import React from "react";
import { Bookmark, Dumbbell, ArrowRight, ExternalLink, RotateCcw, ShieldCheck } from "lucide-react";
import type { ProgramSeriesItem } from "../lib/programSeries";

interface NeutralExitStepProps {
  funnelId: "funnel_a" | "funnel_b";
  matchedProgram?: ProgramSeriesItem;
  customerEmail?: string;
  onRestart?: () => void;
}

export default function NeutralExitStep({
  funnelId,
  matchedProgram,
  customerEmail,
  onRestart,
}: NeutralExitStepProps) {
  const handleRestart = () => {
    try {
      sessionStorage.removeItem("brj_funnel_assessment");
      sessionStorage.removeItem("brj_funnel_prescription");
      sessionStorage.removeItem("brj_funnel_orders");
    } catch {}
    if (onRestart) onRestart();
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center py-2 sm:py-4">
      {/* ── Saved Prescription Icon ────────────────────────────────────────── */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 border-2 border-[#0A3161] rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
        <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-[#0A3161]" />
      </div>

      <span className="font-['DM_Mono'] text-xs font-bold tracking-[0.25em] text-[#0A3161] uppercase block mb-2">
        DIAGNOSTIC ON FILE • PROTOCOL ARCHIVED
      </span>
      <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-3">
        YOUR RESULTS ARE <span className="text-[#0A3161]">SAVED</span>
      </h1>
      <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
        Thank you for completing the BigRonJones® diagnostic assessment. You have chosen not to enroll in a training protocol today. No charges were made to any payment method.
        {customerEmail && (
          <span className="block font-['DM_Mono'] text-xs text-slate-500 mt-2">
            Prescription notification logged for: <strong className="text-slate-800">{customerEmail}</strong>
          </span>
        )}
      </p>

      {/* ── Summary of Matched Program ─────────────────────────────────────── */}
      {matchedProgram && (
        <div className="bg-white border-2 border-[#0A3161]/20 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-['DM_Mono'] text-xs uppercase tracking-wider text-slate-600 font-bold">
              Your Prescribed Training Protocol:
            </span>
            <span className="font-['DM_Mono'] text-xs font-bold text-[#0A3161] uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Program 0{matchedProgram.id}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Dumbbell className="w-7 h-7 text-[#0A3161]" />
            </div>
            <div>
              <h2 className="font-['Bebas_Neue'] text-2xl text-slate-900 tracking-wide uppercase leading-tight">
                {matchedProgram.title}
              </h2>
              <p className="font-['DM_Sans'] text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {matchedProgram.blurb}
              </p>
              <div className="mt-2 font-['DM_Mono'] text-xs font-bold text-[#0A3161] uppercase tracking-wider">
                Primary focus: {matchedProgram.focus} • 4 Gym Days + 4 Home Days
              </div>
            </div>
          </div>

          <p className="font-['DM_Sans'] text-xs text-slate-500 pt-3 border-t border-slate-200">
            When you are ready to execute with deliberate structure and direct coaching oversight, you can return to BigRonJones® at any time to activate your curriculum.
          </p>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 max-w-sm mx-auto">
        <a
          href="https://bigronjones.com"
          className="w-full py-4 px-6 min-h-[48px] bg-[#0A3161] hover:bg-[#08274d] text-white rounded-xl font-['Bebas_Neue'] text-xl tracking-wider uppercase transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <span>EXPLORE BIGRONJONES.COM</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {onRestart && (
          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3 px-6 min-h-[44px] bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-['DM_Mono'] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic Assessment</span>
          </button>
        )}
      </div>

      <p className="mt-8 text-xs text-slate-400 font-['DM_Mono'] uppercase tracking-wider">
        © {new Date().getFullYear()} BigRonJones® • Strategy First. Execution Always.
      </p>
    </div>
  );
}
