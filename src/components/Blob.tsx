"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientData } from "@/lib/colors";
import { Copy } from "lucide-react";

type BlobProps = {
  gradient: GradientData;
  index: number;
};

// Generate random blob border radius
const generateBlobRadius = () => {
  const r = () => Math.floor(Math.random() * 40) + 30; // 30% to 70%
  return `${r()}% ${100 - r()}% ${r()}% ${100 - r()}% / ${r()}% ${r()}% ${100 - r()}% ${100 - r()}%`;
};

export default function Blob({ gradient, index }: BlobProps) {
  const [borderRadius, setBorderRadius] = useState("50%");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // We want the shape to morph when gradient changes,
    // but the linter warns about cascading renders.
    // Using setTimeout schedules it after the current render cycle.
    const timer = setTimeout(() => {
      setBorderRadius(generateBlobRadius());
    }, 0);
    return () => clearTimeout(timer);
  }, [gradient]);

  const cssGradient = `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${cssGradient};`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center group relative w-full max-w-[240px]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1
      }}
    >
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6">
        {/* The Liquid Blob */}
        <motion.div
          onClick={handleCopy}
          className="absolute inset-0 cursor-pointer shadow-lg hover:shadow-xl transition-shadow animate-blob-bg"
          style={{
            background: cssGradient,
            borderRadius,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Hover overlay for copy action */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm" style={{ borderRadius }}>
            <div className="bg-white/80 p-3 rounded-full text-[var(--foreground)] shadow-sm">
              <Copy className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Pop Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: 0, scale: 0.8 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-xl z-10"
            >
              ✨ コピーしたよ！
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cute Japanese Name */}
      <h3 className="font-bold text-lg text-center font-display text-[var(--foreground)] tracking-wide">
        {gradient.name}
      </h3>

      {/* Hex Codes display */}
      <div className="flex gap-2 mt-2 text-xs font-mono text-[var(--foreground)]/60 bg-white/50 px-3 py-1.5 rounded-full border border-gray-100">
        <span>{gradient.colors[0]}</span>
        <span>→</span>
        <span>{gradient.colors[1]}</span>
      </div>
    </motion.div>
  );
}
