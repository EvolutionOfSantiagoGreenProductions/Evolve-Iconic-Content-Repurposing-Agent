import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  History,
  SendHorizontal,
  Download,
  RotateCcw,
  Youtube,
  LogIn,
  LogOut,
  User,
  CheckCircle2,
  Cloud,
  ChevronDown,
  RefreshCw,
  Scissors,
  Activity,
} from "lucide-react";
import { ChannelIntelligenceData } from "../types";
import { useAuth } from "../lib/AuthContext";

interface NavbarProps {
  hasData: boolean;
  historyCount: number;
  endpointsCount: number;
  syncedChannel: ChannelIntelligenceData | null;
  onOpenSyncModal: () => void;
  onOpenHistory: () => void;
  onOpenEndpoints: () => void;
  onOpenExport: () => void;
  onReset: () => void;
  onSelectSample: () => void;
  onOpenClipper?: () => void;
  onOpenAssetLogger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasData,
  historyCount,
  endpointsCount,
  syncedChannel,
  onOpenSyncModal,
  onOpenHistory,
  onOpenEndpoints,
  onOpenExport,
  onReset,
  onSelectSample,
  onOpenClipper,
  onOpenAssetLogger,
}) => {
  const { user, youtubeToken, signInWithGoogle, signOut, isAuthLoading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      // Error handled in context
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/30 bg-[#06070c]/20 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.12)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-[1.5px] shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <div className="w-full h-full bg-[#090b14]/70 backdrop-blur-md rounded-[10px] flex items-center justify-center border border-amber-400/30">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-400/30" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-white font-['Outfit'] flex items-center gap-1.5">
                EVOLUTION <span className="animate-gold-shimmer font-black">STUDIO</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                MINDSTORM & KG ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block font-medium">
              Viral YouTube Ingestion, KG Entity Nodes & Multi-Platform Distribution
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Synced Channel Button */}
          <button
            onClick={onOpenSyncModal}
            id="btn-navbar-channel-sync"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border backdrop-blur-md ${
              syncedChannel
                ? "bg-amber-500/20 text-amber-200 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:border-amber-300"
                : "bg-slate-950/20 text-slate-200 border-amber-400/30 hover:border-amber-400/70 hover:text-amber-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            {syncedChannel ? (
              <span className="max-w-[100px] sm:max-w-[130px] truncate">
                {syncedChannel.profile.handle}
              </span>
            ) : (
              <span>Sync Channel</span>
            )}
          </button>

          {/* Iconic Clipper Quick Launch */}
          {onOpenClipper && (
            <button
              onClick={onOpenClipper}
              id="btn-iconic-clipper-nav"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 border border-amber-200/50"
            >
              <Scissors className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Iconic Clipper</span>
            </button>
          )}

          {/* Performance Monitor & Before/After Snapshot Comparator */}
          {onOpenAssetLogger && (
            <button
              onClick={onOpenAssetLogger}
              id="btn-asset-logger-nav"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 hover:text-white border border-amber-400/40 hover:border-amber-400 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] active:scale-95 backdrop-blur-md"
              title="Open Performance Monitor & Before/After Snapshot Comparator"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Performance Monitor</span>
            </button>
          )}

          <button
            onClick={onSelectSample}
            id="btn-sample-presets"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-950/20 hover:bg-slate-900/40 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400/70 transition-all shadow-sm active:scale-95 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-diamond-glint" />
            <span className="hidden md:inline">Sample</span> Presets
          </button>

          <button
            onClick={onOpenEndpoints}
            id="btn-custom-endpoints"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-950/20 hover:bg-slate-900/40 hover:text-cyan-200 border border-amber-400/30 hover:border-cyan-400/70 transition-all relative shadow-sm active:scale-95 backdrop-blur-md"
          >
            <SendHorizontal className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Endpoints</span>
            {endpointsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-cyan-500/30 text-cyan-200 border border-cyan-400/50">
                {endpointsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenHistory}
            id="btn-history"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-950/20 hover:bg-slate-900/40 hover:text-amber-200 border border-amber-400/30 hover:border-amber-400/70 transition-all relative shadow-sm active:scale-95 backdrop-blur-md"
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500/30 text-amber-200 border border-amber-400/50">
                {historyCount}
              </span>
            )}
          </button>

          {hasData && (
            <>
              <button
                onClick={onOpenExport}
                id="btn-export-campaign"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all active:scale-95 border border-amber-200/50"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Export</span>
              </button>

              <button
                onClick={onReset}
                id="btn-reset-campaign"
                title="New Ingestion"
                className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-950/20 hover:bg-slate-900/40 border border-amber-400/30 hover:border-amber-400 transition-colors backdrop-blur-md"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* ==================== GOOGLE AUTH & YOUTUBE OAUTH STATUS ==================== */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="btn-user-profile"
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-950/25 hover:bg-slate-900/50 border border-amber-400/40 hover:border-amber-400 transition-all text-xs text-white backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-6 h-6 rounded-lg object-cover border border-amber-400/60"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-400 flex items-center justify-center text-[11px] font-bold">
                    {user.displayName?.[0] || user.email?.[0] || "U"}
                  </div>
                )}
                <div className="text-left hidden md:block max-w-[100px] truncate">
                  <span className="font-bold text-xs block leading-tight truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {/* User dropdown popup */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e101b]/95 backdrop-blur-2xl border border-amber-400/50 shadow-2xl p-3 space-y-3 z-50 animate-in fade-in">
                  <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/70"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-200 border border-amber-400 flex items-center justify-center font-bold text-base">
                        {user.displayName?.[0] || "U"}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">
                        {user.displayName || "Google Creator"}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-400/20">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                        Firestore Persistency
                      </span>
                      <span className="text-emerald-300 font-bold">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-400/20">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        YouTube Data API v3
                      </span>
                      {youtubeToken ? (
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> OAuth Live
                        </span>
                      ) : (
                        <button
                          onClick={handleGoogleSignIn}
                          className="text-[10px] font-bold text-amber-300 underline hover:text-amber-200"
                        >
                          Re-authorize
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    id="btn-sign-out"
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || isAuthLoading}
              id="btn-google-signin"
              title="Sign in with Google to enable Firestore cloud persistence and YouTube Data API v3 sync"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95 transition-all border border-amber-200/50"
            >
              {isSigningIn ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Youtube className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              )}
              <span className="hidden sm:inline">Sign In with Google</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
