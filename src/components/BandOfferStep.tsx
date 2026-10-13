import React, { useState, useEffect } from "react";
import { Package, Truck, ShieldCheck, ArrowRight, Check, AlertCircle } from "lucide-react";

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
    fetch("/api/funnels/status")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setInventory(data);
          if (data.isSoldOut) {
            // Cap reached: automatically trigger decline/bypass according to instructions
            console.log("[BandOfferStep] 30-sale cap reached, auto-bypassing bands offer");
            onDecline();
          }
        }
      })
      .catch((err) => console.warn("Failed to check band status:", err));
    return () => {
      mounted = false;
    };
  }, [onDecline]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !addressLine1 || !city || !state || !postalCode) {
      setError("Please complete all shipping address fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/funnels/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
          checkoutType: "bands",
          email: email.trim().toLowerCase(),
          name: name.trim(),
          phone: phone.trim(),
          shippingAddress: {
            line1: addressLine1.trim(),
            city: city.trim(),
            state: state.trim(),
            postal_code: postalCode.trim(),
            country: "US",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.soldOut) {
          onDecline();
          return;
        }
        throw new Error(data.error || "Failed to initialize band checkout");
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

  const remainingKits = inventory ? inventory.remaining : 30;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Scarcity & Offer Banner ────────────────────────────────────────── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-mono mb-4">
          <Package className="w-4 h-4 text-emerald-400" />
          <span>PHYSICAL HARDWARE ACQUISITION • $0 PRODUCT VALUE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
          FREE RESISTANCE BANDS
        </h1>
        <p className="mt-2 text-xl font-bold text-[#F59E0B]">
          $15 Shipping & Handling • First 30 Completed Orders Only
        </p>

        {/* Live Counter Badge */}
        <div className="mt-4 inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-mono text-slate-200">
            Live Inventory: <strong className="text-white text-base">{remainingKits} of 30</strong> kits available
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Product Showcase ──────────────────────────────────────────────── */}
      <div className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-4/3 flex items-center justify-center p-4">
            <img
              src="/images/ron/band-training.jpg"
              alt="BigRonJones Heavy Duty Resistance Band Set"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                // Fallback to high-contrast badge graphic
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-amber-400 border border-amber-500/30">
              OFFICIAL GEAR
            </div>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
              $0 KIT + $15 S&H
            </div>
          </div>

          {/* Details & Specs */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              BigRonJones® Heavy-Duty Resistance Band Set
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Engineered for real progressive overload, joint-friendly mechanics, and travel training. Built so you have zero excuses whether training at home, outdoors, or in the gym.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 font-medium mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Commercial grade, anti-snap layered latex</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multiple resistance tension tiers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ships directly to your address within 3-5 business days</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict limit: 1 kit per customer (shared 30-cap)</span>
              </li>
            </ul>

            {/* Pricing Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Resistance Band Kit:</span>
                <span className="line-through text-slate-500">$49.00</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Promotional Band Price:</span>
                <span>$0.00 (FREE)</span>
              </div>
              <div className="flex justify-between text-white font-semibold pt-1 border-t border-slate-800">
                <span>Insured Tracked Shipping:</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-amber-400 font-extrabold text-sm pt-1 border-t border-slate-800">
                <span>TOTAL DUE TODAY:</span>
                <span>$15.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shipping & Claim Form ─────────────────────────────────────────── */}
      <form onSubmit={handleClaim} className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-400" />
          <span>Enter Physical Shipping Address</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Full name for delivery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Email Address (For Tracking) *</label>
            <input
              type="email"
              required
              placeholder="receipt@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1 font-medium">Street Address *</label>
            <input
              type="text"
              required
              placeholder="123 Main St, Apt 4B"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">City *</label>
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">State *</label>
              <input
                type="text"
                required
                placeholder="State / Province"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Zip *</label>
              <input
                type="text"
                required
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-base uppercase tracking-wider rounded-xl shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>RESERVING KIT & INITIALIZING PAYMENT…</span>
            ) : (
              <>
                <span>CLAIM MY FREE BANDS • $15 SHIPPING</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Decline / Skip Option */}
          <button
            type="button"
            onClick={onDecline}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors underline font-medium"
          >
            No thanks, I will train with my own equipment (continue to my prescription)
          </button>
        </div>
      </form>
    </div>
  );
}
