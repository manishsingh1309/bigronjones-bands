import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FunnelShellProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  funnelTitle?: string;
  onBack?: () => void;
  ctaText?: string;
  onCtaClick?: () => void;
  children: React.ReactNode;
}

export default function FunnelShell({
  currentStep,
  totalSteps,
  stepLabel,
  funnelTitle = "ATHLETIC DIAGNOSTIC & ENROLLMENT PROTOCOL",
  onBack,
  ctaText,
  onCtaClick,
  children,
}: FunnelShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | "refund" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0A3161] selection:text-white antialiased overflow-x-hidden">
      {/* ══ 1. TOP BRAND BLUE TAGLINE BAR — Exact Match to BigRonJones®, The Standard, & The Foundation ══ */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0A3161] py-1.5 shadow-sm">
        <p className="text-center font-['DM_Mono'] text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white font-medium px-2">
          &ldquo;Practical Advice for Your Real World Goals.<span style={{ fontSize: "0.78em", verticalAlign: "super", fontWeight: 700, marginLeft: "0.08em" }}>®</span>&rdquo;
        </p>
      </div>

      {/* ══ 2. MAIN NAVBAR — Clean, Premium, Distraction-Free Brand Header ══ */}
      <header
        className={`fixed top-[28px] inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2.5 md:py-3.5"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3 md:py-4"
        }`}
      >
        <div className="w-full flex h-14 sm:h-16 md:h-20 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
          {/* Brand Avatar + BIGRONJONES® Wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 select-none">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 min-h-[40px] min-w-[40px] rounded-lg text-slate-500 hover:text-[#0A3161] hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer border border-slate-200 mr-1"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <a
              href="https://bigronjones.com"
              className="flex items-center gap-2.5 sm:gap-3.5 group select-none cursor-pointer"
            >
              <img
                src="/images/ron/bigronjones.png?v=4"
                alt="BigRonJones®"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/ron/ron-headshot.png";
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 select-none rounded-full border-2 border-[#0A3161]/70 object-cover object-center shadow-sm"
              />
              <span className="font-['Bebas_Neue'] text-2xl tracking-[0.08em] sm:text-3xl text-slate-900 select-none leading-none">
                BIGRONJONES
                <span
                  style={{
                    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontSize: "0.32em",
                    verticalAlign: "0.85em",
                    lineHeight: 1,
                    fontWeight: 800,
                    letterSpacing: 0,
                    marginLeft: "0.08em",
                    display: "inline-block",
                  }}
                >
                  ®
                </span>
              </span>
            </a>
          </div>

          {/* Right Action: Clean Step Tracker or Primary Action Button */}
          <div className="flex items-center gap-3">
            {ctaText && onCtaClick ? (
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center justify-center rounded-lg bg-[#B31942] px-3.5 py-2 sm:px-5 sm:py-2.5 md:py-3 font-['DM_Mono'] text-[10px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white shadow-md shadow-red-900/25 hover:bg-[#8e1032] hover:shadow-red-900/35 transition-all duration-200 whitespace-nowrap active:scale-[0.98] cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight size={13} className="ml-1 sm:ml-1.5" />
              </button>
            ) : currentStep > 1 ? (
              <div className="flex items-center gap-1.5 bg-slate-100/90 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-['DM_Mono'] font-bold">
                <span className="text-[#0A3161]">STEP {currentStep}</span>
                <span className="text-slate-400">OF {totalSteps}</span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* ══ 3. FUNNEL CONTENT CANVAS ══ */}
      <main className="flex-1 w-full pt-[96px] sm:pt-[108px] md:pt-[116px]">
        {children}
      </main>

      {/* ══ 4. OFFICIAL FOOTER — Matching BigRonJones® & The Foundation ══ */}
      <footer className="relative overflow-hidden border-t border-slate-200 bg-[#FFFFFF] pt-12 pb-10 text-slate-900 mt-16 sm:mt-24">
        {/* Signature BigRonJones® Background Watermark */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-0 right-0 select-none whitespace-nowrap text-center font-['Bebas_Neue'] leading-none text-slate-200/40"
          style={{
            fontSize: "clamp(4rem, 16vw, 18rem)",
            letterSpacing: "0.02em",
          }}
        >
          BIGRONJONES
          <span
            style={{
              fontSize: "0.30em",
              verticalAlign: "0.82em",
              fontWeight: 800,
              marginLeft: "0.06em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            ®
          </span>
        </span>

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/ron/bigronjones.png?v=4"
                  alt="BigRonJones®"
                  className="h-10 w-10 select-none rounded-full border-2 border-[#0A3161]/70 object-cover object-center shadow-sm"
                />
                <div>
                  <span className="font-['Bebas_Neue'] text-2xl tracking-[0.08em] text-slate-900 block leading-none">
                    BIGRONJONES
                    <span
                      style={{
                        fontSize: "0.30em",
                        verticalAlign: "0.82em",
                        fontWeight: 800,
                        marginLeft: "0.06em",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      ®
                    </span>
                  </span>
                  <span className="font-['DM_Mono'] text-[9px] uppercase tracking-[0.2em] text-[#0A3161] font-bold">
                    {funnelTitle}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3 font-['DM_Sans'] uppercase font-medium tracking-wide">
                PRACTICAL ADVICE FOR YOUR REAL WORLD GOALS.
                <span style={{ fontSize: "0.78em", verticalAlign: "super", fontWeight: 700, marginLeft: "0.08em" }}>
                  ®
                </span>
              </p>
              <p className="text-xs text-slate-500 font-['DM_Mono']">
                BigRonJones LLC · 10845 Griffith Peak Dr, Las Vegas, NV 89135
              </p>
            </div>

            {/* Support & Legal Column */}
            <div className="md:text-right flex flex-col md:items-end justify-between">
              <div>
                <h4 className="font-['DM_Mono'] text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
                  Client Support &amp; Oversight
                </h4>
                <a
                  href="mailto:RonJones@BigRonJones.com"
                  className="text-sm text-[#0A3161] hover:text-[#08274d] font-['DM_Mono'] font-medium transition-colors"
                >
                  RonJones@BigRonJones.com
                </a>
              </div>

              <div className="mt-6 flex items-center md:justify-end gap-4 text-xs font-['DM_Mono'] text-slate-500">
                <button
                  type="button"
                  onClick={() => setLegalModal("privacy")}
                  className="hover:text-[#0A3161] transition-colors cursor-pointer"
                >
                  Privacy
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setLegalModal("terms")}
                  className="hover:text-[#0A3161] transition-colors cursor-pointer"
                >
                  Terms
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setLegalModal("refund")}
                  className="hover:text-[#0A3161] transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 text-center sm:text-left text-[11px] font-['DM_Mono'] text-slate-400">
            <p>© {new Date().getFullYear()} BigRonJones®. All rights reserved. Statements on this site have not been evaluated by the FDA.</p>
          </div>
        </div>
      </footer>

      {/* ══ 5. LEGAL MODAL DIALOG ══ */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLegalModal(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-slate-800 max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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
                    BigRonJones® respects your privacy. All contact information, diagnostic responses, and order records submitted through this portal are securely handled.
                  </p>
                  <p>
                    We never sell, rent, or distribute personal information to third parties. Information is strictly used to deliver your tailored fitness prescription and manage fulfillment.
                  </p>
                </>
              )}
              {legalModal === "terms" && (
                <>
                  <p>
                    By participating in BigRonJones® programs, you acknowledge that you are physically capable of physical exercise and have consulted a qualified physician if necessary.
                  </p>
                  <p>
                    All video modules, training regimens, and coaching materials are proprietary intellectual property of BigRonJones LLC.
                  </p>
                </>
              )}
              {legalModal === "refund" && (
                <>
                  <p>
                    Physical hardware orders (Resistance Bands) ship via tracked domestic parcel. If equipment arrives defective, immediate replacements are provided upon request.
                  </p>
                  <p>
                    Digital programs carry our 30-Day Practical Results Guarantee. If you complete the workouts and follow the instructions without satisfaction, reach out for a full refund.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
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
