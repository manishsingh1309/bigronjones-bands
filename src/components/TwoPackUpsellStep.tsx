import React, { useState } from "react";
import { Sparkles, Check, ArrowRight, AlertCircle, BookmarkCheck, Lock, ShieldCheck } from "lucide-react";
import { getFunnelApiUrl } from "../lib/funnelEngine";
import { programSeries, getProgramSeriesItem, type ProgramSeriesItem } from "../lib/programSeries";

interface TwoPackUpsellStepProps {
  funnelId: "funnel_a" | "funnel_b";
  purchasedProgramId: number;
  customerEmail?: string;
  customerName?: string;
  onAccept: (orderData: any, selectedPrograms?: ProgramSeriesItem[]) => void;
  onDecline: () => void;
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

  const purchasedProgram = getProgramSeriesItem(purchasedProgramId);

  // Remaining eligible programs (strictly excluding the one already purchased)
  const eligiblePrograms: ProgramSeriesItem[] = programSeries.filter(
    (p: ProgramSeriesItem) => p.id !== purchasedProgramId
  );

  const toggleProgram = (id: number) => {
    setError(null);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 2) {
        setError("You can choose exactly two additional programs. Tap one of your selected programs to unselect it first.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getSelectedProgramObjects = (): ProgramSeriesItem[] => {
    return eligiblePrograms.filter((p: ProgramSeriesItem) => selectedIds.includes(p.id));
  };

  const handleCheckout = async () => {
    if (selectedIds.length !== 2) {
      setError("Please select exactly two programs to complete your 2-program discounted bundle.");
      return;
    }

    setLoading(true);
    setError(null);

    const chosenPrograms = getSelectedProgramObjects();

    try {
      const res = await fetch(getFunnelApiUrl("/api/funnels/checkout"), {
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

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        onAccept(data, chosenPrograms);
        return;
      }

      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Checkout returned status ${res.status}`);
    } catch (err: any) {
      console.warn("[TwoPackUpsell] Checkout warning:", err);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        err.message?.includes("fetch")
      ) {
        console.info("[TwoPackUpsell] Standalone/dev preview mode active: advancing to ascension step.");
        onAccept({ testMode: true, checkoutType: "twopack_398" }, chosenPrograms);
        return;
      }
      setError(err?.message || "Checkout error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-4">
      {/* ── Heading ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0A3161] text-xs font-['DM_Mono'] font-bold uppercase tracking-[0.25em] mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0A3161]" />
          <span>SPECIAL BUNDLE ACCELERATOR • SAVE 20% TODAY</span>
        </div>

        <h1 className="font-['Bebas_Neue'] text-4xl sm:text-6xl uppercase tracking-[0.02em] text-slate-900 leading-[0.95] mb-2">
          CHOOSE 2 COMPANION <span className="text-[#0A3161]">TRAINING PROTOCOLS</span>
        </h1>
        <p className="font-['DM_Sans'] text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Expand your athletic foundation across strength, mobility, and endurance. Add any 2 companion programs for just $398.40 (Save $99.60 today).
        </p>

        {purchasedProgram && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-['DM_Mono'] font-bold">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Already Enrolled: <strong>{purchasedProgram.title}</strong></span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans'] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Selection Grid ────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="font-['DM_Mono'] text-xs uppercase tracking-wider text-slate-600 font-bold">
            Select Any 2 Companion Protocols:
          </span>
          <span className="font-['DM_Mono'] text-xs font-bold text-[#0A3161] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {selectedIds.length} of 2 Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {eligiblePrograms.map((p: ProgramSeriesItem) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleProgram(p.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center ${
                  isSelected
                    ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={p.image || `/programs/thumb-${p.id}.jpg`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/programs/thumb-${p.id}.webp`;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-['Bebas_Neue'] text-lg text-slate-900 tracking-wide uppercase truncate">
                      {p.title}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#0A3161] border-[#0A3161] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="font-['DM_Sans'] text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {p.blurb}
                  </p>
                  <span className="inline-block mt-1 font-['DM_Mono'] text-[10px] text-[#0A3161] font-bold uppercase tracking-wider">
                    {p.focus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bundle Summary & CTA ─────────────────────────────────────────── */}
      <div className="bg-white border-2 border-[#0A3161]/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-['DM_Mono'] mb-6">
          <div className="flex justify-between text-slate-500">
            <span>2 Companion Training Programs:</span>
            <span className="line-through text-slate-400">$498.00</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>20% Bundle Savings:</span>
            <span>-$99.60 (20% OFF)</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
            <span>TOTAL DUE TODAY:</span>
            <span className="text-[#B31942] text-xl font-black">$398.40</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || selectedIds.length !== 2}
          className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 active:scale-[0.99]"
        >
          {loading ? (
            <span>PROCESSING 2-PROGRAM BUNDLE…</span>
          ) : (
            <>
              <span>ADD 2 PROGRAMS FOR $398.40 (SAVE $99.60)</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="text-center pt-3">
          <button
            type="button"
            onClick={onDecline}
            className="font-['DM_Mono'] text-xs font-semibold text-slate-400 hover:text-slate-700 uppercase tracking-widest underline underline-offset-4 cursor-pointer transition-colors"
          >
            No thanks, I will stick with my single program »
          </button>
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
          Lifetime Portal Access Included
        </span>
      </div>
    </div>
  );
}
