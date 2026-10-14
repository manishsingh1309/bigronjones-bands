import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

interface FunnelShellProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  funnelTitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function FunnelShell({
  currentStep,
  totalSteps,
  stepLabel,
  funnelTitle = "ATHLETIC DIAGNOSTIC & ENROLLMENT PROTOCOL",
  onBack,
  children,
}: FunnelShellProps) {
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "refund" | null>(null);

  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLegalModal(null);
    };
    if (legalModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [legalModal]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#0A3161] selection:text-white overflow-x-hidden antialiased">
      {/* ── Top Announcement Bar (Official Old Glory Blue) ─────────────────── */}
      <div className="bg-[#0A3161] text-white py-2 px-4 text-center border-b border-[#08274d]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs font-['DM_Mono'] font-bold uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-[#B31942] animate-pulse shrink-0" />
          <span>OFFICIAL BIGRONJONES® PROTOCOL • LIMITED DIRECT ENROLLMENT ACCESS</span>
        </div>
      </div>

      {/* ── Strict Funnel Header (Clean Athletic Luxury White) ─────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Optional Back */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-[#0A3161] hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer border border-slate-200"
                aria-label="Go back to previous step"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/images/ron/bigronjones.png"
                alt="Big Ron Jones"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/ron/ron-headshot.png";
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0A3161] object-cover shadow-sm shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider text-slate-900 leading-none">
                  BIGRONJONES<span className="text-[#B31942]">®</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-['DM_Mono'] font-bold tracking-[0.2em] text-[#0A3161] truncate max-w-[160px] sm:max-w-none">
                  {funnelTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badges & Step Tracker */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-['DM_Mono'] shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold shadow-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100/90 px-3.5 py-1.5 rounded-full border border-slate-300/80 font-bold">
              <span className="text-[#B31942]">STEP {currentStep}</span>
              <span className="text-slate-400">OF {totalSteps}</span>
            </div>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="flex items-center justify-between text-[11px] font-['DM_Mono'] font-bold mb-1.5">
            <span className="uppercase tracking-wider text-[#0A3161]">{stepLabel}</span>
            <span className="text-slate-600">{progressPercent}% COMPLETE</span>
          </div>
          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#0A3161] via-[#164680] to-[#B31942] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── Funnel Body with Luxury Radial Glow ────────────────────────────── */}
      <main className="flex-1 relative max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col justify-center">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 10%, rgba(10, 49, 97, 0.05) 0%, rgba(248, 250, 252, 0) 70%)",
          }}
        />
        {children}
      </main>

      {/* ── Legal & Compliance Footer ───────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official BigRonJones® Authorized Protocol • Guaranteed Authentic</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-['DM_Mono'] text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="hover:text-[#0A3161] transition-colors underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="hover:text-[#0A3161] transition-colors underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("refund")}
              className="hover:text-[#0A3161] transition-colors underline cursor-pointer"
            >
              Fulfillment & Refunds
            </button>
          </div>
        </div>

        <p className="mt-4 text-[11px] font-['DM_Sans'] text-slate-500 max-w-2xl mx-auto leading-relaxed">
          © {new Date().getFullYear()} BigRonJones®. All rights reserved. Statements on this site have not been evaluated by the FDA. Programs and coaching are designed for healthy adults seeking structured fitness oversight.
        </p>
      </footer>

      {/* ── Legal Modal ────────────────────────────────────────────────────── */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLegalModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-800 max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide text-slate-900 uppercase">
                {legalModal === "privacy" && "Privacy Notice & Data Security"}
                {legalModal === "terms" && "Terms of Service & Program License"}
                {legalModal === "refund" && "Fulfillment & Refund Policy"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-sm leading-relaxed text-slate-600 space-y-3 font-['DM_Sans']">
              {legalModal === "privacy" && (
                <>
                  <p>
                    BigRonJones® respects your privacy. All contact information, assessment inputs, and shipping records submitted through this portal are encrypted via 256-Bit SSL transmission.
                  </p>
                  <p>
                    We never sell, rent, or distribute personal data to third-party marketing brokers. Diagnostic information is exclusively utilized to generate your personalized fitness prescription and coordinate program delivery.
                  </p>
                </>
              )}
              {legalModal === "terms" && (
                <>
                  <p>
                    By participating in BigRonJones® training programs, you verify that you are physically capable of exercise and have consulted a qualified physician prior to undertaking any rigorous physical routine.
                  </p>
                  <p>
                    All video modules, training templates, and coaching collateral are proprietary intellectual property of BigRonJones®. Unauthorized distribution or reproduction is strictly prohibited.
                  </p>
                </>
              )}
              {legalModal === "refund" && (
                <>
                  <p>
                    Physical hardware orders (Resistance Band Kits) are fulfilled and dispatched via tracked USPS parcel. If equipment arrives defective or damaged, replacement units are provided immediately upon verification.
                  </p>
                  <p>
                    Digital training programs and Zoom consultations carry a 30-day satisfaction guarantee. If you complete the prescribed modules and conclude the guidance was unhelpful, contact support@bigronjones.com for a full, courteous refund.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-6 py-2.5 rounded-xl bg-[#0A3161] hover:bg-[#08274d] text-white font-['DM_Mono'] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
