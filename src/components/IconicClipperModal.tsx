import React, { useState, useEffect, useRef } from "react";
import {
  Scissors,
  Zap,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  Copy,
  UploadCloud,
  ChevronRight,
  RefreshCw,
  Flame,
  Volume2,
  VolumeX,
  Layers,
  Sliders,
  Maximize2,
  Film,
  Tv,
  ArrowRight,
  TrendingUp,
  X,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Eye,
  Shuffle,
  Clock,
  Type,
  Music,
  SlidersHorizontal,
  Wand2,
  Send,
  HelpCircle,
  Video,
  Key,
  Share2,
  Settings,
  Edit3,
} from "lucide-react";
import {
  IconicClipperPackage,
  ShortsVariation,
  ShortsTransitionType,
  ShortsVisualEffectType,
  CaptionFontFamily,
  CaptionAnimationStyle,
  CaptionPosition,
  ShortsClipSegment,
  ChannelIntelligenceData,
  PushedAssetRecord,
} from "../types";
import { useAuth } from "../lib/AuthContext";
import { updateYouTubeVideoMetadata } from "../lib/youtubeApi";
import { savePushedAssetToFirestore } from "../lib/firestoreService";
import { PlatformApiGuideModal } from "./PlatformApiGuideModal";
import { trackAndLogContentTransformation } from "../lib/trackingEngine";

interface IconicClipperModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle?: string;
  channelIntelligence?: ChannelIntelligenceData | null;
  onOpenAssetLogger?: () => void;
}

const TRANSITIONS: { id: ShortsTransitionType; label: string; icon: string; desc: string }[] = [
  { id: "whip_pan_right", label: "Whip Pan Right", icon: "⏩", desc: "High-speed directional whip cut" },
  { id: "whip_pan_left", label: "Whip Pan Left", icon: "⏪", desc: "Counter-rotational motion blur" },
  { id: "glitch_cut", label: "Glitch Jump Cut", icon: "⚡", desc: "Digital chromatic RGB split" },
  { id: "zoom_punch", label: "Hyper Zoom Punch", icon: "🔍", desc: "Instant 1.4x scale crash zoom" },
  { id: "flash_fade", label: "Flash Fade Black", icon: "💥", desc: "Optical exposure flash & deep black" },
  { id: "beat_drop_slice", label: "Beat-Drop 808 Slice", icon: "🥁", desc: "Transient-synced hard kick splice" },
  { id: "vhs_tear", label: "Analog VHS Tear", icon: "📼", desc: "Vintage tape tracking scanline" },
  { id: "cross_dissolve", label: "Cross Dissolve", icon: "✨", desc: "Smooth cinematic blend" },
  { id: "lens_flare", label: "Anamorphic Lens Flare", icon: "🌟", desc: "High-contrast golden streak" },
  { id: "rgb_split", label: "RGB Prism Split", icon: "🌈", desc: "Prismatic color separation" },
];

const VISUAL_EFFECTS: { id: ShortsVisualEffectType; label: string; icon: string }[] = [
  { id: "none", label: "Clean / Raw", icon: "🚫" },
  { id: "diamond_glints", label: "Diamond Glints & Sparkles", icon: "💎" },
  { id: "crt_scanlines", label: "Vintage CRT Scanlines", icon: "📺" },
  { id: "bass_pulse", label: "Dynamic Bass Pulse", icon: "🔊" },
  { id: "film_grain", label: "35mm Film Grain", icon: "🎞️" },
  { id: "cyber_neon", label: "Cyber Neon Frame", icon: "⚡" },
  { id: "golden_vignette", label: "Golden Luxury Vignette", icon: "👑" },
];

const FONTS: { id: CaptionFontFamily; label: string; fontClass: string }[] = [
  { id: "Impact", label: "Impact (Viral Classic)", fontClass: "font-['Impact']" },
  { id: "Montserrat", label: "Montserrat Black", fontClass: "font-['Montserrat',sans-serif] font-black" },
  { id: "Bebas Neue", label: "Bebas Neue", fontClass: "font-['Bebas_Neue',sans-serif]" },
  { id: "Outfit", label: "Outfit Heavy", fontClass: "font-['Outfit',sans-serif] font-black" },
  { id: "Anton", label: "Anton Poster", fontClass: "font-['Anton',sans-serif]" },
  { id: "Permanent Marker", label: "Permanent Marker", fontClass: "font-['Permanent_Marker',cursive]" },
  { id: "Roboto Mono", label: "Cyber Terminal Mono", fontClass: "font-mono font-bold" },
  { id: "Inter", label: "Inter Modern", fontClass: "font-sans font-bold" },
];

