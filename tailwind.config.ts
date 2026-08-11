import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                catarse: {
                    black: "#0a0a0a",       // Fundo quase preto
                    moss: "#1A261B",        // Verde Musgo Escuro
                    "moss-light": "#2F3E30", // Verde Musgo Claro
                    gold: "#D4CDA8",        // Dourado Pálido
                    cream: "#EAEAEA",       // Creme/Off-white
                    dim: "rgba(234, 234, 234, 0.4)", // Texto secundário
                }
            },
            fontFamily: {
                serif: ["var(--font-newsreader)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                'grain': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')",
            },
            // --- AQUI ESTÁ A CORREÇÃO: AS ANIMAÇÕES ---
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 1s ease-out forwards",
                "slide-up": "slide-up 0.8s ease-out forwards",
            },
        },
    },
    plugins: [],
};
export default config;