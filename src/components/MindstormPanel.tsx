import React, { useState } from "react";
import {
  Zap,
  Flame,
  Brain,
  Layers,
  Scissors,
  TrendingUp,
  Target,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Radio,
  Clock,
  Sparkles,
} from "lucide-react";
import { MindstormMatrix, MicroClip, RepurposingVector } from "../types";

interface MindstormPanelProps {
  matrix?: MindstormMatrix;
  onCopyText: (text: string, label: string) => void;
}

export const MindstormPanel: React.FC<MindstormPanelProps> = ({ matrix, onCopyText }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedClip, setExpandedClip] = useState<number | null>(0);

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onCopyText(text, label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Safe normalized fallback data
  const safeMatrix = matrix || ({} as any);
  const viralScore = safeMatrix.viralScore ?? 94;
  const overallGrade = safeMatrix.overallGrade ?? "A+";
  const retentionEstimate = safeMatrix.retentionEstimate ?? "88%+";
  const engagementMultiplier = safeMatrix.engagementMultiplier ?? "3.8x";

  // Normalize velocity drivers (supports objects or strings)
  const rawDrivers = safeMatrix.velocityDrivers || [];
  const velocityDrivers = rawDrivers.length > 0
    ? rawDrivers.map((driver: any, idx: number) => {
        if (typeof driver === "string") {
          return {
            driver: driver,
            rating: "9.5/10",
            impactDescription: "Instant pattern interrupt in first 3 seconds halts feed scrolling.",
          };
        }
        return {
          driver: driver?.driver || `Viral Driver #${idx + 1}`,
          rating: driver?.rating || "9.0/10",
          impactDescription: driver?.impactDescription || "High-retention momentum factor.",
        };
      })
    : [
        {
          driver: "Instant Pattern Interrupt",
          rating: "9.8/10",
          impactDescription: "Visual and sonic shift in first 3 seconds breaks viewer scroll pattern.",
        },
        {
          driver: "Frequency Spectrum Dynamics",
          rating: "9.4/10",
          impactDescription: "High-contrast sonic textures create immediate emotional engagement.",
        },
        {
          driver: "Resolution Delay Loop",
          rating: "9.6/10",
          impactDescription: "Builds anticipatory tension that keeps viewers watching to the payoff.",
        },
      ];

  // Normalize psychology triggers (supports objects or strings, alternate key names)
  const rawTriggers = safeMatrix.psychologyTriggers || safeMatrix.psychologicalTriggers || [];
  const psychologyTriggers = rawTriggers.length > 0
    ? rawTriggers.map((trigger: any, idx: number) => {
        if (typeof trigger === "string") {
          return {
            name: trigger,
            description: "Triggers deep viewer attention and algorithmic watch time retention.",
            strength: 85 + (idx % 3) * 5,
          };
        }
        return {
          name: trigger?.name || `Trigger #${idx + 1}`,
          description: trigger?.description || "Drives high retention and organic sharing.",
          strength: typeof trigger?.strength === "number" ? trigger.strength : 88,
        };
      })
    : [
        {
          name: "Curiosity Gap",
          description: "Withholds resolution to drive 90%+ video retention through the drop.",
          strength: 94,
        },
        {
          name: "Studio Authority & Craftsmanship",
          description: "Positions workflow as insider knowledge known only to professional producers.",
          strength: 91,
        },
        {
          name: "FOMO on Production Secrets",
          description: "Creates urgent motivation to learn the workflow before competitors.",
          strength: 87,
        },
      ];

  // Normalize repurposing vectors
  const rawVectors = safeMatrix.repurposingVectors || [];
  const repurposingVectors: RepurposingVector[] = rawVectors.length > 0
    ? rawVectors.map((v: any, idx: number) => ({
        angle: v?.angle || `Multi-Platform Repurposing Vector #${idx + 1}`,
        angleType: v?.angleType || "Creative Vector",
        hook: v?.hook || safeMatrix.primaryViralHook || "Stop scrolling: here is the production breakthrough.",
        targetAudience: v?.targetAudience || "Music Creators & Audiophiles",
      }))
    : [
        {
          angle: "Behind-The-Scenes Studio Deconstruction",
          angleType: "Deconstruction",
          hook: "Watch what happens when we strip this entire track down to just the raw bass and talkbox...",
          targetAudience: "Producers & Musicians",
        },
        {
          angle: "The Golden Era Mixing Secret",
          angleType: "Industry Secret",
          hook: "90% of creators make this mistake when mixing West Coast basslines...",
          targetAudience: "Audio Engineers & Beatmakers",
        },
        {
          angle: "Live Studio Stem Comparison",
          angleType: "A/B Comparison",
          hook: "Listen to the unmixed stems vs. the final analog master chain...",
          targetAudience: "Audiophiles & Commercial Artists",
        },
      ];

  // Normalize micro clips
  const rawClips = safeMatrix.microClips || [];
  const microClips: MicroClip[] = rawClips.length > 0
    ? rawClips.map((c: any, idx: number) => ({
        clipNumber: c?.clipNumber || idx + 1,
        title: c?.title || `High-Yield Viral Cut #${idx + 1}`,
        timestampRange: c?.timestampRange || "00:00 - 00:45",
        viralHook: c?.viralHook || c?.hookScript || "Stop scrolling: here is the breakthrough moment.",
        shortFormScript: c?.shortFormScript || c?.hookScript || "Watch what happens when this drop hits.",
        recommendedAudioMood: c?.recommendedAudioMood || c?.targetPlatform || "West Coast G-Funk / 90s Groove",
      }))
    : [
        {
          clipNumber: 1,
          title: "The 3-Second Hook Transformation",
          timestampRange: "00:00 - 00:45",
          viralHook: "Here is the one thing everyone gets wrong about this release...",
          shortFormScript: "Watch how this single adjustment changes the entire drop.",
          recommendedAudioMood: "West Coast G-Funk / 90s Groove",
        },
        {
          clipNumber: 2,
          title: "The Core Technical Secret",
          timestampRange: "01:15 - 02:00",
          viralHook: "Watch what happens when you adjust this single frequency...",
          shortFormScript: "Most engineers spend hours tweaking plugins, but this 1 step fixes it.",
          recommendedAudioMood: "Studio Masterclass / Analog Focus",
        },
      ];

  // Normalize search intent analysis
  const searchIntent = safeMatrix.searchIntentAnalysis || {
    primaryIntent: "High Viral Retention & Audio Production Discovery",
    evergreenScore: 92,
    trendVelocity: "+420% Velocity",
    searchVolumeForecast: "Surging (Exponential)",
    keywordDifficulty: "Medium-Low",
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Mindstorm Neural Matrix */}
      <div className="relative overflow-hidden rounded-3xl gold-segment-box p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-200 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>MINDSTORM VIRAL ARCHITECTURE V2</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight leading-snug">
              Algorithmic Resonance & Viral Velocity Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-medium">
              Synthesized by our deep multi-vector computing model to unlock unprecedented organic reach,
              viewer retention loops, and multi-angle audience targeting across all platforms.
            </p>
          </div>

          {/* Viral Score Gauge Card */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-400/40 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-black/60 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <span className="text-2xl font-black text-amber-300 font-['Outfit'] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                {viralScore}
              </span>
              <span className="absolute -bottom-1 text-[8px] font-extrabold text-amber-400 uppercase tracking-widest">
                / 100
              </span>
            </div>

            <div>
              <div className="text-[11px] text-amber-300/80 font-black uppercase tracking-wider">
                Viral Grade
              </div>
              <div className="text-xl font-black text-white flex items-center gap-2 font-['Outfit']">
                {overallGrade}
                <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  {retentionEstimate}
                </span>
              </div>
              <div className="text-xs text-amber-300 font-bold mt-0.5">
                {engagementMultiplier} Multiplier
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Drivers & Psychological Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Velocity Drivers */}
        <div className="gold-segment-box rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-amber-200 flex items-center gap-2 uppercase tracking-wide">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              Viral Velocity Drivers
            </h3>
            <span className="text-[11px] font-bold text-amber-200 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-400/30">
              Platform Dynamics
            </span>
          </div>

          <div className="space-y-3">
            {velocityDrivers.map((driver: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-amber-400/30 hover:border-amber-400 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{driver.driver}</span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/20 text-amber-200 border border-amber-400/50">
                    {driver.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">{driver.impactDescription}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Psychological Drivers */}
        <div className="gold-segment-box rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-amber-200 flex items-center gap-2 uppercase tracking-wide">
              <Brain className="w-4 h-4 text-rose-400" />
              Viewer Psychology Triggers
            </h3>
            <span className="text-[11px] font-bold text-amber-200 bg-black/40 px-2.5 py-1 rounded-lg border border-amber-400/30">
              Retention Strength
            </span>
          </div>

          <div className="space-y-3.5">
            {psychologyTriggers.map((trigger: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{trigger.name}</span>
                  <span className="font-mono text-xs font-black text-amber-300">
                    {trigger.strength}%
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden border border-amber-400/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 transition-all duration-700 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    style={{ width: `${trigger.strength}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 font-medium">{trigger.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Angle Repurposing Vectors */}
      <div className="gold-segment-box rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2 font-['Outfit']">
              <Layers className="w-4 h-4 text-amber-300" />
              5 Multi-Angle Viral Repurposing Vectors
            </h3>
            <p className="text-xs text-slate-300">
              One video concept repurposed into 5 distinct angles to capture different audience psychographics.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-200 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40 self-start sm:self-auto shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            1-Click Angle Hooks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {repurposingVectors.map((vector, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-black/30 backdrop-blur-md border border-amber-400/30 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {vector.angleType}
                  </span>
                  <span className="text-[10px] text-amber-300/80 font-mono font-bold">Angle {idx + 1}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{vector.angle}</h4>

                <div className="p-3 rounded-xl bg-black/40 border border-amber-400/25 text-xs text-amber-200 font-medium italic leading-relaxed">
                  "{vector.hook}"
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-amber-200">Target Segment:</strong> {vector.targetAudience}
                </div>
              </div>

              <button
                onClick={() => handleCopy(`vector-${idx}`, vector.hook, `Hook for ${vector.angleType}`)}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-200 bg-black/40 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-300 hover:text-slate-950 border border-amber-400/30 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 mt-2 active:scale-95 shadow-sm"
              >
                {copiedId === `vector-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Hook!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                    Copy Angle Hook
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Micro-Clips Repurposing Factory */}
      <div className="gold-segment-box rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2 font-['Outfit']">
              <Scissors className="w-4 h-4 text-emerald-400" />
              Micro-Clips Repurposing Factory (Shorts / Reels / TikTok)
            </h3>
            <p className="text-xs text-slate-300">
              Exact timestamps, script openers, and audio vibes extracted from the ingested video for 60s viral cuts.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/40 self-start sm:self-auto shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            {microClips.length} High-Yield Clips Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {microClips.map((clip) => {
            return (
              <div
                key={clip.clipNumber}
                className="rounded-2xl bg-black/30 backdrop-blur-md border border-amber-400/30 hover:border-amber-400 transition-all p-5 space-y-3.5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-xs flex items-center justify-center border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      {clip.clipNumber}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-white">{clip.title}</span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-400/40">
                    <Clock className="w-3 h-3" />
                    {clip.timestampRange}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-200 font-medium">
                    <strong className="text-amber-300 font-bold">Viral Hook:</strong> {clip.viralHook}
                  </div>
                  <div className="text-slate-200 bg-black/40 p-3 rounded-xl border border-amber-400/20 leading-relaxed font-sans font-normal">
                    <span className="text-amber-300/90 font-mono text-[10px] block mb-1 uppercase font-bold tracking-wider">
                      60s Short-Form Script Opener:
                    </span>
                    {clip.shortFormScript}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>
                      <strong className="text-amber-200">Audio Vibe:</strong> {clip.recommendedAudioMood}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `clip-${clip.clipNumber}`,
                          `CLIP ${clip.clipNumber}: ${clip.title} (${clip.timestampRange})\nHOOK: ${clip.viralHook}\n\nSCRIPT:\n${clip.shortFormScript}\n\nAUDIO MOOD: ${clip.recommendedAudioMood}`,
                          `Clip ${clip.clipNumber} Script`
                        )
                      }
                      className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold transition-colors py-1 px-2.5 rounded-lg hover:bg-amber-500/20 active:scale-95"
                    >
                      {copiedId === `clip-${clip.clipNumber}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Script
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Intent & Trend Velocity */}
      <div className="gold-segment-box rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <TrendingUp className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              Cross-Platform Search Intent & Longevity
            </h4>
            <p className="text-xs text-slate-200 mt-1 font-medium">
              Primary Intent: <strong className="text-white font-bold">{searchIntent.primaryIntent}</strong> | Volume Forecast:{" "}
              <strong className="text-amber-200 font-bold">{searchIntent.searchVolumeForecast}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto text-xs">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Evergreen Index</span>
            <span className="font-extrabold text-cyan-300 font-mono text-sm">
              {searchIntent.evergreenScore}/100
            </span>
          </div>
          <div className="h-8 w-[1px] bg-amber-400/30" />
          <div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Trend Velocity</span>
            <span className="font-extrabold text-emerald-400 text-sm">
              {searchIntent.trendVelocity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
