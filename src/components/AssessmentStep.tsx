import React, { useState } from "react";
import { Target, ArrowRight, CheckCircle2, User, Mail, Phone, Sparkles } from "lucide-react";
import { evaluatePrescription, getFunnelApiUrl } from "../lib/funnelEngine";

export interface AssessmentData {
  gender: "Male" | "Female";
  goal: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  obstacle: string;
  environment: "Home" | "Gym" | "Both";
  supportLevel: string;
  fullName: string;
  email: string;
  phone: string;
}

interface AssessmentStepProps {
  funnelId: "funnel_a" | "funnel_b";
  onComplete: (data: AssessmentData, prescription: any) => void;
  initialData?: Partial<AssessmentData>;
}

const GOALS = [
  { label: "Improve Athletic Performance", desc: "Build speed, explosive power & dynamic resilience" },
  { label: "Build Muscle", desc: "Progressive hypertrophy, shape & muscular density" },
  { label: "Improve Everyday Fitness", desc: "Move freely, live energetically & perform confidently" },
  { label: "Get Stronger", desc: "Total-body functional strength & work capacity" },
  { label: "Improve Endurance", desc: "Sustain explosive stamina & output for longer" },
  { label: "Improve Movement", desc: "Rebuild movement quality & joint-friendly mechanics" },
  { label: "Develop Better Control", desc: "Deliberate tempo, mind-muscle connection & stability" },
  { label: "Improve Overall Conditioning", desc: "Cardiovascular engine, metabolic stamina & durability" },
];

const OBSTACLES = [
  "Consistency",
  "Motivation",
  "Knowledge",
  "Accountability",
  "Time",
  "Movement limitations",
  "Not knowing what to do",
];

const SUPPORT_LEVELS = [
  { label: "Give me the plan; I'll execute.", desc: "Self-driven, just need structured programming" },
  { label: "I want some guidance.", desc: "Structured plan with expert video progressions" },
  { label: "I need accountability.", desc: "Regular check-ins to stay disciplined" },
  { label: "I want coaching and a group pushing me.", desc: "Dedicated oversight & community" },
  { label: "I am serious about making a major transformation.", desc: "High-touch coaching & full lifestyle alignment" },
];

