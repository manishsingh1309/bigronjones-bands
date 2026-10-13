import React, { useState } from "react";
import { Crown, Check, ArrowRight, ShieldCheck, Video, Calendar, MessageSquare, Heart } from "lucide-react";

interface AscensionStepProps {
  funnelId: "funnel_a" | "funnel_b";
  gender: "Male" | "Female";
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void; // Proceeds to Final Confirmation
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
  const programCode = isWomens ? "WWP" : "MFA";
  const programTitle = isWomens ? "Women’s Wellness Program" : "Men’s Fitness Alliance";
  const programSub = isWomens
    ? "Private strength, hormonal wellness, and accountability oversight for women 35+."
    : "Private strength, vitality, and discipline oversight for men 35+.";

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/funnels/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "ascension_3000",
          program: programCode,
          plan,
          email: customerEmail,
          name: customerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize coaching enrollment");
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
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-800 text-amber-400 text-xs font-mono mb-3">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>PREMIUM 24-WEEK DIRECT OVERSIGHT • HIGHEST TIER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          {programTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          {programSub}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* ── Main Coaching Card ────────────────────────────────────────────── */}
      <div className="bg-[#111622] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          {/* Coach Photo & Badge */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-800">
            <img
              src={isWomens ? "/assets/bigronjones/Women's wellness program.PNG" : "/images/ron/ron-hero.jpg"}
              alt={programTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback
                (e.target as HTMLImageElement).src = "/images/ron/coaching-session.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                24-WEEK PRIVATE OVERSIGHT
              </span>
              <span className="text-sm font-bold text-white">
                Weekly Zoom Direct Access with BigRonJones®
              </span>
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Full Coaching Ecosystem Inclusions:</span>
            </h2>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Weekly 1:1 Zoom with BigRonJones®</strong> for progressive training review, form analysis & mindset.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Weekly nutrition guidance</strong> with our in-house Nutritionist tailored to real work & family life.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Custom progressive training & cardio protocols</strong> updated dynamically as you evolve.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Private accountability community</strong> with high-caliber peers holding you to a higher standard.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Payment Options (Existing Configuration Preserved) ───────────── */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
          <p className="text-xs font-mono uppercase text-slate-400 mb-3 font-bold">
            Select Your Coaching Investment Option:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* PIF $3,000 */}
            <button
              type="button"
              onClick={() => setPlan("pif")}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                plan === "pif"
                  ? "bg-[#0A3161] border-blue-500 ring-2 ring-blue-500/20 text-white"
                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">Paid In Full</span>
                <span className="text-xs font-mono font-bold text-emerald-400">BEST VALUE</span>
              </div>
              <div className="text-2xl font-black text-white">$3,000</div>
              <div className="text-[11px] text-slate-400 mt-1">One-time payment for complete 24 weeks</div>
            </button>

            {/* In-House $750 x 4 */}
            <button
              type="button"
              onClick={() => setPlan("in_house")}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                plan === "in_house"
                  ? "bg-[#0A3161] border-blue-500 ring-2 ring-blue-500/20 text-white"
                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm">In-House Installment Plan</span>
                <span className="text-xs font-mono font-bold text-blue-300">4 PAYMENTS</span>
              </div>
              <div className="text-2xl font-black text-white">$750 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <div className="text-[11px] text-slate-400 mt-1">$750 due today, then 3 monthly payments of $750</div>
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleEnroll}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-black text-base uppercase tracking-wider rounded-xl shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>INITIALIZING COACHING ENROLLMENT…</span>
            ) : (
              <>
                <Crown className="w-5 h-5 text-black" />
                <span>ENROLL IN {programTitle.toUpperCase()}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onDecline}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors underline font-medium"
          >
            No thanks, complete my order with my training programs only
          </button>
        </div>
      </div>
    </div>
  );
}
