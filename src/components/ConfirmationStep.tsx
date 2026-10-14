import React from "react";
import { CheckCircle2, Package, Dumbbell, Crown, ArrowRight, ShieldCheck, Lock, ExternalLink } from "lucide-react";

interface ConfirmationStepProps {
  funnelId: "funnel_a" | "funnel_b";
  customerEmail?: string;
  orderSummary?: {
    hasBands?: boolean;
    primaryProgramTitle?: string;
    isDownsell?: boolean;
    twoPackTitles?: string[];
    coachingProgramTitle?: string;
    coachingPlan?: "pif" | "in_house";
    totalPaid?: number;
  };
}

export default function ConfirmationStep({
  funnelId,
  customerEmail = "your email",
  orderSummary = {
    primaryProgramTitle: "Performance Training",
    hasBands: true,
  },
}: ConfirmationStepProps) {
  const calculateTotal = () => {
    if (typeof orderSummary.totalPaid === "number") return orderSummary.totalPaid;
    let sum = 0;
    if (orderSummary.hasBands) sum += 15;
    if (orderSummary.isDownsell) sum += 199;
    else if (orderSummary.primaryProgramTitle) sum += 249;
    if (orderSummary.twoPackTitles && orderSummary.twoPackTitles.length > 0) sum += 398.40;
    if (orderSummary.coachingProgramTitle) {
      sum += orderSummary.coachingPlan === "in_house" ? 750 : 3000;
    }
    return sum;
  };

  const total = calculateTotal();

  return (
    <div className="w-full max-w-2xl mx-auto text-center py-2 sm:py-4">
      {/* ── Success Icon & Header ─────────────────────────────────────────── */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600" />
      </div>

      <span className="font-['DM_Mono'] text-xs font-bold tracking-[0.25em] text-emerald-700 uppercase block mb-2">
        TRANSACTION CONFIRMED • ENROLLMENT COMPLETE
      </span>
      <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-3">
        WELCOME TO <span className="text-[#0A3161]">BIGRONJONES®</span>
      </h1>
      <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        Your orders have been processed and your account entitlements are active. Confirmation receipt and credentials have been dispatched to:
        <span className="block font-['DM_Mono'] font-bold text-slate-900 mt-1 text-sm">{customerEmail}</span>
      </p>

      {/* ── Itemized Order Summary Box ────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#0A3161]/20 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="font-['Bebas_Neue'] text-2xl text-slate-900 tracking-wide uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Official Receipt &amp; Entitlement Breakdown</span>
          </h2>
          <span className="font-['DM_Mono'] text-sm sm:text-base font-black text-[#0A3161]">
            Total: ${total.toFixed(2)}
          </span>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm font-['DM_Sans']">
          {orderSummary.primaryProgramTitle && (
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <Dumbbell className="w-5 h-5 text-[#0A3161] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {orderSummary.primaryProgramTitle} {orderSummary.isDownsell ? "(DIY Protocol)" : "Complete Package"}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Your 8-video progression library is active. Sign in with your email at <strong>bigronjones.com</strong>.
                  </p>
                </div>
              </div>
              <span className="font-['DM_Mono'] font-bold text-slate-900 shrink-0">
                ${orderSummary.isDownsell ? "199.00" : "249.00"}
              </span>
            </div>
          )}

          {orderSummary.twoPackTitles && orderSummary.twoPackTitles.length > 0 && (
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <Dumbbell className="w-5 h-5 text-[#0A3161] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    2-Program Companion Bundle ({orderSummary.twoPackTitles.join(" & ")})
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Both complementary training programs have been added to your member vault.
                  </p>
                </div>
              </div>
              <span className="font-['DM_Mono'] font-bold text-slate-900 shrink-0">$398.40</span>
            </div>
          )}

          {orderSummary.hasBands && (
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#B31942] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Free Resistance Band Kit ($15 S&amp;H)</div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Your physical band kit is queued for USPS priority packing. Tracking details will be emailed upon dispatch.
                  </p>
                </div>
              </div>
              <span className="font-['DM_Mono'] font-bold text-slate-900 shrink-0">$15.00</span>
            </div>
          )}

          {orderSummary.coachingProgramTitle && (
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {orderSummary.coachingProgramTitle}
                    {orderSummary.coachingPlan === "in_house" ? " (Monthly Plan)" : " (PIF)"}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Check your email for your intake onboarding protocol prior to your initial Zoom call with your coach.
                  </p>
                </div>
              </div>
              <span className="font-['DM_Mono'] font-bold text-slate-900 shrink-0">
                {orderSummary.coachingPlan === "in_house" ? "$750.00 / mo" : "$3,000.00"}
              </span>
            </div>
          )}
        </div>

        {/* ── Next Steps Action ────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-slate-200">
          <a
            href="https://bigronjones.com"
            className="w-full py-4 sm:py-5 bg-[#0A3161] hover:bg-[#08274d] text-white font-['Bebas_Neue'] text-2xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-blue-900/25 flex items-center justify-center gap-3 cursor-pointer text-center"
          >
            <span>ACCESS CLIENT PORTAL (BIGRONJONES.COM)</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-['DM_Mono'] text-[11px] uppercase tracking-wider text-center">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Receipt Verified
        </span>
        <span>•</span>
        <span>Customer Support: RonJones@BigRonJones.com</span>
      </div>
    </div>
  );
}
