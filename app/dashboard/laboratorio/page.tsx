"use client";

import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import Link from "next/link";
import Image from "next/image"; // Importando Image caso precise usar fora do slider

// --- CONFIGURAÇÃO DAS IMAGENS ---
// Coloque aqui o nome de todos os arquivos que você jogou na pasta public
const FILMES = [
    { src: "/filme.jpg", label: "Cena 01: O Encontro" },
    { src: "/filme1.jpg", label: "Cena 02: A Cerimônia" },
    { src: "/filme2.jpg", label: "Cena 03: Detalhes" },
];

export default function LaboratorioPage() {
    // Estado para controlar qual foto está aparecendo (Começa na 0)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Função Próxima Foto
    const nextImage = () => {
        setCurrentIndex((prev) => (prev === FILMES.length - 1 ? 0 : prev + 1));
    };

    // Função Foto Anterior
    const prevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? FILMES.length - 1 : prev - 1));
    };

    const currentFilm = FILMES[currentIndex];

    return (
        <div className="min-h-screen bg-catarse-moss flex flex-col items-center py-12 px-6 relative overflow-hidden">

            {/* Botão Voltar */}
            <div className="w-full max-w-5xl mb-8 z-10 flex justify-between items-center">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-white/40 hover:text-catarse-gold transition-colors text-xs uppercase tracking-widest"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Voltar
                </Link>

                {/* Contador de Imagens */}
                <span className="text-[10px] uppercase tracking-widest text-white/20">
                    {currentIndex + 1} / {FILMES.length}
                </span>
            </div>

            {/* Conteúdo Explicativo */}
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-4 z-10">
                <p className="text-catarse-gold text-xs uppercase tracking-[0.3em]">Showcase de Identidade</p>
                <h1 className="font-serif italic text-4xl md:text-5xl text-catarse-cream">
                    A Química da Cor
                </h1>
            </div>

            {/* O SLIDER + CONTROLES */}
            <div className="w-full max-w-5xl relative z-10 animate-fade-in group">

                {/* Botão Anterior (Esquerda) */}
                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-catarse-gold hover:text-catarse-moss transition-all backdrop-blur-md md:-left-16"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Botão Próximo (Direita) */}
                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-catarse-gold hover:text-catarse-moss transition-all backdrop-blur-md md:-right-16"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {/* Área do Slider */}
                <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">

                    <ReactCompareSlider
                        // Reinicia o slider quando muda a imagem (key)
                        key={currentIndex}
                        handle={
                            <div className="w-full h-full relative">
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50 backdrop-blur-sm -translate-x-1/2 h-full"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-catarse-moss">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                </div>
                            </div>
                        }

                        itemOne={
                            <ReactCompareSliderImage
                                src={currentFilm.src}
                                alt="Color Graded"
                            />
                        }

                        itemTwo={
                            <div className="w-full h-full relative">
                                {/* Imagem simulando RAW */}
                                <img
                                    src={currentFilm.src}
                                    className="w-full h-full object-cover filter grayscale-[50%] contrast-[80%] brightness-[110%] saturate-[60%]"
                                    alt="RAW Footage"
                                />
                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[10px] uppercase tracking-widest text-white/70">Original (RAW)</span>
                                </div>
                            </div>
                        }
                    />

                    <div className="absolute top-6 left-6 bg-catarse-gold/90 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none z-20">
                        <span className="text-[10px] uppercase tracking-widest text-catarse-moss font-bold">Cine Print V2</span>
                    </div>

                </div>

                {/* Legenda da Foto Atual */}
                <div className="text-center mt-6 animate-fade-in">
                    <p className="font-serif italic text-white/60 text-lg">{currentFilm.label}</p>
                </div>

            </div>

        </div>
    );
}