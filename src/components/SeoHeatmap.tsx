import React, { useState } from "react";
import {
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Search,
  Eye,
  Hash,
  Activity,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import { YouTubeSeoPackage } from "../types";

interface SeoHeatmapProps {
  seoPackage: YouTubeSeoPackage;
  currentTitle: string;
  currentDescription: string;
  currentTags: string[];
  onUpdateTitle?: (title: string) => void;
}

export const SeoHeatmap: React.FC<SeoHeatmapProps> = ({
  seoPackage,
  currentTitle,
  currentDescription,
  currentTags,
  onUpdateTitle,
}) => {
  const [highlightMode, setHighlightMode] = useState<"all" | "entities" | "keywords" | "structure">("all");

  // Title Metrics
  const titleCharCount = currentTitle.length;
  const isTitleLengthOptimal = titleCharCount >= 40 && titleCharCount <= 65;
  const titleWords = currentTitle.toLowerCase().split(/\s+/);
  
  const powerWordsList = [
    "exact", "secret", "blueprint", "masterclass", "mistake", "why", "how to", "never",
    "stop", "shocking", "ultimate", "fast", "simple", "hack", "algorithm", "2026",
    "transform", "flywheel", "insane", "framework", "step-by-step", "revealed",
  ];
  const detectedPowerWords = powerWordsList.filter((pw) => currentTitle.toLowerCase().includes(pw));

  // Description Metrics
  const descCharCount = currentDescription.length;
  const descWordCount = currentDescription.split(/\s+/).filter(Boolean).length;
  const first120Chars = currentDescription.slice(0, 120);
  const hasTimestamps = /([0-9]{1,2}:[0-9]{2})/g.test(currentDescription);
  const hasLinks = /https?:\/\/[^\s]+/g.test(currentDescription);

  // Keyword Density Analysis
  const primaryKeywords = seoPackage.primaryKeywords || [];
  const secondaryKeywords = seoPackage.secondaryKeywords || [];
  const entityTags = seoPackage.kgEntityTags || [];

  const keywordStats = primaryKeywords.map((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const countInTitle = (currentTitle.match(regex) || []).length;
    const countInDesc = (currentDescription.match(regex) || []).length;
    const inTags = currentTags.some((t) => t.toLowerCase() === kw.toLowerCase());
    
    // Ideal density: 2-5 mentions in description
    let status: "optimal" | "moderate" | "low" | "high" = "optimal";
    if (countInDesc === 0) status = "low";
    else if (countInDesc > 6) status = "high";
    else if (countInDesc === 1) status = "moderate";

    return {
      keyword: kw,
      countInTitle,
      countInDesc,
      inTags,
      status,
    };
  });

  // Calculate Overall SEO Heat Score (0 - 100)
  let heatScore = 60;
  if (isTitleLengthOptimal) heatScore += 10;
  if (detectedPowerWords.length > 0) heatScore += 8;
  if (first120Chars.length >= 80) heatScore += 6;
  if (hasTimestamps) heatScore += 6;
  if (currentTags.length >= 8) heatScore += 5;
  if (keywordStats.filter((k) => k.countInDesc >= 1).length >= 2) heatScore += 5;
  heatScore = Math.min(100, heatScore);

  // Render Highlighted Text
  const renderHighlightedDescription = () => {
    const lines = currentDescription.split("\n");
    return lines.map((line, lIdx) => {
      // Check for timestamps
      if (hasTimestamps && /^[0-9]{1,2}:[0-9]{2}/.test(line.trim())) {
        return (
          <div key={lIdx} className="text-purple-300 font-mono py-0.5 bg-purple-950/20 px-1 rounded">
            {line}
          </div>
        );
      }

      return (
        <p key={lIdx} className="min-h-[1.2em] my-1 leading-relaxed text-slate-300 text-xs sm:text-sm">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Heatmap Score HUD */}
      <div className="p-5 sm:p-6 rounded-3xl gold-segment-box shadow-[0_0_30px_rgba(245,158,11,0.2)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <span>YouTube SEO Algorithmic Heatmap</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/50 uppercase font-black">
                    Live Diagnostics
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Real-time density analysis, CTR hook intensity, and Knowledge Graph entity resonance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-auto flex-wrap">
            {/* Heat Score Gauge */}
            <div className="flex items-center gap-3 bg-black/50 px-4 py-2.5 rounded-2xl border border-amber-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 block">
                  Algorithmic Heat Score
                </span>
                <span className="text-xl font-black text-amber-300 font-mono drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {heatScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-amber-500/20 flex items-center justify-center font-black text-xs text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                {heatScore >= 90 ? "A+" : heatScore >= 80 ? "A" : "B+"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Search Resonance
              </span>
            </div>
          </div>
        </div>

        {/* 4 Heat Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-amber-400/20">
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 space-y-1 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Title Length
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{titleCharCount} chars</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isTitleLengthOptimal ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-amber-500/20 text-amber-300 border border-amber-400/30"}`}>
                {isTitleLengthOptimal ? "Optimal (40-65)" : "Adjust Length"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 space-y-1 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Power Words / Hooks
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{detectedPowerWords.length} Detected</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                CTR Boost
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 space-y-1 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Above-The-Fold
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{first120Chars.length}/120</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Mobile Ready
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/30 space-y-1 backdrop-blur-md">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Active Tags & Entities
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-mono">{currentTags.length} Tags</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                {entityTags.length} KG Entities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Above-The-Fold Mobile Snippet Heat Simulator */}
      <div className="p-5 rounded-3xl gold-segment-box space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Above-The-Fold Mobile Snippet Simulator (First 120 Characters)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">
            Visible in Search Results before clicking "Show More"
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-mono leading-relaxed relative backdrop-blur-md">
          <span className="bg-amber-500/20 text-amber-200 px-1 py-0.5 rounded font-bold border border-amber-400/30">
            {first120Chars}
          </span>
          <span className="text-slate-400 opacity-70">
            {currentDescription.slice(120, 260)}...
          </span>
        </div>
      </div>

      {/* Keyword & Semantic Entity Density Heat Grid */}
      <div className="p-5 rounded-3xl gold-segment-box space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Keyword & Entity Density Matrix
            </span>
          </div>
          <span className="text-[11px] text-slate-300">
            Target: 2-4 mentions in description + presence in Tags
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {keywordStats.map((kw, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                kw.status === "optimal"
                  ? "bg-emerald-950/30 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  : kw.status === "moderate"
                  ? "bg-amber-950/30 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                  : "bg-black/40 border-amber-400/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[160px]">
                  {kw.keyword}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    kw.status === "optimal"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : kw.status === "moderate"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                      : "bg-black/60 text-slate-400"
                  }`}
                >
                  {kw.countInDesc} in Desc
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-amber-400/20">
                <span>Title: {kw.countInTitle > 0 ? "✅ Included" : "❌ None"}</span>
                <span>Tags: {kw.inTags ? "✅ Present" : "⚠️ Add tag"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Highlighted Description Heatmap Box */}
      <div className="p-5 rounded-3xl gold-segment-box space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Live Description Content Inspector
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span>{descWordCount} Words</span>
            <span>•</span>
            <span>{descCharCount} Characters</span>
            <span>•</span>
            <span>{hasTimestamps ? "⏱️ Timestamps Active" : "No timestamps"}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/30 max-h-80 overflow-y-auto font-sans leading-relaxed scrollbar-thin backdrop-blur-md">
          {renderHighlightedDescription()}
        </div>
      </div>
    </div>
  );
};
