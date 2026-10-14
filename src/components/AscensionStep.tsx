import { getFunnelApiUrl } from "../lib/funnelEngine";
import React, { useState } from "react";
import { Crown, Check, ArrowRight, ShieldCheck, Video, Calendar, Sparkles, Lock } from "lucide-react";

interface AscensionStepProps {
  funnelId: "funnel_a" | "funnel_b";
  gender: "Male" | "Female";
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void; // Routes to Confirmation
}

export default function AscensionStep({
  funnelId,
  gender,
  customerEmail = "",
  customerName = "",
  onAccept,
  onDecline,
}: AscensionStepProps) {
  const [plan, setPlan] = useState<"pif" | "in_house">("pif");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isWomens = gender === "Female";
  const programTitle = isWomens ? "WOMEN'S WELLNESS PROGRAM (WWP)" : "MEN'S FITNESS ALLIANCE (MFA)";
  const programSub = isWomens
    ? "A structured 24-week health, nutrition, and strength transformation engineered specifically for women with dedicated female wellness oversight."
    : "A 24-week executive brotherhood of functional strength, relentless discipline, and direct weekly coaching oversight with Big Ron Jones.";

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getFunnelApiUrl("/api/funnels/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "ascension_3000",
          program: isWomens ? "WWP" : "MFA",
          plan,
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
      console.warn("[AscensionStep] Checkout warning:", err);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        err.message?.includes("fetch")
      ) {
        console.info("[AscensionStep] Standalone/dev preview mode active: advancing to confirmation step.");
        onAccept({ testMode: true, checkoutType: "ascension_3000", plan });
        return;
      }
      setError(err?.message || "Checkout error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-4">
      {/* ── Banner Header ─────────────────────────────────────────────────── */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-['DM_Mono'] font-bold uppercase tracking-[0.25em] mb-4 shadow-2xs">
          <Crown className="w-3.5 h-3.5 text-amber-700" />
          <span>EXECUTIVE 24-WEEK DIRECT OVERSIGHT • HIGHEST TIER</span>
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-2">
          {programTitle}
        </h1>
        <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          {programSub}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans']">
          {error}
        </div>
      )}

      {/* ── Main Coaching Card ────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#0A3161]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          {/* Coach Photo & Badge */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={isWomens ? "/images/team/shelia.png" : "/images/team/ron-founder.png"}
              alt={programTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = isWomens
                  ? "/assets/client-stories/selena-800.jpg"
                  : "/images/ron/ron-headshot.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-4">
              <span className="font-['DM_Mono'] text-xs font-bold text-amber-400 uppercase tracking-widest">
                24-WEEK DEDICATED COACHING
              </span>
              <span className="font-['Bebas_Neue'] text-xl text-white tracking-wide uppercase">
                {isWomens ? "Weekly Direct Oversight with Coach Selena" : "Weekly Direct 1-on-1 Oversight with Big Ron Jones"}
              </span>
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="font-['Bebas_Neue'] text-2xl text-slate-900 tracking-wide uppercase mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0A3161]" />
              <span>Full Coaching Ecosystem Inclusions:</span>
            </h2>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-['DM_Sans']">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Weekly 1:1 Private Zoom Calls</strong> for progressive training review, biomechanics audits & direct accountability.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Custom Adaptive Nutrition Blueprint</strong> updated bi-weekly based on metabolic rate and progress.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Private Direct Messaging Access</strong> with your coach for instant feedback and travel adjustments.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Lifetime Video Vault Access</strong> to all BigRonJones® current and future training programs.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Payment Plan Selector ────────────────────────────────────────── */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
          <span className="block font-['DM_Mono'] text-xs uppercase tracking-wider text-slate-700 font-bold mb-3">
            Select Your Enrollment Structure:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PIF */}
            <div
              onClick={() => setPlan("pif")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                plan === "pif"
                  ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-['Bebas_Neue'] text-xl text-slate-900 tracking-wide uppercase">
                  Pay In Full (Term Access)
                </span>
                <span className="text-xs font-['DM_Mono'] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  BEST VALUE
                </span>
              </div>
              <div className="font-['Bebas_Neue'] text-3xl text-slate-900">$3,000</div>
              <p className="font-['DM_Sans'] text-xs text-slate-500 mt-1">
                One-time enrollment covering complete 24 weeks of direct weekly coaching oversight.
              </p>
            </div>

            {/* In-House Split */}
            <div
              onClick={() => setPlan("in_house")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                plan === "in_house"
                  ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-['Bebas_Neue'] text-xl text-slate-900 tracking-wide uppercase">
                  In-House Monthly Installments
                </span>
                <span className="text-xs font-['DM_Mono'] font-bold text-slate-500">
                  4 MONTHS
                </span>
              </div>
              <div className="font-['Bebas_Neue'] text-3xl text-slate-900">4 × $750/mo</div>
              <p className="font-['DM_Sans'] text-xs text-slate-500 mt-1">
                $750 due today, followed by three automatic monthly payments. Total $3,000.
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleEnroll}
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <span>SECURING COACHING ALLOCATION…</span>
            ) : (
              <>
                <span>APPLY FOR PRIVATE COACHING OVERSIGHT</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onDecline}
              className="font-['DM_Mono'] text-xs font-semibold text-slate-400 hover:text-slate-700 uppercase tracking-widest underline underline-offset-4 cursor-pointer transition-colors"
            >
              No thanks, I will pass on executive coaching and view my order receipt »
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
          Direct Coach Confidentiality Agreement
        </span>
      </div>
    </div>
  );
}
