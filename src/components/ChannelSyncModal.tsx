import React, { useState, useEffect } from "react";
import {
  X,
  Youtube,
  Sparkles,
  Zap,
  CheckCircle2,
  Brain,
  Network,
  Users,
  Target,
  ArrowRight,
  TrendingUp,
  Flame,
  Check,
  Copy,
  Layers,
  Search,
  Shield,
  HelpCircle,
  Video,
  Play,
  Calendar,
  Eye,
  RefreshCw,
  LogIn,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  ChannelIntelligenceData,
  ChannelWorkingStrategy,
  KGNodeCluster,
} from "../types";
import { PRESET_CHANNELS } from "../lib/sampleChannels";
import { KnowledgeGraphVisualizer } from "./KnowledgeGraphVisualizer";
import { useAuth } from "../lib/AuthContext";
import {
  fetchMyUploadedVideos,
  RealYouTubeChannel,
  RealYouTubeVideo,
} from "../lib/youtubeApi";

interface ChannelSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncedChannel: ChannelIntelligenceData | null;
  onSelectChannel: (channel: ChannelIntelligenceData) => void;
  onCopyText: (text: string, label: string) => void;
  isTurboActive: boolean;
  onToggleTurbo: (val: boolean) => void;
  onSelectVideoForIngest?: (url: string, title?: string) => void;
}

