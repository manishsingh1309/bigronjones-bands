import React from "react";
import { CheckCircle2, Package, Dumbbell, Crown, ArrowRight, ShieldCheck, Mail } from "lucide-react";

interface ConfirmationStepProps {
  funnelId: "funnel_a" | "funnel_b";
  customerEmail?: string;
  orderSummary?: {
    hasBands?: boolean;
    primaryProgramTitle?: string;
    isDownsell?: boolean;
    twoPackTitles?: string[];
    coachingProgramTitle?: string;
    totalPaid?: number;
  };
}

export default function ConfirmationStep({
  funnelId,
  customerEmail = "your email",
  orderSummary = {
    primaryProgramTitle: "Performance Training",
    hasBands: true,
    totalPaid: 264,
  },
}: ConfirmationStepProps) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* ── Success Icon & Header ─────────────────────────────────────────── */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/30">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
        TRANSACTION CONFIRMED • ENROLLMENT COMPLETE
      </span>
      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 mb-4">
        WELCOME TO BIGRONJONES®
      </h1>
      <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto mb-8">
        Your orders have been processed and your account entitlements are active. Confirmation receipt and credentials have been dispatched to:
        <span className="block font-bold text-white mt-1 font-mono text-xs sm:text-sm">{customerEmail}</span>
      </p>

      {/* ── What Happens Next Box ─────────────────────────────────────────── */}
      <div className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-8 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Immediate Access & Fulfillment Next Steps</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          {orderSummary.primaryProgramTitle && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <Dumbbell className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">
                  {orderSummary.primaryProgramTitle} {orderSummary.isDownsell ? "(DIY Version)" : "Package"}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Your 8-video progression library is unlocked. Sign in at <strong>bigronjones.com/auth/login</strong> with your email to start day 1.
                </p>
              </div>
            </div>
          )}

          {orderSummary.twoPackTitles && orderSummary.twoPackTitles.length > 0 && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <Dumbbell className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">
                  Additional Programs ({orderSummary.twoPackTitles.join(" & ")})
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Both complementary training programs have been added to your member portal.
                </p>
              </div>
            </div>
          )}

          {orderSummary.hasBands && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <Package className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Free Resistance Band Kit ($15 S&H)</div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Your physical band kit has been assigned for fulfillment. Tracking information will be emailed as soon as the carrier scans your package.
                </p>
              </div>
            </div>
          )}

          {orderSummary.coachingProgramTitle && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">{orderSummary.coachingProgramTitle} ($3,000)</div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Our team has been notified. Check your email for your confidential coaching intake questionnaire before your initial onboarding Zoom with Big Ron Jones.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Member Login Button */}
        <div className="pt-2">
          <a
            href="https://www.bigronjones.com/auth/login"
            className="w-full py-4 px-6 bg-[#0A3161] hover:bg-[#1E40AF] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>ACCESS MY MEMBER PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="text-xs text-slate-500 font-mono">
        Need help? Contact support anytime at <span className="text-slate-400">RonJones@BigRonJones.com</span>
      </div>
    </div>
  );
}
