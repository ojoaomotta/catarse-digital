"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PhotoItem {
    id: string;
    url: string;
    title?: string;
}

export default function PhotosGalleryPage() {
    const router = router_or_fallback();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
    const [searchQuery, setSearchQuery] = useState("");

    // Lightbox modal state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [downloadingPhotoId, setDownloadingPhotoId] = useState<string | null>(null);
    const [shareToast, setShareToast] = useState(false);

    function router_or_fallback() {
        try {
            return useRouter();
        } catch {
            return { push: (path: string) => window.location.href = path, replace: (path: string) => window.location.href = path };
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("catarse_user");
        if (!storedUser) {
            router.replace("/");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Processa fotos iniciais do localStorage
        const rawAlbum = parsedUser.photo_album || [];
        const formattedPhotos: PhotoItem[] = (Array.isArray(rawAlbum) ? rawAlbum : []).map((item: any, idx: number) => {
            if (typeof item === "string") {
                return { id: `photo-${idx}`, url: item, title: `Foto ${idx + 1}` };
            }
            return { id: item.id || `photo-${idx}`, url: item.url || "", title: item.title || `Foto ${idx + 1}` };
        });
        setPhotos(formattedPhotos);
        setFavorites(Array.isArray(parsedUser.favorite_photos) ? parsedUser.favorite_photos : []);

        // Busca versão atualizada no Supabase
        const fetchLatestUser = async () => {
            try {
                const { data, error } = await supabase
                    .from("clients")
                    .select("*")
                    .eq("id", parsedUser.id)
                    .single();

                if (!error && data) {
                    setUser(data);
                    localStorage.setItem("catarse_user", JSON.stringify(data));

                    const latestAlbum = data.photo_album || [];
                    const latestFormatted: PhotoItem[] = (Array.isArray(latestAlbum) ? latestAlbum : []).map((item: any, idx: number) => {
                        if (typeof item === "string") {
                            return { id: `photo-${idx}`, url: item, title: `Foto ${idx + 1}` };
                        }
                        return { id: item.id || `photo-${idx}`, url: item.url || "", title: item.title || `Foto ${idx + 1}` };
                    });
                    setPhotos(latestFormatted);
                    setFavorites(Array.isArray(data.favorite_photos) ? data.favorite_photos : []);
                }
            } catch (err) {
                console.error("Erro ao sincronizar álbum com Supabase:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestUser();
    }, [router]);

    // Suporte a teclado no Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;

            if (e.key === "Escape") {
                setLightboxIndex(null);
            } else if (e.key === "ArrowRight") {
                handleNextPhoto();
            } else if (e.key === "ArrowLeft") {
                handlePrevPhoto();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, photos]);

    // Alternar Favorito
    const toggleFavorite = async (photoId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const updatedFavorites = favorites.includes(photoId)
            ? favorites.filter(id => id !== photoId)
            : [...favorites, photoId];

        setFavorites(updatedFavorites);

        // Atualiza estado local do usuário
        if (user) {
            const updatedUser = { ...user, favorite_photos: updatedFavorites };
            setUser(updatedUser);
            localStorage.setItem("catarse_user", JSON.stringify(updatedUser));

            // Persiste no Supabase
            try {
                await supabase
                    .from("clients")
                    .update({ favorite_photos: updatedFavorites })
                    .eq("id", user.id);
            } catch (err) {
                console.error("Erro ao salvar favoritos no banco:", err);
            }
        }
    };

    // Download Individual em Alta Resolução via Stream Blob
    const downloadSinglePhoto = async (photo: PhotoItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setDownloadingPhotoId(photo.id);

        try {
            const response = await fetch(photo.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${photo.title || 'Catarse-Foto'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            // Fallback para o link direto se houver bloqueio de CORS
            window.open(photo.url, "_blank");
        } finally {
            setDownloadingPhotoId(null);
        }
    };

    // Compartilhar Foto (Copiar link ou WhatsApp)
    const handleSharePhoto = (photo: PhotoItem) => {
        if (navigator.share) {
            navigator.share({
                title: `${user?.project_name || 'Catarse'} — Foto`,
                text: `Confira esta foto do nosso álbum na Catarse Studio!`,
                url: photo.url
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(photo.url);
            setShareToast(true);
            setTimeout(() => setShareToast(false), 3000);
        }
    };

    // Filtragem de fotos
    const filteredPhotos = photos.filter(photo => {
        const matchesTab = activeTab === 'all' || favorites.includes(photo.id);
        const matchesSearch = !searchQuery || (photo.title && photo.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const handlePrevPhoto = () => {
        if (lightboxIndex === null || filteredPhotos.length === 0) return;
        setLightboxIndex((prev) => (prev! === 0 ? filteredPhotos.length - 1 : prev! - 1));
    };

    const handleNextPhoto = () => {
        if (lightboxIndex === null || filteredPhotos.length === 0) return;
        setLightboxIndex((prev) => (prev! === filteredPhotos.length - 1 ? 0 : prev! + 1));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <span className="font-serif italic text-2xl text-[#C9A96E]">Catarse</span>
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Carregando álbum em alta resolução...</p>
                </div>
            </div>
        );
    }

    const currentLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

    return (
        <div className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F0EB] relative flex flex-col font-sans select-none overflow-x-hidden">

            {/* Texture Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-40 bg-grain mix-blend-overlay z-0"></div>

            {/* NAVBAR */}
            <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
                <Link href="/dashboard" className="relative h-8 w-28 md:h-10 md:w-36 block">
                    <Image src="/logo.png" alt="Catarse Logo" fill className="object-contain object-left" priority />
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-[9px] uppercase tracking-[2px] text-[#C9A96E] border-r border-white/10 pr-4 hidden sm:inline">
                        Álbum de Fotografia
                    </span>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#C9A96E]/50 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white/60 group-hover:text-[#C9A96E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span className="text-[10px] uppercase tracking-widest text-white/60 group-hover:text-[#C9A96E] transition-colors">Voltar ao Painel</span>
                    </button>
                </div>
            </nav>

            {/* TOAST DE LINK COPIADO */}
            {shareToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#C9A96E] text-black font-bold text-xs px-4 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Link direto da foto copiado para a área de transferência!
                </div>
            )}

            {/* CONTEÚDO PRINCIPAL DA GALERIA */}
            <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 max-w-7xl mx-auto w-full relative z-10">

                {/* CABEÇALHO DO ÁLBUM */}
                <div className="text-center space-y-3 mb-10 max-w-2xl">
                    <span className="text-xs uppercase tracking-[0.4em] text-[#C9A96E] inline-block border-b border-[#C9A96E]/30 pb-1">
                        Galeria em Alta Resolução
                    </span>
                    <h1 className="font-serif italic text-3xl md:text-5xl text-[#F5F0EB]">
                        {user?.project_name || "Álbum de Fotografia"}
                    </h1>
                    <p className="text-white/40 text-xs md:text-sm font-light">
                        {photos.length} fotos eternizadas para <span className="text-white/80 border-b border-[#C9A96E]/30">{user?.name}</span>
                    </p>
                </div>

                {/* BARRA DE AÇÕES & FILTROS */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0E0E0E]/80 border border-white/5 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
                    
                    {/* TABS (Todas vs Favoritas) */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 sm:flex-none text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-[#C9A96E] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
                        >
                            Todas as Fotos ({photos.length})
                        </button>

                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`flex-1 sm:flex-none text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'favorites' ? 'bg-[#C9A96E] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
                        >
                            <span>Favoritas</span>
                            <span className={favorites.length > 0 ? "text-red-400 font-bold" : "text-white/40"}>❤️ {favorites.length}</span>
                        </button>
                    </div>

                    {/* BUSCA & BOTÃO DOWNLOAD COMPLETO */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar foto..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full sm:w-48 bg-[#050505] border border-white/10 px-3 py-2 rounded-xl text-white text-xs focus:border-[#C9A96E] focus:outline-none"
                        />

                        {user?.photos_download_url && (
                            <a
                                href={user.photos_download_url}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto bg-[#C9A96E] text-black hover:bg-white font-bold text-[10px] uppercase tracking-widest py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96E]/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Baixar Álbum Completo (ZIP)
                            </a>
                        )}
                    </div>
                </div>

                {/* GRADE DE FOTOS */}
                {filteredPhotos.length === 0 ? (
                    <div className="py-24 text-center space-y-4 border border-dashed border-white/5 rounded-2xl w-full bg-[#0E0E0E]/40">
                        <p className="font-serif italic text-xl text-white/40">
                            {activeTab === 'favorites' ? "Você ainda não marcou nenhuma foto como favorita." : "Nenhuma foto encontrada no álbum."}
                        </p>
                        {activeTab === 'favorites' && (
                            <button
                                onClick={() => setActiveTab('all')}
                                className="text-xs text-[#C9A96E] underline uppercase tracking-widest"
                            >
                                Voltar para Todas as Fotos
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 w-full pb-16">
                        {filteredPhotos.map((photo, index) => {
                            const isFav = favorites.includes(photo.id);

                            return (
                                <div
                                    key={photo.id || index}
                                    onClick={() => setLightboxIndex(index)}
                                    className="group relative aspect-[4/3] bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-[#C9A96E]/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.title || `Foto ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Overlay com Ícones */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={(e) => toggleFavorite(photo.id, e)}
                                                className={`p-2 rounded-full backdrop-blur-md transition-all ${isFav ? 'bg-red-500 text-white' : 'bg-black/60 text-white/80 hover:text-white hover:bg-black'}`}
                                                title={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] uppercase tracking-wider text-white/80 font-mono truncate max-w-[120px]">
                                                {photo.title || `Foto #${index + 1}`}
                                            </span>

                                            <button
                                                onClick={(e) => downloadSinglePhoto(photo, e)}
                                                className="p-2 bg-black/60 hover:bg-[#C9A96E] hover:text-black rounded-full text-white backdrop-blur-md transition-all"
                                                title="Download em Alta Resolução"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Indicador de Favorito Visível */}
                                    {isFav && (
                                        <div className="absolute top-2 left-2 pointer-events-none">
                                            <span className="bg-red-500/90 text-white p-1 rounded-full text-xs shadow-md block">❤️</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* LIGHTBOX MODAL (VISUALIZADOR EM TELA CHEIA) */}
            {currentLightboxPhoto !== null && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-fade-in">
                    
                    {/* BARRA SUPERIOR DO LIGHTBOX */}
                    <div className="p-4 md:p-6 flex justify-between items-center border-b border-white/10 bg-black/50 z-20">
                        <div className="space-y-0.5">
                            <h3 className="font-serif italic text-lg text-[#C9A96E]">
                                {currentLightboxPhoto.title || `Foto ${lightboxIndex! + 1}`}
                            </h3>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                                {lightboxIndex! + 1} de {filteredPhotos.length} fotos
                            </p>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Botão Favorito */}
                            <button
                                onClick={() => toggleFavorite(currentLightboxPhoto.id)}
                                className={`p-2.5 rounded-full border transition-all ${favorites.includes(currentLightboxPhoto.id) ? 'bg-red-500 border-red-500 text-white' : 'border-white/10 text-white/70 hover:text-white hover:bg-white/10'}`}
                                title="Favoritar Foto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favorites.includes(currentLightboxPhoto.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>

                            {/* Botão Download */}
                            <button
                                onClick={() => downloadSinglePhoto(currentLightboxPhoto)}
                                disabled={downloadingPhotoId === currentLightboxPhoto.id}
                                className="px-4 py-2.5 rounded-full bg-[#C9A96E] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                <span>{downloadingPhotoId === currentLightboxPhoto.id ? "Baixando..." : "Baixar Alta Res"}</span>
                            </button>

                            {/* Botão Compartilhar */}
                            <button
                                onClick={() => handleSharePhoto(currentLightboxPhoto)}
                                className="p-2.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                title="Compartilhar Link da Foto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                </svg>
                            </button>

                            {/* Botão Fechar */}
                            <button
                                onClick={() => setLightboxIndex(null)}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-2"
                                title="Fechar (Esc)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* CENTRO: FOTO & NAVEGAÇÃO */}
                    <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
                        
                        {/* Botão Anterior */}
                        <button
                            onClick={handlePrevPhoto}
                            className="absolute left-4 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#C9A96E] hover:text-black transition-all"
                            title="Foto Anterior (←)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        {/* Foto Exibida */}
                        <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                            <img
                                src={currentLightboxPhoto.url}
                                alt={currentLightboxPhoto.title || "Foto em Alta Resolução"}
                                className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/5"
                            />
                        </div>

                        {/* Botão Próximo */}
                        <button
                            onClick={handleNextPhoto}
                            className="absolute right-4 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#C9A96E] hover:text-black transition-all"
                            title="Próxima Foto (→)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* RODAPÉ DO LIGHTBOX */}
                    <div className="p-4 text-center bg-black/50 border-t border-white/5 text-[10px] text-white/40 uppercase tracking-widest">
                        Catarse Digital · Estúdio de Cinema e Fotografia
                    </div>
                </div>
            )}
        </div>
    );
}
