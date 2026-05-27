"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// As etapas do processo cinematográfico
const STEPS = [
    { id: 1, label: "Contrato", status: "Contrato" },
    { id: 2, label: "Captura", status: "Captura" },
    { id: 3, label: "Montagem", status: "Montagem" },
    { id: 4, label: "Color Grading", status: "Color Grading" },
    { id: 5, label: "Finalização", status: "Finalizado" },
];

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("catarse_user");

        if (!storedUser) {
            router.replace("/");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Define logo o estado inicial para evitar tela preta/atrasos

        const fetchLatestUser = async () => {
            try {
                const { data, error } = await supabase
                    .from("clients")
                    .select("*")
                    .eq("id", parsedUser.id)
                    .single();

                if (!error && data) {
                    setUser(data);
                    localStorage.setItem("catarse_user", JSON.stringify(data));
                }
            } catch (err) {
                console.error("Erro ao sincronizar dados do cliente com o Supabase:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("catarse_user");
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-catarse-black flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <span className="font-serif italic text-2xl text-catarse-gold">Catarse</span>
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Verificando credenciais...</p>
                </div>
            </div>
        );
    }

    const currentStepIndex = STEPS.findIndex(s => s.status === user.status);

    return (
        <div className="min-h-screen w-full bg-catarse-moss relative flex flex-col">

            {/* NAVBAR */}
            <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-catarse-moss/90 backdrop-blur-md sticky top-0 z-50">
                <div className="relative h-8 w-32 md:h-12 md:w-56">
                    <Image
                        src="/logo.png"
                        alt="Catarse Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>

                <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-catarse-gold/50 transition-all duration-300"
                >
                    <span className="text-[10px] uppercase tracking-widest text-white/60 group-hover:text-catarse-gold transition-colors">Sair</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white/60 group-hover:text-catarse-gold">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </button>
            </nav>

            {/* CONTEÚDO */}
            <main className="flex-1 flex flex-col items-center px-6 py-12 max-w-4xl mx-auto w-full animate-fade-in">

                <div className="text-center space-y-4 mb-16">
                    <p className="text-xs uppercase tracking-[0.3em] text-catarse-gold">Status da Produção</p>
                    <h1 className="font-serif italic text-4xl md:text-6xl text-catarse-cream leading-tight">
                        {user.project_name}
                    </h1>
                    <p className="text-white/40 font-light text-sm">
                        Para: <span className="text-white/80 border-b border-catarse-gold/30 pb-0.5">{user.name}</span>
                    </p>
                </div>

                {/* TIMELINE INTELIGENTE */}
                <div className="w-full max-w-md space-y-8 relative pl-4 md:pl-0 mb-20">
                    <div className="absolute left-[27px] md:left-[19px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent z-0"></div>

                    {STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        if (step.status === "Finalizado" && isCurrent) {
                            return (
                                <div key={step.id} className="relative z-10 flex items-center gap-6 group">
                                    <button
                                        onClick={() => router.push('/dashboard/premiere')}
                                        className="w-14 h-14 rounded-full bg-catarse-gold text-catarse-moss flex items-center justify-center shadow-[0_0_30px_rgba(212,205,168,0.5)] hover:scale-110 transition-transform duration-300 animate-pulse"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="opacity-100 translate-x-2">
                                        <h3 className="font-serif italic text-2xl text-catarse-gold cursor-pointer hover:underline" onClick={() => router.push('/dashboard/premiere')}>
                                            Assistir Filme
                                        </h3>
                                        <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
                                            Sua estreia está pronta
                                        </p>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div key={step.id} className="relative z-10 flex items-center gap-6 group">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-700
                                    ${isCurrent
                                        ? "bg-catarse-gold border-catarse-gold text-catarse-moss shadow-[0_0_25px_rgba(212,205,168,0.4)] scale-110"
                                        : isCompleted
                                            ? "bg-catarse-moss-light border-catarse-moss-light text-catarse-gold"
                                            : "bg-catarse-black border-white/5 text-white/10"}
                                `}>
                                    <span className="text-xs font-bold">{index + 1}</span>
                                </div>
                                <div className={`transition-all duration-500 ${isCurrent ? "opacity-100 translate-x-2" : isCompleted ? "opacity-50" : "opacity-20 blur-[1px]"}`}>
                                    <h3 className={`font-serif text-xl ${isCurrent ? "text-catarse-gold italic" : "text-white"}`}>
                                        {step.label}
                                    </h3>
                                    {isCurrent && (
                                        <p className="text-[9px] uppercase tracking-widest text-catarse-gold/60 mt-1 animate-pulse">
                                            Em progresso
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- BOTÕES DE AÇÃO RÁPIDA (LAYOUT DINÂMICO BENTO GRID) --- */}
                {(() => {
                    const showBriefing = user.briefing_enabled !== false;
                    const showExtras = user.extras_enabled !== false;

                    let briefingClass = "border border-white/10 p-6 rounded text-left hover:bg-white/5 transition-all duration-300 group relative overflow-hidden";
                    let laboratorioClass = "border border-white/10 p-6 rounded text-left hover:bg-white/5 transition-all duration-300 group relative overflow-hidden";
                    let extrasClass = "border border-white/10 p-6 rounded text-left hover:bg-white/5 transition-all duration-300 group relative overflow-hidden flex flex-col";

                    if (showBriefing && showExtras) {
                        // Layout original: Briefing e Lab são meio-meio, Extras é full-width embaixo
                        extrasClass += " md:col-span-2 md:items-center md:text-center";
                    } else if (!showBriefing && showExtras) {
                        // Apenas Lab e Extras: ficam lado a lado (meio-meio)
                    } else if (showBriefing && !showExtras) {
                        // Apenas Briefing e Lab: ficam lado a lado (meio-meio)
                    } else {
                        // Apenas Laboratório ativo: fica full-width e centralizado
                        laboratorioClass += " md:col-span-2 md:items-center md:text-center";
                    }

                    return (
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                            {/* Botão Briefing */}
                            {showBriefing && (
                                <button
                                    onClick={() => router.push('/dashboard/briefing')}
                                    className={briefingClass}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-catarse-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="block text-catarse-gold text-xs uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform relative z-10">Briefing</span>
                                    <span className="font-serif italic text-2xl text-white/80 relative z-10">Sua História</span>
                                </button>
                            )}

                            {/* Botão Laboratório */}
                            <button
                                onClick={() => router.push('/dashboard/laboratorio')}
                                className={laboratorioClass}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-catarse-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="block text-catarse-gold text-xs uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform relative z-10">Showcase</span>
                                <span className="font-serif italic text-2xl text-white/80 relative z-10">Laboratório de Cor</span>
                            </button>

                            {/* Botão EXTRAS (Destaque Full Width se houver 3 elementos, senão meio-meio) */}
                            {showExtras && (
                                <button
                                    onClick={() => router.push('/dashboard/extras')}
                                    className={extrasClass}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-catarse-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="block text-catarse-gold text-xs uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform relative z-10">Upsell</span>
                                    <span className="font-serif italic text-2xl text-white/80 relative z-10">Fragmentos Ocultos</span>
                                    <p className="hidden md:block text-white/40 text-sm mt-2 max-w-md relative z-10">
                                        Acesse cenas deletadas e momentos exclusivos que não entraram no corte final.
                                    </p>
                                </button>
                            )}
                        </div>
                    );
                })()}

            </main>
        </div>
    );
}