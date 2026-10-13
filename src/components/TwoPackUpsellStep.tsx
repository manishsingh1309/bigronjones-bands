import React, { useState } from "react";
import { Check, ArrowRight, Sparkles, AlertCircle, Dumbbell } from "lucide-react";
import { programSeries, type ProgramSeriesItem } from "../lib/programSeries";

interface TwoPackUpsellStepProps {
  funnelId: "funnel_a" | "funnel_b";
  purchasedProgramId: number;
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void; // Proceeds to $3,000 coaching offer
}

export default function TwoPackUpsellStep({
  funnelId,
  purchasedProgramId,
  customerEmail = "",
  customerName = "",
  onAccept,
  onDecline,
}: TwoPackUpsellStepProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remaining eligible programs (excluding the one already purchased)
  const eligiblePrograms = programSeries.filter((p) => p.id !== purchasedProgramId);

  const toggleProgram = (id: number) => {
    setError(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 2) {
        setError("You can choose exactly two additional programs for this bundle.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCheckout = async () => {
    if (selectedIds.length !== 2) {
      setError("Please select exactly two programs to complete your 2-program discounted bundle.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/funnels/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "twopack_398",
          purchasedProgramId,
          selectedProgramIds: selectedIds,
          email: customerEmail,
          name: customerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize 2-program checkout");
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
      {/* ── Heading ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800 text-purple-400 text-xs font-mono mb-3">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>COMPLEMENTARY PROGRAM BUNDLE • 20% DISCOUNT</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          CHOOSE 2 MORE PROGRAMS
        </h1>
        <p className="mt-2 text-base text-[#F59E0B] font-bold">
          20% Off Each Program • $199.20 Each (Total $398.40)
        </p>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Expand your training stack across power, endurance, or mobility. Select any two distinct programs below.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Selection Indicator ───────────────────────────────────────────── */}
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span>Selected:</span>
          <span className="font-bold text-white text-sm">
            {selectedIds.length} of 2 programs
          </span>
        </div>
        <div className="text-purple-400 font-semibold">
          Bundle Price: <strong>$398.40</strong> <span className="line-through text-slate-500">$498.00</span>
        </div>
      </div>

      {/* ── Eligible Programs Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        {eligiblePrograms.map((prog) => {
          const isSelected = selectedIds.includes(prog.id);
          return (
            <button
              key={prog.id}
              type="button"
              onClick={() => toggleProgram(prog.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-[#0A3161]/90 border-purple-500 ring-2 ring-purple-500/30 text-white shadow-lg"
                  : "bg-[#111622] border-slate-800/80 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-purple-400 font-bold uppercase">
                    PROGRAM 0{prog.id}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div className="font-bold text-base text-white mb-1">{prog.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed mb-3">{prog.blurb}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{prog.focus}</span>
                <span className="text-emerald-400 font-bold">$199.20</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Checkout & Continue ───────────────────────────────────────────── */}
      <div className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400">Total for Two Additional Programs:</div>
            <div className="text-3xl font-black text-white">$398.40</div>
          </div>
          <div className="text-right text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
            YOU SAVE $99.60 (20% OFF)
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || selectedIds.length !== 2}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base uppercase tracking-wider rounded-xl shadow-xl hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          {loading ? (
            <span>PROCESSING TWO-PROGRAM SELECTION…</span>
          ) : (
            <>
              <span>ADD 2 ADDITIONAL PROGRAMS — $398.40</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onDecline}
          className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors underline font-medium"
        >
          No thanks, I will stick with my single purchased program (continue to next step)
        </button>
      </div>
    </div>
  );
}
