"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface LinkItem {
    icon: React.ReactNode;
    text: string;
    href: string;
    isExternal: boolean;
}

export default function LinksPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Set dynamic document title for links page
        document.title = "Catarse Links | Cartão de Contato";

        // Force video play on mount (helps bypass strict mobile browser autoplay policies)
        if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {
                /* autoplay blocked or failed */
            });
        }
    }, []);

    const links: LinkItem[] = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            ),
            text: "@CATARSEFILM",
            href: "https://instagram.com/catarsefilm",
            isExternal: true,
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            ),
            text: "INICIAR CONVERSA",
            href: "https://wa.me/5522997402760",
            isExternal: true,
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
            ),
            text: "ASSISTIR FILMES",
            href: "https://www.youtube.com/@CatarseFilm/",
            isExternal: true,
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            ),
            text: "contatocatarsefilm@gmail.com",
            href: "mailto:contatocatarsefilm@gmail.com",
            isExternal: true,
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
            ),
            text: "BAIXAR APLICATIVO",
            href: "/download",
            isExternal: false,
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            ),
            text: "SITE COMPLETO",
            href: "/",
            isExternal: false,
        },
    ];

    return (
        <main className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center text-center py-6 px-6 select-none bg-black">
            
            {/* Camada 1 — Background Video */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://ltvqklvtoufhracpwmor.supabase.co/storage/v1/object/public/images/bg-videos/herobg.mp4" type="video/mp4" />
                    <source src="/herobg.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Camada 2 — Dark linear-gradient Overlay */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.75) 100%)"
                }}
            />

            {/* Camada 3 — Content Area */}
            <div className="relative z-20 w-full h-full max-w-[400px] mx-auto flex flex-col justify-between items-center py-2 md:py-6 gap-4">
                
                {/* BRANDING HEADER */}
                <header className="flex flex-col items-center w-full animate-fade-in">
                    {/* Logo (Centered, 100px mobile, 120px desktop) */}
                    <div className="relative w-[100px] h-[30px] md:w-[120px] md:h-[36px] mb-3">
                        <Image
                            src="/logo.png"
                            alt="Catarse"
                            fill
                            sizes="(max-width: 768px) 100px, 120px"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Fino dourado subtitulo */}
                    <p className="font-sans text-[11px] font-light tracking-[3px] text-[#C9A96E] uppercase mb-1">
                        AUDIOVISUAL CINEMATOGRÁFICO
                    </p>

                    {/* Serif Tagline */}
                    <h1 className="font-serif italic text-[15px] text-[#F5F0EB] mt-2 leading-relaxed">
                        Sua história merece ser cinema.
                    </h1>

                    {/* Golden Divider */}
                    <div className="w-[60px] h-[1px] bg-[#C9A96E] mt-4 mb-3 opacity-80" />

                    {/* Segmentos Atendidos */}
                    <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[9px] md:text-[10px] uppercase tracking-[1.5px] text-white/50 font-sans font-light max-w-[320px] px-2">
                        <span>Casamentos</span>
                        <span className="text-[#C9A96E] font-bold">·</span>
                        <span>Ensaios</span>
                        <span className="text-[#C9A96E] font-bold">·</span>
                        <span>Infantil</span>
                        <span className="text-[#C9A96E] font-bold">·</span>
                        <span>Eventos</span>
                        <span className="text-[#C9A96E] font-bold">·</span>
                        <span>Partos</span>
                    </div>
                </header>

                {/* BUTTONS LINK STACK */}
                <section className="w-full flex flex-col gap-[10px] my-auto animate-slide-up">
                    {links.map((link, idx) => {
                        const className = `
                            flex items-center gap-3.5 w-full py-[14px] px-[20px] rounded-[6px] 
                            border border-[#C9A96E]/40 bg-[#0d0d0d]/55 backdrop-blur-[8px] 
                            transition-all duration-200 ease-out 
                            hover:border-[#C9A96E]/90 hover:-translate-y-[1px] active:scale-[0.99]
                        `.trim();

                        const content = (
                            <>
                                {link.icon}
                                <span className="font-sans text-[13px] text-white tracking-[1px] uppercase font-light leading-none">
                                    {link.text}
                                </span>
                            </>
                        );

                        if (link.isExternal) {
                            return (
                                <a
                                    key={idx}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={className}
                                    id={`link-btn-${idx}`}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={link.href}
                                className={className}
                                id={`link-btn-${idx}`}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </section>

                {/* FOOTER */}
                <footer className="w-full text-center mt-2 opacity-80 select-none animate-fade-in">
                    <p className="font-sans text-[10px] text-[#F5F0EB]/40 tracking-wider">
                        © 2026 Catarse Studio · Cabo Frio, RJ
                    </p>
                </footer>

            </div>
        </main>
    );
}
