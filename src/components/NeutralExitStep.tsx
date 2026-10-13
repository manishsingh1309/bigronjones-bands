import React from "react";
import { Check, Bookmark, ArrowRight, ShieldCheck, Dumbbell } from "lucide-react";
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
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* ── Saved Prescription Icon ────────────────────────────────────────── */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
        <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
        PRESCRIPTION ON FILE • FUNNEL CONCLUDED
      </span>
      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 mb-4">
        YOUR RESULTS ARE SAVED
      </h1>
      <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8">
        Thank you for completing the BigRonJones® diagnostic assessment. You have chosen not to enroll in a training program today. No charges were made to any payment method.
      </p>

      {/* ── Summary of Matched Program ─────────────────────────────────────── */}
      {matchedProgram && (
        <div className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Your Prescribed Training Program:
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              Program 0{matchedProgram.id}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
              <Dumbbell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{matchedProgram.title}</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {matchedProgram.blurb}
              </p>
              <div className="mt-2 text-xs font-mono text-slate-500">
                Primary focus: {matchedProgram.focus} • 4 Gym Days + 4 Home Days
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            When you are ready to execute with deliberate structure, you can revisit BigRonJones® at any time to activate your program.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 max-w-sm mx-auto">
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Retake Diagnostic Assessment
          </button>
        )}
      </div>

      <p className="mt-8 text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} BigRonJones® Command Center • Strategy First. Execution Always.
      </p>
    </div>
  );
}
