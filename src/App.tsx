import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Layers,
  Flame,
  Shield,
  ArrowRight,
  Download,
  Share2,
  Tv,
  CheckCircle2,
  SendHorizontal,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  MessageSquare,
  Ghost,
  Linkedin,
  Cloud,
  Activity,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroIngestor } from "./components/HeroIngestor";
import { ProcessingVisualizer } from "./components/ProcessingVisualizer";
import { VideoWorkspace } from "./components/VideoWorkspace";
import { MindstormPanel } from "./components/MindstormPanel";
import { PlatformPackagesPanel } from "./components/PlatformPackagesPanel";
import { CustomEndpointsModal } from "./components/CustomEndpointsModal";
import { ExportModal } from "./components/ExportModal";
import { HistoryModal } from "./components/HistoryModal";
import { ChannelSyncModal } from "./components/ChannelSyncModal";
import { ChannelIntelligenceBanner } from "./components/ChannelIntelligenceBanner";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { RecentUploadsSection } from "./components/RecentUploadsSection";
import { IconicClipperModal } from "./components/IconicClipperModal";
import { AssetLoggerPanel } from "./components/AssetLoggerPanel";
import {
  DistributionData,
  YouTubeVideoInfo,
  CustomEndpoint,
  IngestionHistoryItem,
  ChannelIntelligenceData,
} from "./types";
import { SAMPLE_VIDEOS } from "./lib/sampleVideos";
import { PRESET_CHANNELS, createChannelIntelligenceFromGoogleUser, DEFAULT_GENERIC_CHANNEL } from "./lib/sampleChannels";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import {
  saveHistoryItemToFirestore,
  deleteHistoryItemFromFirestore,
  clearHistoryInFirestore,
  subscribeToUserHistory,
  saveEndpointsToFirestore,
  subscribeToUserEndpoints,
  saveChannelToFirestore,
  subscribeToUserChannels,
  saveUserSettingsToFirestore,
  getUserSettingsFromFirestore,
} from "./lib/firestoreService";

const STORAGE_KEY_HISTORY = "evolution_studio_history_v1";
const STORAGE_KEY_ENDPOINTS = "evolution_studio_endpoints_v1";
const STORAGE_KEY_CHANNEL = "evolution_studio_channel_v1";
const STORAGE_KEY_TURBO = "evolution_studio_turbo_v1";

