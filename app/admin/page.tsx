"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// Funções auxiliares para parse seguro de JSON vindo do banco de dados (evitando falhas em registros legados)
const parseJsonIfNeeded = (val: any): any => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }
    return val;
};

const getSafeArray = (val: any): any[] => {
    if (val === null || val === undefined) return [];
    const parsed = parseJsonIfNeeded(val);
    return Array.isArray(parsed) ? parsed : [];
};

const getSafeObject = (val: any): Record<string, any> | null => {
    if (val === null || val === undefined) return null;
    const parsed = parseJsonIfNeeded(val);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
    }
    return null;
};

const renderSafeValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
        try {
            return JSON.stringify(val);
        } catch {
            return "[Objeto]";
        }
    }
    return String(val);
};

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [dbPassword, setDbPassword] = useState<string | null>(null);

    const [clients, setClients] = useState<any[]>([]);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'clients' | 'portfolio' | 'settings'>('clients');

    // Formulário de Cliente
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

    // Briefing Dinâmico e Respostas
    const [briefingQuestions, setBriefingQuestions] = useState<{title: string; question: string}[]>([]);
    const [clientBriefingData, setClientBriefingData] = useState<Record<string, string> | null>(null);

    // Fragmentos Ocultos (Extras)
    const [extras, setExtras] = useState<{title: string; thumb: string; video_url: string; duration: string}[]>([]);
    const [newExtra, setNewExtra] = useState({title: "", thumb: "", video_url: "", duration: ""});
    const [editingExtraIndex, setEditingExtraIndex] = useState<number | null>(null);
    const [extrasUnlocked, setExtrasUnlocked] = useState(false);
    const [savingExtras, setSavingExtras] = useState(false);

    // Portfólio Global (Antes e Depois)
    const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
    const [newPortfolioItem, setNewPortfolioItem] = useState({
        title: "",
        before_img: "",
        after_img: ""
    });

    // Alteração de Senha Mestra
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [uploading, setUploading] = useState(false);
    const [uploadField, setUploadField] = useState<string | null>(null); // Rastreia qual campo está fazendo upload

    // 1. Carregar a senha atual do banco ao montar
    useEffect(() => {
        const fetchDbPassword = async () => {
            try {
                const { data, error } = await supabase
                    .from("admin_settings")
                    .select("value")
                    .eq("key", "admin_password")
                    .single();

                if (!error && data?.value) {
                    setDbPassword(data.value);
                } else {
                    // Fallback para a senha mestra dura se a tabela ainda não existir
                    setDbPassword("catarse2026");
                }
            } catch (err) {
                setDbPassword("catarse2026");
            }
        };
        fetchDbPassword();
    }, []);

    // 2. Ações de Login e Autenticação
    const handleAdminLogin = () => {
        const correctPassword = dbPassword || "catarse2026";
        if (passwordInput === correctPassword) {
            setIsAuthenticated(true);
            fetchClients();
            fetchPortfolio();
        } else {
            alert("Senha mestra incorreta.");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = dbPassword || "catarse2026";

        if (passwordData.currentPassword !== correctPassword) {
            alert("A senha mestra atual inserida está incorreta.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("A nova senha e a confirmação não coincidem.");
            return;
        }

        if (passwordData.newPassword.length < 4) {
            alert("A nova senha deve ter no mínimo 4 caracteres.");
            return;
        }

        try {
            // Tenta atualizar no banco
            const { error } = await supabase
                .from("admin_settings")
                .upsert({ key: "admin_password", value: passwordData.newPassword }, { onConflict: "key" });

            if (error) {
                throw error;
            }

            setDbPassword(passwordData.newPassword);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            alert("Senha mestra atualizada com sucesso no banco de dados!");
        } catch (err: any) {
            alert("Não foi possível atualizar no banco. Certifique-se de ter criado a tabela 'admin_settings' no painel do Supabase. Erro: " + err.message);
        }
    };

    // 3. Gerenciamento de Clientes
    const fetchClients = async () => {
        const { data } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setClients(data);
    };

    const startEdit = (client: any) => {
        setEditingClient(client);
        setIsCreating(false);
        setFormData({
            name: client.name || "",
            username: client.username || "",
            password: client.password || "",
            project_name: client.project_name || "",
            status: client.status || "Contrato",
            video_url: client.video_url || "",
            video_cover: client.video_cover || "",
            download_url: client.download_url || "",
            contract_url: client.contract_url || ""
        });
        setBriefingQuestions(getSafeArray(client.briefing_questions));
        setClientBriefingData(getSafeObject(client.briefing_data));
        setExtras(getSafeArray(client.extras));
        setExtrasUnlocked(client.extras_unlocked || false);
        setEditingExtraIndex(null);
        setNewExtra({ title: "", thumb: "", video_url: "", duration: "" });
    };

    const resetForm = () => {
        setFormData({
            name: "", username: "", password: "", project_name: "", status: "Contrato",
            video_url: "", video_cover: "", download_url: "", contract_url: ""
        });
        setBriefingQuestions([]);
        setClientBriefingData(null);
        setExtras([]);
        setExtrasUnlocked(false);
        setEditingExtraIndex(null);
        setNewExtra({ title: "", thumb: "", video_url: "", duration: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            alert("Preencha usuário e senha de acesso do cliente.");
            return;
        }

        const payload = { ...formData, briefing_questions: briefingQuestions };

        if (editingClient) {
            const { error } = await supabase
                .from("clients")
                .update(payload)
                .eq("id", editingClient.id);

            if (!error) {
                setEditingClient(null);
                fetchClients();
                alert("Cliente atualizado com sucesso!");
            } else {
                alert("Erro ao atualizar cliente: " + error.message);
            }
        } else {
            const { error } = await supabase
                .from("clients")
                .insert([payload]);

            if (!error) {
                setIsCreating(false);
                fetchClients();
                alert("Cliente cadastrado com sucesso!");
            } else {
                alert("Erro ao cadastrar cliente: " + error.message);
            }
        }
        resetForm();
    };

    // 4. Fragmentos Ocultos (Extras)
    const saveExtras = async () => {
        if (!editingClient) return;
        setSavingExtras(true);
        const { error } = await supabase
            .from("clients")
            .update({ extras, extras_unlocked: extrasUnlocked })
            .eq("id", editingClient.id);

        setSavingExtras(false);
        if (!error) {
            alert("Fragmentos ocultos salvos com sucesso!");
            fetchClients();
        } else {
            alert("Erro ao salvar fragmentos: " + error.message);
        }
    };

    // 5. Upload de Imagens/Arquivos para o Supabase Storage
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, bucket: string, isPortfolio = false) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        setUploadField(field);

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
            alert("Upload concluído com sucesso!");
        } catch (error: any) {
            alert("Erro no upload: " + error.message);
        } finally {
            setUploading(false);
            setUploadField(null);
        }
    };

    // 6. Gerenciamento do Portfólio Global (Laboratório de Cor)
    const fetchPortfolio = async () => {
        const { data } = await supabase
            .from("lab_portfolio")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setPortfolioItems(data);
    };

    const handleAddToPortfolio = async () => {
        if (!newPortfolioItem.before_img || !newPortfolioItem.after_img) {
            alert("Por favor, envie as duas imagens (Antes & Depois).");
            return;
        }

        const { error } = await supabase
            .from("lab_portfolio")
            .insert([newPortfolioItem]);

        if (!error) {
            setNewPortfolioItem({ title: "", before_img: "", after_img: "" });
            fetchPortfolio();
            alert("Cena de cor adicionada ao portfólio global!");
        } else {
            alert("Erro ao adicionar cena: " + error.message);
        }
    };

    const handleDeletePortfolio = async (id: number) => {
        if (!confirm("Tem certeza que deseja apagar esta cena da galeria global?")) return;

        const { error } = await supabase
            .from("lab_portfolio")
            .delete()
            .eq("id", id);

        if (!error) {
            fetchPortfolio();
            alert("Cena deletada!");
        } else {
            alert("Erro ao deletar cena: " + error.message);
        }
    };

    // --- TELA DE LOGIN GLASSMORPHIC ---
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-[#EAEAEA] font-sans flex items-center justify-center p-6 relative overflow-hidden select-none">
                
                {/* Background Film Grain Overlay */}
                <div className="fixed inset-0 pointer-events-none opacity-40 bg-grain mix-blend-overlay z-0"></div>
                
                {/* Decorative background glow */}
                <div className="absolute w-[300px] h-[300px] bg-[#C9A96E]/5 rounded-full blur-3xl -top-12 -left-12"></div>
                <div className="absolute w-[400px] h-[400px] bg-[#1A261B]/20 rounded-full blur-3xl -bottom-16 -right-16"></div>

                <div className="relative z-10 w-full max-w-[360px] bg-[#0e0e0e]/85 border border-[#C9A96E]/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-fade-in text-center space-y-6">
                    <div className="relative w-36 h-10 mx-auto">
                        <Image src="/logo.png" alt="Catarse" fill className="object-contain" priority />
                    </div>
                    
                    <div className="space-y-1">
                        <h1 className="font-serif italic text-xl text-white">Painel Administrativo</h1>
                        <p className="text-[10px] uppercase tracking-[3px] text-[#C9A96E]">Estúdio de Cinema</p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="space-y-1.5 text-left">
                            <label className="text-[9px] uppercase tracking-widest text-white/40 block ml-1">Senha Mestra</label>
                            <input
                                type="password"
                                className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200 text-center font-mono"
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={e => setPasswordInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                            />
                        </div>
                        <button
                            onClick={handleAdminLogin}
                            className="w-full bg-[#C9A96E] text-black py-3 rounded-lg font-bold uppercase text-[11px] tracking-widest transition-all duration-300 hover:bg-white active:scale-[0.99] shadow-lg shadow-[#C9A96E]/10"
                        >
                            Entrar no Estúdio
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // --- PAINEL GERAL REDESENHADO (GLASSMORPHISM & RESPONSIVO) ---
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#EAEAEA] font-sans flex flex-col overflow-hidden relative">
            
            {/* Background Film Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-40 bg-grain mix-blend-overlay z-0"></div>

            {/* HEADER GERAL */}
            <header className="bg-black/90 border-b border-white/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4 relative z-10 backdrop-blur-md">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-3">
                        <div className="w-24 relative h-6 md:w-28 md:h-8">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-[9px] uppercase tracking-[2px] text-[#C9A96E] border-l border-white/10 pl-3 select-none">Admin</span>
                    </div>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            setPasswordInput("");
                        }}
                        className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-[9px] uppercase tracking-wider hover:text-white"
                    >
                        Sair
                    </button>
                </div>

                {/* NAVEGAÇÃO DOS MENUS */}
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => { setActiveTab('clients'); resetForm(); }}
                        className={`flex-1 md:flex-none text-[9px] md:text-xs uppercase font-bold tracking-widest px-4 py-2.5 rounded-md transition-all duration-300 ${activeTab === 'clients' ? 'bg-[#C9A96E] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Clientes
                    </button>
                    <button
                        onClick={() => { setActiveTab('portfolio'); resetForm(); }}
                        className={`flex-1 md:flex-none text-[9px] md:text-xs uppercase font-bold tracking-widest px-4 py-2.5 rounded-md transition-all duration-300 ${activeTab === 'portfolio' ? 'bg-[#C9A96E] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Portfólio Lab
                    </button>
                    <button
                        onClick={() => { setActiveTab('settings'); resetForm(); }}
                        className={`flex-1 md:flex-none text-[9px] md:text-xs uppercase font-bold tracking-widest px-4 py-2.5 rounded-md transition-all duration-300 ${activeTab === 'settings' ? 'bg-[#C9A96E] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Segurança
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {activeTab === 'clients' && !isCreating && !editingClient && (
                        <button
                            onClick={() => { setIsCreating(true); setEditingClient(null); resetForm(); }}
                            className="bg-[#C9A96E] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white transition-colors"
                        >
                            + Novo Cliente
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            setPasswordInput("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/50 text-[10px] uppercase tracking-widest hover:border-[#C9A96E]/50 hover:text-white transition-all"
                    >
                        Sair
                    </button>
                </div>
            </header>

            {/* ÁREA DE CONTEÚDO PRINCIPAL */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">

                {/* ==================== ABA 1: GERENCIAR CLIENTES ==================== */}
                {activeTab === 'clients' && (
                    <>
                        {/* LISTA LATERAL (Oculta no celular se estiver editando) */}
                        <aside className={`${(editingClient || isCreating) ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-white/5 overflow-y-auto bg-black/10 flex flex-col`}>
                            <div className="p-4 border-b border-white/5 bg-black/20 flex md:hidden items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Projetos Ativos ({clients.length})</span>
                                <button
                                    onClick={() => { setIsCreating(true); setEditingClient(null); resetForm(); }}
                                    className="bg-[#C9A96E] text-black px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded"
                                >
                                    + Novo
                                </button>
                            </div>
                            
                            <div className="flex-1 divide-y divide-white/5">
                                {clients.map(client => (
                                    <div
                                        key={client.id}
                                        onClick={() => startEdit(client)}
                                        className={`p-6 cursor-pointer hover:bg-white/[0.02] transition-all duration-300 relative ${editingClient?.id === client.id ? 'bg-[#C9A96E]/5 border-l-2 border-[#C9A96E]' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-serif italic text-lg text-white group-hover:text-[#C9A96E]">{client.project_name}</h3>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${client.status === 'Finalizado' ? 'bg-[#C9A96E] text-black' : 'bg-white/10 text-white/60'}`}>
                                                {client.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/50">{client.name}</p>
                                        <div className="flex gap-4 mt-3 pt-2 border-t border-white/[0.02] text-[10px]">
                                            <p className="text-[#C9A96E]/80 font-mono">User: {client.username}</p>
                                            <p className="text-white/30 font-mono">Pass: {client.password}</p>
                                        </div>
                                    </div>
                                ))}
                                {clients.length === 0 && (
                                    <div className="text-center py-20 text-white/20 italic text-xs">
                                        Nenhum cliente cadastrado.
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* FORMULÁRIO DE EDIÇÃO / CRIAÇÃO */}
                        <main className={`${(!editingClient && !isCreating) ? 'hidden md:flex' : 'flex'} flex-1 p-4 md:p-8 overflow-y-auto flex-col`}>
                            {(editingClient || isCreating) ? (
                                <div className="max-w-2xl w-full mx-auto space-y-8 animate-fade-in pb-16">
                                    
                                    {/* Cabeçalho do Formulário */}
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setEditingClient(null); setIsCreating(false); resetForm(); }}
                                                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#C9A96E] hover:text-white border border-[#C9A96E]/20 hover:border-white px-2.5 py-1 rounded-md transition-all"
                                            >
                                                ← Voltar
                                            </button>
                                            <h2 className="text-xl md:text-2xl font-serif text-[#C9A96E] italic">
                                                {isCreating ? "Novo Trabalho" : `Editar Trabalho`}
                                            </h2>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-white/30 hidden sm:inline">
                                            {isCreating ? "Cadastro" : "Identificador: " + String(editingClient.id).substring(0, 8)}
                                        </span>
                                    </div>

                                    {/* FORMULÁRIO PRINCIPAL */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        
                                        {/* SESSÃO 1: DADOS BÁSICOS */}
                                        <div className="bg-[#0e0e0e]/80 border border-white/5 rounded-xl p-6 space-y-4">
                                            <h3 className="text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">1. Dados Básicos do Projeto</h3>
                                            
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Nome dos Noivos (Exibição)</label>
                                                <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Julia & Leonardo" required />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Título do Filme</label>
                                                <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.project_name} onChange={e => setFormData({ ...formData, project_name: e.target.value })} placeholder="Ex: O Som do Silêncio" required />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Etapa de Produção</label>
                                                <select className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                                    <option value="Contrato">Contrato Fechado</option>
                                                    <option value="Captura">Em Captura (Filmagem)</option>
                                                    <option value="Montagem">Em Montagem (Edição)</option>
                                                    <option value="Color Grading">Em Color Grading (Cor)</option>
                                                    <option value="Finalizado">Finalizado / Pronto para Estreia</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* SESSÃO 2: CREDENCIAIS DE ACESSO */}
                                        <div className="bg-[#0e0e0e]/80 border border-[#C9A96E]/20 rounded-xl p-6 space-y-4">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                <h3 className="text-[#C9A96E] text-xs uppercase tracking-widest">2. Credenciais de Acesso do Cliente</h3>
                                                <span className="text-[9px] uppercase tracking-wider text-white/30 font-light">Será usado para fazer login</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Usuário (Código Único)</label>
                                                    <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="juliaeleonardo" required />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Senha de Acesso</label>
                                                    <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200 font-mono" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="123456" required />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SESSÃO 3: LINKS E ARQUIVOS (BUNNY/CLOUDFLARE R2) */}
                                        <div className="bg-[#0e0e0e]/80 border border-white/5 rounded-xl p-6 space-y-4">
                                            <h3 className="text-white text-xs uppercase tracking-widest border-b border-white/5 pb-2">3. Links de Transmissão & Arquivos</h3>
                                            
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Link do Filme (4K MP4 Cloudflare R2 ou Youtube)</label>
                                                <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://pub-xxxx.r2.dev/video-noivos.mp4" />
                                            </div>

                                            {/* COVER IMAGE UPLOADER */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Capa da Estreia (Poster / Thumbnail)</label>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <input className="flex-1 bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.video_cover} onChange={e => setFormData({ ...formData, video_cover: e.target.value })} placeholder="https://pub-xxxx.r2.dev/thumbnail.jpg" />
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="file"
                                                            id="cover-file-upload"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileUpload(e, 'video_cover', 'images')}
                                                            className="hidden"
                                                            disabled={uploading}
                                                        />
                                                        <label
                                                            htmlFor="cover-file-upload"
                                                            className={`bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-4 rounded-lg cursor-pointer transition-all h-full flex items-center justify-center shrink-0 border border-white/10 ${uploading && uploadField === 'video_cover' ? 'animate-pulse opacity-50 cursor-wait' : ''}`}
                                                        >
                                                            {uploading && uploadField === 'video_cover' ? "Enviando..." : "Subir Imagem"}
                                                        </label>
                                                    </div>
                                                </div>
                                                {formData.video_cover && (
                                                    <div className="mt-2 w-full max-w-[200px] aspect-[16/9] relative bg-black border border-white/10 rounded-lg overflow-hidden">
                                                        <img src={formData.video_cover} className="object-cover w-full h-full" alt="Cover Preview" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Link de Download (Master Original 4K)</label>
                                                <input className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none transition-all duration-200" value={formData.download_url} onChange={e => setFormData({ ...formData, download_url: e.target.value })} placeholder="https://pub-xxxx.r2.dev/master-4k.mp4" />
                                            </div>

                                            {/* CONTRATO PDF UPLOADER */}
                                            <div className="space-y-2 border-t border-white/5 pt-4">
                                                <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Contrato de Serviço (Arquivo PDF)</label>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                    <input
                                                        type="file"
                                                        id="contract-file-upload"
                                                        accept="application/pdf"
                                                        onChange={(e) => handleFileUpload(e, 'contract_url', 'contracts')}
                                                        className="hidden"
                                                        disabled={uploading}
                                                    />
                                                    <label
                                                        htmlFor="contract-file-upload"
                                                        className={`bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-lg cursor-pointer transition-all border border-white/10 inline-block ${uploading && uploadField === 'contract_url' ? 'animate-pulse opacity-50 cursor-wait' : ''}`}
                                                    >
                                                        {uploading && uploadField === 'contract_url' ? "Enviando Contrato..." : "Selecionar PDF"}
                                                    </label>
                                                    {formData.contract_url && (
                                                        <a href={formData.contract_url} target="_blank" rel="noreferrer" className="text-[10px] text-[#C9A96E] hover:underline font-mono truncate max-w-xs block sm:inline-block">
                                                            ✓ Contrato Vinculado
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SESSÃO 4: PERGUNTAS DO BRIEFING */}
                                        <div className="bg-[#0e0e0e]/80 border border-white/5 rounded-xl p-6 space-y-4">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                <h3 className="text-white text-xs uppercase tracking-widest">4. Perguntas Customizadas do Briefing</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setBriefingQuestions(prev => [...prev, { title: "", question: "" }])}
                                                    className="text-[9px] font-bold uppercase tracking-widest bg-white/10 hover:bg-[#C9A96E] hover:text-black text-white px-3 py-1.5 rounded transition-all"
                                                >
                                                    + Adicionar Pergunta
                                                </button>
                                            </div>
                                            
                                            {briefingQuestions.length === 0 && (
                                                <p className="text-white/20 text-xs italic text-center py-4">Nenhuma pergunta definida para este briefing.</p>
                                            )}

                                            <div className="space-y-3">
                                                {briefingQuestions.map((q, i) => (
                                                    <div key={i} className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-3 relative">
                                                        <div className="space-y-1.5">
                                                            <input
                                                                className="w-full bg-[#050505] border border-white/10 p-2 rounded text-white text-xs font-bold focus:border-[#C9A96E] focus:outline-none"
                                                                placeholder="Título da Seção (Ex: Cena 01 - Entrada da Noiva)"
                                                                value={q?.title || ""}
                                                                onChange={e => {
                                                                    const u = [...briefingQuestions];
                                                                    u[i].title = e.target.value;
                                                                    setBriefingQuestions(u);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <textarea
                                                                className="w-full bg-[#050505] border border-white/10 p-2 rounded text-white text-xs resize-none focus:border-[#C9A96E] focus:outline-none"
                                                                rows={2}
                                                                placeholder="Descreva a pergunta ou instrução que o cliente responderá..."
                                                                value={q?.question || ""}
                                                                onChange={e => {
                                                                    const u = [...briefingQuestions];
                                                                    u[i].question = e.target.value;
                                                                    setBriefingQuestions(u);
                                                                }}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setBriefingQuestions(prev => prev.filter((_, j) => j !== i))}
                                                            className="text-red-400 text-[9px] font-bold uppercase tracking-wider hover:text-red-300 transition-colors"
                                                        >
                                                            Remover Pergunta
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* RESPOSTAS DO BRIEFING ENVIADAS PELO CLIENTE */}
                                        {clientBriefingData && Object.keys(clientBriefingData).length > 0 && (
                                            <div className="bg-[#1A261B]/20 border border-[#C9A96E]/20 rounded-xl p-6 space-y-4">
                                                <h3 className="text-[#C9A96E] text-xs uppercase tracking-widest border-b border-[#C9A96E]/10 pb-2">Respostas do Cliente</h3>
                                                <div className="space-y-4">
                                                    {Object.entries(clientBriefingData).map(([key, val], i) => (
                                                        <div key={i} className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-1.5">
                                                            <p className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-wider">
                                                                {briefingQuestions[i]?.title || key}
                                                            </p>
                                                            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{renderSafeValue(val)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* BOTÕES DE ENVIO */}
                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className="flex-1 bg-[#C9A96E] text-black py-3.5 font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#C9A96E]/10 cursor-pointer"
                                            >
                                                {uploading ? "Aguardando Arquivo..." : (isCreating ? "Criar Projeto" : "Salvar Projeto")}
                                            </button>
                                            
                                            {editingClient && (
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (confirm("Tem certeza absoluta que deseja deletar permanentemente este cliente e todos os seus dados?")) {
                                                            await supabase.from("clients").delete().eq("id", editingClient.id);
                                                            setEditingClient(null);
                                                            fetchClients();
                                                            alert("Projeto deletado!");
                                                        }
                                                    }}
                                                    className="px-5 py-3.5 border border-red-500/30 text-red-400 font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-red-500/10 hover:border-red-500/70 transition-all cursor-pointer"
                                                >
                                                    Deletar
                                                </button>
                                            )}
                                        </div>

                                    </form>

                                    {/* SEÇÃO EXTRA: FRAGMENTOS OCULTOS (SÓ PARA CLIENTES EXISTENTES) */}
                                    {editingClient && (
                                        <div className="bg-[#0e0e0e]/80 border border-white/5 rounded-xl p-6 space-y-6">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-2 flex-wrap gap-3">
                                                <div className="space-y-0.5">
                                                    <h3 className="text-white text-xs uppercase tracking-widest">Fragmentos Ocultos (Extras)</h3>
                                                    <p className="text-[10px] text-white/40">Cenas extras liberadas após aprovação</p>
                                                </div>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <span className="text-[10px] uppercase tracking-wider text-white/50">Acesso Liberado</span>
                                                    <div
                                                        className={`relative w-10 h-5 rounded-full transition-colors ${extrasUnlocked ? 'bg-[#C9A96E]' : 'bg-white/10'}`}
                                                        onClick={() => setExtrasUnlocked(v => !v)}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${extrasUnlocked ? 'left-5' : 'left-0.5'}`} />
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Adicionar ou Editar Fragmento */}
                                            <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-3">
                                                <h4 className="text-[#C9A96E] text-[10px] uppercase tracking-wider font-bold">
                                                    {editingExtraIndex !== null ? "Editando Fragmento" : "Novo Fragmento"}
                                                </h4>
                                                
                                                <input className="w-full bg-[#050505] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#C9A96E] focus:outline-none" placeholder="Título (Ex: Cenas Cortadas - Pista)" value={newExtra.title} onChange={e => setNewExtra(p => ({ ...p, title: e.target.value }))} />
                                                
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className="w-full bg-[#050505] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#C9A96E] focus:outline-none" placeholder="Duração (Ex: 3m 45s)" value={newExtra.duration} onChange={e => setNewExtra(p => ({ ...p, duration: e.target.value }))} />
                                                    <input className="w-full bg-[#050505] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#C9A96E] focus:outline-none" placeholder="URL Thumbnail (.jpg)" value={newExtra.thumb} onChange={e => setNewExtra(p => ({ ...p, thumb: e.target.value }))} />
                                                </div>
                                                
                                                <input className="w-full bg-[#050505] border border-white/10 p-2.5 rounded text-white text-xs focus:border-[#C9A96E] focus:outline-none" placeholder="URL do Vídeo (4K R2 ou Vimeo)" value={newExtra.video_url} onChange={e => setNewExtra(p => ({ ...p, video_url: e.target.value }))} />
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!newExtra.title) return;
                                                        if (editingExtraIndex !== null) {
                                                            setExtras(p => { const u = [...p]; u[editingExtraIndex] = newExtra; return u; });
                                                            setEditingExtraIndex(null);
                                                        } else {
                                                            setExtras(p => [...p, newExtra]);
                                                        }
                                                        setNewExtra({ title: "", thumb: "", video_url: "", duration: "" });
                                                    }}
                                                    className="w-full bg-white/10 hover:bg-[#C9A96E] hover:text-black text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-all cursor-pointer"
                                                >
                                                    {editingExtraIndex !== null ? "Salvar Edição" : "+ Adicionar à Lista"}
                                                </button>
                                            </div>

                                            {/* Lista de fragmentos adicionados */}
                                            <div className="space-y-2">
                                                {getSafeArray(extras).map((ex, i) => (
                                                    <div key={i} className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-xs ${editingExtraIndex === i ? "bg-[#C9A96E]/5 border-[#C9A96E]/30" : "bg-black/30 border-white/5"}`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-medium">{ex?.title || "Sem título"}</span>
                                                            <span className="text-[#C9A96E] text-[10px] mt-0.5 font-mono">{ex?.duration || ""}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button type="button" onClick={() => { setNewExtra(ex || { title: "", thumb: "", video_url: "", duration: "" }); setEditingExtraIndex(i); }} className="text-[#C9A96E] hover:text-white text-[10px] uppercase font-bold tracking-wider">Editar</button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setExtras(p => p.filter((_, j) => j !== i));
                                                                    if (editingExtraIndex === i) {
                                                                        setEditingExtraIndex(null);
                                                                        setNewExtra({ title: "", thumb: "", video_url: "", duration: "" });
                                                                    }
                                                                }}
                                                                className="text-red-400 text-[10px] uppercase font-bold tracking-wider"
                                                            >
                                                                Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={saveExtras}
                                                disabled={savingExtras}
                                                className="w-full bg-[#C9A96E] text-black py-3 font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C9A96E]/5"
                                            >
                                                {savingExtras ? "Salvando Fragmentos..." : "Salvar Configurações de Fragmentos"}
                                            </button>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4 text-center py-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-white/10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <div className="space-y-1">
                                        <p className="font-serif italic text-lg text-white/40">Catarse Studio</p>
                                        <p className="text-[10px] uppercase tracking-widest text-white/10">Selecione um cliente ao lado ou crie um novo projeto</p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </>
                )}

                {/* ==================== ABA 2: PORTFÓLIO GLOBAL ==================== */}
                {activeTab === 'portfolio' && (
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative z-10">
                        <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in">
                            <div className="border-b border-white/5 pb-4">
                                <h2 className="text-xl md:text-2xl font-serif text-[#C9A96E] italic">Portfólio Global (Showcase de Cor)</h2>
                                <p className="text-white/40 text-xs mt-1">Imagens exibidas na comparação de cor ("A Química da Cor") para todos os clientes ativos.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Adicionar Novo Item (Formulário) */}
                                <div className="bg-[#0e0e0e]/80 p-6 rounded-xl border border-white/5 space-y-4 lg:col-span-5 lg:sticky lg:top-4">
                                    <h3 className="text-[#C9A96E] text-xs uppercase tracking-widest border-b border-white/5 pb-2">Adicionar Nova Cena</h3>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Título da Cena</label>
                                        <input
                                            className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none"
                                            placeholder="Ex: Cena 01 - Luz de Janela"
                                            value={newPortfolioItem.title}
                                            onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* UPLOAD ANTES */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Antes (RAW)</label>
                                            <input
                                                type="file"
                                                id="portfolio-before-upload"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'before_img', 'images', true)}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="portfolio-before-upload"
                                                className={`w-full bg-white/10 hover:bg-white/20 text-white font-bold text-[9px] uppercase tracking-widest py-2 rounded-lg cursor-pointer transition-all border border-white/10 flex items-center justify-center shrink-0 ${uploading && uploadField === 'before_img' ? 'animate-pulse opacity-50 cursor-wait' : ''}`}
                                            >
                                                {uploading && uploadField === 'before_img' ? "Subindo..." : "Selecionar RAW"}
                                            </label>
                                            {newPortfolioItem.before_img && (
                                                <div className="aspect-[16/9] relative bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                    <img src={newPortfolioItem.before_img} className="object-cover w-full h-full" alt="Before" />
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD DEPOIS */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Depois (Graded)</label>
                                            <input
                                                type="file"
                                                id="portfolio-after-upload"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'after_img', 'images', true)}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="portfolio-after-upload"
                                                className={`w-full bg-white/10 hover:bg-white/20 text-white font-bold text-[9px] uppercase tracking-widest py-2 rounded-lg cursor-pointer transition-all border border-white/10 flex items-center justify-center shrink-0 ${uploading && uploadField === 'after_img' ? 'animate-pulse opacity-50 cursor-wait' : ''}`}
                                            >
                                                {uploading && uploadField === 'after_img' ? "Subindo..." : "Selecionar Grade"}
                                            </label>
                                            {newPortfolioItem.after_img && (
                                                <div className="aspect-[16/9] relative bg-black rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                    <img src={newPortfolioItem.after_img} className="object-cover w-full h-full" alt="After" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToPortfolio}
                                        disabled={uploading}
                                        className="w-full bg-[#C9A96E] text-black py-3 rounded-lg text-xs uppercase font-bold tracking-widest hover:bg-white transition-all cursor-pointer"
                                    >
                                        Adicionar à Galeria
                                    </button>
                                </div>

                                {/* Lista de Cenas Cadastradas */}
                                <div className="space-y-4 lg:col-span-7">
                                    <h3 className="text-white text-xs uppercase tracking-widest text-white/40 mb-4">Galeria de Cenas Ativas ({portfolioItems.length})</h3>

                                    <div className="grid grid-cols-1 gap-3">
                                        {portfolioItems.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-[#0e0e0e]/80 border border-white/5 rounded-xl items-start sm:items-center justify-between hover:bg-white/[0.01] transition-all">
                                                <div className="space-y-0.5">
                                                    <p className="font-serif italic text-lg text-white">{item.title || "Cena sem título"}</p>
                                                    <p className="text-[10px] text-white/20 font-mono">ID do Registro: {item.id}</p>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                                    <div className="flex gap-2">
                                                        <div className="w-14 h-9 relative bg-zinc-900 rounded overflow-hidden border border-white/5 shadow-md">
                                                            {item.before_img && <img src={item.before_img} className="object-cover w-full h-full" alt="Before thumbnail" />}
                                                        </div>
                                                        <div className="w-14 h-9 relative bg-zinc-900 rounded overflow-hidden border border-white/5 shadow-md">
                                                            {item.after_img && <img src={item.after_img} className="object-cover w-full h-full" alt="After thumbnail" />}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeletePortfolio(item.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                                        title="Excluir Cena"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {portfolioItems.length === 0 && (
                                            <div className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-black/10">
                                                <p className="text-white/20 italic text-xs">A galeria de cor está vazia.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {/* ==================== ABA 3: CONFIGURAÇÕES DE SEGURANÇA ==================== */}
                {activeTab === 'settings' && (
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative z-10">
                        <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fade-in">
                            <div className="border-b border-white/5 pb-4">
                                <h2 className="text-xl md:text-2xl font-serif text-[#C9A96E] italic">Segurança & Configurações Globais</h2>
                                <p className="text-white/40 text-xs mt-1">Gerencie as senhas de acesso administrativo do estúdio.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Formulário de Alteração de Senha */}
                                <div className="bg-[#0e0e0e]/80 p-6 rounded-xl border border-white/5 space-y-4">
                                    <div className="border-b border-white/5 pb-2">
                                        <h3 className="text-[#C9A96E] text-xs uppercase tracking-widest font-bold">Alterar Senha Mestra</h3>
                                        <p className="text-[10px] text-white/40">Esta senha protege o acesso a este painel administrativo</p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Senha Atual</label>
                                            <input
                                                type="password"
                                                className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none font-mono"
                                                placeholder="••••••••"
                                                value={passwordData.currentPassword}
                                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Nova Senha</label>
                                            <input
                                                type="password"
                                                className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none font-mono"
                                                placeholder="Mínimo 4 caracteres"
                                                value={passwordData.newPassword}
                                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 block ml-1">Confirmar Nova Senha</label>
                                            <input
                                                type="password"
                                                className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-white text-sm focus:border-[#C9A96E] focus:outline-none font-mono"
                                                placeholder="Confirme a nova senha"
                                                value={passwordData.confirmPassword}
                                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-[#C9A96E] text-black py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#C9A96E]/5"
                                        >
                                            Atualizar Senha
                                        </button>
                                    </form>
                                </div>

                                {/* Script de Inicialização da Tabela no Supabase */}
                                <div className="bg-[#0e0e0e]/85 p-6 rounded-xl border border-[#C9A96E]/20 space-y-4">
                                    <div className="border-b border-[#C9A96E]/10 pb-2">
                                        <h3 className="text-[#C9A96E] text-xs uppercase tracking-widest font-bold">Instalação da Senha Dinâmica</h3>
                                        <p className="text-[10px] text-white/40">Necessário rodar uma vez no seu Supabase</p>
                                    </div>

                                    <p className="text-xs text-white/60 leading-relaxed text-justify">
                                        Para que a senha seja lida do banco de dados ao invés do código, você precisa criar a tabela correspondente. Copie o script SQL abaixo e cole no seu **Supabase SQL Editor** e clique em **RUN**:
                                    </p>

                                    <pre className="w-full bg-[#050505] border border-white/10 p-3 rounded-lg text-[9px] text-[#C9A96E] font-mono whitespace-pre overflow-x-auto select-all leading-relaxed">
{`-- Criar a tabela de configurações
create table if not exists admin_settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  created_at timestamp with time zone 
    default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone 
    default timezone('utc'::text, now()) not null
);

-- Inserir senha inicial (catarse2026)
insert into admin_settings (key, value)
values ('admin_password', 'catarse2026')
on conflict (key) do nothing;`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

            </div>
        </div>
    );
}