const CAPTION_COLORS = [
  { id: "neon_amber", label: "Neon Amber Gold", bg: "bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]" },
  { id: "cyber_crimson", label: "Cyber Crimson", bg: "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]" },
  { id: "toxic_emerald", label: "Toxic Emerald", bg: "bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.6)]" },
  { id: "diamond_cyan", label: "Electric Diamond Cyan", bg: "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.6)]" },
  { id: "pure_white", label: "Pure Platinum White", bg: "bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.7)]" },
  { id: "purple_haze", label: "Deep Purple Haze", bg: "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)]" },
];

export const IconicClipperModal: React.FC<IconicClipperModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoTitle = "",
  channelIntelligence,
  onOpenAssetLogger,
}) => {
  const { user, youtubeToken } = useAuth();

  // Core Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [clipperData, setClipperData] = useState<IconicClipperPackage | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<"A" | "B" | "C">("A");
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  // Editor View Mode: "quick_post" vs "full_studio"
  const [editorMode, setEditorMode] = useState<"quick_post" | "full_studio">("quick_post");
  const [activePlatformTab, setActivePlatformTab] = useState<"youtube" | "tiktok" | "instagram" | "facebook">("youtube");

  // Customization & Editorial Controls
  const [selectedTransition, setSelectedTransition] = useState<ShortsTransitionType>("whip_pan_right");
  const [transitionSpeedMs, setTransitionSpeedMs] = useState<number>(350);
  const [selectedVisualEffect, setSelectedVisualEffect] = useState<ShortsVisualEffectType>("diamond_glints");
  const [selectedFont, setSelectedFont] = useState<CaptionFontFamily>("Impact");
  const [captionColor, setCaptionColor] = useState<string>("neon_amber");
  const [captionAnimation, setCaptionAnimationStyle] = useState<CaptionAnimationStyle>("karaoke_bounce");
  const [captionPosition, setCaptionPosition] = useState<CaptionPosition>("center");
  const [fontSizePx, setFontSizePx] = useState<number>(18);

  // Video Framing & 9:16 Scale
  const [videoScale, setVideoScale] = useState<number>(1.35);
  const [videoPanX, setVideoPanX] = useState<number>(0);
  const [videoPanY, setVideoPanY] = useState<number>(0);
  const [previewPlatformOverlay, setPreviewPlatformOverlay] = useState<"shorts" | "tiktok" | "instagram" | "facebook">("shorts");

  // Audio Studio State
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(100);
  const [isAudioDuckingEnabled, setIsAudioDuckingEnabled] = useState(true);
  const [selectedSoundFx, setSelectedSoundFx] = useState<string>("heavy_808");

  // Playback Simulation State
  const [isPlayingPreview, setIsPlayingPreview] = useState(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);

  // Modals & Push State
  const [isApiGuideOpen, setIsApiGuideOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ success: boolean; message: string; platform?: string } | null>(null);

  // Extract clean video ID
  const getVideoId = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "d1N9bQ8v1x4";
  };

  const videoId = getVideoId(videoUrl);

  // Fetch or generate Iconic Clipper Package
  const generateClipperPackage = async () => {
    setIsLoading(true);
    setPushStatus(null);
    try {
      const res = await fetch("/api/clipper/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          videoTitle,
          authorName: channelIntelligence?.profile?.title || "@iconicbeatsmusicstudios",
          durationSeconds: 180,
          channelIntelligence,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setClipperData(data.data);
          if (data.data.selectedTransition) {
            setSelectedTransition(data.data.selectedTransition);
          }
          if (data.data.transitionDurationMs) {
            setTransitionSpeedMs(data.data.transitionDurationMs);
          }
          if (data.data.visualEffect) {
            setSelectedVisualEffect(data.data.visualEffect);
          }
        }
      }
    } catch (err) {
      console.error("Error generating Iconic Clipper package:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && videoUrl) {
      generateClipperPackage();
    }
  }, [isOpen, videoUrl]);

  // Preview simulation ticker
  useEffect(() => {
    let interval: any;
    if (isPlayingPreview && clipperData?.segments && clipperData.segments.length > 0) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const currentSeg = clipperData.segments[activeClipIndex];
          const segDuration = currentSeg ? currentSeg.endTime - currentSeg.startTime : 15;
          if (prev >= segDuration) {
            setActiveClipIndex((idx) => (idx + 1) % clipperData.segments.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingPreview, activeClipIndex, clipperData]);

  if (!isOpen) return null;

  const currentVariation: ShortsVariation | undefined =
    clipperData?.variations.find((v) => v.variationId === selectedVariationId) || clipperData?.variations[0];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 1-Click Post to Any Platform (YouTube Shorts, TikTok, Instagram Reels, Facebook Reels)
  const handleOneClickPost = async (platform: "youtube" | "tiktok" | "instagram" | "facebook") => {
    if (!currentVariation) return;

    setIsPushing(true);
    setPushStatus(null);

    const platformMeta = currentVariation.platforms?.[platform];

    try {
      if (platform === "youtube") {
        if (!youtubeToken) {
          // Open YouTube Studio upload with pre-copied title & description
          navigator.clipboard.writeText(
            `${currentVariation.youtubeTitle}\n\n${currentVariation.youtubeDescription}\n\n${currentVariation.suggestedHashtags.join(" ")}`
          );
          setPushStatus({
            success: true,
            platform: "YouTube Shorts",
            message:
              "Shorts Title & SEO Description copied to clipboard! Opening YouTube Studio Studio Uploads in a new window...",
          });
          window.open("https://studio.youtube.com/channel/upload", "_blank");
          setIsPushing(false);
          return;
        }

        // Direct YouTube Data API v3 update
        const updateRes = await updateYouTubeVideoMetadata(youtubeToken, videoId, {
          title: currentVariation.youtubeTitle.slice(0, 100),
          description: currentVariation.youtubeDescription,
          tags: currentVariation.suggestedHashtags.map((h) => h.replace(/^#/, "")),
        });

        if (!updateRes.success) {
          setPushStatus({
            success: false,
            message: updateRes.error || "Failed to push Shorts package to YouTube API.",
          });
          setIsPushing(false);
          return;
        }

        // Log to Performance Monitor & Snapshot Engine
        await trackAndLogContentTransformation({
          userId: user?.uid,
          video: {
            id: videoId,
            title: videoTitle || currentVariation.youtubeTitle,
            description: currentVariation.youtubeDescription,
            tags: currentVariation.suggestedHashtags,
            thumbnailUrl: "",
            viewCount: 160,
            likeCount: 24,
            commentCount: 6,
          } as any,
          actionType: "iconic_shorts_clip",
          platform: "youtube",
          channelHandle: channelIntelligence?.profile?.handle || "@iconicbeatsmusicstudios",
          targetNiche: channelIntelligence?.profile?.nicheCategory,
          channelIntelligence,
          payload: {
            title: currentVariation.youtubeTitle,
            description: currentVariation.youtubeDescription,
            tags: currentVariation.suggestedHashtags,
            shortsVariation: currentVariation,
            aspectRatio: "9:16",
          },
        });

        setPushStatus({
          success: true,
          platform: "YouTube Shorts",
          message: `Success! Variation ${currentVariation.variationId} (${currentVariation.angleName}) is pushed live to YouTube! Logged to Performance Monitor.`,
        });
      } else if (platform === "tiktok") {
        const tiktokMeta = currentVariation.platforms?.tiktok;
        const textToCopy = `${tiktokMeta?.punchyCaption || currentVariation.youtubeTitle}\n\n${currentVariation.suggestedHashtags.join(" ")}`;
        navigator.clipboard.writeText(textToCopy);

        // Track 1-Click Redirect in Performance Monitor
        await trackAndLogContentTransformation({
          userId: user?.uid,
          video: {
            id: videoId,
            title: videoTitle || currentVariation.youtubeTitle,
            description: currentVariation.youtubeDescription,
            tags: currentVariation.suggestedHashtags,
            thumbnailUrl: "",
            viewCount: 160,
            likeCount: 24,
            commentCount: 6,
          } as any,
          actionType: "social_one_click_post",
          platform: "tiktok",
          channelHandle: channelIntelligence?.profile?.handle || "@iconicbeatsmusicstudios",
          targetNiche: channelIntelligence?.profile?.nicheCategory,
          channelIntelligence,
          payload: {
            title: currentVariation.youtubeTitle,
            socialCaption: textToCopy,
            tags: currentVariation.suggestedHashtags,
            shortsVariation: currentVariation,
            aspectRatio: "9:16",
          },
        });

        setPushStatus({
          success: true,
          platform: "TikTok",
          message:
            "TikTok Hook Caption and Search Tags copied to clipboard! Tracked in Performance Monitor. Launching TikTok Creator Studio...",
        });
        window.open("https://www.tiktok.com/creator-center/upload", "_blank");
      } else if (platform === "instagram") {
        const igMeta = currentVariation.platforms?.instagram;
        const textToCopy = `${igMeta?.reelCaption || currentVariation.youtubeDescription}\n\n${(igMeta?.hashtags || currentVariation.suggestedHashtags).join(" ")}`;
        navigator.clipboard.writeText(textToCopy);

        // Track 1-Click Redirect in Performance Monitor
        await trackAndLogContentTransformation({
          userId: user?.uid,
          video: {
            id: videoId,
            title: videoTitle || currentVariation.youtubeTitle,
            description: currentVariation.youtubeDescription,
            tags: currentVariation.suggestedHashtags,
            thumbnailUrl: "",
            viewCount: 160,
            likeCount: 24,
            commentCount: 6,
          } as any,
          actionType: "social_one_click_post",
          platform: "instagram",
          channelHandle: channelIntelligence?.profile?.handle || "@iconicbeatsmusicstudios",
          targetNiche: channelIntelligence?.profile?.nicheCategory,
          channelIntelligence,
          payload: {
            title: currentVariation.youtubeTitle,
            socialCaption: textToCopy,
            tags: igMeta?.hashtags || currentVariation.suggestedHashtags,
            shortsVariation: currentVariation,
            aspectRatio: "9:16",
          },
        });

        // If Web Share API is available (Mobile/Chrome), invoke native share
        if (navigator.share) {
          try {
            await navigator.share({
              title: currentVariation.youtubeTitle,
              text: textToCopy,
              url: videoUrl,
            });
          } catch (e) {
            // fallback
          }
        }

        setPushStatus({
          success: true,
          platform: "Instagram Reels",
          message: "Instagram Reel Caption & Audio Attribution copied! Tracked in Performance Monitor. Launching Instagram...",
        });
        window.open("https://www.instagram.com/", "_blank");
      } else if (platform === "facebook") {
        const fbMeta = currentVariation.platforms?.facebook;
        const textToCopy = `${fbMeta?.headline || currentVariation.youtubeTitle}\n\n${fbMeta?.narrativeStory || ""}\n\n${(fbMeta?.hashtags || currentVariation.suggestedHashtags).join(" ")}`;
        navigator.clipboard.writeText(textToCopy);

        // Track 1-Click Redirect in Performance Monitor
        await trackAndLogContentTransformation({
          userId: user?.uid,
          video: {
            id: videoId,
            title: videoTitle || currentVariation.youtubeTitle,
            description: currentVariation.youtubeDescription,
            tags: currentVariation.suggestedHashtags,
            thumbnailUrl: "",
            viewCount: 160,
            likeCount: 24,
            commentCount: 6,
          } as any,
          actionType: "social_one_click_post",
          platform: "facebook",
          channelHandle: channelIntelligence?.profile?.handle || "@iconicbeatsmusicstudios",
          targetNiche: channelIntelligence?.profile?.nicheCategory,
          channelIntelligence,
          payload: {
            title: currentVariation.youtubeTitle,
            socialCaption: textToCopy,
            tags: fbMeta?.hashtags || currentVariation.suggestedHashtags,
            shortsVariation: currentVariation,
            aspectRatio: "9:16",
          },
        });

        setPushStatus({
          success: true,
          platform: "Facebook Reels",
          message: "Facebook Reel Headline, Story & Discussion Prompt copied! Tracked in Performance Monitor. Launching Facebook...",
        });
        window.open("https://www.facebook.com/reels/create", "_blank");
      }
    } catch (err: any) {
      console.error("1-Click post error:", err);
      setPushStatus({
        success: false,
        message: err.message || `Failed to dispatch to ${platform}.`,
      });
    } finally {
      setIsPushing(false);
    }
  };

  const currentSegment = clipperData?.segments[activeClipIndex] || clipperData?.segments[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl gold-segment-box rounded-3xl shadow-[0_0_70px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Navigation Bar */}
        <div className="p-4 sm:p-5 border-b border-amber-400/30 flex items-center justify-between bg-black/50 backdrop-blur-md flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Scissors className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-['Outfit'] tracking-wide flex items-center gap-2">
                  ICONIC CLIPPER STUDIO
                  <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-200 border border-amber-400/50">
                    9:16 VERTICAL ENGINE
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5 line-clamp-1">
                {videoTitle || `Source Video: ${videoId}`}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Utility Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 1-Click vs Full Studio Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-black/60 border border-slate-800">
              <button
                onClick={() => setEditorMode("quick_post")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  editorMode === "quick_post"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Auto Post</span>
              </button>
              <button
                onClick={() => setEditorMode("full_studio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  editorMode === "full_studio"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Full Editorial Studio</span>
              </button>
            </div>

            {/* API Credentials Setup Guide Trigger */}
            <button
              onClick={() => setIsApiGuideOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-400/30 hover:border-amber-400 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="API Setup & Automation Guide"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">API Setup Guide</span>
            </button>

            <button
              onClick={generateClipperPackage}
              disabled={isLoading}
              className="p-2 rounded-xl bg-black/40 border border-amber-400/30 hover:border-amber-400 text-slate-200 hover:text-amber-200 transition-colors disabled:opacity-50"
              title="Regenerate Grounded Clips"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-300" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/40 border border-transparent hover:border-amber-400/30 hover:bg-black/60 hover:text-white text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4 text-center bg-black/40 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.35)]">
              <Scissors className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white font-['Outfit']">
                Grounding & Synthesizing 9:16 Shorts Packages...
              </h3>
              <p className="text-xs text-slate-300 max-w-md">
                Analyzing acoustic transients, peak energy moments, and Google-grounded CTR psychology hooks for YouTube, TikTok, Instagram & Facebook.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-black/50 backdrop-blur-md">
            {/* Top Row: 9:16 Interactive Smartphone Player + Multi-Platform Control Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 4 Cols: 9:16 Vertical Smartphone Viewport */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] rounded-3xl bg-black border-4 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.2)] relative overflow-hidden flex flex-col justify-between p-3.5 group">
                  {/* Visual Effect Layer */}
                  {selectedVisualEffect === "crt_scanlines" && (
                    <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
                  )}
                  {selectedVisualEffect === "diamond_glints" && (
                    <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent animate-pulse" />
                  )}
                  {selectedVisualEffect === "film_grain" && (
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  )}
                  {selectedVisualEffect === "cyber_neon" && (
                    <div className="absolute inset-0 z-20 pointer-events-none border-2 border-cyan-400/60 shadow-[inset_0_0_20px_rgba(34,211,238,0.4)]" />
                  )}
                  {selectedVisualEffect === "golden_vignette" && (
                    <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_50px_rgba(245,158,11,0.4)]" />
                  )}

                  {/* Scaled & Panned Video Frame */}
                  <div className="absolute inset-0 bg-slate-950 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isAudioMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&start=${currentSegment?.startTime || 0}`}
                      title="Shorts 9:16 Preview"
                      style={{
                        transform: `scale(${videoScale}) translate(${videoPanX}%, ${videoPanY}%)`,
                        transformOrigin: "center center",
                      }}
                      className="w-[190%] h-full -ml-[45%] object-cover opacity-75 pointer-events-none transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
                  </div>

                  {/* Top Bar Header inside Smartphone */}
                  <div className="relative z-30 flex items-center justify-between text-white">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black tracking-wider text-amber-300 border border-amber-400/40">
                      {previewPlatformOverlay.toUpperCase()} 9:16
                    </span>
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[10px] font-mono font-black text-rose-300">
                        {currentVariation?.ctrScore}/10 CTR
                      </span>
                    </div>
                  </div>

                  {/* Dynamic High-Velocity Captions & Hook Overlay in Selected Position */}
                  <div
                    className={`relative z-30 px-2 text-center transition-all ${
                      captionPosition === "top_safe"
                        ? "mt-4"
                        : captionPosition === "upper_third"
                        ? "my-auto -translate-y-8"
                        : captionPosition === "lower_third"
                        ? "mb-16"
                        : "my-auto"
                    }`}
                  >
                    <div
                      style={{ fontSize: `${fontSizePx}px` }}
                      className={`inline-block px-3.5 py-2 rounded-2xl ${
                        CAPTION_COLORS.find((c) => c.id === captionColor)?.bg || "bg-amber-400 text-slate-950"
                      } ${FONTS.find((f) => f.id === selectedFont)?.fontClass || "font-['Impact']"} font-black tracking-wider uppercase transform -rotate-1 ${
                        captionAnimation === "karaoke_bounce"
                          ? "animate-bounce"
                          : captionAnimation === "glow_pulse"
                          ? "animate-pulse"
                          : ""
                      }`}
                    >
                      {currentVariation?.onScreenHookOverlay || "HIGH VELOCITY HOOK 🤯"}
                    </div>
                    <p className="text-[10px] text-white font-bold drop-shadow-lg mt-1.5 px-2 line-clamp-2">
                      {currentVariation?.hookHeadline}
                    </p>
                  </div>

                  {/* Platform-Specific UI Overlay Emulation */}
                  <div className="relative z-30 space-y-2">
                    {/* Platform Actions Side Column Emulation */}
                    <div className="absolute right-0 bottom-16 flex flex-col items-center gap-2.5 text-white text-[9px] font-bold">
                      <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-rose-400">
                        ❤️
                      </div>
                      <span>42.8K</span>
                      <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-cyan-400">
                        💬
                      </div>
                      <span>1.2K</span>
                      <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 flex items-center justify-center text-amber-400">
                        🔗
                      </div>
                      <span>Share</span>
                    </div>

                    {/* Bottom Channel & Title Bar */}
                    <div className="pr-12 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-slate-950">
                          IB
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow">
                          {channelIntelligence?.profile?.handle || "@iconicbeatsmusicstudios"}
                        </span>
                      </div>

                      <p className="text-[10px] font-semibold text-white/95 line-clamp-2 leading-tight drop-shadow">
                        {currentVariation?.youtubeTitle}
                      </p>

                      <div className="flex items-center gap-1 flex-wrap">
                        {currentVariation?.suggestedHashtags.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-[9px] text-amber-300 font-bold">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Playback Scrubber */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                        className="p-1 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300"
                      >
                        {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              (playbackTime / (currentSegment ? currentSegment.endTime - currentSegment.startTime : 15)) * 100
                            )}%`,
                          }}
                          className="h-full bg-amber-400 transition-all duration-300"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {currentSegment?.timestampLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview Platform Switcher Pills */}
                <div className="mt-3 flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-slate-800">
                  {[
                    { id: "shorts", label: "YouTube" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "instagram", label: "Reels" },
                    { id: "facebook", label: "FB" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreviewPlatformOverlay(p.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        previewPlatformOverlay === p.id
                          ? "bg-amber-400 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right 8 Cols: Timeline Clips, Variations, & Platform Packages */}
              <div className="lg:col-span-8 space-y-4">
                {/* User Directives: Slicing Factors & Traffic Conversion Routing */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-cyan-500/15 border border-amber-400/40 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
                        <Scissors className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
                          Universal Slicing Rule: Drops, Breakdowns & Chill Vibes
                        </span>
                        <p className="text-[11px] text-slate-300">
                          Prioritizes beat drops, remix deconstructions, and stream vibes with links to full replays and upcoming sessions.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-auto">
                      Direct Viewer Routing
                    </span>
                  </div>

                  {/* Direct Link Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-300 uppercase block">
                          ▶ Full Video Replay Link
                        </span>
                        <span className="text-[11px] font-mono text-slate-300 truncate block">
                          {clipperData?.fullReplayUrl || videoUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(clipperData?.fullReplayUrl || videoUrl, "replay-url")}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Copy Full Replay URL"
                        >
                          {copiedField === "replay-url" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={clipperData?.fullReplayUrl || videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Open Replay in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-rose-300 uppercase block">
                          🔴 Upcoming Live Stream Sessions
                        </span>
                        <span className="text-[11px] font-mono text-slate-300 truncate block">
                          {clipperData?.upcomingLiveSessionsUrl || "https://www.youtube.com/@iconicbeatsmusicstudios/streams"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              clipperData?.upcomingLiveSessionsUrl ||
                                "https://www.youtube.com/@iconicbeatsmusicstudios/streams",
                              "live-sessions-url"
                            )
                          }
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Copy Live Sessions URL"
                        >
                          {copiedField === "live-sessions-url" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={
                            clipperData?.upcomingLiveSessionsUrl ||
                            "https://www.youtube.com/@iconicbeatsmusicstudios/streams"
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Open Upcoming Streams in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Intelligent Key Moments Timeline */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-['Outfit']">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      Intelligently Detected Key Moments & High Velocity Clips
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {clipperData?.detectedArchetype || "High-Energy Drop Showcase"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {clipperData?.segments.map((segment, idx) => {
                      const isActive = activeClipIndex === idx;
                      return (
                        <div
                          key={segment.id}
                          onClick={() => {
                            setActiveClipIndex(idx);
                            setPlaybackTime(0);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                            isActive
                              ? "bg-amber-500/15 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                isActive ? "bg-amber-400 text-slate-950 font-black" : "bg-slate-800 text-amber-300"
                              }`}
                            >
                              {segment.timestampLabel}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">CLIP 0{idx + 1}</span>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-1">{segment.label}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{segment.keyMoment}</p>

                          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-cyan-400" />
                              Sync Cue
                            </span>
                            <span className="text-slate-400 line-clamp-1">{segment.audioSyncCue}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Variation Selector Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-['Outfit']">
                      <Flame className="w-4 h-4 text-rose-400" />
                      3 Google-Grounded High-Velocity CTR Packages
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Select Variation to preview hooks, tailored platform copy & 1-click dispatch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {clipperData?.variations.map((variation) => {
                      const isSelected = selectedVariationId === variation.variationId;
                      return (
                        <div
                          key={variation.variationId}
                          onClick={() => setSelectedVariationId(variation.variationId)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                            isSelected
                              ? "bg-gradient-to-b from-amber-500/20 to-[#101428] border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                                  isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                                }`}
                              >
                                VARIATION {variation.variationId}
                              </span>
                              <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-black">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {variation.ctrScore} / 10 CTR
                              </div>
                            </div>

                            <h4 className="text-xs font-black text-white font-['Outfit'] line-clamp-1">
                              {variation.angleName}
                            </h4>

                            <p className="text-[11px] text-amber-300/90 font-mono line-clamp-1">
                              "{variation.onScreenHookOverlay}"
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{variation.projectedRetentionLift}</span>
                            <span className="text-amber-400 font-bold">{isSelected ? "● Active" : "Select"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Platform-Tailored Metadata & 1-Click Distribution Suite */}
                {currentVariation && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1224] border border-amber-400/40 space-y-4">
                    {/* Platform Tabs */}
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-1.5">
                        {[
                          { id: "youtube", label: "YouTube Shorts", icon: "▶️" },
                          { id: "tiktok", label: "TikTok", icon: "🎵" },
                          { id: "instagram", label: "Instagram Reels", icon: "📸" },
                          { id: "facebook", label: "Facebook Reels", icon: "👥" },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setActivePlatformTab(p.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              activePlatformTab === p.id
                                ? "bg-amber-400 text-slate-950 shadow-md"
                                : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                            }`}
                          >
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(currentVariation.fullShortsScript, "script")}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          {copiedField === "script" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Copied Script</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Platform Content Metadata View / Editor */}
                    {activePlatformTab === "youtube" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            YouTube Shorts Title (with #Shorts tag)
                          </span>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                            <span className="line-clamp-1">{currentVariation.youtubeTitle}</span>
                            <button
                              onClick={() => handleCopy(currentVariation.youtubeTitle, "yt-title")}
                              className="text-slate-400 hover:text-amber-400 p-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            SEO Description & High-Converting Subscribe CTA
                          </span>
                          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
                            {currentVariation.youtubeDescription}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Direct YouTube Data API v3 auto-push
                          </span>
                          <button
                            onClick={() => handleOneClickPost("youtube")}
                            disabled={isPushing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 via-amber-400 to-rose-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs font-['Outfit'] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>1-Click Post to YouTube Shorts</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activePlatformTab === "tiktok" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            TikTok Retention Hook & Punchy Viral Caption
                          </span>
                          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-white flex items-center justify-between">
                            <span>{currentVariation.platforms?.tiktok.punchyCaption || currentVariation.youtubeTitle}</span>
                            <button
                              onClick={() =>
                                handleCopy(
                                  currentVariation.platforms?.tiktok.punchyCaption || currentVariation.youtubeTitle,
                                  "tiktok-caption"
                                )
                              }
                              className="text-slate-400 hover:text-amber-400 p-1"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Trending Sound Cue & Vibe
                            </span>
                            <div className="p-2 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-cyan-300">
                              {currentVariation.platforms?.tiktok.trendingSoundVibe || currentVariation.soundDesignVibe}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              TikTok Creator Search Terms
                            </span>
                            <div className="p-2 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-amber-300 flex items-center justify-between">
                              <span>
                                {currentVariation.platforms?.tiktok.searchKeywords?.join(" • ") ||
                                  currentVariation.suggestedHashtags.join(" ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-slate-400">
                            Automatic clipboard sync + direct TikTok Creator Studio dispatch
                          </span>
                          <button
                            onClick={() => handleOneClickPost("tiktok")}
                            disabled={isPushing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs font-['Outfit'] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>1-Click Post to TikTok</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activePlatformTab === "instagram" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Instagram Reel Caption & First 3-Seconds Hook
                          </span>
                          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
                            {currentVariation.platforms?.instagram.reelCaption || currentVariation.youtubeDescription}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-slate-400">
                            Web Share trigger + direct Instagram Create launcher
                          </span>
                          <button
                            onClick={() => handleOneClickPost("instagram")}
                            disabled={isPushing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 hover:opacity-90 active:scale-95 text-white font-black text-xs font-['Outfit'] transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center gap-2"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                            <span>1-Click Post to Instagram Reels</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activePlatformTab === "facebook" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Facebook Reel Headline & Discussion Starter
                          </span>
                          <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
                            {currentVariation.platforms?.facebook.headline || currentVariation.youtubeTitle}
                            {"\n\n"}
                            {currentVariation.platforms?.facebook.narrativeStory || ""}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-slate-400">
                            Copies headline, story & opens Facebook Reels Studio
                          </span>
                          <button
                            onClick={() => handleOneClickPost("facebook")}
                            disabled={isPushing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 hover:opacity-90 active:scale-95 text-white font-black text-xs font-['Outfit'] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                            <span>1-Click Post to Facebook Reels</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Push Status Toast Banner */}
                    {pushStatus && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                          pushStatus.success
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                        }`}
                      >
                        {pushStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p>{pushStatus.message}</p>
                          {pushStatus.success && onOpenAssetLogger && (
                            <button
                              onClick={onOpenAssetLogger}
                              className="mt-2 text-xs font-bold text-emerald-400 underline hover:text-emerald-300"
                            >
                              Open Asset Logger & Performance Auditor →
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FULL EDITORIAL STUDIO DRAWER (Shown when editorMode === "full_studio") */}
            {editorMode === "full_studio" && (
              <div className="p-5 rounded-3xl bg-slate-950/90 border border-amber-400/40 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    FULL EDITORIAL STUDIO: TYPOGRAPHY, TRANSITIONS, EFFECTS & AUDIO
                  </h3>
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Live Reactive Canvas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Captions, Fonts & Text Styles */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5 font-['Outfit']">
                      <Type className="w-3.5 h-3.5 text-amber-400" />
                      Captions & High-Velocity Typography
                    </h4>

                    {/* Font Family Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Caption Font</label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-amber-400"
                      >
                        {FONTS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Scheme Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">High-Contrast Glow Palettes</label>
                      <div className="grid grid-cols-3 gap-2">
                        {CAPTION_COLORS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setCaptionColor(c.id)}
                            className={`p-2 rounded-xl text-[10px] font-black border transition-all ${
                              captionColor === c.id
                                ? "border-amber-400 bg-amber-500/20 text-white"
                                : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {c.label.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animation Style */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Caption Animation Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "karaoke_bounce", label: "Karaoke Bounce" },
                          { id: "glow_pulse", label: "Glow Pulse" },
                          { id: "word_pop", label: "Word-by-Word Pop" },
                          { id: "static", label: "Solid High Impact" },
                        ].map((a) => (
                          <button
                            key={a.id}
                            onClick={() => setCaptionAnimationStyle(a.id as any)}
                            className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                              captionAnimation === a.id
                                ? "bg-amber-400/20 border-amber-400 text-amber-200"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Caption Position */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Vertical Screen Placement</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "top_safe", label: "Top" },
                          { id: "upper_third", label: "Upper" },
                          { id: "center", label: "Center" },
                          { id: "lower_third", label: "Lower" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setCaptionPosition(pos.id as any)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                              captionPosition === pos.id
                                ? "bg-amber-400 text-slate-950 font-black"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Transitions & Visual Video Effects */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5 font-['Outfit']">
                      <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                      Transitions & Visual Effects
                    </h4>

                    {/* Visual Overlays Grid */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Cinematic Overlay Effects</label>
                      <div className="grid grid-cols-2 gap-2">
                        {VISUAL_EFFECTS.map((eff) => (
                          <button
                            key={eff.id}
                            onClick={() => setSelectedVisualEffect(eff.id)}
                            className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-2 ${
                              selectedVisualEffect === eff.id
                                ? "bg-amber-400/20 border-amber-400 text-white"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <span>{eff.icon}</span>
                            <span className="text-[10px] font-bold line-clamp-1">{eff.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Transition Selector */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400">Shorts Clip Transition</label>
                        <span className="text-[10px] font-mono text-amber-300">{transitionSpeedMs}ms</span>
                      </div>
                      <select
                        value={selectedTransition}
                        onChange={(e) => setSelectedTransition(e.target.value as any)}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-amber-400"
                      >
                        {TRANSITIONS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.icon} {t.label}
                          </option>
                        ))}
                      </select>

                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-[9px] font-mono text-slate-500">150ms (Snap)</span>
                        <input
                          type="range"
                          min="150"
                          max="750"
                          step="25"
                          value={transitionSpeedMs}
                          onChange={(e) => setTransitionSpeedMs(Number(e.target.value))}
                          className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                        <span className="text-[9px] font-mono text-slate-500">750ms (Film)</span>
                      </div>
                    </div>

                    {/* 9:16 Scale & Framing */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400">9:16 Zoom Crop</label>
                        <span className="text-[10px] font-mono text-amber-300">{videoScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.2"
                        step="0.05"
                        value={videoScale}
                        onChange={(e) => setVideoScale(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Column 3: Audio Separation & Sound Studio */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5 font-['Outfit']">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      Audio Separation & Sound Studio
                    </h4>

                    {/* Mute / Separate Original Audio */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {isAudioMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">Original Audio Track</div>
                          <div className="text-[10px] text-slate-400">
                            {isAudioMuted ? "Audio Muted / Stem Separated" : "Original Audio Active"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAudioMuted(!isAudioMuted)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isAudioMuted ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        }`}
                      >
                        {isAudioMuted ? "Unmute" : "Separate & Mute"}
                      </button>
                    </div>

                    {/* Volume Boost Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400">Volume Output</label>
                        <span className="text-[10px] font-mono text-cyan-300">{audioVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={audioVolume}
                        onChange={(e) => setAudioVolume(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* Audio Ducking Toggle */}
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Dynamic Audio Ducking</div>
                        <div className="text-[10px] text-slate-400">Auto-lower music when speech is detected</div>
                      </div>
                      <button
                        onClick={() => setIsAudioDuckingEnabled(!isAudioDuckingEnabled)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          isAudioDuckingEnabled ? "bg-amber-400" : "bg-slate-800"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                            isAudioDuckingEnabled ? "left-5.5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Background Audio FX Stinger */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">Background Audio Cue / Stinger</label>
                      <select
                        value={selectedSoundFx}
                        onChange={(e) => setSelectedSoundFx(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:border-amber-400"
                      >
                        <option value="heavy_808">Heavyweight 808 Sub Drop</option>
                        <option value="bass_whoosh">Cinematic Sub Whoosh</option>
                        <option value="vinyl_crackle">Vintage Vinyl Crackle</option>
                        <option value="riser_tension">White Noise Harmonic Riser</option>
                        <option value="lofi_bed">Lo-Fi Atmospheric Bed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Credentials Setup Guide Modal */}
      <PlatformApiGuideModal isOpen={isApiGuideOpen} onClose={() => setIsApiGuideOpen(false)} />
    </div>
  );
};
