"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Senha Mestra do Admin
const ADMIN_PASS = "catarse2026";

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");

    const [clients, setClients] = useState<any[]>([]);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Novos campos: username, password, contract_url, lab_before_img, lab_after_img
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        project_name: "",
        status: "Contrato",
        video_url: "",
        video_cover: "",
        download_url: "",
        contract_url: ""
    });

    // Briefing dinâmico
    const [briefingQuestions, setBriefingQuestions] = useState<{title: string; question: string}[]>([]);
    const [clientBriefingData, setClientBriefingData] = useState<Record<string,string> | null>(null);

    // Extras / Fragmentos Ocultos
    const [extras, setExtras] = useState<{title: string; thumb: string; video_url: string; duration: string}[]>([]);
    const [newExtra, setNewExtra] = useState({title: "", thumb: "", video_url: "", duration: ""});
    const [extrasUnlocked, setExtrasUnlocked] = useState(false);
    const [savingExtras, setSavingExtras] = useState(false);

    const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
    const [newPortfolioItem, setNewPortfolioItem] = useState({
        title: "",
        before_img: "",
        after_img: ""
    });

    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'clients' | 'portfolio'>('clients');

    const handleAdminLogin = () => {
        if (passwordInput === ADMIN_PASS) {
            setIsAuthenticated(true);
            setIsAuthenticated(true);
            fetchClients();
            fetchPortfolio();
        } else {
            alert("Senha incorreta");
        }
    };

    // ...

    const resetForm = () => {
        setFormData({
            name: "", username: "", password: "", project_name: "", status: "Contrato",
            video_url: "", video_cover: "", download_url: "",
            contract_url: ""
        });
        setBriefingQuestions([]);
        setClientBriefingData(null);
        setExtras([]);
        setExtrasUnlocked(false);
    }

    const startEdit = (client: any) => {
        setEditingClient(client);
        setIsCreating(false);
        setFormData({
            name: client.name,
            username: client.username || "",
            password: client.password || "",
            project_name: client.project_name,
            status: client.status,
            video_url: client.video_url || "",
            video_cover: client.video_cover || "",
            download_url: client.download_url || "",
            contract_url: client.contract_url || ""
        });
        setBriefingQuestions(client.briefing_questions || []);
        setClientBriefingData(client.briefing_data || null);
        setExtras(client.extras || []);
        setExtrasUnlocked(client.extras_unlocked || false);
    };

    const fetchClients = async () => {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setClients(data);
    };

    const fetchPortfolio = async () => {
        const { data, error } = await supabase
            .from("lab_portfolio")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setPortfolioItems(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            alert("Preencha usuário e senha");
            return;
        }
        const payload = { ...formData, briefing_questions: briefingQuestions };
        if (editingClient) {
            const { error } = await supabase.from("clients").update(payload).eq("id", editingClient.id);
            if (!error) { setEditingClient(null); fetchClients(); }
            else alert("Erro ao atualizar: " + error.message);
        } else {
            const { error } = await supabase.from("clients").insert([payload]);
            if (!error) { setIsCreating(false); fetchClients(); }
            else alert("Erro ao criar: " + error.message);
        }
        resetForm();
    };

    const saveExtras = async () => {
        if (!editingClient) return;
        setSavingExtras(true);
        const { error } = await supabase.from("clients")
            .update({ extras, extras_unlocked: extrasUnlocked })
            .eq("id", editingClient.id);
        setSavingExtras(false);
        if (!error) { alert("Fragmentos salvos!"); fetchClients(); }
        else alert("Erro: " + error.message);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, bucket: string, isPortfolio = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

            if (isPortfolio) {
                setNewPortfolioItem(prev => ({ ...prev, [field]: data.publicUrl }));
            } else {
                setFormData(prev => ({ ...prev, [field]: data.publicUrl }));
            }
            alert("Upload concluído!");
        } catch (error: any) {
            alert("Erro no upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAddToPortfolio = async () => {
        if (!newPortfolioItem.before_img || !newPortfolioItem.after_img) {
            alert("Selecione as duas imagens");
            return;
        }

        const { error } = await supabase
            .from("lab_portfolio")
            .insert([newPortfolioItem]);

        if (!error) {
            setNewPortfolioItem({ title: "", before_img: "", after_img: "" });
            fetchPortfolio();
            alert("Item adicionado ao portfólio!");
        } else {
            alert("Erro ao adicionar: " + error.message);
        }
    };

    const handleDeletePortfolio = async (id: number) => {
        if (!confirm("Tem certeza?")) return;

        const { error } = await supabase
            .from("lab_portfolio")
            .delete()
            .eq("id", id);

        if (!error) {
            fetchPortfolio();
        } else {
            alert("Erro ao deletar: " + error.message);
        }
    };


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="bg-white/5 p-8 rounded border border-white/10 text-center space-y-4 w-full max-w-sm mx-4">
                    <h1 className="text-catarse-gold font-serif italic text-2xl">Catarse Admin</h1>
                    <input
                        type="password"
                        className="w-full bg-black border border-white/20 p-2 text-white"
                        placeholder="Senha Mestra"
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                    />
                    <button onClick={handleAdminLogin} className="w-full bg-catarse-gold text-black p-2 font-bold uppercase text-xs">Entrar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white font-sans flex flex-col overflow-x-hidden">

            <header className="bg-black border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                    <div className="w-24 relative h-6">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-white/40 border-l border-white/20 pl-4">Painel de Controle</span>
                </div>

                {/* MENU TABS */}
                <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`text-[10px] md:text-xs uppercase font-bold px-3 py-2 md:px-4 rounded transition-colors ${activeTab === 'clients' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Gerenciar Clientes
                    </button>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={`text-[10px] md:text-xs uppercase font-bold px-3 py-2 md:px-4 rounded transition-colors ${activeTab === 'portfolio' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Global Portfolio
                    </button>
                </div>

                <div className="w-full md:w-[120px]">
                    {activeTab === 'clients' && (
                        <button
                            onClick={() => { setIsCreating(true); setEditingClient(null); resetForm(); }}
                            className="bg-catarse-gold text-catarse-moss px-4 py-2 text-xs font-bold uppercase rounded hover:bg-white transition-colors w-full"
                        >
                            + Novo
                        </button>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* VIEW: CLIENTES */}
                {activeTab === 'clients' && (
                    <>
                        {/* LISTA LATERAL */}
                        <aside className={`${(editingClient || isCreating) ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-white/10 overflow-y-auto bg-black/20`}>
                            {clients.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => startEdit(client)}
                                    className={`p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${editingClient?.id === client.id ? 'bg-white/10 border-l-4 border-l-catarse-gold' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-serif italic text-xl text-white">{client.project_name}</h3>
                                        <span className={`text-[10px] uppercase px-2 py-1 rounded ${client.status === 'Finalizado' ? 'bg-catarse-gold text-black' : 'bg-white/10 text-white/60'}`}>
                                            {client.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60">{client.name}</p>
                                    <div className="flex gap-4 mt-2">
                                        <p className="text-xs text-catarse-gold/70 font-mono">User: {client.username}</p>
                                        <p className="text-xs text-white/30 font-mono">Pass: {client.password}</p>
                                    </div>
                                </div>
                            ))}
                        </aside>

                        {/* FORMULÁRIO */}

                        <main className={`${(!editingClient && !isCreating) ? 'hidden md:block' : 'block'} flex-1 p-4 md:p-8 overflow-y-auto`}>
                            {(editingClient || isCreating) ? (
                                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <h2 className="text-2xl font-serif text-catarse-gold">
                                            {isCreating ? "Novo Projeto" : `Editando: ${formData.project_name}`}
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => { setEditingClient(null); setIsCreating(false); }}
                                            className="text-white/40 hover:text-white text-xs uppercase underline"
                                        >
                                            Voltar / Cancelar
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">

                                        {/* ... (Existing Name, Login, Project Name, Status fields) ... */}

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/40">Nome dos Noivos (Exibição)</label>
                                            <input className="w-full bg-black border border-white/10 p-3 rounded text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Julia & Leo" required />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded border border-white/10">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-catarse-gold">Usuário de Acesso</label>
                                                <input className="w-full bg-black border border-white/10 p-3 rounded text-white" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Ex: juliaeleo" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-catarse-gold">Senha</label>
                                                <input className="w-full bg-black border border-white/10 p-3 rounded text-white font-mono" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Ex: 123456" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/40">Nome do Filme</label>
                                            <input className="w-full bg-black border border-white/10 p-3 rounded text-white" value={formData.project_name} onChange={e => setFormData({ ...formData, project_name: e.target.value })} placeholder="Ex: O Sim Eterno" required />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/40">Status</label>
                                            <select className="w-full bg-black border border-white/10 p-3 rounded text-white" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                                <option value="Contrato">Contrato</option>
                                                <option value="Captura">Captura</option>
                                                <option value="Montagem">Montagem</option>
                                                <option value="Color Grading">Color Grading</option>
                                                <option value="Finalizado">Finalização / Finalizado</option>
                                            </select>
                                        </div>



                                        <div className="p-4 border border-catarse-gold/20 bg-catarse-gold/5 rounded space-y-4">
                                            <h3 className="text-catarse-gold text-xs uppercase tracking-widest">Entrega Final & Arquivos</h3>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-white/40">Link do YouTube (Premiere)</label>
                                                <input className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm" value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://youtu.be/..." />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-white/40">Link da Capa</label>
                                                <input className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm" value={formData.video_cover} onChange={e => setFormData({ ...formData, video_cover: e.target.value })} placeholder="https://..." />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-white/40">Link de Download</label>
                                                <input className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm" value={formData.download_url} onChange={e => setFormData({ ...formData, download_url: e.target.value })} placeholder="https://..." />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs uppercase text-white/40">Contrato (PDF)</label>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) => handleFileUpload(e, 'contract_url', 'contracts')}
                                                    className="text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-catarse-gold file:text-catarse-moss hover:file:bg-white"
                                                />
                                                {formData.contract_url && <a href={formData.contract_url} target="_blank" className="text-[10px] text-catarse-gold underline break-all block mt-2"> Ver Contrato Anexado </a>}
                                            </div>
                                        </div>

                                        {/* PERGUNTAS DO BRIEFING */}
                                        <div className="p-4 border border-white/10 rounded space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-white text-xs uppercase tracking-widest">Perguntas do Briefing</h3>
                                                <button type="button" onClick={() => setBriefingQuestions(prev => [...prev, { title: "", question: "" }])}
                                                    className="text-[10px] bg-white/10 hover:bg-catarse-gold hover:text-black text-white px-3 py-1 rounded transition-colors">
                                                    + Pergunta
                                                </button>
                                            </div>
                                            {briefingQuestions.length === 0 && <p className="text-white/20 text-xs italic">Nenhuma pergunta definida. Clique em "+ Pergunta" para adicionar.</p>}
                                            {briefingQuestions.map((q, i) => (
                                                <div key={i} className="bg-black/30 p-3 rounded space-y-2 border border-white/5">
                                                    <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-xs" placeholder="Título (Ex: Cena 01)" value={q.title}
                                                        onChange={e => { const u = [...briefingQuestions]; u[i].title = e.target.value; setBriefingQuestions(u); }} />
                                                    <textarea className="w-full bg-black border border-white/10 p-2 rounded text-white text-xs resize-none" rows={2} placeholder="Texto da pergunta..." value={q.question}
                                                        onChange={e => { const u = [...briefingQuestions]; u[i].question = e.target.value; setBriefingQuestions(u); }} />
                                                    <button type="button" onClick={() => setBriefingQuestions(prev => prev.filter((_, j) => j !== i))} className="text-red-400 text-[10px] hover:text-red-300">Remover</button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* RESPOSTAS DO BRIEFING */}
                                        {clientBriefingData && Object.keys(clientBriefingData).length > 0 && (
                                            <div className="p-4 border border-catarse-gold/20 bg-catarse-gold/5 rounded space-y-3">
                                                <h3 className="text-catarse-gold text-xs uppercase tracking-widest">Respostas do Briefing</h3>
                                                {Object.entries(clientBriefingData).map(([key, val], i) => (
                                                    <div key={i} className="space-y-1">
                                                        <p className="text-white/40 text-[10px] uppercase tracking-wider">{briefingQuestions[i]?.title || key}</p>
                                                        <p className="text-white text-sm leading-relaxed bg-black/30 p-3 rounded">{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" disabled={uploading} className="flex-1 bg-catarse-gold text-black py-3 font-bold uppercase text-xs rounded hover:bg-white transition-colors disabled:opacity-50">
                                                {uploading ? "Enviando Arquivos..." : (isCreating ? "Criar Cliente" : "Salvar Alterações")}
                                            </button>
                                            {editingClient && (
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (confirm("Tem certeza que deseja apagar este cliente?")) {
                                                            await supabase.from("clients").delete().eq("id", editingClient.id);
                                                            setEditingClient(null);
                                                            fetchClients();
                                                        }
                                                    }}
                                                    className="px-4 py-3 border border-red-500/50 text-red-400 font-bold uppercase text-xs rounded hover:bg-red-500/10 transition-colors"
                                                >
                                                    Excluir
                                                </button>
                                            )}
                                        </div>

                                    </form>

                                    {/* FRAGMENTOS OCULTOS — fora do form, só para clientes existentes */}
                                    {editingClient && (
                                        <div className="mt-8 p-4 border border-white/10 rounded space-y-4">
                                            <div className="flex justify-between items-center flex-wrap gap-3">
                                                <h3 className="text-white text-xs uppercase tracking-widest">Fragmentos Ocultos</h3>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <span className="text-xs text-white/40">Acesso Liberado (pagamento confirmado)</span>
                                                    <div className={`relative w-10 h-5 rounded-full transition-colors ${extrasUnlocked ? 'bg-catarse-gold' : 'bg-white/10'}`}
                                                        onClick={() => setExtrasUnlocked(v => !v)}>
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${extrasUnlocked ? 'left-5' : 'left-0.5'}`} />
                                                    </div>
                                                </label>
                                            </div>
                                            {/* Adicionar fragmento */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <input className="bg-black border border-white/10 p-2 rounded text-white text-xs col-span-2" placeholder="Título" value={newExtra.title} onChange={e => setNewExtra(p => ({...p, title: e.target.value}))} />
                                                <input className="bg-black border border-white/10 p-2 rounded text-white text-xs" placeholder="URL Thumbnail" value={newExtra.thumb} onChange={e => setNewExtra(p => ({...p, thumb: e.target.value}))} />
                                                <input className="bg-black border border-white/10 p-2 rounded text-white text-xs" placeholder="Duração (ex: 2min)" value={newExtra.duration} onChange={e => setNewExtra(p => ({...p, duration: e.target.value}))} />
                                                <input className="bg-black border border-white/10 p-2 rounded text-white text-xs col-span-2" placeholder="URL do Vídeo (opcional)" value={newExtra.video_url} onChange={e => setNewExtra(p => ({...p, video_url: e.target.value}))} />
                                                <button type="button" onClick={() => { if (!newExtra.title) return; setExtras(p => [...p, newExtra]); setNewExtra({title:"",thumb:"",video_url:"",duration:""}); }}
                                                    className="col-span-2 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors">+ Adicionar Fragmento</button>
                                            </div>
                                            {/* Lista */}
                                            {extras.map((ex, i) => (
                                                <div key={i} className="flex items-center justify-between gap-2 bg-black/30 p-2 rounded text-xs">
                                                    <span className="text-white/60">{ex.title} <span className="text-catarse-gold">({ex.duration})</span></span>
                                                    <button type="button" onClick={() => setExtras(p => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 text-[10px]">Remover</button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={saveExtras} disabled={savingExtras}
                                                className="w-full bg-catarse-gold text-black py-2 font-bold uppercase text-xs rounded hover:bg-white transition-colors disabled:opacity-50">
                                                {savingExtras ? "Salvando..." : "Salvar Fragmentos"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                                    <p>Selecione um cliente ou crie um novo</p>
                                </div>
                            )}

                        </main>
                    </>
                )}

                {/* VIEW: PORTFOLIO */}
                {activeTab === 'portfolio' && (
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl font-serif text-catarse-gold mb-6 border-b border-white/10 pb-4">Gerenciar Portfólio Global</h2>
                            <p className="text-white/40 text-sm mb-8">As imagens adicionadas aqui aparecerão no carrossel "A Química da Cor" da página Laboratório para TODOS os clientes.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Adicionar Novo */}
                                <div className="bg-white/5 p-6 rounded border border-white/10 space-y-4 h-fit sticky top-0">
                                    <h3 className="text-white text-xs uppercase tracking-widest text-catarse-gold">Adicionar Novo Item</h3>

                                    <input
                                        className="w-full bg-black border border-white/10 p-3 rounded text-white"
                                        placeholder="Título (Ex: Cena 01)"
                                        value={newPortfolioItem.title}
                                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/40">Antes (RAW)</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'before_img', 'images', true)} className="text-[10px] text-white w-full" />
                                            {newPortfolioItem.before_img && <div className="h-24 relative bg-black rounded overflow-hidden shadow-lg border border-white/20"><Image src={newPortfolioItem.before_img} fill className="object-contain" alt="preview" /></div>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase text-white/40">Depois (Grade)</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'after_img', 'images', true)} className="text-[10px] text-white w-full" />
                                            {newPortfolioItem.after_img && <div className="h-24 relative bg-black rounded overflow-hidden shadow-lg border border-white/20"><Image src={newPortfolioItem.after_img} fill className="object-contain" alt="preview" /></div>}
                                        </div>
                                    </div>

                                    <button onClick={handleAddToPortfolio} disabled={uploading} className="w-full bg-catarse-gold text-black py-3 rounded text-xs uppercase font-bold hover:bg-white transition-colors">
                                        {uploading ? "Enviando..." : "Adicionar à Galeria"}
                                    </button>
                                </div>

                                {/* Lista de Itens */}
                                <div className="space-y-4">
                                    <h3 className="text-white text-xs uppercase tracking-widest text-white/40 mb-4">Itens Ativos no Site ({portfolioItems.length})</h3>

                                    {portfolioItems.map(item => (
                                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-black/40 border border-white/5 rounded items-start sm:items-center group hover:bg-white/5 transition-colors">
                                            <div className="flex-1 w-full sm:w-auto">
                                                <p className="font-serif italic text-lg text-white">{item.title || "Sem Título"}</p>
                                                <p className="text-[10px] text-white/20 font-mono mt-1">ID: {item.id}</p>
                                            </div>
                                            <div className="flex gap-2 relative w-full sm:w-auto justify-end">
                                                <div className="w-16 h-10 relative bg-zinc-800 rounded overflow-hidden border border-white/10">
                                                    {item.before_img && <Image src={item.before_img} fill className="object-cover object-center" alt="before" />}
                                                </div>
                                                <div className="w-16 h-10 relative bg-zinc-800 rounded overflow-hidden border border-white/10">
                                                    {item.after_img && <Image src={item.after_img} fill className="object-cover object-center" alt="after" />}
                                                </div>
                                                <button onClick={() => handleDeletePortfolio(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {portfolioItems.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded">
                                            <p className="text-white/20 italic">A galeria está vazia.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}