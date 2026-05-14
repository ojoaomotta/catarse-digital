"use client";

import Link from "next/link";
import Image from "next/image";

export default function SobrePage() {
    return (
        <div className="bg-catarse-black text-catarse-cream font-sans overflow-x-hidden min-h-screen">

            {/* Texture Noise Global */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-grain mix-blend-overlay z-50"></div>

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
            <section className="pt-40 pb-24 px-6 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-catarse-black via-transparent to-catarse-black pointer-events-none" />
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <span className="text-catarse-gold text-xs uppercase tracking-[0.4em] border-b border-catarse-gold/30 pb-2 inline-block">
                        Por trás da Catarse
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif italic leading-tight text-white">
                        Somos um casal cristão e sensível que decidimos transformar histórias em filmes.
                    </h1>
                    <p className="text-white/40 font-light text-sm max-w-xl mx-auto leading-relaxed">
                        A Catarse nasceu de um sonho compartilhado, de um amor pela arte e pela autenticidade.
                    </p>
                </div>
            </section>

            {/* Linha separadora */}
            <div className="container mx-auto px-6">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Fundadores */}
            <section className="py-24">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-1">

                    {/* João */}
                    <div className="relative group p-10 md:p-16 border border-white/5 hover:border-catarse-gold/20 transition-colors bg-white/[0.01] space-y-8">
                        <div className="absolute top-0 left-0 w-1 h-0 bg-catarse-gold group-hover:h-full transition-all duration-700 ease-out" />

                        {/* Ícone de câmera estilizado como avatar */}
                        <div className="w-20 h-20 rounded-full border border-catarse-gold/30 bg-catarse-gold/5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-catarse-gold/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </div>

                        <div>
                            <span className="text-catarse-gold text-xs uppercase tracking-[0.3em] block mb-1">Fundador</span>
                            <h2 className="text-3xl md:text-4xl font-serif italic text-white">João</h2>
                        </div>

                        <blockquote className="border-l-2 border-catarse-gold/30 pl-6 space-y-4 text-white/60 font-light leading-relaxed text-sm md:text-base text-justify">
                            <p>
                                Criei a Catarse com a ajuda da Beatriz, minha parceira e co-fundadora, para que pudéssemos
                                juntos ter uma produtora nossa. Sempre fui muito inclinado à tecnologia, montei meu próprio
                                computador e sou, principalmente, um observador.
                            </p>
                            <p>
                                Eu observo, vejo a arte e passo para a Beatriz, que complementa com o olhar único que só
                                ela tem. Nosso objetivo é transmitir uma história da forma autêntica — e esse é o nosso diferencial.
                            </p>
                            <p>
                                Nunca vou esquecer do dia que falei: <em className="text-catarse-cream">"amor, você teria uma produtora?"</em> e ela,
                                sem medo e sem hesitar, disse: <em className="text-catarse-cream">"agora!"</em>. O que antes era apenas uma brincadeira
                                está se tornando mais real do que nunca — afinal, cá estamos nós.
                            </p>
                        </blockquote>
                    </div>

                    {/* Beatriz */}
                    <div className="relative group p-10 md:p-16 border border-white/5 hover:border-catarse-gold/20 transition-colors bg-white/[0.02] space-y-8">
                        <div className="absolute top-0 right-0 w-1 h-0 bg-catarse-gold group-hover:h-full transition-all duration-700 ease-out" />

                        {/* Ícone de olho estilizado como avatar */}
                        <div className="w-20 h-20 rounded-full border border-catarse-gold/30 bg-catarse-gold/5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-catarse-gold/60">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>

                        <div>
                            <span className="text-catarse-gold text-xs uppercase tracking-[0.3em] block mb-1">Co-fundadora</span>
                            <h2 className="text-3xl md:text-4xl font-serif italic text-white">Beatriz</h2>
                        </div>

                        <blockquote className="border-l-2 border-catarse-gold/30 pl-6 space-y-4 text-white/60 font-light leading-relaxed text-sm md:text-base text-justify">
                            <p>
                                Quando conheci o João, eu já trabalhava como filmmaker mobile em uma doceria. Sempre adorei
                                filmar tudo — gostava muito da sensação de um vídeo pronto e dinâmico.
                            </p>
                            <p>
                                Quando ele me falou sobre a produtora, não pensei duas vezes e de fato vi muito potencial.
                                Eu tenho o olhar, e ele, a técnica. Nos complementamos em absolutamente tudo. Eu o acho um
                                gênio da tecnologia — não há nada que ele não saiba fazer. Esse site, inclusive, ele quem fez.
                            </p>
                            <p>
                                Vejo a potência que a Catarse pode se tornar — o que ela já está se tornando. Nosso time é
                                rico e sensível. O que queremos, de fato, é contar sentimentos, arrancar lágrimas. Escolhi o
                                nome da empresa: <em className="text-catarse-cream">"catarse"</em> significa o êxtase da arte segundo Aristóteles —
                                o exato momento em que há a conexão profunda entre a arte e o espectador.{" "}
                                <em className="text-catarse-cream">É exatamente isso que buscamos: conexão.</em>
                            </p>
                        </blockquote>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center border-t border-white/5">
                <div className="container mx-auto px-6 space-y-6">
                    <p className="text-white/30 text-xs uppercase tracking-widest">Vem fazer parte dessa história</p>
                    <a
                        href="https://wa.me/5522999734867"
                        target="_blank"
                        className="inline-block px-10 py-5 bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors"
                    >
                        Falar com a Catarse
                    </a>
                </div>
            </section>

            {/* Footer simples */}
            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-white/20 text-[10px] uppercase tracking-widest">© 2026 Catarse Studio</p>
            </footer>
        </div>
    );
}
