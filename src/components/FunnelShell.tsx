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
  funnelTitle = "BigRonJones® Command Center",
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
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans selection:bg-[#B31942] selection:text-white overflow-x-hidden">
      {/* ── Strict Funnel Header (No Site Navigation) ──────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Optional Back */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 min-h-[44px] min-w-[44px] rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Go back to previous step"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white">
                BIGRONJONES<span className="text-[#F59E0B]">®</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 truncate max-w-[150px] sm:max-w-none">
                {funnelTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono text-slate-300 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
              <span className="text-[#F59E0B] font-bold">Step {currentStep}</span>
              <span className="text-slate-500">/ {totalSteps}</span>
            </div>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mt-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-wider text-[#F59E0B] font-semibold">{stepLabel}</span>
            <span>{progressPercent}% COMPLETE</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0A3161] via-[#2563EB] to-[#F59E0B] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── Funnel Body ───────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col justify-center">
        {children}
      </main>

      {/* ── Legal & Compliance Footer (No Site Navigation) ────────────────── */}
      <footer className="border-t border-slate-800/80 bg-[#07090E] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official BigRonJones® Authorized Enrollment Protocol</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="hover:text-white transition-colors underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="hover:text-white transition-colors underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("refund")}
              className="hover:text-white transition-colors underline cursor-pointer"
            >
              Fulfillment & Refunds
            </button>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-slate-600 max-w-2xl mx-auto">
          © {new Date().getFullYear()} BigRonJones®. All rights reserved. Statements on this site have not been evaluated by the FDA. Programs and coaching are designed for healthy adults seeking structured fitness oversight.
        </p>
      </footer>

      {/* ── Legal Slide-Over / Modal ─────────────────────────────────────── */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLegalModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111622] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-200 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white capitalize">
                {legalModal === "privacy" && "Privacy Notice & Data Security"}
                {legalModal === "terms" && "Terms of Service & Program License"}
                {legalModal === "refund" && "Fulfillment & Refund Policy"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-sm leading-relaxed text-slate-300 space-y-3">
              {legalModal === "privacy" && (
                <>
                  <p>
                    BigRonJones® respects your privacy. All assessment answers, contact information, and payment data are encrypted in transit via TLS 1.3 and processed securely through Stripe.
                  </p>
                  <p>
                    Assessment data is used solely to generate your personalized training prescription and provide tailored fitness guidance. We never sell or share your personal health or contact details with third-party data brokers.
                  </p>
                </>
              )}
              {legalModal === "terms" && (
                <>
                  <p>
                    All training programs, video demonstrations, and consultation materials provided through BigRonJones® are copyrighted and licensed for individual personal use.
                  </p>
                  <p>
                    Purchasers must consult their physician before beginning any physical exercise regimen. Participation is voluntary.
                  </p>
                </>
              )}
              {legalModal === "refund" && (
                <>
                  <p>
                    <strong>Resistance Bands ($15 S&H):</strong> Physical goods ship via standard ground carrier within 3-5 business days. Tracking details are provided upon fulfillment.
                  </p>
                  <p>
                    <strong>Digital Training Programs ($249 & $199):</strong> Instant access is granted upon successful payment confirmation. Consultation calls must be booked within 90 days of enrollment.
                  </p>
                  <p>
                    Questions? WhatsApp message or contact support at RonJones@BigRonJones.com.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-[#0A3161] hover:bg-[#1E40AF] text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
