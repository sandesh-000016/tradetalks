"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

export default function TestDataEditor() {
  const [data, setData] = useState<any>({ performance: [], referrals: [], insights: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-data");
      const json = await res.json();
      setData({
        performance: json.performance || [],
        referrals: json.referrals || [],
        insights: json.insights || [],
      });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load mock data." });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (index: number, field: string, value: any, category: "performance" | "insights") => {
    setData((prev: any) => {
      const list = [...prev[category]];
      list[index] = { ...list[index], [field]: value };
      
      const newReferrals = [...prev.referrals];
      if (category === "performance") {
        const perfItem = list[index];
        const refIndex = newReferrals.findIndex(r => r.external_client_id === perfItem.external_client_id);
        if (refIndex > -1) {
          newReferrals[refIndex] = {
            ...newReferrals[refIndex],
            client_name: perfItem.client_name,
            registration_date: perfItem.registration_date
          };
        }
      }
      
      return {
        ...prev,
        [category]: list,
        referrals: newReferrals
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/test-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setMessage({ type: "success", text: "Mock data updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save mock data." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to connect to the test-data API." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading mock data editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <Link href="/leaderboard" className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Leaderboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider mt-1">
              Admin Mock Data Editor
            </h1>
            <p className="text-xs text-slate-400">
              Directly edit metrics for your 10 mock traders to test calculation logic.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Mock Data"}
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-200 ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-450"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Editor Panels */}
        <div className="space-y-6">
          {data.performance.map((item: any, index: number) => {
            const insightIndex = data.insights.findIndex((i: any) => i.external_client_id === item.external_client_id);
            const insightItem = data.insights[insightIndex] || {};

            return (
              <div key={item.external_client_id} className="glass-panel border border-slate-800 rounded-2xl p-5 md:p-6 bg-slate-900/20 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
                  <div>
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      {item.client_name || `Trader ${index + 1}`}
                    </h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Client ID: {item.external_client_id} | Numeric ID: {item.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-850 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {item.registration_date}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Client Name Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Name</label>
                    <input
                      type="text"
                      value={item.client_name || ""}
                      onChange={(e) => handleFieldChange(index, "client_name", e.target.value, "performance")}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  {/* Volume Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume (Lots)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.volume ?? 0}
                      onChange={(e) => handleFieldChange(index, "volume", parseFloat(e.target.value) || 0, "performance")}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  {/* Total Balance Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={insightItem.total_balance ?? 0}
                      onChange={(e) => {
                        if (insightIndex > -1) {
                          handleFieldChange(insightIndex, "total_balance", parseFloat(e.target.value) || 0, "insights");
                        }
                      }}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  {/* Total Equity Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Equity ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={insightItem.total_equity ?? 0}
                      onChange={(e) => {
                        if (insightIndex > -1) {
                          handleFieldChange(insightIndex, "total_equity", parseFloat(e.target.value) || 0, "insights");
                        }
                      }}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Last Deposit Date Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Deposit Date (ISO / Timestamp)</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-07-24T10:00:00Z"
                      value={insightItem.last_deposit_date || ""}
                      onChange={(e) => {
                        if (insightIndex > -1) {
                          handleFieldChange(insightIndex, "last_deposit_date", e.target.value, "insights");
                        }
                      }}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  {/* Country Input */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Country</label>
                    <input
                      type="text"
                      value={item.country || ""}
                      onChange={(e) => handleFieldChange(index, "country", e.target.value, "performance")}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Mock Data Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
