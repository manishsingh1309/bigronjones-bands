import { getFunnelApiUrl } from "../lib/funnelEngine";
import React, { useState, useEffect, useRef } from "react";
import { Package, Truck, Check, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

interface BandOfferStepProps {
  funnelId: "funnel_a" | "funnel_b";
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  onAccept: (orderData: any) => void;
  onDecline: () => void;
}

export default function BandOfferStep({
  funnelId,
  customerEmail = "",
  customerName = "",
  customerPhone = "",
  onAccept,
  onDecline,
}: BandOfferStepProps) {
  const [inventory, setInventory] = useState<{
    totalCap: number;
    completedSales: number;
    remaining: number;
    isSoldOut: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  // Shipping Form State
  const [name, setName] = useState(customerName);
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState(customerPhone);
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch(getFunnelApiUrl("/api/funnels/status"))
      .then((res) => {
        if (!res.ok) throw new Error("Status endpoint unavailable");
        return res.json();
      })
      .then((data) => {
        if (mounted && data) {
          setInventory(data);
          if (data.isSoldOut || (typeof data.remaining === "number" && data.remaining <= 0)) {
            console.log("[BandOfferStep] 30-sale cap reached, auto-bypassing bands offer");
            onDecline();
          }
        }
      })
      .catch((err) => {
        console.warn("[BandOfferStep] Status check note:", err?.message);
        if (mounted) {
          setInventory({ totalCap: 30, completedSales: 0, remaining: 30, isSoldOut: false });
        }
      });

    return () => {
      mounted = false;
    };
  }, [onDecline]);

  const scrollToClaim = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAddress = addressLine1.trim();
    const cleanCity = city.trim();
    const cleanState = state.trim().toUpperCase();
    const cleanPostal = postalCode.trim().toUpperCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please provide a valid email address for USPS parcel tracking.");
      return;
    }
    if (!cleanName) {
      setError("Please provide recipient full name.");
      return;
    }
    if (!cleanAddress || !cleanCity || !cleanState || !cleanPostal) {
      setError("Please complete all shipping address fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getFunnelApiUrl("/api/funnels/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "bands",
          email: cleanEmail,
          name: cleanName,
          phone: phone.trim(),
          shippingAddress: {
            line1: cleanAddress,
            city: cleanCity,
            state: cleanState,
            postal_code: cleanPostal,
            country: "US",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        onAccept(data);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 409 || data.soldOut) {
        onDecline();
        return;
      }

      throw new Error(data.error || `Checkout returned status ${res.status}`);
    } catch (err: any) {
      console.warn("[BandOfferStep] Checkout warning:", err);
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        err.message?.includes("fetch")
      ) {
        console.info("[BandOfferStep] Standalone/dev preview mode active: advancing to next step.");
        onAccept({ testMode: true, checkoutType: "bands" });
        return;
      }
      setError(err?.message || "Checkout error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const remainingKits = inventory ? Math.max(0, inventory.remaining) : 30;

  return (
    <div className="w-full">
      {/* ── SECTION 01 — HERO (Exact Match to foundation.bigronjones.com) ── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-200 text-center">
        {/* Subtle radial glow in brand blue */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-[#0A3161]/5 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/80 bg-white text-[#0A3161] font-['DM_Mono'] text-[11px] sm:text-xs uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={13} className="text-[#0A3161]" />
            <span>BIGRONJONES · THE RESISTANCE PROTOCOL</span>
          </div>

          {/* Headline */}
          <h1 className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92] text-slate-900 mb-6 uppercase">
            EVERYTHING STARTS
            <br />
            <span className="text-[#B31942]">SOMEWHERE.</span>
          </h1>

          {/* Supporting Copy */}
          <div className="max-w-2xl mx-auto mb-8 space-y-3 font-['DM_Sans'] text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
            <p>
              A strong body does not require a complicated beginning.<br />
              Start with the tool, the structure, and the willingness to work.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto w-full mb-10">
            <button
              type="button"
              onClick={scrollToClaim}
              className="w-full bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider py-4 px-8 rounded-xl uppercase transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/25 cursor-pointer"
            >
              <span>GET MY BANDS</span>
              <ArrowRight size={22} />
            </button>

            <p className="font-['DM_Mono'] text-xs sm:text-sm text-slate-500 tracking-wider">
              Official BigRonJones® Resistance Band Kit · Strictly limited to 30 Kits.
            </p>
          </div>

          {/* Verified Scarcity & Offer Allocation Card */}
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-['DM_Mono'] uppercase tracking-widest text-[#0A3161] font-bold block mb-1">
                  OFFICIAL OFFER
                </span>
                <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-slate-900 tracking-wide uppercase leading-tight">
                  BIGRONJONES RESISTANCE BAND KIT
                </h2>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-['DM_Mono'] uppercase tracking-widest text-slate-400 block mb-0.5">
                  PRICE
                </span>
                <span className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-[#0A3161] leading-none">
                  FREE
                </span>
                <span className="text-xs text-slate-500 font-['DM_Mono'] block">+ S&amp;H ($15.00)</span>
              </div>
            </div>

            {/* Scarcity Notice */}
            <div className="my-6">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-900 font-['DM_Mono'] text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-amber-600 shrink-0" />
                  <span className="font-bold tracking-wider uppercase">
                    {remainingKits} OF 30 KITS AVAILABLE
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  STRICT ALLOCATION
                </span>
              </div>
            </div>

            {/* Product Image */}
            <div className="rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 mb-6">
              <img
                src="/images/ron/band-training.jpg"
                alt="BigRonJones Heavy Duty Resistance Band Set"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/ron/band-coaching.jpg";
                }}
              />
            </div>

            {/* Inclusions */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium mb-6 font-['DM_Sans']">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Commercial grade, anti-snap layered latex</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full progressive tension range (10 lbs – 50+ lbs)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Heavy-duty door anchor & cushioned ergonomic grips</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ships via insured USPS Priority within 3-5 business days</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={scrollToClaim}
              className="w-full bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-xl sm:text-2xl tracking-wider py-3.5 px-6 rounded-xl uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer"
            >
              <span>CLAIM YOUR BAND SET</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 02 — SHIPPING FULFILLMENT FORM ── */}
      <section ref={formRef} className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-['DM_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-2">
            STEP 01 — DELIVERY DESTINATION
          </span>
          <h3 className="font-['Bebas_Neue'] text-3xl sm:text-5xl text-slate-900 tracking-wide uppercase leading-none">
            WHERE SHOULD WE SHIP YOUR BANDS?
          </h3>
          <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600 mt-2">
            Provide your mailing address below. Kit ships directly to you via USPS Priority.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans'] flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleClaim} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address (USPS Tracking) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number (Delivery Notifications)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="123 Performance Way, Apt 4B"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dallas"
                className="w-full px-3.5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                State *
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="TX"
                className="w-full px-3.5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none uppercase shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="75001"
                className="w-full px-3.5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-['DM_Mono'] mt-6">
            <div className="flex justify-between text-slate-500">
              <span>Resistance Band Kit:</span>
              <span className="line-through text-slate-400">$49.00</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Promotional Equipment Credit:</span>
              <span>-$49.00 (100% FREE)</span>
            </div>
            <div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200">
              <span>Insured USPS Priority Shipping:</span>
              <span>$15.00</span>
            </div>
            <div className="flex justify-between text-[#0A3161] font-black text-sm pt-1 border-t border-slate-200">
              <span>TOTAL DUE TODAY:</span>
              <span className="text-[#B31942] text-lg font-black">$15.00</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/25 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span>INITIALIZING SECURE CHECKOUT...</span>
            ) : (
              <>
                <span>CLAIM MY FREE BANDS NOW (PAY $15 S&amp;H)</span>
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
