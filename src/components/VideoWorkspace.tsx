import React, { useState } from "react";
import {
  ExternalLink,
  Play,
  Download,
  Copy,
  Check,
  Film,
  Sparkles,
  Share2,
  Tv,
  Scissors,
} from "lucide-react";
import { YouTubeVideoInfo } from "../types";

interface VideoWorkspaceProps {
  video: YouTubeVideoInfo;
  onCopyLink: () => void;
  onOpenExport: () => void;
  onOpenClipper?: (url: string, title?: string) => void;
}

export const VideoWorkspace: React.FC<VideoWorkspaceProps> = ({
  video,
  onCopyLink,
  onOpenExport,
  onOpenClipper,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(video.standardWatchUrl);
    setCopied(true);
    onCopyLink();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadThumbnail = () => {
    const a = document.createElement("a");
    a.href = video.thumbnailUrl;
    a.target = "_blank";
    a.download = `youtube-${video.videoId}-thumbnail.jpg`;
    a.click();
  };

  return (
    <div className="w-full gold-segment-box rounded-3xl p-5 sm:p-7 shadow-2xl mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Video Player / Thumbnail Preview */}
        <div className="lg:col-span-6 relative aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.25)] group">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={video.thumbnailUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = video.fallbackThumbnailUrl;
                }}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  id="btn-play-video"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-110 active:scale-95 transition-all border border-amber-200"
                  title="Play Ingested Video"
                >
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 bg-black/70 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-amber-400/30">
                <span className="flex items-center gap-2 font-bold truncate text-amber-200">
                  <Film className="w-4 h-4 text-amber-300" />
                  YouTube Ingestion Verified
                </span>
                <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded-lg text-amber-300 border border-amber-400/40">
                  ID: {video.videoId}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video Metadata & Quick Actions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              <Tv className="w-3.5 h-3.5" />
              SOURCE VIDEO INGESTED
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Outfit'] tracking-tight flex items-center gap-2">
              {video.title}
              <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint shrink-0" />
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-medium">
              <span>
                Creator: <strong className="text-amber-200 font-bold">{video.author}</strong>
              </span>
              <span>•</span>
              <a
                href={video.standardWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 font-bold transition-colors"
              >
                Watch on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-amber-400/30 font-medium">
            This YouTube asset has been parsed and synchronized with the{" "}
            <span className="text-amber-300 font-bold">Mindstorm Multi-Vector Neural Engine</span>.
            All metadata, high-CTR hooks, micro-clips, and distribution packages below are fully generated and ready to post.
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-black/40 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400 transition-all active:scale-95 shadow-sm backdrop-blur-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              {copied ? "Link Copied!" : "Copy Video Link"}
            </button>

            <button
              onClick={handleDownloadThumbnail}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-black/40 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400 transition-all active:scale-95 shadow-sm backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              Get 4K Thumbnail
            </button>

            {onOpenClipper && (
              <button
                onClick={() => onOpenClipper(video.standardWatchUrl, video.title)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-400/40 transition-all active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md"
                title="Launch in Iconic Clipper Studio to extract viral 9:16 vertical clips"
              >
                <Scissors className="w-3.5 h-3.5 text-amber-300" />
                Clip in Clipper Studio
              </button>
            )}

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 ml-auto border border-amber-200/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              Export Full Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
