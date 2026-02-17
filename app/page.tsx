"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Dados Fictícios do Portfólio (Substitua pelas suas melhores capas depois)
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

    // Efeito para mudar a cor da navbar ao rolar
    useEffect(() => {
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
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled
                    ? "bg-catarse-black/90 backdrop-blur-md py-4 border-white/5"
                    : "bg-transparent py-8 border-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <div className="relative w-32 h-8 md:w-40 md:h-10">
                        <Image src="/logo.png" alt="Catarse" fill className="object-contain object-left" priority />
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-10">
                        <a href="#manifesto" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Manifesto</a>
                        <a href="#portfolio" className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-catarse-gold transition-colors">Cinemateca</a>

                        {/* Botão de Acesso ao Cliente */}
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
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background Imagem/Vídeo */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-40 animate-pulse"
                        style={{ animationDuration: '8s' }}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-catarse-black via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-catarse-black/50 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 space-y-8 animate-fade-in">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.4em] border-b border-catarse-gold/30 pb-2">Estúdio de Cinema Autoral</span>
                    <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight text-white italic mix-blend-overlay opacity-90 leading-tight">
                        Memórias que<br />o tempo não apaga.
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

                {/* Scroll Indicator */}
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
                    <div className="md:col-span-5 relative aspect-[3/4] group overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop"
                            alt="Art"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
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
                                Em um mundo de imagens rápidas e descartáveis, escolhemos o caminho inverso.
                                O caminho da permanência. Nosso olhar busca o "não-dito": o suspiro antes do sim,
                                o tremor nas mãos, a lágrima que cai no escuro.
                            </p>
                            <p>
                                Trabalhamos com a granulação da película, a profundidade da sombra e a elegância da composição
                                para transformar o seu dia em uma obra de arte cinematográfica.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CINEMATECA (PORTFOLIO) --- */}
            <section id="portfolio" className="py-24 bg-zinc-900/30 border-t border-white/5">
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

            {/* --- SERVIÇOS / DIFERENCIAIS --- */}
            <section className="py-24 bg-catarse-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">01</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">Invisibilidade</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Nossa equipe trabalha como sombras. Sem luzes fortes no rosto dos convidados,
                                sem equipamentos gigantes. Capturamos a verdade sem interferir nela.
                            </p>
                        </div>
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">02</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">Color Grading</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Nossa identidade visual é inspirada nas películas Kodak Vision3.
                                Cores profundas, tons de pele naturais e um visual atemporal que não envelhece.
                            </p>
                        </div>
                        <div className="p-8 border border-white/5 hover:border-catarse-gold/30 transition-colors bg-white/[0.02]">
                            <span className="text-4xl font-serif italic text-catarse-gold mb-4 block">03</span>
                            <h3 className="text-lg uppercase tracking-widest text-white mb-4">Ecossistema</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Muito além de um link. Oferecemos uma plataforma exclusiva onde você acompanha a edição,
                                interage com o processo criativo e assiste à sua estreia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-32 bg-catarse-gold text-catarse-moss relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Sua história merece ser cinema.</h2>
                    <p className="max-w-xl mx-auto text-catarse-moss/70 font-medium mb-12">
                        Nossa agenda é limitada a 20 casamentos por ano para garantir a exclusividade do processo artesanal.
                        Verifique a disponibilidade para a sua data.
                    </p>
                    <a
                        href="https://wa.me/5522999734867"
                        target="_blank"
                        className="inline-block px-10 py-5 bg-catarse-moss text-catarse-gold font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-catarse-moss transition-colors shadow-2xl"
                    >
                        Solicitar Orçamento
                    </a>
                </div>
                {/* Noise invertido para textura */}
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
                            Baseado no Brasil, disponível para o mundo.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white text-xs uppercase tracking-widest mb-6">Navegação</h4>
                        <ul className="space-y-4 text-xs text-white/40">
                            <li><a href="#" className="hover:text-catarse-gold transition-colors">Home</a></li>
                            <li><a href="#portfolio" className="hover:text-catarse-gold transition-colors">Filmes</a></li>
                            <li><a href="#manifesto" className="hover:text-catarse-gold transition-colors">Sobre</a></li>
                            <li><Link href="/login" className="hover:text-catarse-gold transition-colors">Área do Cliente</Link></li>
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