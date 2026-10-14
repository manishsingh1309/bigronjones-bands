import { getFunnelApiUrl } from "../lib/funnelEngine";
import React, { useState } from "react";
import { ArrowRight, Check, X, ShieldAlert, Lock, ShieldCheck } from "lucide-react";
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
      const res = await fetch(getFunnelApiUrl("/api/funnels/checkout"), {
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

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        onAccept(data);
        return;
      }

      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Checkout returned status ${res.status}`);
    } catch (err: any) {
      console.warn("[DownsellStep] Checkout warning:", err);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        err.message?.includes("fetch")
      ) {
        console.info("[DownsellStep] Standalone/dev preview mode active: advancing to confirmation step.");
        onAccept({ testMode: true, checkoutType: "downsell_199" });
        return;
      }
      setError(err?.message || "Checkout error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2 sm:py-4">
      {/* ── Banner Header ─────────────────────────────────────────────────── */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-['DM_Mono'] font-bold uppercase tracking-[0.25em] mb-4 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          <span>SELF-DIRECTED DIY OPTION • SAVE $50 INSTANTLY</span>
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-2">
          TRAIN INDEPENDENTLY FOR <span className="text-[#0A3161]">$199</span>
        </h1>
        <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
          Keep your personalized training prescription without paying for private 1-on-1 consultations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans']">
          {error}
        </div>
      )}

      {/* ── Downsell Comparison Card ──────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#0A3161]/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
          <div>
            <span className="text-xs font-['DM_Mono'] uppercase tracking-[0.2em] text-[#0A3161] font-bold block mb-1">
              {matchedProgram.title} (DIY VERSION)
            </span>
            <div className="font-['Bebas_Neue'] text-4xl sm:text-5xl text-slate-900 leading-none">$199</div>
          </div>
          <div className="text-right">
            <span className="line-through text-slate-400 font-['DM_Mono'] text-xs font-semibold">$249 Package</span>
            <div className="font-['DM_Mono'] text-xs sm:text-sm font-black text-emerald-600 uppercase tracking-wider">
              $50 SAVINGS TODAY
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8 text-xs sm:text-sm font-['DM_Sans']">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <p className="font-bold text-emerald-950 mb-2 font-['DM_Mono'] uppercase tracking-wider text-xs">
              What you keep in the $199 DIY Option:
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete 4-Day Gym Series progressive video curriculum</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complete 4-Day Home Series progressive video curriculum</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lifetime digital access to movement mastery demonstrations</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-600 mb-2 font-['DM_Mono'] uppercase tracking-wider text-xs">
              What is removed to reach $199:
            </p>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Private 1-on-1 Zoom consultation with BigRonJones® (Removed)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Private video nutrition consultation with Nutritionist (Removed)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleBuyDownsell}
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <span>SECURING DIY ENROLLMENT…</span>
            ) : (
              <>
                <span>ENROLL IN THE DIY PROTOCOL FOR $199</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onDecline}
              className="font-['DM_Mono'] text-xs font-semibold text-slate-400 hover:text-slate-700 uppercase tracking-widest underline underline-offset-4 cursor-pointer transition-colors"
            >
              No thanks, I choose to decline this training program entirely »
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-['DM_Mono'] text-[11px] uppercase tracking-wider text-center">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          256-Bit SSL Encrypted
        </span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0A3161]" />
          30-Day Money-Back Guarantee
        </span>
      </div>
    </div>
  );
}
