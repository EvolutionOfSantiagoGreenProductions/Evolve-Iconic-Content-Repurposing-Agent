import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  SendHorizontal,
  Check,
  AlertCircle,
  Code,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { CustomEndpoint } from "../types";

interface CustomEndpointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: CustomEndpoint[];
  onSaveEndpoints: (endpoints: CustomEndpoint[]) => void;
  onTestPing: (endpoint: CustomEndpoint) => Promise<{ success: boolean; status: number; data: any; error?: string }>;
}

export const CustomEndpointsModal: React.FC<CustomEndpointsModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  onSaveEndpoints,
  onTestPing,
}) => {
  const [list, setList] = useState<CustomEndpoint[]>(endpoints);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"POST" | "PUT">("POST");
  const [authHeader, setAuthHeader] = useState("");
  const [customHeadersJson, setCustomHeadersJson] = useState('{\n  "X-Custom-Header": "EvolutionStudio"\n}');
  const [notes, setNotes] = useState("");

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; status: number; text: string } | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let headersObj: Record<string, string> = {};
    try {
      if (customHeadersJson.trim()) {
        headersObj = JSON.parse(customHeadersJson);
      }
    } catch (err) {
      alert("Invalid custom headers JSON format.");
      return;
    }

    const newEndpoint: CustomEndpoint = {
      id: "ep-" + Date.now(),
      name: name.trim(),
      url: url.trim(),
      method,
      authHeader: authHeader.trim() || undefined,
      customHeaders: headersObj,
      enabled: true,
      notes: notes.trim() || undefined,
    };

    const updated = [...list, newEndpoint];
    setList(updated);
    onSaveEndpoints(updated);

    // Reset form
    setName("");
    setUrl("");
    setAuthHeader("");
    setNotes("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((item) => item.id !== id);
    setList(updated);
    onSaveEndpoints(updated);
  };

  const handleTestPing = async (ep: CustomEndpoint) => {
    setTestingId(ep.id);
    setTestResult(null);
    try {
      const res = await onTestPing(ep);
      setTestResult({
        id: ep.id,
        success: res.success,
        status: res.status,
        text: JSON.stringify(res.data || res.error || {}, null, 2),
      });
    } catch (err: any) {
      setTestResult({
        id: ep.id,
        success: false,
        status: 500,
        text: err.message || "Test ping failed",
      });
    }
    setTestingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl gold-segment-box rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-400/30 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <SendHorizontal className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
                Custom API & Webhook Endpoints
                <Sparkles className="w-4 h-4 text-amber-300 animate-diamond-glint" />
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                1-Click auto-post distribution packages directly to your custom servers or webhooks.
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

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-black/50 backdrop-blur-md">
          {/* List of endpoints */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Active Endpoints ({list.length})
              </span>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Endpoint
                </button>
              )}
            </div>

            {list.length === 0 && !showAddForm && (
              <div className="text-center py-8 rounded-2xl bg-[#06070c]/60 border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                <p className="font-bold text-slate-400">No endpoints configured yet.</p>
                <p className="text-xs text-slate-500">
                  Connect Zapier, Make, Discord webhooks, or your custom REST endpoints.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {list.map((ep) => (
                <div
                  key={ep.id}
                  className="p-4 rounded-2xl bg-[#06070c]/90 border border-slate-800/90 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-white">{ep.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold">
                          {ep.method}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-1 truncate max-w-sm sm:max-w-md">
                        {ep.url}
                      </p>
                      {ep.authHeader && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/90 mt-1 font-mono font-bold">
                          <Shield className="w-3 h-3" /> Auth Header Protected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestPing(ep)}
                        disabled={testingId === ep.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all active:scale-95"
                      >
                        {testingId === ep.id ? "Pinging..." : "Test Ping"}
                      </button>

                      <button
                        onClick={() => handleDelete(ep.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Test result feedback */}
                  {testResult && testResult.id === ep.id && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-mono border ${
                        testResult.success
                          ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "bg-rose-950/40 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>HTTP {testResult.status}</span>
                        <span>{testResult.success ? "Ready to Dispatch" : "Check Endpoint"}</span>
                      </div>
                      <pre className="text-[10px] whitespace-pre-wrap line-clamp-3">{testResult.text}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Endpoint Form */}
          {showAddForm && (
            <form
              onSubmit={handleAdd}
              className="p-5 rounded-2xl bg-[#06070c] border border-cyan-500/40 space-y-4 animate-in fade-in shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  New Custom Endpoint Configuration
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">Endpoint Friendly Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zapier Social Buffer / Discord Webhook"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">HTTP Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">Target Webhook / API URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/... or https://api.yoursite.com/social"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Authorization Header (Optional, e.g. Bearer token or API key)
                </label>
                <input
                  type="text"
                  value={authHeader}
                  onChange={(e) => setAuthHeader(e.target.value)}
                  placeholder="Bearer your_secret_token_here"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center gap-1.5 mt-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Save & Connect Endpoint
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#06070c]/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Payloads are automatically serialized in clean JSON.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
