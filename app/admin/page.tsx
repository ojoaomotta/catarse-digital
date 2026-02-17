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

    // Novos campos: username e password
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        project_name: "",
        status: "Briefing",
        video_url: "",
        video_cover: "",
        download_url: ""
    });

    const handleAdminLogin = () => {
        if (passwordInput === ADMIN_PASS) {
            setIsAuthenticated(true);
            fetchClients();
        } else {
            alert("Senha incorreta");
        }
    };

    const fetchClients = async () => {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setClients(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação simples
        if (!formData.username || !formData.password) {
            alert("Preencha usuário e senha");
            return;
        }

        if (editingClient) {
            const { error } = await supabase
                .from("clients")
                .update(formData)
                .eq("id", editingClient.id);

            if (!error) {
                setEditingClient(null);
                fetchClients();
            }
        } else {
            const { error } = await supabase
                .from("clients")
                .insert([formData]);

            if (!error) {
                setIsCreating(false);
                fetchClients();
            }
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: "", username: "", password: "", project_name: "", status: "Briefing", video_url: "", video_cover: "", download_url: "" });
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
            download_url: client.download_url || ""
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="bg-white/5 p-8 rounded border border-white/10 text-center space-y-4">
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
        <div className="min-h-screen bg-zinc-900 text-white font-sans">

            <header className="bg-black border-b border-white/10 p-6 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-24 relative h-6">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-white/40 border-l border-white/20 pl-4">Painel de Controle</span>
                </div>
                <button
                    onClick={() => { setIsCreating(true); setEditingClient(null); resetForm(); }}
                    className="bg-catarse-gold text-catarse-moss px-4 py-2 text-xs font-bold uppercase rounded hover:bg-white transition-colors"
                >
                    + Novo Cliente
                </button>
            </header>

            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">

                {/* LISTA LATERAL */}
                <aside className="w-full md:w-1/3 border-r border-white/10 overflow-y-auto bg-black/20">
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
                                {/* Mostramos a senha aqui para facilitar seu controle */}
                                <p className="text-xs text-white/30 font-mono">Pass: {client.password}</p>
                            </div>
                        </div>
                    ))}
                </aside>

                {/* FORMULÁRIO */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {(editingClient || isCreating) ? (
                        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                            <h2 className="text-2xl font-serif text-catarse-gold border-b border-white/10 pb-4">
                                {isCreating ? "Novo Projeto" : `Editando: ${formData.project_name}`}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-white/40">Nome dos Noivos (Exibição)</label>
                                    <input className="w-full bg-black border border-white/10 p-3 rounded text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Julia & Leo" required />
                                </div>

                                {/* NOVOS CAMPOS DE LOGIN */}
                                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded border border-white/10">
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
                                        <option value="Briefing">Briefing</option>
                                        <option value="Filmagens">Filmagens</option>
                                        <option value="Edição">Edição</option>
                                        <option value="Cor">Cor (Color Grading)</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                </div>

                                <div className="p-4 border border-catarse-gold/20 bg-catarse-gold/5 rounded space-y-4">
                                    <h3 className="text-catarse-gold text-xs uppercase tracking-widest">Entrega Final</h3>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase text-white/40">Link do YouTube</label>
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
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 bg-catarse-gold text-black py-3 font-bold uppercase text-xs rounded hover:bg-white transition-colors">
                                        {isCreating ? "Criar Cliente" : "Salvar Alterações"}
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
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                            <p>Selecione um cliente ou crie um novo</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}