export const ChannelSyncModal: React.FC<ChannelSyncModalProps> = ({
  isOpen,
  onClose,
  syncedChannel,
  onSelectChannel,
  onCopyText,
  isTurboActive,
  onToggleTurbo,
  onSelectVideoForIngest,
}) => {
  const {
    user,
    youtubeToken,
    userChannels,
    isLoadingChannels,
    signInWithGoogle,
    refreshYouTubeChannels,
    apiDiagnostic,
    isAuthLoading,
  } = useAuth();
  const [channelInput, setChannelInput] = useState("");
  const [customNiche, setCustomNiche] = useState("AI, Tech & Creator Systems");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"strategies" | "kg" | "audience" | "my_channel" | "presets">(
    user && youtubeToken ? "my_channel" : syncedChannel ? "strategies" : "presets"
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // My Videos state
  const [myVideos, setMyVideos] = useState<RealYouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [selectedChannelForVideos, setSelectedChannelForVideos] = useState<RealYouTubeChannel | null>(null);

  useEffect(() => {
    if (userChannels.length > 0 && !selectedChannelForVideos) {
      setSelectedChannelForVideos(userChannels[0]);
    }
  }, [userChannels, selectedChannelForVideos]);

  // Load videos when selectedChannel changes
  useEffect(() => {
    if (selectedChannelForVideos && youtubeToken) {
      setIsLoadingVideos(true);
      fetchMyUploadedVideos(youtubeToken, selectedChannelForVideos.uploadsPlaylistId)
        .then((videos) => {
          setMyVideos(videos);
        })
        .catch((err) => {
          console.warn("Failed to fetch my videos:", err);
        })
        .finally(() => {
          setIsLoadingVideos(false);
        });
    }
  }, [selectedChannelForVideos, youtubeToken]);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onCopyText(text, label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/youtube/channel/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelInput: channelInput.trim(),
          customNiche,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        onSelectChannel(data.data);
        setActiveTab("strategies");
      } else {
        setError(data.error || "Failed to sync channel.");
      }
    } catch (err: any) {
      console.error("Channel sync failed", err);
      setError("Network or server error during channel sync.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: ChannelIntelligenceData) => {
    onSelectChannel(preset);
    setActiveTab("strategies");
  };

  const handleSyncRealChannel = async (realChannel: RealYouTubeChannel) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/youtube/channel/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelInput: realChannel.customUrl || realChannel.title,
          customNiche: "Creator Channel & Video Intelligence",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        // Overlay real avatar and stats from YouTube Data API
        const enhancedData: ChannelIntelligenceData = {
          ...data.data,
          profile: {
            ...data.data.profile,
            channelId: realChannel.id,
            handle: realChannel.customUrl,
            title: realChannel.title,
            description: realChannel.description || data.data.profile.description,
            avatarUrl: realChannel.avatarUrl || data.data.profile.avatarUrl,
            subscriberCount: realChannel.subscriberCount,
            videoCount: realChannel.videoCount,
            verifiedBadge: true,
          },
        };

        onSelectChannel(enhancedData);
        setActiveTab("strategies");
      } else {
        setError(data.error || "Failed to sync channel.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync YouTube channel DNA.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentChannel = syncedChannel || PRESET_CHANNELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col gold-segment-box rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-amber-400/30 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <div className="w-full h-full bg-black/60 rounded-[14px] flex items-center justify-center">
                <Youtube className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
                  YouTube Channel Sync & KG Sledgehammer Engine
                  <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-200 border border-amber-400/50">
                  DEEP DNA V2
                </span>
                {youtubeToken && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                    <CheckCircle2 className="w-3 h-3" /> YouTube Data API v3 OAuth Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                Synchronize your YouTube channel to extract proven working strategies, Knowledge Graph node clusters, and 1-click video ingestion.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-black/50 transition-colors border border-transparent hover:border-amber-400/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Input Bar - Only active for unauthenticated guests, or shows active Google Account Sync status when signed in */}
        <div className="p-5 sm:p-6 bg-black/30 backdrop-blur-md border-b border-amber-400/20">
          {user ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      Channel Sync Engaged with Google Account
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                      {user.email || user.displayName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Your YouTube channel DNA and uploads are automatically linked to your authenticated Google credentials. (Manual @handle sync is disabled while signed in).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("my_channel")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>View My Channel & Uploads</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSyncSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="Enter YouTube Channel Handle (e.g. @MrBeast, @HubermanLab, @AliAbdaal) or URL"
                  className="w-full h-12 pl-4 pr-10 rounded-2xl bg-black/50 border border-amber-400/40 text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 backdrop-blur-md"
                />
                <Youtube className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              </div>

              <button
                type="submit"
                disabled={isLoading || !channelInput.trim()}
                className="w-full sm:w-auto h-12 px-6 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 border border-amber-200/50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Syncing DNA...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Sync YouTube Channel</span>
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <p className="text-xs text-rose-400 mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Active Channel Snapshot Bar */}
        {currentChannel && (
          <div className="px-5 sm:px-6 py-4 bg-black/40 backdrop-blur-md border-b border-amber-400/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentChannel.profile.avatarUrl}
                alt={currentChannel.profile.title}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {currentChannel.profile.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {currentChannel.profile.handle}
                  </span>
                  {currentChannel.profile.verifiedBadge && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span>{currentChannel.profile.subscriberCount} Subscribers</span>
                  <span>•</span>
                  <span>{currentChannel.profile.videoCount} Videos</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{currentChannel.profile.authorityGrade}</span>
                </div>
              </div>
            </div>

            {/* Sledgehammer Turbo Toggle */}
            <div className="flex items-center gap-3 bg-[#06070c]/90 px-4 py-2 rounded-2xl border border-amber-500/30">
              <div className="text-right">
                <div className="text-[11px] font-extrabold text-white flex items-center gap-1.5 justify-end">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  KG Sledgehammer Turbo
                </div>
                <div className="text-[10px] text-slate-400">
                  {isTurboActive ? "Infusing KG Nodes & Working Hooks" : "Standard Model"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleTurbo(!isTurboActive)}
                className={`w-12 h-7 rounded-full transition-colors relative p-0.5 border ${
                  isTurboActive
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 border-amber-400"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white transition-transform ${
                    isTurboActive ? "translate-x-5 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 border-b border-slate-800/80 bg-[#06070c]/50 flex items-center gap-2 overflow-x-auto">
          {/* My YouTube Channel Tab */}
          <button
            onClick={() => setActiveTab("my_channel")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "my_channel"
                ? "border-red-500 text-red-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>My Connected YouTube ({userChannels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("strategies")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "strategies"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Working Strategies ({currentChannel.workingStrategies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("kg")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "kg"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>KG Node Clusters ({currentChannel.kgNodeClusters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("audience")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "audience"
                ? "border-rose-400 text-rose-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Audience Persona</span>
          </button>

          <button
            onClick={() => setActiveTab("presets")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === "presets"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Presets</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
          {/* TAB: MY CONNECTED YOUTUBE CHANNEL (LIVE YOUTUBE DATA API V3) */}
          {activeTab === "my_channel" && (
            <div className="space-y-6">
              {/* API Enablement Guide Banner if YouTube Data API is disabled in project */}
              {apiDiagnostic?.isApiDisabled && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-white block text-sm">
                          YouTube Data API v3 Needs Activation in Google Cloud Project
                        </strong>
                        <p className="text-xs text-amber-300/90 mt-0.5 leading-relaxed">
                          Your Google OAuth token was successfully verified. To unlock live uploads and channel stats directly from Google's API, enable YouTube Data API v3 in your Google Cloud project.
                        </p>
                      </div>
                    </div>

                    <a
                      href={apiDiagnostic.enablementUrl || "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <span>Enable YouTube API in GCP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-[11px] text-amber-400/80 pt-1 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
                    <span>💡 Tip:</span>
                    <span>You can still sync any channel instantly using the handle search bar above (e.g. @MrBeast, @HubermanLab) or your authenticated profile below.</span>
                  </div>
                </div>
              )}

              {!user || !youtubeToken ? (
                <div className="p-8 rounded-3xl bg-[#090b14] border border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
                    <Youtube className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      Sign in with Google to Connect Your YouTube Channel
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Authorize Google OAuth to access the YouTube Data API v3. Live browse your uploads, sync channel analytics, and 1-click ingest your videos.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      signInWithGoogle().catch(() => {});
                    }}
                    disabled={isAuthLoading}
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:opacity-95 shadow-lg active:scale-95 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAuthLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Youtube className="w-4 h-4" />
                    )}
                    <span>{isAuthLoading ? "Connecting..." : "Sign In with Google & Authorize YouTube"}</span>
                  </button>
                </div>
              ) : isLoadingChannels ? (
                <div className="p-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300">
                    Querying YouTube Data API v3 for your connected channels...
                  </p>
                </div>
              ) : userChannels.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#090b14] border border-slate-800 text-center space-y-3">
                  <p className="text-xs text-slate-300">
                    No public YouTube channels found on this Google account. You can enter any channel handle in the search bar above or create a YouTube channel on this account.
                  </p>
                  <button
                    onClick={refreshYouTubeChannels}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:text-white border border-slate-700 transition-all inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh YouTube Data</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Channel cards list */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Authenticated YouTube Channels ({userChannels.length})
                      </h4>
                      <button
                        onClick={refreshYouTubeChannels}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" /> Refresh
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userChannels.map((chan) => {
                        const isSelected = selectedChannelForVideos?.id === chan.id;
                        return (
                          <div
                            key={chan.id}
                            className={`p-5 rounded-2xl border transition-all space-y-4 ${
                              isSelected
                                ? "bg-[#111425] border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                                : "bg-[#06070c]/90 border-slate-800/90"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {chan.avatarUrl ? (
                                <img
                                  src={chan.avatarUrl}
                                  alt={chan.title}
                                  className="w-12 h-12 rounded-2xl object-cover border border-red-500/50"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                                  <Youtube className="w-6 h-6" />
                                </div>
                              )}
                              <div>
                                <h3 className="text-sm font-extrabold text-white">{chan.title}</h3>
                                <div className="text-xs font-mono text-amber-300">{chan.customUrl}</div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                  <span>{chan.subscriberCount} Subs</span>
                                  <span>•</span>
                                  <span>{chan.videoCount} Videos</span>
                                  <span>•</span>
                                  <span>{chan.viewCount} Views</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                              <button
                                onClick={() => handleSyncRealChannel(chan)}
                                className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Sync DNA & KG Nodes</span>
                              </button>

                              <button
                                onClick={() => setSelectedChannelForVideos(chan)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                  isSelected
                                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                                    : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
                                }`}
                              >
                                Browse Videos
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Uploaded Videos Grid with 1-Click Ingest */}
                  {selectedChannelForVideos && (
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-red-500" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                            Uploaded Videos on {selectedChannelForVideos.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400">
                          Click any video to 1-click ingest & distribute
                        </span>
                      </div>

                      {isLoadingVideos ? (
                        <div className="p-8 text-center space-y-2">
                          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                          <p className="text-xs text-slate-400">Fetching latest uploaded videos...</p>
                        </div>
                      ) : myVideos.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-[#090b14] border border-slate-800 text-center text-xs text-slate-400">
                          No uploaded videos found in this channel's upload playlist.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {myVideos.map((video) => (
                            <div
                              key={video.id}
                              className="group bg-[#06070c]/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
                            >
                              <div className="relative aspect-video bg-black">
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                                  <span className="flex items-center gap-1 font-mono">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {video.publishedAt}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                                <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                                  {video.title}
                                </h5>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                                  <button
                                    onClick={() => {
                                      if (onSelectVideoForIngest) {
                                        onSelectVideoForIngest(video.watchUrl, video.title);
                                        onClose();
                                      }
                                    }}
                                    className="flex-1 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>Ingest & Synthesize</span>
                                  </button>

                                  <a
                                    href={video.watchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-700"
                                    title="Open on YouTube"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: WORKING STRATEGIES */}
          {activeTab === "strategies" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Proven Working Strategies & Algorithmic Multipliers
                  </h4>
                  <p className="text-xs text-slate-400">
                    High-performing hooks and retention formulas extracted from {currentChannel.profile?.title || "Channel"}'s verified upload history.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                  {(currentChannel.workingStrategies || []).length} Verified Strategies
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(currentChannel.workingStrategies || []).map((strat, idx) => (
                  <div
                    key={strat.id || idx}
                    className="bg-[#06070c]/90 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 space-y-3.5 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {strat.name}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {strat.retentionMultiplier}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-amber-200 font-medium italic leading-relaxed">
                        "{strat.hookFormula}"
                      </div>

                      <div className="space-y-1 text-xs text-slate-300 font-normal">
                        <div>
                          <strong className="text-slate-400 font-semibold">Psychological Driver:</strong>{" "}
                          {strat.psychologicalDriver}
                        </div>
                        <div>
                          <strong className="text-slate-400 font-semibold">Best Format:</strong>{" "}
                          {strat.bestPerformingFormat}
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0c0d16] border border-slate-800 text-slate-300 text-[11px] mt-1">
                          <strong className="text-emerald-400 block mb-0.5">Actionable Directive:</strong>
                          {strat.actionableDirective}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleCopy(
                          strat.id,
                          `Strategy: ${strat.name}\nHook: ${strat.hookFormula}\nDirective: ${strat.actionableDirective}`,
                          `${strat.name} Hook`
                        )
                      }
                      className="w-full py-2 rounded-xl text-xs font-bold text-slate-300 bg-[#0c0d16] hover:bg-amber-500 hover:text-slate-950 border border-slate-800 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      {copiedId === strat.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Formula!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Hook Formula
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: KNOWLEDGE GRAPH & SEMANTIC IDs */}
          {activeTab === "kg" && (
            <KnowledgeGraphVisualizer
              clusters={currentChannel.kgNodeClusters || []}
              channelHandle={currentChannel.profile?.handle || ""}
              onCopyText={onCopyText}
            />
          )}

          {/* TAB 3: AUDIENCE PERSONA TRIGGERS */}
          {activeTab === "audience" && (
            <div className="space-y-5">
              <div className="bg-[#06070c]/90 border border-slate-800/90 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  Target Audience Persona Profile
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-['Outfit']">
                  {currentChannel.audiencePersona?.coreAvatar || "Target Creator Community"}
                </h3>
                <div className="text-xs text-slate-400">
                  <strong className="text-slate-200">Ideal Content Pacing:</strong>{" "}
                  {currentChannel.audiencePersona?.idealContentPacing || "Fast, high-retention cadence"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* High Converting Triggers */}
                <div className="bg-[#06070c]/90 border border-slate-800/90 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    High-Converting Resonant Triggers
                  </h4>
                  <div className="space-y-2">
                    {(currentChannel.audiencePersona?.highConvertingTriggers || []).map((trigger, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-200 p-2.5 rounded-xl bg-[#0c0d16] border border-slate-800/80 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banned Taboo Phrases */}
                <div className="bg-[#06070c]/90 border border-slate-800/90 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Banned Taboo Phrases (Algorithmic Drop-Off)
                  </h4>
                  <div className="space-y-2">
                    {(currentChannel.audiencePersona?.bannedTabooPhrases || []).map((phrase, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-rose-300/90 p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        "{phrase}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Curated Creator Intelligence Profiles
                  </h4>
                  <p className="text-xs text-slate-400">
                    Switch between pre-modeled master creators to test contrasting Knowledge Graph nodes and working hooks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_CHANNELS.map((preset) => {
                  const isSelected = syncedChannel?.profile?.handle === preset.profile.handle;
                  return (
                    <div
                      key={preset.profile.handle}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "bg-[#111425] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                          : "bg-[#06070c]/90 border-slate-800/90 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={preset.profile.avatarUrl}
                          alt={preset.profile.title}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">
                              {preset.profile.title}
                            </span>
                            <span className="text-xs font-mono text-amber-300">
                              {preset.profile.handle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {preset.profile.description}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                            <span className="text-amber-400 font-bold">{preset.profile.subscriberCount}</span>
                            <span>•</span>
                            <span>{preset.profile.nicheCategory}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPreset(preset)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-900 hover:bg-gradient-to-r hover:from-amber-400 hover:to-rose-400 hover:text-slate-950 text-slate-200 border border-slate-800"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Currently Active Channel</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Load Channel DNA & KG Nodes</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-[#06070c] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Channel DNA and KG entities will automatically boost all 8 platform packages during distribution synthesis.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:opacity-95 shadow-md active:scale-95 transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
