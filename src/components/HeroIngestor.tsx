import React, { useState, useEffect } from "react";
import {
  Youtube,
  Sparkles,
  ArrowRight,
  Clipboard,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertCircle,
  Zap,
  Scissors,
} from "lucide-react";
import { SAMPLE_VIDEOS, SampleVideoPreset } from "../lib/sampleVideos";
import { extractYouTubeId, isValidYouTubeUrl } from "../lib/youtubeUtils";
import { ChannelIntelligenceData } from "../types";

interface HeroIngestorProps {
  onIngest: (params: {
    url: string;
    targetNiche: string;
    tone: string;
    notes: string;
    customTitle?: string;
  }) => void;
  isLoading: boolean;
  syncedChannel?: ChannelIntelligenceData | null;
  onOpenSyncModal?: () => void;
  isTurboActive?: boolean;
  onToggleTurbo?: (val: boolean) => void;
  onOpenClipper?: (url: string, title?: string) => void;
}

const TONE_OPTIONS = [
  "High Viral Energy & Engaging Authority",
  "Raw Storytelling & High-Value Tactical",
  "Controversial Debate & Thought Leadership",
  "Clean Step-by-Step Educational",
  "Humorous, Witty & Fast Paced",
];

const NICHE_OPTIONS = [
  "AI & Software Engineering",
  "Business & Growth Hacking",
  "Media & Creator Economy",
  "Productivity & Tech Workflows",
  "Crypto, DeFi & Web3",
  "Health, Fitness & Longevity",
  "Gaming & Entertainment",
  "E-Commerce & Digital Products",
];

export const HeroIngestor: React.FC<HeroIngestorProps> = ({
  onIngest,
  isLoading,
  syncedChannel,
  onOpenSyncModal,
  isTurboActive = true,
  onToggleTurbo,
  onOpenClipper,
}) => {
  const [url, setUrl] = useState("");
  const [targetNiche, setTargetNiche] = useState(NICHE_OPTIONS[0]);
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    const videoId = extractYouTubeId(url);
    setPreviewId(videoId);
  }, [url]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch (err) {
      console.warn("Clipboard access denied or unavailable", err);
    }
  };

  const handleSelectSample = (sample: SampleVideoPreset) => {
    setUrl(sample.url);
    setTargetNiche(sample.category);
    setTone(sample.tone);
    setNotes(sample.notes);
    setCustomTitle(sample.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !isValidYouTubeUrl(url)) return;
    onIngest({
      url: url.trim(),
      targetNiche,
      tone,
      notes,
      customTitle: customTitle.trim() || undefined,
    });
  };

  const isValid = isValidYouTubeUrl(url);

  return (
    <div className="relative w-full max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6">
      {/* Immersive background glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-tr from-amber-400/20 via-yellow-300/15 to-amber-500/20 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[200px] bg-amber-400/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Hero Header */}
      <div className="text-center relative z-10 space-y-4 mb-9">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-200 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
          <span className="tracking-wide">UNPRECEDENTED VIRAL DISCOVERY & KG ENTITY CLUSTER REACH</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-['Outfit'] leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          Turn Any YouTube Video Into A{" "}
          <span className="animate-gold-shimmer font-black">
            Multi-Platform Viral Fleet
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 leading-relaxed font-medium drop-shadow-md">
          Ingest your YouTube link in real-time. Instantly synthesize high-CTR titles, SEO-primed descriptions,
          and tailored native distribution packages for <strong className="text-amber-200 font-bold">Facebook, X, Instagram, TikTok, Reddit, Snapchat</strong> & custom API webhooks.
        </p>
      </div>

      {/* Ingestion Box with 10-15% Transparency and Gold Highlight Border */}
      <form
        onSubmit={handleSubmit}
        id="form-youtube-ingest"
        className="relative z-10 gold-segment-box rounded-3xl p-5 sm:p-7 space-y-5"
      >
        {/* Main URL input bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="input-youtube-url" className="text-xs font-black uppercase tracking-wider text-amber-200 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
              </div>
              Paste YouTube Video Link
            </label>

            <div className="flex items-center gap-2">
              {onOpenSyncModal && (
                <button
                  type="button"
                  onClick={onOpenSyncModal}
                  className={`text-xs flex items-center gap-1.5 font-bold transition-all py-1 px-2.5 rounded-lg border backdrop-blur-md ${
                    syncedChannel
                      ? "bg-amber-500/20 text-amber-200 border-amber-400/50 hover:bg-amber-500/30"
                      : "bg-slate-950/30 text-slate-300 border-amber-400/25 hover:text-white hover:border-amber-400/60"
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>{syncedChannel ? `Synced: ${syncedChannel.profile.handle}` : "Sync Channel DNA"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-bold transition-colors py-1 px-2.5 rounded-lg hover:bg-amber-500/20 border border-transparent hover:border-amber-400/30"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              id="input-youtube-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
              className={`w-full h-15 pl-4 pr-36 rounded-2xl bg-black/40 backdrop-blur-md text-slate-100 placeholder-slate-400 text-sm sm:text-base font-mono border transition-all focus:outline-none focus:ring-2 ${
                url.length > 0
                  ? isValid
                    ? "border-emerald-400/80 focus:ring-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                    : "border-rose-400/80 focus:ring-rose-400/30 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                  : "border-amber-400/40 focus:border-amber-300 focus:ring-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              }`}
            />

            <div className="absolute right-2.5 flex items-center gap-2">
              {previewId && isValid && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ID: {previewId}
                </span>
              )}

              {isValid && onOpenClipper && (
                <button
                  type="button"
                  onClick={() => onOpenClipper(url.trim(), customTitle || undefined)}
                  className="h-11 px-4 rounded-xl font-bold text-xs text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-400/40 transition-all flex items-center gap-1.5 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md"
                  title="Open this video immediately in Iconic Clipper Studio"
                >
                  <Scissors className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Clip in Studio</span>
                </button>
              )}

              <button
                type="submit"
                disabled={!isValid || isLoading}
                id="btn-submit-ingest"
                className="h-11 px-6 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2 active:scale-95 border border-amber-200/50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <span>Generate Fleet</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>

          {url.length > 0 && !isValid && (
            <p className="text-xs text-rose-300 flex items-center gap-1.5 mt-1 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              Please enter a valid YouTube video or shorts link.
            </p>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-3 border-t border-amber-500/20">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-extrabold text-amber-200/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
              Instant Sample Demos:
            </span>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-300 hover:text-amber-200 flex items-center gap-1.5 font-bold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
              {showAdvanced ? "Hide Matrix Parameters" : "Customize Parameters & Tone"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_VIDEOS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-black/30 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400 transition-all text-left flex items-center gap-2 group active:scale-95 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                <span className="truncate max-w-[180px] sm:max-w-[220px]">{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Tuning Parameters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Target Niche / Category</label>
              <select
                value={targetNiche}
                onChange={(e) => setTargetNiche(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/50 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-300"
              >
                {NICHE_OPTIONS.map((n) => (
                  <option key={n} value={n} className="bg-slate-950 text-white">
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Tone & Personality Matrix</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/50 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-300"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-slate-950 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-200">
                Optional Title Override / Creator Directives
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. In-depth analysis of AI agents, highlight 3 key frameworks"
                className="w-full h-10 px-3 rounded-xl bg-black/50 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-300"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