function MainStudio() {
  const { user, youtubeToken } = useAuth();

  const [currentVideo, setCurrentVideo] = useState<YouTubeVideoInfo | null>(null);
  const [currentData, setCurrentData] = useState<DistributionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<"platforms" | "mindstorm">("platforms");

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEndpointsOpen, setIsEndpointsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isClipperOpen, setIsClipperOpen] = useState(false);
  const [clipperVideoUrl, setClipperVideoUrl] = useState<string>("");
  const [clipperVideoTitle, setClipperVideoTitle] = useState<string>("");
  const [isAssetLoggerOpen, setIsAssetLoggerOpen] = useState(false);

  // Channel Intelligence & Turbo State
  const [syncedChannel, setSyncedChannel] = useState<ChannelIntelligenceData | null>(null);
  const [isTurboActive, setIsTurboActive] = useState<boolean>(true);

  // Persistence (History, Endpoints, Toasts)
  const [history, setHistory] = useState<IngestionHistoryItem[]>([]);
  const [endpoints, setEndpoints] = useState<CustomEndpoint[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Initial Local Storage Load
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedEndpoints = localStorage.getItem(STORAGE_KEY_ENDPOINTS);
      if (savedEndpoints) {
        setEndpoints(JSON.parse(savedEndpoints));
      } else {
        const defaultEndpoints: CustomEndpoint[] = [
          {
            id: "ep-webhook-default",
            name: "Zapier / Make Social Buffer Webhook",
            url: "https://httpbin.org/post",
            method: "POST",
            enabled: true,
            notes: "Test endpoint verifying 1-click webhook payload transmission",
          },
        ];
        setEndpoints(defaultEndpoints);
        localStorage.setItem(STORAGE_KEY_ENDPOINTS, JSON.stringify(defaultEndpoints));
      }
      const savedChannel = localStorage.getItem(STORAGE_KEY_CHANNEL);
      if (savedChannel) {
        try {
          const parsed = JSON.parse(savedChannel);
          // If previous session had hardcoded PewDiePie, upgrade to generic/user channel
          if (parsed?.profile?.handle === "@PewDiePie") {
            setSyncedChannel(DEFAULT_GENERIC_CHANNEL);
          } else {
            setSyncedChannel(parsed);
          }
        } catch {
          setSyncedChannel(DEFAULT_GENERIC_CHANNEL);
        }
      } else {
        setSyncedChannel(DEFAULT_GENERIC_CHANNEL);
      }
      const savedTurbo = localStorage.getItem(STORAGE_KEY_TURBO);
      if (savedTurbo !== null) {
        setIsTurboActive(savedTurbo === "true");
      }
    } catch (e) {
      console.warn("Local storage read error", e);
    }
  }, []);

  // Auto-engage authenticated Google user with channel intelligence
  useEffect(() => {
    if (user) {
      setSyncedChannel((prev) => {
        if (
          !prev ||
          prev.profile.handle === "@PewDiePie" ||
          prev.profile.handle === "@EvolutionStudio" ||
          prev.profile.handle.startsWith("@UC_")
        ) {
          const userChan = createChannelIntelligenceFromGoogleUser(
            user.displayName,
            user.email,
            user.photoURL
          );
          localStorage.setItem(STORAGE_KEY_CHANNEL, JSON.stringify(userChan));
          return userChan;
        }
        return prev;
      });
    }
  }, [user]);

  // 2. Real-time Firestore Cloud Sync when Signed In
  useEffect(() => {
    if (!user) return;

    // A. Subscribe to Cloud History
    const unsubHistory = subscribeToUserHistory(user.uid, (cloudHistory) => {
      if (cloudHistory && cloudHistory.length > 0) {
        setHistory(cloudHistory);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(cloudHistory));
      } else {
        // If cloud history is empty but local has items, migrate local history to Firestore
        const localSaved = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (localSaved) {
          try {
            const parsed: IngestionHistoryItem[] = JSON.parse(localSaved);
            parsed.forEach((item) => saveHistoryItemToFirestore(user.uid, item));
          } catch (err) {
            console.warn("Migration error:", err);
          }
        }
      }
    });

    // B. Subscribe to Cloud Endpoints
    const unsubEndpoints = subscribeToUserEndpoints(user.uid, (cloudEndpoints) => {
      if (cloudEndpoints && cloudEndpoints.length > 0) {
        setEndpoints(cloudEndpoints);
        localStorage.setItem(STORAGE_KEY_ENDPOINTS, JSON.stringify(cloudEndpoints));
      }
    });

    // C. Subscribe to Cloud Channels
    const unsubChannels = subscribeToUserChannels(user.uid, (cloudChannels) => {
      if (cloudChannels && cloudChannels.length > 0) {
        setSyncedChannel(cloudChannels[0]);
        localStorage.setItem(STORAGE_KEY_CHANNEL, JSON.stringify(cloudChannels[0]));
      }
    });

    // D. Load User Settings
    getUserSettingsFromFirestore(user.uid).then((settings) => {
      if (settings?.isTurboActive !== undefined) {
        setIsTurboActive(settings.isTurboActive);
      }
    });

    return () => {
      unsubHistory();
      unsubEndpoints();
      unsubChannels();
    };
  }, [user]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: "toast-" + Date.now() + Math.random(),
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Main YouTube Ingestion & Turbo Distribution Handler
  const handleIngest = async (params: {
    url: string;
    targetNiche: string;
    tone: string;
    notes: string;
    customTitle?: string;
  }) => {
    setIsLoading(true);
    try {
      // 1. Fetch YouTube video metadata via server endpoint
      const infoRes = await fetch("/api/youtube/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: params.url }),
      });

      if (!infoRes.ok) {
        const errJson = await infoRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to retrieve YouTube video metadata.");
      }

      const videoInfo: YouTubeVideoInfo = await infoRes.json();
      if (params.customTitle) {
        videoInfo.title = params.customTitle;
      }
      setCurrentVideo(videoInfo);

      // 2. Generate comprehensive distribution package & Mindstorm Matrix with Gemini AI
      const genRes = await fetch("/api/distribute/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoInfo.standardWatchUrl,
          videoTitle: videoInfo.title,
          authorName: videoInfo.author,
          originalDescription: videoInfo.originalDescription || "",
          originalKeywords: videoInfo.originalKeywords || [],
          userNotes: params.notes,
          targetNiche: params.targetNiche,
          tone: params.tone,
          channelIntelligence: syncedChannel,
          channelCatalog: syncedChannel?.recentUploads || [],
          turboCharged: isTurboActive,
        }),
      });

      if (!genRes.ok) {
        const errJson = await genRes.json().catch(() => ({}));
        throw new Error(
          errJson.error || "Failed to generate distribution package with Gemini AI."
        );
      }

      const genData = await genRes.json();
      const distributionPackage: DistributionData = genData.data;
      setCurrentData(distributionPackage);

      // 3. Save to history (Local + Firestore if logged in)
      const historyItem: IngestionHistoryItem = {
        id: "hist-" + Date.now(),
        video: videoInfo,
        data: distributionPackage,
        timestamp: new Date().toISOString(),
        targetNiche: params.targetNiche,
        tone: params.tone,
        syncedChannelHandle: syncedChannel?.profile.handle,
        turboCharged: isTurboActive,
      };

      const updatedHistory = [historyItem, ...history.filter((h) => h.video.videoId !== videoInfo.videoId).slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

      if (user) {
        await saveHistoryItemToFirestore(user.uid, historyItem);
      }

      addToast(
        "success",
        "Viral Distribution Fleet Generated!",
        "YouTube SEO, Facebook, X, Instagram, TikTok, Reddit, Snapchat packages & Mindstorm Matrix ready."
      );
    } catch (err: any) {
      console.error("Ingestion failed:", err);
      addToast(
        "error",
        "Ingestion Generation Error",
        err.message || "Please verify your YouTube link and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch to custom endpoint
  const handleDispatchEndpoint = async (endpoint: CustomEndpoint, payload: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-endpoints/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, payload }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(
          "success",
          `Dispatched to ${endpoint.name}`,
          `HTTP ${data.statusCode} - 1-Click auto-post successful!`
        );

        // Update endpoint last dispatch
        const updated = endpoints.map((e) =>
          e.id === endpoint.id
            ? {
                ...e,
                lastDispatch: {
                  success: true,
                  timestamp: new Date().toISOString(),
                  statusCode: data.statusCode,
                },
              }
            : e
        );
        setEndpoints(updated);
        localStorage.setItem(STORAGE_KEY_ENDPOINTS, JSON.stringify(updated));

        if (user) {
          await saveEndpointsToFirestore(user.uid, updated);
        }
        return true;
      } else {
        throw new Error(data.error || `HTTP ${data.statusCode}`);
      }
    } catch (err: any) {
      addToast(
        "error",
        `Dispatch Failed for ${endpoint.name}`,
        err.message || "Failed to reach endpoint."
      );
      return false;
    }
  };

  const handleTestPingEndpoint = async (endpoint: CustomEndpoint) => {
    const res = await fetch("/api/custom-endpoints/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint,
        payload: {
          testPing: true,
          message: "Evolution Studio Live Connection Test",
          timestamp: new Date().toISOString(),
        },
      }),
    });
    const data = await res.json();
    return {
      success: data.success,
      status: data.statusCode || res.status,
      data: data.data,
      error: data.error,
    };
  };

  const handleSaveEndpoints = (updated: CustomEndpoint[]) => {
    setEndpoints(updated);
    localStorage.setItem(STORAGE_KEY_ENDPOINTS, JSON.stringify(updated));
    if (user) {
      saveEndpointsToFirestore(user.uid, updated);
    }
    addToast("info", "Custom Endpoints Updated", `${updated.length} endpoints saved.`);
  };

  const handleClearHistory = async () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    if (user) {
      await clearHistoryInFirestore(user.uid);
    }
    addToast("info", "History Cleared", "Saved campaigns removed.");
  };

  const handleDeleteHistoryItem = async (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    if (user) {
      await deleteHistoryItemFromFirestore(user.uid, id);
    }
  };

  const handleSelectHistoryItem = (item: IngestionHistoryItem) => {
    setCurrentVideo(item.video);
    setCurrentData(item.data);
    addToast("success", "Campaign Restored", item.video.title);
  };

  const handleSelectChannel = (channel: ChannelIntelligenceData) => {
    setSyncedChannel(channel);
    localStorage.setItem(STORAGE_KEY_CHANNEL, JSON.stringify(channel));
    if (user) {
      saveChannelToFirestore(user.uid, channel);
    }
    addToast("success", "Channel Synced", `${channel.profile.title} (${channel.profile.handle})`);
  };

  const handleToggleTurbo = (val: boolean) => {
    setIsTurboActive(val);
    localStorage.setItem(STORAGE_KEY_TURBO, String(val));
    if (user) {
      saveUserSettingsToFirestore(user.uid, { isTurboActive: val });
    }
    addToast(
      "info",
      val ? "Sledgehammer Turbo Active" : "Turbo Mode Disabled",
      val
        ? "Knowledge Graph entities & working hooks will boost all platforms."
        : "Standard distribution generation model active."
    );
  };

  const handleReset = () => {
    setCurrentVideo(null);
    setCurrentData(null);
  };

  const handleOpenClipper = (url?: string, title?: string) => {
    setClipperVideoUrl(url || currentVideo?.standardWatchUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    setClipperVideoTitle(title || currentVideo?.title || "Iconic Studio Production");
    setIsClipperOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#040509] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      {/* High-Fidelity Public Background Image with Brilliant Shine-Through */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-95 transition-opacity duration-700 scale-[1.01]"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/d/18ouUbA3TvBTjioQcYx7gqLYMNXcGGPk1')`,
        }}
      />

      {/* Sparkling Gold & Diamond Encrusted Ambient Overlay & Radiance Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft dark vignette to ensure perfect text contrast while letting diamond lettering shine brilliantly */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50 backdrop-contrast-[1.08] backdrop-brightness-[1.02]" />

        {/* Shimmering Gold & Crystal Radiance Beams */}
        <div className="absolute -top-20 left-1/4 w-[800px] h-[600px] bg-gradient-to-br from-amber-400/20 via-yellow-300/10 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[700px] h-[600px] bg-gradient-to-bl from-yellow-500/15 via-amber-300/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-yellow-400/10 to-transparent blur-[130px]" />

        {/* Sparkling Gold & Diamond Glint Light Flares */}
        <div className="absolute top-[12%] left-[18%] w-3 h-3 bg-white rounded-full blur-[1px] shadow-[0_0_15px_4px_rgba(255,255,255,0.9),0_0_30px_8px_rgba(251,191,36,0.8)] animate-diamond-glint" />
        <div className="absolute top-[28%] right-[22%] w-2.5 h-2.5 bg-amber-200 rounded-full blur-[1px] shadow-[0_0_14px_3px_rgba(251,191,36,0.9),0_0_28px_6px_rgba(245,158,11,0.7)] animate-diamond-glint [animation-delay:1.2s]" />
        <div className="absolute top-[55%] left-[8%] w-3.5 h-3.5 bg-white rounded-full blur-[1px] shadow-[0_0_18px_4px_rgba(255,255,255,0.95),0_0_35px_10px_rgba(251,191,36,0.85)] animate-diamond-glint [animation-delay:0.6s]" />
        <div className="absolute top-[72%] right-[12%] w-3 h-3 bg-amber-100 rounded-full blur-[1px] shadow-[0_0_16px_4px_rgba(254,240,138,0.9),0_0_32px_8px_rgba(245,158,11,0.75)] animate-diamond-glint [animation-delay:1.8s]" />
        <div className="absolute top-[88%] left-[30%] w-2.5 h-2.5 bg-white rounded-full blur-[1px] shadow-[0_0_12px_3px_rgba(255,255,255,0.85),0_0_24px_6px_rgba(251,191,36,0.7)] animate-diamond-glint [animation-delay:2.4s]" />
      </div>

      {/* Fixed Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Top Navigation */}
      <Navbar
        hasData={Boolean(currentData && currentVideo)}
        historyCount={history.length}
        endpointsCount={endpoints.length}
        syncedChannel={syncedChannel}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEndpoints={() => setIsEndpointsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onReset={handleReset}
        onSelectSample={() => {
          const sample = SAMPLE_VIDEOS[0];
          handleIngest({
            url: sample.url,
            targetNiche: sample.category,
            tone: sample.tone,
            notes: sample.notes,
            customTitle: sample.title,
          });
        }}
        onOpenClipper={() => handleOpenClipper()}
        onOpenAssetLogger={() => setIsAssetLoggerOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Active Channel DNA & Knowledge Graph Intelligence Banner */}
        <ChannelIntelligenceBanner
          channel={syncedChannel}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          isTurboActive={isTurboActive}
          onToggleTurbo={handleToggleTurbo}
        />

        {/* Loading HUD Visualizer */}
        {isLoading && <ProcessingVisualizer currentStage="Processing" />}

        {/* If no video has been processed yet, display the full Hero Ingestor & Architecture Features */}
        {!isLoading && !currentData && (
          <div className="space-y-12">
            <HeroIngestor
              onIngest={handleIngest}
              isLoading={isLoading}
              onOpenClipper={(url, title) => handleOpenClipper(url, title)}
            />

            {/* Recent Uploads Section (Visual Channel Sync Engagement & 1-Click Ingest) */}
            <RecentUploadsSection
              syncedChannel={syncedChannel}
              onSelectVideoForIngest={(url, title) => {
                handleIngest({
                  url,
                  targetNiche: syncedChannel?.profile.nicheCategory || "Digital Media & High-Velocity Content Systems",
                  tone: "High Conversion / Direct & Punchy",
                  notes: "Ingested directly from recent channel uploads",
                  customTitle: title,
                });
              }}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onOpenClipper={(url, title) => handleOpenClipper(url, title)}
            />

            {/* Architecture Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-amber-500/30">
              <div className="p-6 rounded-3xl gold-segment-box hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.35)] transition-all space-y-3.5 group">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                  <span>Mindstorm Neural Stack</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-diamond-glint" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Dual-engine computing model analyzing algorithmic retention, multi-angle viral hooks, psychology triggers, and 60s micro-clips with exact timestamps.
                </p>
              </div>

              <div className="p-6 rounded-3xl gold-segment-box hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.35)] transition-all space-y-3.5 group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-400/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Share2 className="w-5 h-5 text-amber-300" />
                </div>
                <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                  <span>Multi-Platform Native Fleet</span>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-diamond-glint [animation-delay:0.5s]" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Tailored distribution packages for <strong className="text-amber-200">Facebook, X, Instagram, TikTok, Reddit, Snapchat, LinkedIn</strong> crafted for each network's algorithmic nuances.
                </p>
              </div>

              <div className="p-6 rounded-3xl gold-segment-box hover:border-amber-400 hover:shadow-[0_0_35px_rgba(251,191,36,0.35)] transition-all space-y-3.5 group">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <SendHorizontal className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                  <span>1-Click Auto-Post & Webhooks</span>
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-diamond-glint [animation-delay:1s]" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Direct platform web launch with 1-click clipboard copying or connect custom REST API endpoints & Zapier/Make webhooks to auto-publish instantly.
                </p>
              </div>
            </div>

            {/* Supported Platforms Banner */}
            <div className="p-6 rounded-3xl gold-segment-box text-center space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Turn 1 YouTube Link Into 8 Native High-Conversion Formats</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-200 text-xs font-bold">
                <span className="flex items-center gap-2 text-red-400 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  <Youtube className="w-4 h-4" /> YouTube SEO
                </span>
                <span className="flex items-center gap-2 text-blue-400 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                  <Facebook className="w-4 h-4" /> Facebook
                </span>
                <span className="flex items-center gap-2 text-slate-100 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  <Twitter className="w-4 h-4" /> X / Twitter
                </span>
                <span className="flex items-center gap-2 text-pink-400 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]">
                  <Instagram className="w-4 h-4" /> Instagram Reels
                </span>
                <span className="flex items-center gap-2 text-teal-300 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(94,234,212,0.5)]">
                  <Flame className="w-4 h-4" /> TikTok
                </span>
                <span className="flex items-center gap-2 text-orange-400 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
                  <MessageSquare className="w-4 h-4" /> Reddit
                </span>
                <span className="flex items-center gap-2 text-yellow-300 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]">
                  <Ghost className="w-4 h-4" /> Snapchat
                </span>
                <span className="flex items-center gap-2 text-sky-400 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </span>
              </div>
            </div>
          </div>
        )}

        {/* When video and packages are ready, render the Full Distribution Workspace */}
        {!isLoading && currentVideo && currentData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Embedded Responsive YouTube Player & Video Summary Header */}
            <VideoWorkspace
              video={currentVideo}
              onCopyLink={() => addToast("success", "Video Link Copied", currentVideo.standardWatchUrl)}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenClipper={(url, title) => handleOpenClipper(url, title)}
            />

            {/* Mode Switcher Navigation */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 bg-[#090b14]/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setActiveViewMode("platforms")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    activeViewMode === "platforms"
                      ? "bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] font-extrabold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Multi-Platform Distribution Fleet</span>
                </button>

                <button
                  onClick={() => setActiveViewMode("mindstorm")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    activeViewMode === "mindstorm"
                      ? "bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] font-extrabold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Mindstorm Neural Matrix</span>
                </button>
              </div>

              <button
                onClick={() => setIsExportOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-[#0c0d16] hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-amber-500/40 transition-all shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Campaign Package</span>
              </button>
            </div>

            {/* View Panels */}
            {activeViewMode === "platforms" ? (
              <PlatformPackagesPanel
                video={currentVideo}
                data={currentData}
                customEndpoints={endpoints}
                syncedChannel={syncedChannel}
                isTurboActive={isTurboActive}
                onCopyText={(text, label) => addToast("success", `Copied: ${label}`, "Content in clipboard.")}
                onDispatchEndpoint={handleDispatchEndpoint}
                onOpenEndpointsModal={() => setIsEndpointsOpen(true)}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
                onOpenClipper={(url, title) => handleOpenClipper(url, title)}
                onOpenAssetLogger={() => setIsAssetLoggerOpen(true)}
              />
            ) : (
              <MindstormPanel
                matrix={currentData.mindstormMatrix}
                onCopyText={(text, label) => addToast("success", `Copied: ${label}`, "Hook in clipboard.")}
              />
            )}
          </div>
        )}
      </main>

      {/* Iconic Clipper Studio Modal with 9:16 Transformation & Multi-Platform Distribution */}
      <IconicClipperModal
        isOpen={isClipperOpen}
        onClose={() => setIsClipperOpen(false)}
        videoUrl={clipperVideoUrl}
        videoTitle={clipperVideoTitle}
        channelIntelligence={syncedChannel}
        onOpenAssetLogger={() => {
          setIsClipperOpen(false);
          setIsAssetLoggerOpen(true);
        }}
      />

      {/* Pushed Asset Audit Dashboard & Performance Modal */}
      {isAssetLoggerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#090b14] border border-slate-800 rounded-3xl p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-['Outfit']">
                    Pushed Asset Audit Dashboard & Real-Time Performance Tracker
                  </h2>
                  <p className="text-xs text-slate-400">
                    Google-grounded verification of pushed SEO metadata, Shorts, and Thumbnails on YouTube
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssetLoggerOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold px-3 py-1.5"
              >
                Close Dashboard ✕
              </button>
            </div>
            <AssetLoggerPanel channelHandle={syncedChannel?.profile?.handle || "@iconicbeatsmusicstudios"} />
          </div>
        </div>
      )}

      {/* Modals */}
      {currentVideo && currentData && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          video={currentVideo}
          data={currentData}
          onCopySuccess={(label) => addToast("success", "Export Ready", label)}
        />
      )}

      <CustomEndpointsModal
        isOpen={isEndpointsOpen}
        onClose={() => setIsEndpointsOpen(false)}
        endpoints={endpoints}
        onSaveEndpoints={handleSaveEndpoints}
        onTestPing={handleTestPingEndpoint}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      <ChannelSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncedChannel={syncedChannel}
        onSelectChannel={handleSelectChannel}
        onCopyText={(text, label) => addToast("success", `Copied: ${label}`, "Content in clipboard.")}
        isTurboActive={isTurboActive}
        onToggleTurbo={handleToggleTurbo}
        onSelectVideoForIngest={(url, title) => {
          handleIngest({
            url,
            targetNiche: syncedChannel?.profile.nicheCategory || "Creator Content",
            tone: "High Conversion / Direct & Punchy",
            notes: "Ingested directly from connected YouTube Channel",
            customTitle: title,
          });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStudio />
    </AuthProvider>
  );
}
