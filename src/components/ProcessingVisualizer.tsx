import React, { useEffect, useState } from "react";
import { Zap, Cpu, Sparkles, Check, Database, Radio } from "lucide-react";

interface ProcessingVisualizerProps {
  currentStage: string;
}

const STAGES = [
  { id: "ingest", label: "Ingesting YouTube Stream & Metadata", icon: Database },
  { id: "mindstorm", label: "Executing Mindstorm Multi-Vector Neural Matrix", icon: Zap },
  { id: "seo", label: "Synthesizing High-CTR YouTube Master SEO Package", icon: Cpu },
  { id: "distribution", label: "Crafting Tailored Facebook, X, IG, TikTok, Reddit & Snap Suites", icon: Sparkles },
];

export const ProcessingVisualizer: React.FC<ProcessingVisualizerProps> = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 sm:p-10 rounded-3xl gold-segment-box shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden">
      {/* Scanning laser beam line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-gold-shimmer" />

      <div className="text-center space-y-2.5 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Radio className="w-3.5 h-3.5 text-amber-300 animate-ping" />
          MINDSTORM CO-PROCESSOR ENGAGED
          <Sparkles className="w-3 h-3 text-amber-300 animate-diamond-glint" />
        </div>
        <h3 className="text-xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
          Synthesizing Viral Distribution Fleet
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Extracting high-retention psychological hooks, SEO keyword clusters, and tailored platform packages...
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3.5">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                isDone
                  ? "bg-emerald-950/30 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : isCurrent
                  ? "bg-black/50 border-amber-400/70 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)] scale-[1.02]"
                  : "bg-black/30 border-amber-400/15 text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  isDone
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : isCurrent
                    ? "bg-amber-500/20 border-amber-400 text-amber-200 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    : "bg-black/40 border-amber-400/20 text-slate-500"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold truncate tracking-tight">{stage.label}</p>
              </div>

              {isCurrent && (
                <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
