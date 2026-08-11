"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ltvqklvtoufhracpwmor.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uFkOQNB6eZF4FRBemyt7-A_fx9_ENMt"
);

export default function ClientLoginPage() {
  const router = useRouter();

  // Novos estados
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Busca combinando usuario E senha
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("username", username)     // Verifica usuario
        .eq("password", password)     // Verifica senha
        .single();

      if (error || !data) {
        throw new Error("Dados incorretos.");
      }

      localStorage.setItem("catarse_user", JSON.stringify(data));
      router.push("/dashboard");

    } catch (err) {
      setError("Usuário ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-catarse-black">

      {/* Fundo */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-catarse-moss/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-8">

          <div className="flex flex-col items-center justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Catarse Logo"
              width={1688}
              height={337}
              className="w-[60%] md:w-[400px] h-auto block"
              priority
            />
            <p className="text-[10px] uppercase tracking-[0.4em] text-catarse-gold/60 font-sans mt-4">
              Área do Cliente
            </p>
          </div>

          <div className="w-full space-y-6 backdrop-blur-md bg-white/5 p-8 rounded border border-white/10 shadow-2xl">

            {/* Campo Usuário */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase tracking-widest text-white/40 pl-1">Usuário</label>
              <input
                type="text"
                placeholder="Ex: juliaeleo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-catarse-cream placeholder-white/10 focus:outline-none focus:border-catarse-gold transition-colors font-serif italic text-xl text-center tracking-widest"
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase tracking-widest text-white/40 pl-1">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-catarse-cream placeholder-white/10 focus:outline-none focus:border-catarse-gold transition-colors font-serif italic text-xl text-center tracking-widest"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-sans text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-catarse-gold text-catarse-moss font-bold text-xs uppercase tracking-widest py-4 hover:bg-white transition-colors duration-500 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Acessar Dashboard"}
            </button>
          </div>

          <p className="text-[10px] text-white/20 cursor-pointer hover:text-white transition-colors" onClick={() => router.push('/')}>
            Voltar ao site principal
          </p>

        </div>
      </div>
    </main>
  );
}