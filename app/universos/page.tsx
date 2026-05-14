"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const UNIVERSOS = [
    {
        id: "film",
        slug: "catarse-film",
        label: "Catarse Film",
        logo: "/logo-catarsefilm.png",
        tagline: "Casamentos & Pré-Weddings",
        description: "Para casamentos e pré-weddings. Esse é nosso principal universo e o mais reconhecido entre nossos clientes. Cada cerimônia é um roteiro único — e nós sabemos como revelá-lo.",
        video: "/thay-bruno.mkv",
        videoType: "video/x-matroska",
        color: "from-amber-900/20",
    },
    {
        id: "ensaios",
        slug: "catarse-ensaios",
        label: "Catarse Ensaios",
        logo: "/logo-catarseensaios.png",
        tagline: "Ensaios Externos & Familiares",
        description: "Voltado para ensaios externos e internos, ensaios familiares — aniversários, Dia das Mães, Dia dos Pais, Dia das Crianças, Dia dos Namorados e muito mais.",
        video: "/nicho-ensaios.mp4",
        videoType: "video/mp4",
        color: "from-green-900/20",
    },
    {
        id: "kids",
        slug: "catarsinhos",
        label: "Catarsinhos",
        logo: "/logo-catarsekids.png",
        tagline: "Para os Pequeninos",
        description: "Tudo que envolva crianças. Ensaios infantis, comemoração de aniversário, batizado infantil e muito mais. O olhar curioso dos pequenos merece ser eternizado.",
        video: "/nicho-kids.mp4",
        videoType: "video/mp4",
        color: "from-pink-900/20",
    },
    {
        id: "eventos",
        slug: "catarse-eventos",
        label: "Catarse Eventos",
        logo: "/logo-catarseventos.png",
        tagline: "Eventos & Comemorações",
        description: "Voltado para eventos no geral — comemorações, aniversários e celebrações de todas as naturezas. Cada momento coletivo tem sua própria emoção para ser capturada.",
        video: null,
        videoType: null,
        color: "from-blue-900/20",
    },
    {
        id: "partos",
        slug: "catarse-partos",
        label: "Catarse Partos",
        logo: "/logo-catarsepartos.png",
        tagline: "Captação de Partos",
        description: "Captação de partos com estilo documental e sensível. O momento mais intenso da vida, preservado com respeito, delicadeza e toda a arte que ele merece.",
        video: null,
        videoType: null,
        color: "from-rose-900/20",
    },
];

export default function UniversosPage() {
    const [active, setActive] = useState(UNIVERSOS[0]);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleSelect = (universo: typeof UNIVERSOS[0]) => {
        setActive(universo);
        // Reset video on tab change
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
            }
        }, 100);
    };

    return (
        <div className="bg-catarse-black text-catarse-cream font-sans overflow-x-hidden min-h-screen">

            {/* Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay z-50" />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-catarse-black/90 backdrop-blur-md py-4 border-b border-white/5">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="relative w-28 h-6 md:w-40 md:h-10 block">
                        <Image src="/logo.png" alt="Catarse" fill className="object-contain object-left" priority />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-16 px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.4em] border-b border-catarse-gold/30 pb-2 inline-block">
                        Nossos Universos
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                        Uma produtora, cinco universos.
                    </h1>
                    <p className="text-white/40 text-sm font-light">
                        Cada universo tem sua própria identidade visual, estilo e sensibilidade.
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <div className="sticky top-[65px] z-40 bg-catarse-black/95 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 flex overflow-x-auto gap-1 py-2 scrollbar-hide">
                    {UNIVERSOS.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => handleSelect(n)}
                            className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-sm text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                                active.id === n.id
                                    ? "bg-catarse-gold text-catarse-moss"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {/* Logo do universo em miniatura */}
                            <div className="relative w-8 h-8 flex-shrink-0 overflow-hidden rounded-md border border-white/20">
                                <Image
                                    src={n.logo}
                                    alt={n.label}
                                    fill
                                    className="object-cover scale-150"
                                />
                            </div>
                            <span className="hidden sm:block">{n.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conteúdo do universo ativo */}
            <section key={active.id} className="py-20 animate-fade-in">
                <div className="container mx-auto px-6">

                    {/* Header do universo */}
                    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${active.color} to-transparent border border-white/5 p-10 md:p-16 mb-12`}>
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">

                            {/* Logo grande */}
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                <Image
                                    src={active.logo}
                                    alt={active.label}
                                    fill
                                    className="object-cover scale-125"
                                />
                            </div>

                            {/* Textos */}
                            <div className="space-y-3">
                                <span className="text-catarse-gold text-xs uppercase tracking-[0.3em]">{active.tagline}</span>
                                <h2 className="text-4xl md:text-5xl font-serif italic text-white">{active.label}</h2>
                                <p className="text-white/60 font-light leading-relaxed max-w-2xl text-sm md:text-base">
                                    {active.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Player de vídeo */}
                    {active.video ? (
                        <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                            <video
                                ref={videoRef}
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full h-full object-contain"
                                key={active.video}
                            >
                                <source src={active.video} type={active.videoType ?? "video/mp4"} />
                                Seu navegador não suporta este formato de vídeo.
                            </video>
                        </div>
                    ) : (
                        <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-white/20">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <p className="text-white/20 text-xs uppercase tracking-widest">Amostra em breve</p>
                        </div>
                    )}

                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-white/5 text-center">
                <div className="container mx-auto px-6 space-y-6">
                    <h3 className="text-3xl font-serif italic text-white">Identificou seu momento?</h3>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                        Nossa agenda é limitada a 30 trabalhos por ano. Verifique a disponibilidade para a sua data.
                    </p>
                    <a
                        href="https://wa.me/5522999734867"
                        target="_blank"
                        className="inline-block px-10 py-5 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors"
                    >
                        Solicitar Orçamento
                    </a>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-white/20 text-[10px] uppercase tracking-widest">© 2026 Catarse Studio</p>
            </footer>
        </div>
    );
}
