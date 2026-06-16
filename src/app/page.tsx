"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette, Wand2 } from "lucide-react";
import { generatePalettes, getRandomHex, CategoryData } from "@/lib/colors";
import Blob from "@/components/Blob";
import { motion } from "framer-motion";

export default function Home() {
  const [hexColor, setHexColor] = useState<string>("#FF477E");
  const [palettes, setPalettes] = useState<CategoryData[] | null>(null);

  const handleGenerate = useCallback((color: string) => {
    setHexColor(color);
    setPalettes(generatePalettes(color));
  }, []);

  const handleRandomize = useCallback(() => {
    handleGenerate(getRandomHex());
  }, [handleGenerate]);

  // Spacebar to shuffle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleRandomize();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRandomize]);

  return (
    <main className="min-h-screen py-12 px-6 max-w-5xl mx-auto flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-[var(--primary)] mb-4 drop-shadow-sm">
          NeoPop-Gradation Lab
        </h1>
        <p className="text-lg text-[var(--foreground)] opacity-80">
          好きな色をひとつ選んで、魔法をかけよう！
        </p>
      </header>

      <section className="flex flex-col sm:flex-row gap-4 items-center mb-16 bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--primary)]/10">
        <div className="flex items-center gap-3 relative">
          <Palette className="text-[var(--primary)] w-6 h-6" />
          <span className="font-bold whitespace-nowrap">🎨 色を選ぶ</span>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--foreground)]/10 shadow-inner cursor-pointer hover:scale-105 transition-transform">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => handleGenerate(e.target.value)}
              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={hexColor.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              setHexColor(val);
              if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                handleGenerate(val);
              }
            }}
            className="w-24 text-center font-mono bg-gray-50 border border-gray-200 rounded-xl py-2 px-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          />
        </div>

        <div className="hidden sm:block w-px h-10 bg-gray-200 mx-2"></div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[#00D0E8] text-[var(--foreground)] font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Wand2 className="w-5 h-5" />
          🎲 おまかせ (Spaceキー)
        </button>
      </section>

      {palettes ? (
        <motion.div
          className="w-full space-y-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {palettes.map((category) => (
            <motion.section
              key={category.categoryName}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h2 className="text-2xl font-display font-bold mb-8 text-center border-b-2 border-dashed border-[var(--primary)]/30 pb-4 inline-block w-full">
                {category.categoryName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
                {category.gradients.map((grad, index) => (
                  <Blob key={grad.id} gradient={grad} index={index} />
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center opacity-50">
          <p className="text-xl animate-pulse">魔法の準備中...</p>
        </div>
      )}
    </main>
  );
}
