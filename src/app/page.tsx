"use client";

import { useState, useEffect, useCallback } from "react";
import { Palette, Wand2, ClipboardCheck, History, Check } from "lucide-react";
import { generatePalettes, getRandomHex, CategoryData, CopyFormat, GradientData, formatGradient } from "@/lib/colors";
import Blob from "@/components/Blob";
import { motion } from "framer-motion";

export default function Home() {
  const [hexColor, setHexColor] = useState<string>("#FF477E");
  const [palettes, setPalettes] = useState<CategoryData[] | null>(null);
  const [defaultFormat, setDefaultFormat] = useState<CopyFormat>('css-full');
  const [copyHistory, setCopyHistory] = useState<GradientData[]>([]);
  const [lastHistoryCopiedId, setLastHistoryCopiedId] = useState<string | null>(null);

  // Load persistence (on mount)
  useEffect(() => {
    const savedFormat = localStorage.getItem('defaultFormat') as CopyFormat;
    if (savedFormat) {
      // Use setTimeout to avoid synchronous setState during render cycle/effect init
      const timer = setTimeout(() => setDefaultFormat(savedFormat), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('copyHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const timer = setTimeout(() => setCopyHistory(parsed), 0);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('defaultFormat', defaultFormat);
  }, [defaultFormat]);

  useEffect(() => {
    localStorage.setItem('copyHistory', JSON.stringify(copyHistory));
  }, [copyHistory]);

  const handleCopySuccess = useCallback((gradient: GradientData) => {
    setCopyHistory(prev => {
      const filtered = prev.filter(item => item.id !== gradient.id);
      return [gradient, ...filtered].slice(0, 5);
    });
  }, []);

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

      {/* Clipboard Settings */}
      <section className="mb-12 flex flex-wrap items-center justify-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]/70">
          <ClipboardCheck className="w-4 h-4 text-[var(--primary)]" />
          <span>コピー形式の既定値:</span>
        </div>
        <div className="flex gap-2">
          {(['css-full', 'css-value', 'hex', 'json', 'tailwind'] as CopyFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setDefaultFormat(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                defaultFormat === f
                  ? "bg-[var(--primary)] text-white shadow-md scale-105"
                  : "bg-white text-[var(--foreground)]/60 hover:bg-white/80 border border-gray-100"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
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
                  <Blob
                    key={grad.id}
                    gradient={grad}
                    index={index}
                    defaultFormat={defaultFormat}
                    onCopy={handleCopySuccess}
                  />
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

      {/* Recently Copied History */}
      {copyHistory.length > 0 && (
        <section className="mt-20 w-full max-w-2xl">
          <div className="flex items-center gap-2 mb-6 text-[var(--foreground)]/60">
            <History className="w-5 h-5" />
            <h2 className="font-bold tracking-wider">最近コピーしたグラデーション</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {copyHistory.map((grad) => (
              <motion.button
                key={`${grad.id}-${grad.colors.join('-')}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={async () => {
                  const text = formatGradient(grad, defaultFormat);
                  await navigator.clipboard.writeText(text);
                  setLastHistoryCopiedId(grad.id + grad.colors.join(''));
                  setTimeout(() => setLastHistoryCopiedId(null), 2000);
                  handleCopySuccess(grad);
                }}
                className="group flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/5"
                  style={{ background: `linear-gradient(135deg, ${grad.colors[0]}, ${grad.colors[1]})` }}
                />
                <span className="text-sm font-bold">{grad.name}</span>
                {lastHistoryCopiedId === grad.id + grad.colors.join('') && (
                  <Check className="w-4 h-4 text-green-500 animate-in zoom-in" />
                )}
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
