import { getFunnelApiUrl } from "../lib/funnelEngine";
import React, { useState } from "react";
import { Dumbbell, Video, Check, ArrowRight, Sparkles, ShieldCheck, Lock, UserCheck } from "lucide-react";
import type { ProgramSeriesItem } from "../lib/programSeries";

interface MatchedProgramStepProps {
  funnelId: "funnel_a" | "funnel_b";
  matchedProgram: ProgramSeriesItem;
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void; // Routes to $199 Downsell
}

export default function MatchedProgramStep({
  funnelId,
  matchedProgram,
  customerEmail = "",
  customerName = "",
  onAccept,
  onDecline,
}: MatchedProgramStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getFunnelApiUrl("/api/funnels/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "primary_249",
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
      console.warn("[MatchedProgramStep] Checkout warning:", err);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        err.message?.includes("fetch")
      ) {
        console.info("[MatchedProgramStep] Standalone/dev preview mode active: advancing to two-pack upsell.");
        onAccept({ testMode: true, checkoutType: "primary_249" });
        return;
      }
      setError(err?.message || "Checkout error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-4">
      {/* ── Match Notification Header ─────────────────────────────────────── */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0A3161] text-xs font-['DM_Mono'] font-bold uppercase tracking-[0.25em] mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0A3161]" />
          <span>DIAGNOSTIC PRESCRIPTION CONFIRMED</span>
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-2">
          YOUR MATCHED PROTOCOL: <span className="text-[#0A3161]">{matchedProgram.title}</span>
        </h1>
        <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          {matchedProgram.blurb}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans']">
          {error}
        </div>
      )}

      {/* ── Main Offer Card ──────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#0A3161]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 bg-[#0A3161] text-white px-5 py-2 rounded-bl-2xl text-[11px] font-['DM_Mono'] uppercase tracking-[0.2em] font-bold shadow-sm">
          PROGRAM 0{matchedProgram.id} OF 08
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Cover Image & Chips */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-md">
              <img
                src={matchedProgram.image || `/programs/thumb-${matchedProgram.id}.jpg`}
                alt={matchedProgram.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/programs/thumb-${matchedProgram.id}.webp`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-['DM_Mono'] font-bold text-white uppercase tracking-wider">
                  PRIMARY FOCUS: {matchedProgram.focus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-['DM_Mono'] font-bold">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <Dumbbell className="w-4 h-4 mx-auto mb-1 text-[#0A3161]" />
                <span>4-Day Gym Series</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <Video className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span>4-Day Home Series</span>
              </div>
            </div>
          </div>

          {/* Value Stack & Inclusions */}
          <div>
            <div className="mb-5 pb-4 border-b border-slate-200">
              <span className="text-xs font-['DM_Mono'] text-[#0A3161] uppercase tracking-[0.2em] font-bold block mb-1">
                COMPLETE EXECUTION PACKAGE
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-slate-900 leading-none">$249</span>
                <span className="text-xs font-['DM_Mono'] font-bold text-slate-500 uppercase tracking-wider">
                  ONE-TIME • LIFETIME ACCESS
                </span>
              </div>
            </div>

            <p className="text-xs font-['DM_Mono'] font-bold uppercase tracking-wider mb-3 text-[#0A3161]">
              WHAT IS INCLUDED IN YOUR PROTOCOL:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-['DM_Sans']">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Full 8-video progressive training curriculum</strong> (4 Gym + 4 Home) streamable on phone, tablet, or TV.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Private 1-on-1 Zoom consultation with BigRonJones®</strong> to dial your technique and progression strategy.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dedicated Nutrition Consultation Session</strong> for practical fuel and recovery planning.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Exercise execution masterclass library</strong> and lifetime video portal updates with zero recurring fees.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Purchase Decision CTA ────────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          {/* YES — $249 Primary Red CTA */}
          <button
            type="button"
            onClick={handleBuy}
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <span>INITIALIZING SECURE ENROLLMENT…</span>
            ) : (
              <>
                <span>UPGRADE TO THE COMPLETE PROTOCOL — $249</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* NO — Route to $199 Downsell */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onDecline}
              className="font-['DM_Mono'] text-xs font-semibold text-slate-500 hover:text-slate-800 uppercase tracking-widest underline underline-offset-4 cursor-pointer transition-colors"
            >
              No thanks, I'll pass on the 1-on-1 consultation with Ron (Show me DIY options) »
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
          30-Day Practical Results Guarantee
        </span>
        <span>•</span>
        <span>Instant Digital Video Access</span>
      </div>
    </div>
  );
}
