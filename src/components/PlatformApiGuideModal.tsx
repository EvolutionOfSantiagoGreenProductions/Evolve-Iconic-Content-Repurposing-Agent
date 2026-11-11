import React, { useState } from "react";
import {
  ShieldCheck,
  Key,
  ExternalLink,
  Copy,
  CheckCircle2,
  Lock,
  Zap,
  HelpCircle,
  X,
  Sparkles,
  Smartphone,
  Layers,
  ChevronRight,
} from "lucide-react";

interface PlatformApiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "youtube" | "tiktok" | "meta" | "webhooks";
}

export const PlatformApiGuideModal: React.FC<PlatformApiGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = "youtube",
}) => {
  const [activeTab, setActiveTab] = useState<"youtube" | "tiktok" | "meta" | "webhooks">(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl gold-segment-box rounded-3xl shadow-[0_0_70px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-amber-400/30 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-['Outfit'] tracking-wide flex items-center gap-2">
                  1-CLICK DISTRIBUTION & API CREDENTIALS GUIDE
                  <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Safe, zero-leak credential setup for instant automated publishing across all 4 platforms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 border border-transparent hover:border-amber-400/30 hover:bg-black/60 hover:text-white text-slate-300 transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/80 bg-black/30 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "youtube", label: "YouTube Data API v3", icon: "▶️", color: "text-red-400" },
            { id: "tiktok", label: "TikTok for Developers", icon: "🎵", color: "text-cyan-400" },
            { id: "meta", label: "Instagram & Facebook Reels (Meta Graph)", icon: "📸", color: "text-pink-400" },
            { id: "webhooks", label: "Zapier / Make / Webhooks", icon: "⚡", color: "text-amber-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-black/40 backdrop-blur-md text-slate-200 text-xs leading-relaxed">
          {/* Security Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3.5 text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-emerald-300 font-['Outfit']">
                Enterprise-Grade Privacy & Client-Side Encryption
              </h4>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Evolution Studio does not store or share your social media API passwords or tokens with any third-party. All dispatches use direct OAuth bearer tokens in your browser or your configured private webhook endpoints.
              </p>
            </div>
          </div>

          {/* TAB 1: YOUTUBE DATA API */}
          {activeTab === "youtube" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Option 1: 1-Click Zero-Config YouTube Sync (Recommended)
                  </h3>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Instant (0 Minutes)
                  </span>
                </div>
                <p className="text-slate-300">
                  You do not need to create API keys manually. Simply click the <strong className="text-amber-300">"Sign In with Google"</strong> or <strong className="text-amber-300">"Sync YouTube Channel"</strong> button at the top of the app. Evolution Studio automatically requests OAuth permissions to update your video titles, descriptions, and Shorts metadata.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Option 2: Custom Google Cloud Developer Key
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                    Advanced
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                  <li>
                    Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a> and create a new project.
                  </li>
                  <li>
                    Navigate to <strong>APIs & Services → Library</strong> and enable <strong className="text-white">"YouTube Data API v3"</strong>.
                  </li>
                  <li>
                    Go to <strong>Credentials → Create Credentials → OAuth Client ID</strong> (Web Application).
                  </li>
                  <li>
                    Add this app's domain to <em>Authorized JavaScript Origins</em> and <em>Authorized Redirect URIs</em>.
                  </li>
                  <li>
                    Copy your <code>Client ID</code> and paste it into the <strong>Settings</strong> panel.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: TIKTOK FOR DEVELOPERS */}
          {activeTab === "tiktok" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    TikTok Content Posting API (Direct 1-Click Publishing)
                  </h3>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    Official API
                  </span>
                </div>
                <p className="text-slate-300">
                  TikTok allows verified creators and developer accounts to automatically dispatch video clips and captions directly into TikTok drafts or public feeds:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                  <li>
                    Sign up at <a href="https://developers.tiktok.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold inline-flex items-center gap-1">TikTok for Developers <ExternalLink className="w-3 h-3" /></a>.
                  </li>
                  <li>
                    Create an App and apply for the <strong className="text-white">Content Posting API</strong> (`video.upload` and `video.publish` scopes).
                  </li>
                  <li>
                    Generate your Long-Lived Creator Access Token in your app sandbox or settings.
                  </li>
                  <li>
                    Open the <strong>"Custom Endpoints"</strong> modal in Evolution Studio, select method <code>POST</code>, enter TikTok's API endpoint <code>https://open.tiktokapis.com/v2/post/publish/video/init/</code>, and add your Bearer Token in the Authorization header.
                  </li>
                </ol>

                <div className="mt-3 p-3 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-slate-300">
                    Endpoint URL: <span className="text-cyan-300">https://open.tiktokapis.com/v2/post/publish/video/init/</span>
                  </div>
                  <button
                    onClick={() => handleCopy("https://open.tiktokapis.com/v2/post/publish/video/init/", "tiktok-url")}
                    className="p-1 text-slate-400 hover:text-cyan-300"
                  >
                    {copiedKey === "tiktok-url" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: META GRAPH API (INSTAGRAM & FACEBOOK REELS) */}
          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    Meta Graph API for Instagram Reels & Facebook Pages
                  </h3>
                  <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-md border border-pink-500/30">
                    Meta Graph v19.0
                  </span>
                </div>
                <p className="text-slate-300">
                  Publish Reels and short video packages directly to your Instagram Professional Account or Facebook Page:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                  <li>
                    Visit <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-pink-400 underline font-bold inline-flex items-center gap-1">Meta for Developers <ExternalLink className="w-3 h-3" /></a> and create a "Business" type app.
                  </li>
                  <li>
                    Add the <strong className="text-white">Instagram Graph API</strong> and <strong className="text-white">Pages API</strong> products.
                  </li>
                  <li>
                    Request permissions: <code>instagram_content_publish</code>, <code>pages_manage_posts</code>, and <code>pages_read_engagement</code>.
                  </li>
                  <li>
                    In the Graph API Explorer, generate your <strong>Page Access Token</strong>.
                  </li>
                  <li>
                    Add your Meta Graph publishing endpoint in Evolution Studio's Custom Endpoints modal:
                  </li>
                </ol>

                <div className="mt-3 p-3 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-slate-300">
                    Instagram Reels API: <span className="text-pink-300">https://graph.facebook.com/v19.0/&#123;ig-user-id&#125;/media</span>
                  </div>
                  <button
                    onClick={() => handleCopy("https://graph.facebook.com/v19.0/{ig-user-id}/media", "meta-url")}
                    className="p-1 text-slate-400 hover:text-pink-300"
                  >
                    {copiedKey === "meta-url" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZAPIER / MAKE WEBHOOKS */}
          {activeTab === "webhooks" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Zapier / Make / n8n Headless Multi-Platform Webhook (Universal)
                  </h3>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                    Most Popular
                  </span>
                </div>
                <p className="text-slate-300">
                  If you use automation tools like Zapier, Make.com, Buffer, or Pabbly, you can publish to <strong>all platforms at the same time</strong> with zero coding:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                  <li>
                    In Zapier or Make, create a new workflow and choose <strong className="text-white">"Webhooks by Zapier / Catch Hook"</strong> as the trigger.
                  </li>
                  <li>
                    Copy the generated Webhook URL (e.g. <code>https://hooks.zapier.com/hooks/catch/12345/abcde</code>).
                  </li>
                  <li>
                    In Evolution Studio, click <strong className="text-amber-300">"Custom Endpoints"</strong> in the top navigation bar, click <strong className="text-white">"Add Custom Endpoint"</strong>, paste the URL, and give it a name like <em>"Viral Shorts Omnichannel Auto-Publisher"</em>.
                  </li>
                  <li>
                    In your Zapier/Make workflow, connect actions to:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-400">
                      <li>Upload to YouTube Shorts</li>
                      <li>Post to TikTok Creator Account</li>
                      <li>Publish Instagram Reel</li>
                      <li>Post Facebook Reel & Tweet on X</li>
                    </ul>
                  </li>
                  <li>
                    Now, simply click <strong>"1-Click Auto Post"</strong> inside the Iconic Clipper Studio and all accounts will be published simultaneously!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-amber-400/30 bg-black/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Tokens remain 100% private to your browser & connected cloud backend
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
