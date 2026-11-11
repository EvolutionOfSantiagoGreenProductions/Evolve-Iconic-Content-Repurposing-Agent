import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  TrendingUp,
  Flame,
  Zap,
  Copy,
  CheckCircle2,
  Download,
  Filter,
  RefreshCw,
  Tag,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Plus,
} from "lucide-react";
import { GroundedKeyword, KeywordDiscoveryResult, GroundedKeywordCategory } from "../types";

interface KeywordDiscoveryPanelProps {
  videoTitle?: string;
  targetNiche?: string;
  originalKeywords?: string[];
  channelHandle?: string;
  onAddKeywordToActiveTags?: (keyword: string) => void;
}

export const KeywordDiscoveryPanel: React.FC<KeywordDiscoveryPanelProps> = ({
  videoTitle = "",
  targetNiche = "Music Production & Sound Design",
  originalKeywords = [],
  channelHandle = "@iconicbeatsmusicstudios",
  onAddKeywordToActiveTags,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KeywordDiscoveryResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | GroundedKeywordCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());

  const fetchKeywords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/keywords/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle,
          targetNiche,
          originalKeywords,
          channelHandle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setResult(data.data);
        }
      }
    } catch (err) {
      console.error("Keyword discovery error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [videoTitle, targetNiche]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result?.keywords) return;
    const allText = result.keywords.map((k) => k.keyword).join(", ");
    navigator.clipboard.writeText(allText);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (!result?.keywords) return;
    const headers = "Keyword,Search Volume,Competition,Velocity Lift,Category,Knowledge Graph MID,Actionable Strategy\n";
    const rows = result.keywords
      .map(
        (k) =>
          `"${k.keyword}","${k.searchVolume}","${k.competitionLabel} (${k.competitionScore}/100)","${k.trendVelocityLift}","${k.category}","${k.kgEntityMid}","${k.actionableContentIdea.replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `google_grounded_keywords_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTag = (keyword: string) => {
    if (onAddKeywordToActiveTags) {
      onAddKeywordToActiveTags(keyword);
    }
    setAddedKeywords((prev) => new Set(prev).add(keyword));
  };

  // Filtered keywords
  const filteredKeywords = (result?.keywords || []).filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.actionableContentIdea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl gold-segment-box flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white font-['Outfit'] tracking-wide flex items-center gap-2">
                INTELLIGENT KEYWORD DISCOVERY
                <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-amber-500/20 text-amber-200 border border-amber-400/40">
                GOOGLE GROUNDED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Top 15 trending, heating up & outlier search queries anchored in Google Knowledge Graph centroids.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyAll}
            className="px-3.5 py-2 rounded-xl bg-black/40 border border-amber-400/30 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-200 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
          >
            {copiedId === "all" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied All 15!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400/70" />
                <span>Copy All 15 Tags</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-black/40 border border-amber-400/30 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-200 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400/70" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchKeywords}
            disabled={isLoading}
            className="p-2 rounded-xl bg-black/40 border border-amber-400/30 hover:border-amber-400 text-slate-200 hover:text-amber-200 transition-colors disabled:opacity-50 backdrop-blur-md"
            title="Refresh Grounded Keywords"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-300" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-amber-400/30 w-full sm:w-auto backdrop-blur-md">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "text-slate-300 hover:text-amber-200"
            }`}
          >
            All 15 Top Queries
          </button>
          <button
            onClick={() => setSelectedCategory("trending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              selectedCategory === "trending"
                ? "bg-rose-500 text-white shadow-md"
                : "text-slate-300 hover:text-rose-300"
            }`}
          >
            <Flame className="w-3 h-3 text-amber-300" />
            Trending (5)
          </button>
          <button
            onClick={() => setSelectedCategory("heating_up")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              selectedCategory === "heating_up"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-amber-200"
            }`}
          >
            <Zap className="w-3 h-3" />
            Heating Up (5)
          </button>
          <button
            onClick={() => setSelectedCategory("outlier")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              selectedCategory === "outlier"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Outliers (5)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords or ideas..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Keywords Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800/60 rounded w-1/2" />
              <div className="h-10 bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKeywords.map((item) => {
            const isAdded = addedKeywords.has(item.keyword);
            return (
              <div
                key={item.id || item.keyword}
                className="group p-4 rounded-2xl bg-[#090b14]/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] transition-all flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-2">
                  {/* Category Pill + Velocity Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        item.category === "trending"
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : item.category === "heating_up"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.category === "trending" && <Flame className="w-2.5 h-2.5 text-rose-400" />}
                      {item.category === "heating_up" && <Zap className="w-2.5 h-2.5 text-amber-400" />}
                      {item.category === "outlier" && <Sparkles className="w-2.5 h-2.5 text-emerald-400" />}
                      {item.category.replace("_", " ")}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {item.trendVelocityLift}
                    </span>
                  </div>

                  {/* Keyword Title */}
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.keyword}
                  </h4>

                  {/* Search Volume & Competition Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Search Volume</span>
                      <span className="text-white font-bold">{item.searchVolume}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Competition</span>
                      <span
                        className={`font-bold ${
                          item.competitionScore < 25
                            ? "text-emerald-400"
                            : item.competitionScore < 50
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {item.competitionLabel}
                      </span>
                    </div>
                  </div>

                  {/* Knowledge Graph Entity MID */}
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>KG MID: {item.kgEntityMid}</span>
                    <span className="text-amber-400/80">{item.relevanceScore}% match</span>
                  </div>

                  {/* Actionable Strategy Directive */}
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                    💡 <span className="font-semibold text-slate-200">{item.actionableContentIdea}</span>
                  </p>
                </div>

                {/* Actions: Copy & Add to Active Tags */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(item.keyword, item.id || item.keyword)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    title="Copy Keyword"
                  >
                    {copiedId === (item.id || item.keyword) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleAddTag(item.keyword)}
                    disabled={isAdded}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isAdded
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                        : "bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Tags</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to YouTube Tags</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
