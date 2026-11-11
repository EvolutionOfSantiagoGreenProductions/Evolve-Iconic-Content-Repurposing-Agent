import React, { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Code,
  Sparkles,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DistributionData, YouTubeVideoInfo } from "../types";
import { formatCompleteCampaignMarkdown } from "../lib/youtubeUtils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: YouTubeVideoInfo;
  data: DistributionData;
  onCopySuccess: (label: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  video,
  data,
  onCopySuccess,
}) => {
  const [activeFormat, setActiveFormat] = useState<"markdown" | "json">("markdown");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = formatCompleteCampaignMarkdown(video, data);
  const jsonContent = JSON.stringify({ video, distribution: data }, null, 2);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCopy = () => {
    const text = activeFormat === "markdown" ? markdownContent : jsonContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti();
    onCopySuccess(`Full Campaign (${activeFormat.toUpperCase()})`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isMd = activeFormat === "markdown";
    const blob = new Blob([isMd ? markdownContent : jsonContent], {
      type: isMd ? "text/markdown;charset=utf-8" : "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evolution-distribution-${video.videoId}.${isMd ? "md" : "json"}`;
    a.click();
    URL.revokeObjectURL(url);
    triggerConfetti();
    onCopySuccess(`Downloaded .${isMd ? "md" : "json"} File`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl gold-segment-box rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-400/30 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Download className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
                Export Distribution Campaign Fleet
                <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                Download or copy all platform packages, Mindstorm matrix, and SEO descriptions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-black/50 transition-colors border border-transparent hover:border-amber-400/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action format toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-amber-400/20 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormat("markdown")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFormat === "markdown"
                  ? "bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "text-slate-300 hover:text-white border border-transparent"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown (.md)
            </button>

            <button
              onClick={() => setActiveFormat("json")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFormat === "json"
                  ? "bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "text-slate-300 hover:text-white border border-transparent"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Raw JSON (.json)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-black/40 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400 transition-all active:scale-95 shadow-sm backdrop-blur-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{copied ? "Copied All!" : "Copy to Clipboard"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 border border-amber-200/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-black/50 backdrop-blur-md">
          <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
            {activeFormat === "markdown" ? markdownContent : jsonContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