export default function AssessmentStep({
  funnelId,
  onComplete,
  initialData,
}: AssessmentStepProps) {
  const [gender, setGender] = useState<"Male" | "Female">(initialData?.gender || "Male");
  const [goal, setGoal] = useState<string>(initialData?.goal || GOALS[0].label);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    initialData?.level || "Intermediate",
  );
  const [obstacle, setObstacle] = useState<string>(initialData?.obstacle || OBSTACLES[0]);
  const [environment, setEnvironment] = useState<"Home" | "Gym" | "Both">(
    initialData?.environment || "Gym",
  );
  const [supportLevel, setSupportLevel] = useState<string>(
    initialData?.supportLevel || SUPPORT_LEVELS[0].label,
  );
  const [fullName, setFullName] = useState<string>(initialData?.fullName || "");
  const [email, setEmail] = useState<string>(initialData?.email || "");
  const [phone, setPhone] = useState<string>(initialData?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please provide a valid email address to receive your training prescription.");
      return;
    }
    if (!cleanName) {
      setError("Please provide your full name.");
      return;
    }

    const payload: AssessmentData = {
      gender,
      goal,
      level,
      obstacle,
      environment,
      supportLevel,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    };

    setLoading(true);

    try {
      // Persist in sessionStorage immediately so state survives navigation
      try {
        sessionStorage.setItem("brj_funnel_assessment", JSON.stringify(payload));
      } catch (e) {
        console.warn("sessionStorage write note:", e);
      }

      const res = await fetch(getFunnelApiUrl("/api/funnels/assessment"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          name: payload.fullName,
          funnelId,
          trafficSource: funnelId === "funnel_a" ? "website" : "paid_ad",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        try {
          sessionStorage.setItem("brj_funnel_prescription", JSON.stringify(data.prescription));
        } catch {}
        onComplete(payload, data.prescription);
        return;
      }

      throw new Error(`Assessment returned status ${res.status}`);
    } catch (err: any) {
      console.warn("[AssessmentStep] API error, falling back to local prescription engine:", err);
      try {
        const localPrescription = evaluatePrescription(payload);
        try {
          sessionStorage.setItem("brj_funnel_prescription", JSON.stringify(localPrescription));
        } catch {}
        onComplete(payload, localPrescription);
      } catch {
        setError(err?.message || "Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── Eyebrow & Hero ─────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>DIAGNOSTIC ASSESSMENT • MANDATORY STEP</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          TRAINING PRESCRIPTION ENGINE
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Determine what program you need — and how much support you need to succeed.
        </p>

        <blockquote className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs sm:text-sm italic">
          “We don’t ask you to choose from eight programs. We determine which program fits you.”
          <span className="block mt-1 font-sans text-xs text-[#F59E0B] font-bold not-italic">
            — BigRonJones®
          </span>
        </blockquote>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* ── Form Card ─────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Q1: Gender */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
            01 / GENDER SPECIFICATION
          </label>
          <p className="text-sm font-semibold text-white mb-4">
            Select your training pathway:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {(["Male", "Female"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`py-3.5 px-4 min-h-[48px] rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  gender === g
                    ? "bg-[#0A3161] text-white border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                {gender === g && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {g} Track
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Primary Goal */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
            02 / PRIMARY GOAL
          </label>
          <p className="text-sm font-semibold text-white mb-4">
            What is your single most important training objective right now?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setGoal(g.label)}
                className={`p-4 min-h-[64px] rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  goal === g.label
                    ? "bg-[#0A3161]/80 text-white border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{g.label}</span>
                  {goal === g.label && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
                <span className="text-xs text-slate-400">{g.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Current Level & Q4: Primary Obstacle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
              03 / CURRENT FITNESS LEVEL
            </label>
            <p className="text-sm font-semibold text-white mb-4">
              Where are you starting from today?
            </p>
            <div className="space-y-2.5">
              {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`w-full py-3.5 px-4 min-h-[48px] rounded-xl font-medium text-sm text-left transition-all border flex items-center justify-between cursor-pointer ${
                    level === lvl
                      ? "bg-[#0A3161] text-white border-blue-500"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>{lvl}</span>
                  {level === lvl && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Obstacle */}
          <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
              04 / PRIMARY OBSTACLE
            </label>
            <p className="text-sm font-semibold text-white mb-4">
              What has historically gotten in your way?
            </p>
            <div className="space-y-2">
              {OBSTACLES.map((obs) => (
                <button
                  key={obs}
                  type="button"
                  onClick={() => setObstacle(obs)}
                  className={`w-full py-3 px-3.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-medium text-left transition-all border flex items-center justify-between cursor-pointer ${
                    obstacle === obs
                      ? "bg-[#0A3161] text-white border-blue-500"
                      : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>{obs}</span>
                  {obstacle === obs && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q5: Training Environment */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
            05 / TRAINING ENVIRONMENT
          </label>
          <p className="text-sm font-semibold text-white mb-4">
            Where will you be executing your sessions?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(["Gym", "Home", "Both"] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setEnvironment(env)}
                className={`py-3.5 px-3 min-h-[48px] rounded-xl font-bold text-sm text-center transition-all border cursor-pointer ${
                  environment === env
                    ? "bg-[#0A3161] text-white border-blue-500"
                    : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Q6: Support Level */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
            06 / SUPPORT & ACCOUNTABILITY LEVEL
          </label>
          <p className="text-sm font-semibold text-white mb-4">
            How much structure and oversight do you require?
          </p>
          <div className="space-y-3">
            {SUPPORT_LEVELS.map((sup) => (
              <button
                key={sup.label}
                type="button"
                onClick={() => setSupportLevel(sup.label)}
                className={`w-full p-4 min-h-[60px] rounded-xl text-left transition-all border flex items-center justify-between cursor-pointer ${
                  supportLevel === sup.label
                    ? "bg-[#0A3161]/80 text-white border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-white">{sup.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sup.desc}</div>
                </div>
                {supportLevel === sup.label && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information to receive prescription */}
        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#F59E0B] mb-2 font-bold">
            PRESCRIPTION DISPATCH CREDENTIALS
          </label>
          <p className="text-sm font-semibold text-white mb-4">
            Where should we deliver your matched program prescription?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 font-medium">Phone Number (Optional - for training updates)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-base sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[320px] min-h-[54px] inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0A3161] via-[#2563EB] to-[#1D4ED8] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-extrabold text-base uppercase tracking-wider rounded-xl shadow-xl hover:shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>CALCULATING PRESCRIPTION…</span>
            ) : (
              <>
                <Target className="w-5 h-5 text-[#F59E0B]" />
                <span>GENERATE MY PRESCRIPTION</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="mt-3 text-[11px] font-mono text-slate-500">
            Instant diagnostic result • Encrypted transmission • BigRonJones® Program Matrix
          </p>
        </div>
      </form>
    </div>
  );
}
