"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExtrasPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [extras, setExtras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem("catarse_user");
            if (!storedUser) { router.replace("/"); return; }
            const parsedUser = JSON.parse(storedUser);

            const { data } = await supabase
                .from("clients")
                .select("extras, extras_unlocked, project_name")
                .eq("id", parsedUser.id)
                .single();

            setUser(data);
            if (data?.extras) setExtras(data.extras);
            setLoading(false);
        };
        fetchData();
    }, [router]);

    const handleUnlock = () => {
        // Aqui você pode colocar seu número real
        const message = `Olá! Gostaria de desbloquear a galeria de extras do projeto ${user?.project_name}.`;
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    if (loading) return <div className="min-h-screen bg-catarse-moss"></div>;

    return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center py-12 px-6 relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay"></div>

            <div className="w-full max-w-5xl mb-12 z-10 flex justify-between items-center">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-white/40 hover:text-catarse-gold transition-colors text-xs uppercase tracking-widest w-fit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Voltar
                </Link>
                <span className="text-catarse-gold text-xs uppercase tracking-[0.3em]">Cenas Deletadas</span>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 z-10 animate-fade-in">
                <h1 className="font-serif italic text-4xl md:text-5xl text-catarse-cream">
                    Fragmentos Ocultos
                </h1>
                <p className="text-white/60 font-sans text-sm font-light leading-relaxed">
                    Momentos espontâneos, risos fora de hora e ângulos alternativos.
                    Cenas que não entraram no corte final por ritmo, mas pertencem à sua história.
                </p>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
                {extras.length === 0 && (
                    <div className="col-span-3 text-center py-20 border border-white/5 rounded">
                        <p className="text-white/20 italic font-serif">Nenhum fragmento disponível ainda.</p>
                    </div>
                )}
                {extras.map((item, index) => {
                    const isLocked = !user?.extras_unlocked;
                    return (
                        <div
                            key={index}
                            className="group relative aspect-[4/5] md:aspect-[3/4] bg-black border border-white/10 overflow-hidden cursor-pointer"
                            onClick={() => isLocked && handleUnlock()}
                        >
                            {item.thumb ? (
                                <img src={item.thumb} alt={item.title}
                                    className={`w-full h-full object-cover transition-all duration-700 ${isLocked ? 'blur-sm scale-105 group-hover:scale-110 opacity-50' : 'opacity-80 group-hover:opacity-100'}`} />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <span className="text-white/10 text-xs uppercase tracking-widest">Sem thumbnail</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                            {isLocked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/60 group-hover:text-catarse-gold group-hover:border-catarse-gold/50 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-catarse-gold opacity-0 group-hover:opacity-100 transition-opacity">Desbloquear</span>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-6">
                                {item.duration && (
                                    <span className="text-[10px] text-catarse-gold border border-catarse-gold/30 px-2 py-1 rounded-full mb-2 inline-block">{item.duration}</span>
                                )}
                                <h3 className="font-serif italic text-2xl text-white group-hover:text-catarse-gold transition-colors">{item.title}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 z-10">
                <button
                    onClick={handleUnlock}
                    className="px-8 py-4 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_30px_rgba(212,205,168,0.2)]"
                >
                    Desbloquear Galeria Completa • R$ 97,00
                </button>
            </div>
        </div>
    );
}