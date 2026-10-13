import React, { useState } from "react";
import { Dumbbell, ArrowRight, Check, X, ShieldAlert } from "lucide-react";
import type { ProgramSeriesItem } from "../lib/programSeries";

interface DownsellStepProps {
  funnelId: "funnel_a" | "funnel_b";
  matchedProgram: ProgramSeriesItem;
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void; // Routes to Neutral Exit (Funnel ends)
}

export default function DownsellStep({
  funnelId,
  matchedProgram,
  customerEmail = "",
  customerName = "",
  onAccept,
  onDecline,
}: DownsellStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyDownsell = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/funnels/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "downsell_199",
          programId: matchedProgram.id,
          email: customerEmail,
          name: customerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize downsell checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        onAccept(data);
      }
    } catch (err: any) {
      setError(err?.message || "Checkout error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-800/80 text-amber-400 text-xs font-mono mb-3">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>SELF-DIRECTED DIY OPTION • LIVE SUPPORT REMOVED</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          TRAIN INDEPENDENTLY FOR $199
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Keep your personalized training prescription without paying for private video consultations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* ── Downsell Comparison Card ──────────────────────────────────────── */}
      <div className="bg-[#111622] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
              {matchedProgram.title} (DIY VERSION)
            </span>
            <div className="text-3xl font-black text-white mt-0.5">$199</div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <span className="line-through text-slate-500">$249 Package</span>
            <div className="text-emerald-400 font-bold">$50 REDUCTION</div>
          </div>
        </div>

        <div className="space-y-4 mb-8 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <p className="font-bold text-white mb-2">What you receive in the $199 DIY Option:</p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete 4-Day Gym Series workout video library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complete 4-Day Home Series workout video library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime digital access to exercise progressions & cues</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <p className="font-bold text-slate-400 mb-2">What is removed to reach $199:</p>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>Private video consultation session with BigRonJones® (Removed)</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <span>Private nutrition consultation with Nutritionist (Removed)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleBuyDownsell}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>INITIALIZING SECURE $199 CHECKOUT…</span>
            ) : (
              <>
                <span>ACCEPT SELF-DIRECTED PROGRAM — $199</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Decline both -> Exit */}
          <button
            type="button"
            onClick={onDecline}
            className="w-full py-3 text-xs text-slate-400 hover:text-slate-200 transition-colors underline font-medium"
          >
            I will pass on both options (Exit funnel and save my prescription)
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-slate-500">
        Note: Purchasing the $199 DIY option concludes your purchase flow directly with order confirmation.
      </p>
    </div>
  );
}
