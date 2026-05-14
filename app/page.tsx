"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Dados Fictícios do Portfólio
const PORTFOLIO = [
    {
        title: "O Som do Silêncio",
        couple: "Ana & Marcos",
        location: "Toscana, Itália",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
    },
    {
        title: "Eterno Retorno",
        couple: "Clara & João",
        location: "Rio de Janeiro, BR",
        image: "https://images.unsplash.com/photo-1511285560982-1351c4f63525?q=80&w=1200&auto=format&fit=crop"
    },
    {
        title: "A Luz da Manhã",
        couple: "Sofia & Pedro",
        location: "São Miguel dos Milagres, BR",
        image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop"
    }
];

export default function HomePage() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Força o play após a hidratação do React
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => { /* autoplay bloqueado pelo browser */ });
        }
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-catarse-black text-catarse-cream selection:bg-catarse-gold selection:text-catarse-black font-sans overflow-x-hidden">

            {/* Texture Noise Global */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay z-50"></div>

            {/* --- NAVBAR --- */}
            <nav
                id="navbar"
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled
                    ? "bg-catarse-black/90 backdrop-blur-md py-4 border-white/5"
                    : "bg-transparent py-6 md:py-8 border-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">

                    {/* Logo */}
                    <div className="relative w-28 h-6 md:w-40 md:h-10">
                        <Image src="/logo.png" alt="Catarse" fill className="object-contain object-left" priority />
                    </div>

                    {/* --- MENU DESKTOP --- */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/sobre" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Sobre</Link>
                        <Link href="/generos" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Gêneros</Link>
                        <a href="#manifesto" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Manifesto</a>
                        <a href="#portfolio" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Cinemateca</a>

                        {/* Link Download Desktop */}
                        <Link href="/download" className="text-xs uppercase tracking-[0.2em] text-catarse-gold hover:text-white transition-colors flex items-center gap-2">
                            <span>App</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Link>

                        <Link
                            href="/login"
                            className="group px-6 py-3 bg-white/5 border border-white/10 hover:border-catarse-gold hover:bg-catarse-gold/10 transition-all rounded-sm flex items-center gap-2"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-catarse-gold">Área do Cliente</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white/50 group-hover:text-catarse-gold">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* --- MENU MOBILE --- */}
                    <div className="md:hidden flex gap-4">
                        {/* Botão Menu Hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center justify-center w-10 h-10 border border-white/10 text-catarse-gold rounded-sm hover:bg-white/5 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>

                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 border border-catarse-gold/30 text-catarse-gold text-[10px] uppercase tracking-widest rounded-sm hover:bg-catarse-gold hover:text-catarse-moss transition-colors"
                        >
                            <span>Login</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Link>
                    </div>

                </div>

                {/* --- MENU DROPDOWN MOBILE --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-catarse-black/95 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex flex-col gap-4 shadow-2xl animate-fade-in">
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/sobre" className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-catarse-gold py-2 border-b border-white/5">Sobre</Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/generos" className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-catarse-gold py-2 border-b border-white/5">Gêneros</Link>
                        <a onClick={() => setIsMobileMenuOpen(false)} href="#manifesto" className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-catarse-gold py-2 border-b border-white/5">Manifesto</a>
                        <a onClick={() => setIsMobileMenuOpen(false)} href="#portfolio" className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-catarse-gold py-2 border-b border-white/5">Cinemateca</a>
                        <Link onClick={() => setIsMobileMenuOpen(false)} href="/download" className="text-sm uppercase tracking-[0.2em] text-catarse-gold hover:text-white py-2 flex items-center gap-2">
                            <span>Baixar App</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    >
                        <source src="/herobg.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-catarse-black via-catarse-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-catarse-black/50 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 space-y-8 animate-fade-in">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.4em] border-b border-catarse-gold/30 pb-2">Estúdio de Cinema Autoral</span>
                    <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight text-white italic mix-blend-overlay opacity-90 leading-tight">
                        Sua história<br />cinematográfica.
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <a href="#portfolio" className="px-8 py-4 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                            Ver Obras
                        </a>
                        <a href="https://wa.me/5522999734867" target="_blank" className="px-8 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-white transition-colors">
                            Iniciar Conversa
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                    <span className="text-[9px] uppercase tracking-widest">Scroll</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </header>

            {/* --- MANIFESTO --- */}
            <section id="manifesto" className="py-24 md:py-32 bg-catarse-black relative">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 relative aspect-[4/3] group overflow-hidden">
                        <Image
                            src="/ocean.jpg"
                            alt="Catarse Film"
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                    </div>
                    <div className="md:col-span-1"></div>
                    <div className="md:col-span-6 space-y-8">
                        <span className="text-catarse-gold text-xs uppercase tracking-[0.25em]">Filosofia</span>
                        <h2 className="text-4xl md:text-5xl font-serif italic leading-tight text-white">
                            Não filmamos apenas o que acontece. <br />Filmamos o que se sente.
                        </h2>
                        <div className="space-y-6 text-white/60 font-light leading-relaxed text-sm md:text-base text-justify">
                            <p>
                                Vai muito além de narrativas com alta qualidade, exploramos o sentimento do momento.
                                As nuances que residem entre o momento e a captura. Pequenos fragmentos, detalhes
                                minuciosos que conduzem o espectador a sentir cada emoção. Literalmente uma “catarse”.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CINEMATECA --- */}
            {/* TODO: Exibir últimos posts do Instagram quando a integração estiver pronta */}
            <section id="portfolio" className="hidden py-24 bg-zinc-900/30 border-t border-white/5">
                <div className="container mx-auto px-6 mb-16 flex justify-between items-end">
                    <div>
                        <span className="text-catarse-gold text-xs uppercase tracking-[0.25em] block mb-2">Portfolio</span>
                        <h2 className="text-3xl md:text-4xl font-serif italic text-white">Últimas Estreias</h2>
                    </div>
                    <a href="#" className="hidden md:block text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1">Ver arquivo completo</a>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-1">
                    {PORTFOLIO.map((film, index) => (
                        <div key={index} className="group relative aspect-[3/4] cursor-pointer overflow-hidden bg-black">
                            <Image
                                src={film.image}
                                alt={film.title}
                                fill
                                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                            <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[10px] uppercase tracking-widest text-catarse-gold mb-2 block">{film.location}</span>
                                <h3 className="text-2xl font-serif italic text-white mb-1">{film.title}</h3>
                                <p className="text-xs text-white/60 uppercase tracking-widest">{film.couple}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SERVIÇOS --- */}
            <section className="py-24 bg-catarse-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">01</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">O Olhar</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Nosso pilar principal é a forma como capturamos cada take. Preservamos sempre o olhar aguçado, sensível e atento para que nada passe despercebido. Vemos arte em tudo.
                            </p>
                        </div>
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">02</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">Estrutura</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Nossos equipamentos de filmagem e de áudio são de altíssima qualidade, os microfones capturam sons com mais de 250 metros de distância. Filmamos em s-log.
                            </p>
                        </div>
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">03</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">Color Grading</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Elevamos cada cena ao nível de cinema através do padrão de cor das grandes produções. Priorizamos uma estética documental, com cores profundas, contraste rico e tons de pele naturais.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO CATARSE MOBILE --- */}
            <section className="py-24 bg-zinc-900/20 border-y border-white/5 relative overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Texto (Esquerda) */}
                    <div className="md:w-1/2 space-y-6 relative z-10 text-center md:text-left">
                        <span className="text-catarse-gold text-xs uppercase tracking-widest block">Aplicativo Catarse</span>
                        <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-tight">
                            Catarse pertinho<br />de você.
                        </h2>
                        <p className="text-white/60 font-light leading-relaxed max-w-md mx-auto md:mx-0">
                            Acompanhe o status da edição em tempo real, receba notificações e assista à sua estreia diretamente pelo nosso aplicativo exclusivo.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/download"
                                className="inline-flex items-center gap-3 px-8 py-4 border border-catarse-gold text-catarse-gold hover:bg-catarse-gold hover:text-catarse-moss transition-all uppercase text-xs font-bold tracking-widest rounded-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Baixar Aplicativo
                            </Link>
                        </div>
                    </div>

                    {/* QR Code (Direita - Só aparece no Desktop) */}
                    <div className="md:w-1/2 flex justify-center relative">
                        {/* Círculo decorativo atrás */}
                        <div className="absolute w-64 h-64 bg-catarse-gold/5 rounded-full blur-3xl"></div>

                        <div className="hidden md:flex flex-col items-center gap-4 p-6 border border-white/10 bg-black/40 rounded-2xl backdrop-blur-sm shadow-2xl relative z-10">
                            <div className="relative w-48 h-48 bg-white p-3 rounded-lg">
                                <Image
                                    src="/qr-code.png"
                                    alt="Baixe o App"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-catarse-gold text-[10px] uppercase tracking-[3px]">Escaneie com a Câmera</p>
                        </div>

                        {/* No mobile, mostramos uma imagem ilustrativa do app ou nada */}
                        <div className="md:hidden relative w-48 h-48 opacity-20">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                    </div>

                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-32 bg-catarse-gold text-catarse-moss relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Sua história merece ser cinema.</h2>
                    <p className="max-w-xl mx-auto text-catarse-moss/70 font-medium mb-12">
                        Nossa agenda é limitada a 30 trabalhos por ano para garantir exclusividade do processo artesanal. Verifique a disponibilidade para a sua data.
                    </p>
                    <a
                        href="https://wa.me/5522999734867"
                        target="_blank"
                        className="inline-block px-10 py-5 bg-catarse-moss text-catarse-gold font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-catarse-moss transition-colors shadow-2xl"
                    >
                        Solicitar Orçamento
                    </a>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-grain mix-blend-multiply"></div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-16 border-t border-white/5 bg-black text-center md:text-left">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="w-32 h-8 relative mb-6 mx-auto md:mx-0">
                            <Image src="/logo.png" alt="Catarse" fill className="object-contain object-left" />
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                            Estúdio de cinema documental focado em casamentos e histórias de família.
                            Fundada no Brasil, disponível para o mundo.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-xs uppercase tracking-widest mb-6">Navegação</h4>
                        <ul className="space-y-4 text-xs text-white/40">
                            <li><a href="#" className="hover:text-catarse-gold transition-colors">Home</a></li>
                            <li><Link href="/sobre" className="hover:text-catarse-gold transition-colors">Sobre</Link></li>
                            <li><Link href="/generos" className="hover:text-catarse-gold transition-colors">Gêneros</Link></li>
                            <li><a href="#manifesto" className="hover:text-catarse-gold transition-colors">Manifesto</a></li>
                            <li><Link href="/login" className="hover:text-catarse-gold transition-colors">Área do Cliente</Link></li>
                            <li><Link href="/download" className="hover:text-catarse-gold transition-colors">Baixar App</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-xs uppercase tracking-widest mb-6">Contato</h4>
                        <ul className="space-y-4 text-xs text-white/40">
                            <li><a href="https://www.instagram.com/catarsefilm/" className="hover:text-catarse-gold transition-colors">Instagram</a></li>
                            <li><a href="https://wa.me/5522999734867" className="hover:text-catarse-gold transition-colors">WhatsApp</a></li>
                            <li>contatocatarsefilm@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/20">
                    <p>© 2026 Catarse Studio. All rights reserved.</p>
                    <p>Desenvolvido com Paixão.</p>
                </div>
            </footer>
        </div>
    );
}