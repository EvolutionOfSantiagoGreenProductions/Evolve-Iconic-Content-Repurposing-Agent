import React from "react";
import {
  Zap,
  Youtube,
  Flame,
  Network,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Brain,
  Layers,
  Sparkles,
} from "lucide-react";
import { ChannelIntelligenceData } from "../types";

interface ChannelIntelligenceBannerProps {
  channel: ChannelIntelligenceData | null;
  onOpenSyncModal: () => void;
  isTurboActive: boolean;
  onToggleTurbo: (active: boolean) => void;
}

export const ChannelIntelligenceBanner: React.FC<ChannelIntelligenceBannerProps> = ({
  channel,
  onOpenSyncModal,
  isTurboActive,
  onToggleTurbo,
}) => {
  if (!channel) {
    return (
      <div className="w-full max-w-5xl mx-auto mb-6 px-4">
        <div className="gold-segment-box rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Youtube className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white font-['Outfit'] flex items-center gap-1.5">
                  Sync Your YouTube Channel DNA
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
                </span>
                <span className="px-2 py-0.2 rounded-md text-[10px] font-extrabold bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  NEW KG ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Unlock Knowledge Graph (KG) node clusters, semantic entity triplets, and high-converting working strategies.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSyncModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 border border-amber-200/50"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Connect YouTube Channel</span>
          </button>
        </div>
      </div>
    );
  }

  const primaryCluster = channel.kgNodeClusters[0];

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 px-4">
      <div className="relative overflow-hidden gold-segment-box rounded-3xl p-4 sm:p-5 space-y-3.5">
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Channel Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src={channel.profile.avatarUrl}
              alt={channel.profile.title}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-white font-['Outfit'] flex items-center gap-1.5">
                  {channel.profile.title}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {channel.profile.handle}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  SYNCED
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 mt-0.5 flex-wrap">
                <span>
                  Resonance: <strong className="text-amber-300 font-bold">{channel.profile.algorithmicResonance}/100</strong>
                </span>
                <span>•</span>
                <span>
                  KG Authority: <strong className="text-cyan-300 font-semibold">{channel?.profile?.authorityGrade || "A+"}</strong>
                </span>
                <span>•</span>
                <span>
                  {(channel.workingStrategies || []).length} Working Strategies Active
                </span>
              </div>
            </div>
          </div>

          {/* Action Controls & Sledgehammer Toggle */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* Turbo Toggle */}
            <button
              onClick={() => onToggleTurbo(!isTurboActive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 border shadow-sm backdrop-blur-md ${
                isTurboActive
                  ? "bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 text-amber-200 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                  : "bg-slate-950/20 text-slate-300 border-amber-400/30 hover:border-amber-400/70 hover:text-white"
              }`}
              title="Toggle Knowledge Graph entity node infusion during generation"
            >
              <Flame className={`w-3.5 h-3.5 ${isTurboActive ? "text-amber-400 fill-amber-400 animate-pulse drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" : "text-slate-400"}`} />
              <span>SLEDGEHAMMER TURBO</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isTurboActive ? "bg-amber-400 text-slate-950 font-black shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "bg-black/40 text-slate-400"}`}>
                {isTurboActive ? "ON" : "OFF"}
              </span>
            </button>

            <button
              onClick={onOpenSyncModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-950/20 hover:bg-slate-900/40 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 backdrop-blur-md"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-300" />
              <span>Inspect Channel DNA</span>
            </button>
          </div>
        </div>

        {/* Bottom KG Entity Quick Preview Bar */}
        {primaryCluster && (
          <div className="pt-2.5 border-t border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/80 flex items-center gap-1 shrink-0">
                <Network className="w-3 h-3 text-cyan-300" />
                Dominant KG Entities:
              </span>
              {(primaryCluster.semanticIdNodes || []).slice(0, 3).map((node) => (
                <span
                  key={node.nodeId}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 text-cyan-200 border border-amber-400/20 shrink-0"
                >
                  {node.name} <strong className="text-amber-300 font-bold">({node.mid})</strong>
                </span>
              ))}
            </div>

            <div className="text-[11px] text-slate-300 italic shrink-0">
              Top Working Hook: <span className="text-amber-300 font-semibold">"{channel.workingStrategies?.[0]?.name || "Viral Retention Hook"}"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
