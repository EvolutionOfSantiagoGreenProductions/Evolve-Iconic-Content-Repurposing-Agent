import React from "react";
import {
  X,
  History,
  Trash2,
  ExternalLink,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { IngestionHistoryItem } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: IngestionHistoryItem[];
  onSelectHistoryItem: (item: IngestionHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl gold-segment-box rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-400/30 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
                Ingested Campaigns History
                <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                Quickly restore previous YouTube distribution runs saved in local memory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-500/20 transition-colors border border-rose-500/30"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-black/50 transition-colors border border-transparent hover:border-amber-400/30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of past campaigns */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-black/50 backdrop-blur-md">
          {history.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-black/40 border border-dashed border-amber-400/30 text-slate-300 text-xs space-y-2">
              <History className="w-8 h-8 text-amber-300/50 mx-auto" />
              <p className="font-bold text-amber-200">No campaigns generated yet.</p>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Paste any YouTube link on the homepage to start your first multi-platform distribution.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-amber-400/30 hover:border-amber-400 transition-all flex items-center justify-between gap-4 group shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <img
                      src={item.video.thumbnailUrl}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.video.fallbackThumbnailUrl;
                      }}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                      {item.video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                      <span className="font-semibold text-amber-200">{item.video.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 border border-amber-200/50"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors border border-transparent hover:border-rose-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
