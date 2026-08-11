"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadPage() {
    const [device, setDevice] = useState<"desktop" | "android" | "ios" | "loading">("loading");

    useEffect(() => {
        // 1. Detectar o Dispositivo
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/android/i.test(ua)) {
            setDevice("android");
            // 2. Se for Android, inicia o download automático após 1 segundo
            setTimeout(() => {
                const link = document.createElement("a");
                link.href = "/catarse.apk"; // O arquivo deve estar na pasta public
                link.download = "CatarseStudio.apk";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 1500);
        } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
            setDevice("ios");
        } else {
            setDevice("desktop");
        }
    }, []);

    return (
        <div className="min-h-screen bg-catarse-black text-catarse-cream font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Noise */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay z-0"></div>

            {/* Logo */}
            <div className="relative w-32 h-10 mb-12 z-10">
                <Image src="/logo.png" alt="Catarse" fill className="object-contain" priority />
            </div>

            <div className="relative z-10 w-full max-w-md text-center">

                {/* --- TELA DE CARREGAMENTO --- */}
                {device === "loading" && (
                    <div className="animate-pulse text-catarse-gold text-xs uppercase tracking-widest">
                        Identificando dispositivo...
                    </div>
                )}

                {/* --- TELA DESKTOP (Computador) --- */}
                {device === "desktop" && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="font-serif italic text-4xl text-white">Experiência Mobile</h1>
                        <p className="text-white/60 font-light leading-relaxed">
                            O aplicativo Catarse Studio foi desenhado exclusivamente para a palma da sua mão.
                            Por favor, acesse este link através do seu celular.
                        </p>

                        {/* BOX DO QR CODE */}
                        <div className="p-4 border border-white/10 bg-white/5 rounded-lg inline-block mt-4">
                            <p className="text-catarse-gold text-[10px] uppercase tracking-widest mb-3">Escaneie para Baixar</p>

                            <div className="relative w-32 h-32 bg-white p-2 rounded">
                                <Image
                                    src="/qr-code.png"
                                    alt="QR Code Download"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TELA ANDROID (Instruções APK) --- */}
                {device === "android" && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="font-serif italic text-3xl text-catarse-gold mb-2">Download Iniciado</h1>
                            <p className="text-white/60 text-xs">Se o download não começar, <a href="/catarse.apk" download className="underline text-white">clique aqui</a>.</p>
                        </div>

                        <div className="space-y-4 text-left bg-white/5 p-6 rounded border border-white/10">
                            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 border-b border-white/10 pb-2">Como Instalar</h3>

                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-catarse-gold text-catarse-moss flex items-center justify-center font-bold text-xs">1</div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Abra o arquivo</p>
                                    <p className="text-xs text-white/40 mt-1">Clique em "Abrir" na notificação de download concluído.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-catarse-gold text-catarse-moss flex items-center justify-center font-bold text-xs">2</div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Permita a instalação</p>
                                    <p className="text-xs text-white/40 mt-1">Se o navegador pedir permissão, clique em "Configurações" e ative "Permitir desta fonte".</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-catarse-gold text-catarse-moss flex items-center justify-center font-bold text-xs">3</div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Instalar</p>
                                    <p className="text-xs text-white/40 mt-1">Clique em instalar e aguarde. O App estará pronto.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TELA iOS (Instruções PWA / Add to Home) --- */}
                {device === "ios" && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="font-serif italic text-3xl text-catarse-gold mb-2">Instalar no iPhone</h1>
                            <p className="text-white/60 text-xs max-w-xs mx-auto">
                                A Apple não permite downloads diretos. Adicione este site à sua tela inicial para usá-lo como um aplicativo.
                            </p>
                        </div>

                        <div className="space-y-6 text-left bg-white/5 p-6 rounded border border-white/10 relative overflow-hidden">
                            {/* Seta animada apontando para baixo (onde fica o botão de compartilhar do Safari) */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-catarse-gold">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {/* Ícone de Compartilhar do iOS (simulado) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Toque em Compartilhar</p>
                                    <p className="text-xs text-white/40">No botão central da barra inferior do Safari.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center pb-8">
                                <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">Adicionar à Tela de Início</p>
                                    <p className="text-xs text-white/40">Role para baixo e selecione esta opção.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Botão Voltar */}
            <div className="absolute bottom-8 left-0 w-full text-center">
                <Link href="/" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                    Voltar ao início
                </Link>
            </div>

        </div>
    );
}