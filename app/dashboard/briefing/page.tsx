"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BriefingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [questions, setQuestions] = useState<{ title: string; question: string }[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const storedUser = localStorage.getItem("catarse_user");
            if (!storedUser) { router.replace("/"); return; }

            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            const { data } = await supabase
                .from("clients")
                .select("briefing_done, briefing_questions, briefing_data")
                .eq("id", parsedUser.id)
                .single();

            if (data?.briefing_done) { setCompleted(true); }
            if (data?.briefing_questions?.length > 0) {
                setQuestions(data.briefing_questions);
            }
            setLoading(false);
        };
        checkStatus();
    }, [router]);

    const currentQ = questions[currentStep];
    const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishBriefing();
        }
    };

    const finishBriefing = async () => {
        setIsSaving(true);
        try {
            if (!user) return;
            const { error } = await supabase
                .from("clients")
                .update({ briefing_data: answers, briefing_done: true })
                .eq("id", user.id);
            if (error) throw error;
            setCompleted(true);
        } catch {
            alert("Erro ao salvar. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-catarse-moss flex items-center justify-center text-catarse-gold animate-pulse">Carregando roteiro...</div>;

    if (completed) return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center justify-center px-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full border border-catarse-gold flex items-center justify-center mb-6 text-catarse-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>
            <h1 className="font-serif italic text-4xl text-catarse-cream mb-4">Roteiro em Produção</h1>
            <p className="text-white/60 font-light max-w-md mb-8">Recebemos suas memórias. Nossa equipe de edição já está utilizando suas respostas para guiar a narrativa do filme.</p>
            <Link href="/dashboard" className="px-8 py-3 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Voltar ao Dashboard</Link>
        </div>
    );

    if (questions.length === 0) return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center justify-center px-6 text-center">
            <p className="text-white/40 font-light">O briefing ainda não foi configurado. Em breve estará disponível.</p>
            <Link href="/dashboard" className="mt-6 text-catarse-gold text-xs uppercase tracking-widest hover:underline">Voltar</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay"></div>

            <div className="w-full max-w-3xl flex flex-col gap-8 z-10">
                <div className="flex justify-between items-end">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-catarse-gold transition-colors text-xs uppercase tracking-widest w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Cancelar
                    </Link>
                    <span className="text-catarse-gold/50 font-serif italic">
                        {currentStep + 1} <span className="text-white/20 text-xs not-italic font-sans">/ {questions.length}</span>
                    </span>
                </div>
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-catarse-gold transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
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
                        value={answers[`q${currentStep}`] || ""}
                        onChange={e => setAnswers(prev => ({ ...prev, [`q${currentStep}`]: e.target.value }))}
                        placeholder="Escreva aqui..."
                        className="w-full bg-transparent border-l-2 border-white/10 pl-6 text-xl text-white/80 placeholder-white/20 focus:outline-none focus:border-catarse-gold transition-colors font-light min-h-[150px] resize-none opacity-0 animate-slide-up"
                        style={{ animationDelay: '0.3s' }}
                        autoFocus
                    />
                </div>
            </div>

            <div className="w-full max-w-3xl flex justify-between items-center z-10 pt-8 border-t border-white/5">
                <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 0}
                    className={`text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                    Anterior
                </button>
                <button onClick={handleNext} disabled={isSaving}
                    className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-catarse-gold hover:text-catarse-moss text-catarse-gold transition-all duration-500 rounded-sm disabled:opacity-50">
                    <span className="text-xs uppercase tracking-widest font-bold">
                        {isSaving ? "Enviando..." : currentStep === questions.length - 1 ? "Finalizar" : "Próximo"}
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