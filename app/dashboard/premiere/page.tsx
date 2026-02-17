"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PremierePage() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);

    const playerRef = useRef<any>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem("catarse_user");
            if (!storedUser) {
                router.replace("/");
                return;
            }
            const parsedUser = JSON.parse(storedUser);

            // --- CORREÇÃO: Busca pelo ID ---
            const { data } = await supabase
                .from("clients")
                .select("*")
                .eq("id", parsedUser.id) // Mudou de access_code para id
                .single();

            setUser(data);
            setLoading(false);
        };
        fetchData();
    }, [router]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds) return "00:00";
        const date = new Date(seconds * 1000);
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setPlayed(newTime);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime);
        }
    };

    const startSession = () => {
        setHasStarted(true);
        setIsPlaying(true);
    };

    if (loading) return <div className="min-h-screen bg-catarse-moss"></div>;

    if (!user?.video_url) return null;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center relative overflow-x-hidden">

            <nav className={`w-full px-6 py-6 flex justify-between items-center absolute top-0 z-50 transition-opacity duration-500 ${hasStarted && !showControls ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
                <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-catarse-gold transition-colors text-xs uppercase tracking-widest pointer-events-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Voltar
                </Link>
                <div className="relative w-24 h-8 pointer-events-auto">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain opacity-50" />
                </div>
            </nav>

            <div
                className="w-full h-[60vh] md:h-[85vh] relative group flex items-center justify-center bg-zinc-900 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowControls(false)}
                onClick={() => {
                    if (hasStarted) setIsPlaying(!isPlaying);
                }}
            >
                {!hasStarted && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
                        <img
                            src={user.video_cover || "/filme.jpg"}
                            alt="Capa"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>

                        <button
                            className="relative z-50 w-24 h-24 rounded-full bg-catarse-gold/90 backdrop-blur-sm flex items-center justify-center pl-2 shadow-[0_0_50px_rgba(212,205,168,0.3)] animate-pulse hover:scale-110 transition-transform duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                startSession();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-catarse-moss">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {hasStarted && (
                    <>
                        {/* @ts-ignore */}
                        <ReactPlayer
                            key={user.video_url}
                            ref={playerRef}
                            url={user.video_url}
                            width="100%"
                            height="100%"
                            playing={isPlaying}
                            volume={0.8}
                            controls={false}
                            onProgress={(state: any) => setPlayed(state.played)}
                            onDuration={setDuration}
                            onEnded={() => setIsPlaying(false)}
                            style={{ position: 'absolute', top: 0, left: 0 }}
                            config={{ file: { forceHLS: true } }}
                        />

                        {!isPlaying && (
                            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pl-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        <div
                            className={`absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent z-50 transition-opacity duration-500 ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 relative group/bar hover:h-2 transition-all">
                                <div
                                    className="h-full bg-catarse-gold relative rounded-full"
                                    style={{ width: `${played * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-catarse-gold rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity scale-125"></div>
                                </div>
                                <input
                                    type="range" min={0} max={0.999999} step="any"
                                    value={played}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleSeek}
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs uppercase tracking-widest font-medium text-white/80">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-catarse-gold transition-colors">
                                        {isPlaying ? "Pausar" : "Play"}
                                    </button>
                                    <span>{formatTime(played * duration)} / {formatTime(duration)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-catarse-gold/50 text-[10px]">4K HDR</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="w-full max-w-5xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.3em]">Official Premiere</span>
                    <h1 className="font-serif italic text-5xl md:text-6xl text-white leading-tight">{user.project_name}</h1>
                    <p className="text-white/60 font-light leading-relaxed max-w-xl">
                        Esta obra é o resultado da fusão entre a memória e a arte.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-white/40 text-xs uppercase tracking-widest mb-6">Arquivos de Entrega</h3>
                    <a
                        href={user.download_url || "#"}
                        target="_blank"
                        className={`flex items-center justify-between p-4 border rounded transition-colors group ${!user.download_url ? 'border-white/5 bg-white/5 cursor-not-allowed opacity-50' : 'border-white/20 hover:border-catarse-gold hover:bg-white/5 cursor-pointer'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-white group-hover:text-catarse-gold transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                            <div>
                                <span className="block text-white text-sm font-medium">Download Original</span>
                                <span className="text-white/40 text-xs">Arquivo Master</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}