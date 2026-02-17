"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const QUESTIONS = [
    {
        id: "atmosfera",
        title: "Cena 01: A Atmosfera",
        question: "Se a história de vocês fosse um filme, em que horário do dia e estação do ano ela se passaria?",
        placeholder: "Ex: Num fim de tarde dourado de outono, ou numa manhã chuvosa e aconchegante..."
    },
    {
        id: "gesto",
        title: "Cena 02: O Detalhe",
        question: "Qual é aquele pequeno gesto ou mania do outro que faz você sorrir escondido?",
        placeholder: "O jeito que ela mexe no cabelo, ou como ele franze a testa quando..."
    },
    {
        id: "som",
        title: "Cena 03: A Trilha Sonora",
        question: "Que música, se tocasse agora, transportaria vocês imediatamente para o melhor momento que viveram?",
        placeholder: "Aquela música que o mundo para quando toca..."
    },
    {
        id: "promessa",
        title: "Cena 04: O Subtexto",
        question: "O que você gostaria de prometer para o futuro, mas talvez não consiga dizer em voz alta no altar?",
        placeholder: "Uma promessa silenciosa, um compromisso de alma..."
    },
    {
        id: "legado",
        title: "Cena Final: O Legado",
        question: "Daqui a 30 anos, quando assistirem a este filme, o que vocês querem sentir?",
        placeholder: "Nostalgia, a certeza da escolha, a paz de ter construído..."
    }
];

export default function BriefingPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const storedUser = localStorage.getItem("catarse_user");
            if (!storedUser) {
                router.replace("/");
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // --- CORREÇÃO 1: Busca pelo ID ---
            const { data, error } = await supabase
                .from("clients")
                .select("briefing_done")
                .eq("id", parsedUser.id) // Mudou de access_code para id
                .single();

            if (data?.briefing_done) {
                setCompleted(true);
            }

            setLoading(false);
        };

        checkStatus();
    }, [router]);


    const currentQ = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

    const handleType = (text: string) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: text }));
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishBriefing();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const finishBriefing = async () => {
        setIsSaving(true);

        try {
            if (!user) return;

            // --- CORREÇÃO 2: Salva pelo ID ---
            const { error } = await supabase
                .from("clients")
                .update({
                    briefing_data: answers,
                    briefing_done: true
                })
                .eq("id", user.id); // Mudou de access_code para id

            if (error) throw error;

            setCompleted(true);

        } catch (err) {
            alert("Erro ao salvar. Tente novamente.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-catarse-moss flex items-center justify-center text-catarse-gold animate-pulse">Carregando roteiro...</div>;
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-catarse-moss flex flex-col items-center justify-center px-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full border border-catarse-gold flex items-center justify-center mb-6 text-catarse-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h1 className="font-serif italic text-4xl text-catarse-cream mb-4">Roteiro em Produção</h1>
                <p className="text-white/60 font-light max-w-md mb-8">
                    Recebemos suas memórias. Nossa equipe de edição já está utilizando suas respostas para guiar a narrativa do filme.
                </p>
                <Link
                    href="/dashboard"
                    className="px-8 py-3 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                    Voltar ao Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden transition-colors duration-700">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay"></div>

            <div className="w-full max-w-3xl flex flex-col gap-8 z-10">
                <div className="flex justify-between items-end">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-white/40 hover:text-catarse-gold transition-colors text-xs uppercase tracking-widest w-fit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Cancelar
                    </Link>
                    <span className="text-catarse-gold/50 font-serif italic">
                        {currentStep + 1} <span className="text-white/20 text-xs not-italic font-sans">/ {QUESTIONS.length}</span>
                    </span>
                </div>
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-catarse-gold transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="w-full max-w-3xl flex-1 flex flex-col justify-center items-start animate-fade-in z-10">
                <div key={currentStep} className="w-full">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.3em] mb-6 block opacity-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {currentQ.title}
                    </span>
                    <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-catarse-cream leading-tight mb-12 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {currentQ.question}
                    </h2>
                    <textarea
                        value={answers[currentQ.id] || ""}
                        onChange={(e) => handleType(e.target.value)}
                        placeholder={currentQ.placeholder}
                        className="w-full bg-transparent border-l-2 border-white/10 pl-6 text-xl text-white/80 placeholder-white/20 focus:outline-none focus:border-catarse-gold transition-colors font-light min-h-[150px] resize-none opacity-0 animate-slide-up"
                        style={{ animationDelay: '0.3s' }}
                        autoFocus
                    />
                </div>
            </div>

            <div className="w-full max-w-3xl flex justify-between items-center z-10 pt-8 border-t border-white/5">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    Anterior
                </button>
                <button
                    onClick={handleNext}
                    disabled={isSaving}
                    className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-catarse-gold hover:text-catarse-moss text-catarse-gold transition-all duration-500 rounded-sm disabled:opacity-50"
                >
                    <span className="text-xs uppercase tracking-widest font-bold">
                        {isSaving ? "Enviando..." : currentStep === QUESTIONS.length - 1 ? "Finalizar Jornada" : "Próximo"}
                    </span>
                    {!isSaving && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}