import React, { useState, useEffect, useCallback } from "react";
import {
  Youtube,
  Zap,
  Play,
  Clock,
  Eye,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sliders,
  LogIn,
  Flame,
  Radio,
  Layers,
  Sparkles,
  AlertCircle,
  Video,
  Scissors,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import {
  RealYouTubeChannel,
  RealYouTubeVideo,
  fetchMyUploadedVideos,
} from "../lib/youtubeApi";
import { ChannelIntelligenceData } from "../types";

interface RecentUploadsSectionProps {
  syncedChannel: ChannelIntelligenceData | null;
  onSelectVideoForIngest: (url: string, title?: string) => void;
  onOpenSyncModal: () => void;
  onOpenClipper?: (videoUrl: string, videoTitle?: string) => void;
}

export const RecentUploadsSection: React.FC<RecentUploadsSectionProps> = ({
  syncedChannel,
  onSelectVideoForIngest,
  onOpenSyncModal,
  onOpenClipper,
}) => {
  const {
    user,
    youtubeToken,
    userChannels,
    isLoadingChannels,
    signInWithGoogle,
    refreshYouTubeChannels,
    isAuthLoading,
  } = useAuth();

  const [uploads, setUploads] = useState<RealYouTubeVideo[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Active channel display name and handle
  const channelHandle =
    (userChannels && userChannels.length > 0 && userChannels[0].customUrl) ||
    syncedChannel?.profile.handle ||
    (user?.email ? `@${user.email.split("@")[0]}` : "@iconicbeatsmusicstudios");

  const channelTitle =
    (userChannels && userChannels.length > 0 && userChannels[0].title) ||
    syncedChannel?.profile.title ||
    user?.displayName ||
    "Iconic Beats Music Studios";

  const channelAvatar =
    (userChannels && userChannels.length > 0 && userChannels[0].avatarUrl) ||
    syncedChannel?.profile.avatarUrl ||
    user?.photoURL ||
    "https://yt3.googleusercontent.com/OaavXSLHea9EVQ7E3drNrYbc2PoeI8ChICe88cyWNBiyOxeE3af-7H_vnQkOBiaRwvjnHs2Mog=s900-c-k-c0x00ffffff-no-rj";

  const channelSubCount =
    (userChannels && userChannels.length > 0 && userChannels[0].subscriberCount) ||
    syncedChannel?.profile.subscriberCount ||
    "392 subscribers";

  const channelVideoCount =
    (userChannels && userChannels.length > 0 && userChannels[0].videoCount) ||
    syncedChannel?.profile.videoCount ||
    "322 videos";

  const loadRealUploads = useCallback(async () => {
    setIsLoadingUploads(true);
    setFetchError(null);

    try {
      // 1. If user is signed in and has Google OAuth token and uploads playlist
      if (youtubeToken && userChannels && userChannels.length > 0 && userChannels[0].uploadsPlaylistId) {
        try {
          const vids = await fetchMyUploadedVideos(youtubeToken, userChannels[0].uploadsPlaylistId, 12);
          if (vids && vids.length > 0) {
            setUploads(vids);
            setIsLoadingUploads(false);
            return;
          }
        } catch (apiErr: any) {
          console.warn("YouTube API playlist fetch failed, trying backend scraper:", apiErr);
        }
      }

      // 2. If syncedChannel already has real recentUploads attached
      if (syncedChannel?.recentUploads && Array.isArray(syncedChannel.recentUploads) && syncedChannel.recentUploads.length > 0) {
        setUploads(
          syncedChannel.recentUploads.map((u) => ({
            id: u.id || u.videoId || "",
            videoId: u.videoId || u.id || "",
            title: u.title,
            description: u.description || "",
            thumbnailUrl: u.thumbnailUrl,
            publishedAt: u.publishedAt || "",
            watchUrl: u.watchUrl || `https://www.youtube.com/watch?v=${u.videoId || u.id}`,
          }))
        );
        setIsLoadingUploads(false);
        return;
      }

      // 3. Ingest real uploads directly via real YouTube scraper endpoint
      const targetIdentifier =
        syncedChannel?.profile?.handle ||
        (userChannels && userChannels.length > 0 ? userChannels[0].customUrl : "") ||
        "@iconicbeatsmusicstudios";

      const res = await fetch("/api/youtube/channel/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelInput: targetIdentifier }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.uploads && Array.isArray(data.uploads) && data.uploads.length > 0) {
          setUploads(data.uploads);
          setIsLoadingUploads(false);
          return;
        }
      }

      // If no uploads found
      setUploads([]);
    } catch (err: any) {
      console.error("Error fetching live YouTube uploads:", err);
      setFetchError(err.message || "Failed to fetch live uploads");
      setUploads([]);
    } finally {
      setIsLoadingUploads(false);
    }
  }, [youtubeToken, userChannels, syncedChannel]);

  useEffect(() => {
    loadRealUploads();
  }, [loadRealUploads]);

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 px-4 space-y-4">
      {/* Channel Header & Sync Status Banner */}
      <div className="p-4 sm:p-5 rounded-3xl gold-segment-box shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={channelAvatar}
              alt={channelTitle}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white font-['Outfit'] flex items-center gap-1.5">
                {channelTitle}
                <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                {user ? "Google Account Sync" : "Grounded YouTube Sync"}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap font-medium">
              <span className="text-amber-300 font-bold">{channelHandle}</span>
              <span>•</span>
              <span>{channelSubCount}</span>
              <span>•</span>
              <span>{channelVideoCount}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!user && (
            <button
              onClick={() => {
                signInWithGoogle().catch(() => {});
              }}
              disabled={isAuthLoading}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:opacity-95 text-slate-950 font-black text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5 active:scale-95 shrink-0 border border-amber-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign in with your Google account for personal YouTube synchronization"
            >
              {isAuthLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5" />
              )}
              <span>{isAuthLoading ? "Connecting..." : "Connect Google"}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (user) refreshYouTubeChannels();
              loadRealUploads();
            }}
            disabled={isLoadingChannels || isLoadingUploads}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-black/40 border border-amber-400/30 text-slate-200 hover:text-amber-200 hover:bg-black/60 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 backdrop-blur-md"
            title="Refresh uploads live from YouTube"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isLoadingChannels || isLoadingUploads ? "animate-spin text-amber-300" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh Uploads</span>
          </button>

          <button
            onClick={onOpenSyncModal}
            className="px-3 py-2 rounded-xl bg-black/40 border border-amber-400/30 text-slate-200 hover:text-amber-200 hover:bg-black/60 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 backdrop-blur-md"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Switch Channel</span>
          </button>
        </div>
      </div>

      {/* Uploads Heading */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-200">
            Real Ingested Channel Uploads ({uploads.length} Verified Videos)
          </h4>
        </div>
        <span className="text-[11px] text-slate-300 font-medium">
          Click any upload to instantly generate 7-platform viral packages
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoadingUploads && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="gold-segment-box rounded-2xl p-3 space-y-3 animate-pulse"
            >
              <div className="aspect-video bg-black/40 rounded-xl border border-amber-400/20" />
              <div className="h-3.5 bg-black/50 rounded w-5/6" />
              <div className="h-3 bg-black/40 rounded w-2/3" />
              <div className="h-8 bg-amber-500/10 rounded-xl mt-2 border border-amber-400/20" />
            </div>
          ))}
        </div>
      )}

      {/* No uploads found empty state */}
      {!isLoadingUploads && uploads.length === 0 && (
        <div className="p-8 rounded-2xl gold-segment-box text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
            <Video className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No Uploads Ingested Yet</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {fetchError ||
              "Could not find public video uploads on this channel handle. Click Refresh or switch to your active Google account."}
          </p>
          <button
            onClick={loadRealUploads}
            className="px-4 py-2 rounded-xl bg-black/40 border border-amber-400/40 hover:bg-black/60 text-xs font-bold text-amber-200 transition-colors"
          >
            Retry Live Fetch
          </button>
        </div>
      )}

      {/* Grid of Real Uploads */}
      {!isLoadingUploads && Array.isArray(uploads) && uploads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(uploads || []).slice(0, 8).map((video) => (
            <div
              key={video.id || video.videoId}
              className="group relative overflow-hidden gold-segment-box hover:border-amber-300 rounded-2xl p-3 shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-amber-400/30">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white">
                    <span className="px-1.5 py-0.5 rounded bg-black/80 border border-amber-400/30 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-300" />
                      {video.publishedAt && video.publishedAt.includes("-")
                        ? new Date(video.publishedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : video.publishedAt || "Uploaded"}
                    </span>
                    <a
                      href={video.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-black/80 hover:bg-red-600/80 text-white transition-colors border border-amber-400/30"
                      title="Watch on YouTube"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Title & Info */}
                <h4
                  className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors"
                  title={video.title}
                >
                  {video.title}
                </h4>
              </div>

              {/* Action Buttons: 1-Click Ingest & Iconic Clipper */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => onSelectVideoForIngest(video.watchUrl, video.title)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:opacity-90 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>1-Click Ingest & Distribute</span>
                </button>

                {onOpenClipper && (
                  <button
                    onClick={() => onOpenClipper(video.watchUrl, video.title)}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-amber-300 text-slate-200 font-bold text-xs transition-all border border-slate-700/80 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    <span>Iconic Clipper (Shorts)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

