import React, { useState } from "react";
import {
  Brain,
  Network,
  Share2,
  Check,
  Copy,
  Tag,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { KGNodeCluster, SemanticIdNode } from "../types";

interface KnowledgeGraphVisualizerProps {
  clusters: KGNodeCluster[];
  channelHandle: string;
  onCopyText: (text: string, label: string) => void;
}

export const KnowledgeGraphVisualizer: React.FC<KnowledgeGraphVisualizerProps> = ({
  clusters,
  channelHandle,
  onCopyText,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(
    clusters[0]?.id || ""
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCluster =
    clusters.find((c) => c.id === selectedClusterId) || clusters[0];

  const handleCopy = (id: string, text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onCopyText(text, label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!activeCluster) {
    return null;
  }

  const generateSchemaOrgJsonLd = (cluster: KGNodeCluster) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: `${channelHandle} Semantic Authority Broadcast`,
      about: (cluster.semanticIdNodes || []).map((node) => ({
        "@type": "Thing",
        name: node.name,
        sameAs: `https://g.co/kg${node.mid}`,
        description: node.searchIntentContext,
      })),
      keywords: (cluster.schemaOrgEntityTags || []).join(", "),
      inLanguage: "en-US",
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Cluster Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {(clusters || []).map((cluster) => {
          const isActive = cluster.id === activeCluster.id;
          return (
            <button
              key={cluster.id}
              onClick={() => setSelectedClusterId(cluster.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border shrink-0 backdrop-blur-md ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black"
                  : "bg-black/40 text-slate-300 border-amber-400/20 hover:text-amber-200 hover:border-amber-400/50"
              }`}
            >
              <Network className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
              <span>{cluster.clusterName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono bg-black/60 text-amber-300 border border-amber-400/30">
                {cluster.authorityWeight}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Cluster Diagnostic Box */}
      <div className="gold-segment-box rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
        {/* Cluster Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-400/20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/40">
                Knowledge Graph Cluster
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                Entity MID: <strong className="text-amber-200 font-bold">{activeCluster.entityMid}</strong>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit'] flex items-center gap-2">
              {activeCluster.centroidEntity}
              <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/50 px-3.5 py-2 rounded-xl border border-amber-400/30 text-center backdrop-blur-md">
              <div className="text-[10px] text-slate-300 font-bold uppercase">Authority Weight</div>
              <div className="text-base font-black text-amber-300 font-mono drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                {activeCluster.authorityWeight}/100
              </div>
            </div>

            <div className="bg-black/50 px-3.5 py-2 rounded-xl border border-amber-400/30 text-center backdrop-blur-md">
              <div className="text-[10px] text-slate-300 font-bold uppercase">Search Velocity</div>
              <div className="text-xs font-black text-emerald-300 font-mono mt-0.5">
                {activeCluster.searchVelocity}
              </div>
            </div>
          </div>
        </div>

        {/* Semantic ID Nodes & Triplet Relations */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              Semantic ID Nodes & Triplet Relations (Google KG Resonance)
            </h4>
            <span className="text-[11px] text-slate-300">
              {activeCluster.semanticIdNodes.length} Nodes Mapped
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeCluster.semanticIdNodes || []).map((node) => (
              <div
                key={node.nodeId}
                className="bg-black/45 border border-amber-400/30 hover:border-amber-400 rounded-2xl p-4 space-y-3 transition-all shadow-md group backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-black text-white">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/40">
                    {node.mid}
                  </span>
                </div>

                {/* Triplet Logic */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-amber-400/20 text-[11px] font-mono text-amber-200 leading-relaxed">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider mb-1">
                    Semantic Triplet Relation:
                  </span>
                  {node.tripletRelation}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {node.searchIntentContext}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-amber-400/20 text-xs">
                  <span className="text-[10px] font-bold text-slate-300">
                    Role: <strong className="text-amber-200">{node.semanticRole}</strong>
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        node.nodeId,
                        `Google Knowledge Graph Node: ${node.name} (${node.mid})\nRelation: ${node.tripletRelation}\nIntent: ${node.searchIntentContext}`,
                        `${node.name} Node Details`
                      )
                    }
                    className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold text-[11px] transition-colors py-0.5 px-2 rounded hover:bg-amber-500/20"
                  >
                    {copiedId === node.nodeId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied Node
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Node
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schema.org Entity Tags & Untapped Search Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-black/40 border border-amber-400/25 rounded-2xl p-4 space-y-2.5 backdrop-blur-md">
            <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Schema.org Entity Tags (Direct Video SEO)
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {(activeCluster.schemaOrgEntityTags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono font-semibold text-amber-200 bg-amber-950/40 border border-amber-400/30 px-2.5 py-0.5 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-black/40 border border-amber-400/25 rounded-2xl p-4 space-y-2.5 backdrop-blur-md">
            <h5 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Untapped High-Volume Search Gaps
            </h5>
            <div className="space-y-1.5">
              {(activeCluster.untappedSearchGaps || []).map((gap, idx) => (
                <div
                  key={idx}
                  className="text-xs text-emerald-300 flex items-center gap-2 bg-emerald-950/30 border border-emerald-400/30 px-2.5 py-1 rounded-lg"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300 shrink-0" />
                  <span className="truncate">{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-Click Schema.org JSON-LD Snippet Box */}
        <div className="pt-2">
          <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Auto-Generated Knowledge Graph JSON-LD Structured Data
              </div>
              <p className="text-[11px] text-slate-300">
                Ready to paste into your website or YouTube description metadata block to command Google Search & Semantic indexing.
              </p>
            </div>

            <button
              onClick={() =>
                handleCopy(
                  `schema-${activeCluster.id}`,
                  generateSchemaOrgJsonLd(activeCluster),
                  "Schema.org JSON-LD structured data"
                )
              }
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all"
            >
              {copiedId === `schema-${activeCluster.id}` ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" /> Copied JSON-LD!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-950" /> Copy JSON-LD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
