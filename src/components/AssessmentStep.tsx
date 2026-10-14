import React, { useState, useRef } from "react";
import { Target, ArrowRight, CheckCircle2, User, Mail, Phone, Sparkles, Dumbbell } from "lucide-react";
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
  { label: "Improve Athletic Performance", desc: "Build speed, explosive power & dynamic durability" },
  { label: "Build Muscle", desc: "Progressive hypertrophy, muscular density & structural shape" },
  { label: "Improve Everyday Fitness", desc: "Move freely, eliminate stiffness & operate with vibrant energy" },
  { label: "Get Stronger", desc: "Total-body functional strength, joint integrity & work capacity" },
  { label: "Improve Endurance", desc: "Sustain high output, cardiovascular efficiency & stamina" },
  { label: "Improve Movement Quality", desc: "Rebuild movement mechanics, posture & injury resilience" },
  { label: "Develop Better Control", desc: "Deliberate movement tempo, motor control & stabilization" },
  { label: "Improve Overall Conditioning", desc: "High metabolic durability, engine capacity & leanness" },
];

const OBSTACLES = [
  "Consistency & Routine",
  "Motivation & Drive",
  "Lack of Knowledge",
  "Personal Accountability",
  "Demanding Work Schedule",
  "Old Joint / Movement Limits",
  "Not Knowing Exactly What To Do",
];

const SUPPORT_LEVELS = [
  { label: "Give me the plan; I'll execute.", desc: "Completely self-driven, just need structured programming" },
  { label: "I want structured video guidance.", desc: "Step-by-step masterclass demonstrations for every movement" },
  { label: "I need direct accountability.", desc: "Structured oversight to stay disciplined week in, week out" },
  { label: "I want coaching and a high-standard cohort.", desc: "Dedicated coach oversight & community standards" },
  { label: "I am serious about making a major transformation.", desc: "High-touch direct coaching & complete lifestyle alignment" },
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

  const questionsRef = useRef<HTMLDivElement>(null);

  const scrollToQuestions = () => {
    if (questionsRef.current) {
      questionsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please provide a valid email address to receive your official training prescription.");
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
      console.warn("[AssessmentStep] API fallback to local prescription engine:", err);
      try {
        const localPrescription = evaluatePrescription(payload);
        try {
          sessionStorage.setItem("brj_funnel_prescription", JSON.stringify(localPrescription));
        } catch {}
        onComplete(payload, localPrescription);
      } catch (innerErr) {
        setError("Error generating prescription. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ── SECTION 01 — HERO (Exact Match to start.bigronjones.com) ── */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-200 text-center">
        {/* Subtle radial glow in brand blue */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-[#0A3161]/5 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/80 bg-white text-[#0A3161] font-['DM_Mono'] text-[11px] sm:text-xs uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles size={13} className="text-[#0A3161]" />
            <span>BIGRONJONES · FITNESS DIAGNOSTIC ASSESSMENT</span>
          </div>

          {/* Headline */}
          <h1 className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92] text-slate-900 mb-6 uppercase">
            YOU DON'T NEED ANOTHER FITNESS PLAN.
            <br />
            <span className="text-[#B31942]">YOU NEED A PRESCRIPTION.</span>
          </h1>

          {/* Supporting Copy */}
          <div className="max-w-2xl mx-auto mb-8 space-y-3 font-['DM_Sans'] text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
            <p>
              You already know you should train.<br />
              You already know you should eat better.<br />
              You already know you need cardio, recovery and consistency.
            </p>
            <p className="font-semibold text-slate-900">
              The problem isn't knowing.<br />
              It's executing with the right protocol and oversight.<br />
              Complete the diagnostic to determine your exact training match.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto w-full mb-4">
            <button
              type="button"
              onClick={scrollToQuestions}
              className="w-full bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider py-4 px-8 rounded-xl uppercase transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/25 cursor-pointer"
            >
              <span>START MY ASSESSMENT</span>
              <ArrowRight size={22} />
            </button>

            <p className="font-['DM_Mono'] text-xs sm:text-sm text-slate-500 tracking-wider">
              60-Second Diagnostic · 8 Tailored Protocols · Direct Coaching Oversight
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 02 — QUESTIONNAIRE & LEAD CAPTURE ── */}
      <section ref={questionsRef} className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Coach Ron Personal Quote Callout */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50/40 border border-blue-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <img
            src="/images/ron/bigronjones.png?v=4"
            alt="Coach Big Ron Jones"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/ron/ron-headshot.png";
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#0A3161] object-cover shadow-md shrink-0"
          />
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-700 italic leading-relaxed">
              "Most programs fail because they ask you to pick from a menu without knowing your starting baseline. We match you to the exact protocol designed for your body, your goals, and your schedule."
            </p>
            <p className="font-['DM_Mono'] text-xs font-bold uppercase tracking-wider text-[#0A3161]">
              — Big Ron Jones, Head Coach &amp; Founder
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans']">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Q1: Gender Pathway */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
              STEP 01 OF 06
            </span>
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-slate-900 tracking-wide uppercase mb-2">
              SELECT YOUR TRAINING PATHWAY
            </h2>
            <p className="font-['DM_Sans'] text-sm text-slate-600 mb-5">
              Men's and women's programming incorporate distinct hormonal recovery curves and mechanical loading.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {(["Male", "Female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-4 px-4 min-h-[56px] rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 border-2 cursor-pointer ${
                    gender === g
                      ? "bg-blue-50/70 text-[#0A3161] border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                  }`}
                >
                  {gender === g && <CheckCircle2 className="w-5 h-5 text-[#0A3161]" />}
                  <span>{g} Pathway</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Primary Goal */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
              STEP 02 OF 06
            </span>
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-slate-900 tracking-wide uppercase mb-2">
              WHAT IS YOUR PRIMARY TRAINING OBJECTIVE?
            </h2>
            <p className="font-['DM_Sans'] text-sm text-slate-600 mb-5">
              Select the single outcome that matters most to you right now.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GOALS.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setGoal(g.label)}
                  className={`p-4 min-h-[72px] rounded-2xl text-left transition-all border-2 flex flex-col justify-between cursor-pointer ${
                    goal === g.label
                      ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Bebas_Neue'] text-xl tracking-wide uppercase text-slate-900">
                      {g.label}
                    </span>
                    {goal === g.label && <CheckCircle2 className="w-5 h-5 text-[#0A3161] shrink-0" />}
                  </div>
                  <span className="font-['DM_Sans'] text-xs text-slate-500 leading-normal">
                    {g.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Q3: Baseline Level & Q4: Primary Obstacle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 03 OF 06
              </span>
              <h3 className="font-['Bebas_Neue'] text-2xl text-slate-900 tracking-wide uppercase mb-1">
                CURRENT FITNESS BASELINE
              </h3>
              <p className="font-['DM_Sans'] text-xs text-slate-500 mb-4">
                Where are you honestly starting from today?
              </p>

              <div className="space-y-2.5">
                {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`w-full py-3.5 px-4 min-h-[48px] rounded-xl font-bold text-sm text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      level === lvl
                        ? "bg-blue-50/70 border-[#0A3161] text-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs"
                    }`}
                  >
                    <span>{lvl}</span>
                    {level === lvl && <CheckCircle2 className="w-4 h-4 text-[#0A3161]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 04 OF 06
              </span>
              <h3 className="font-['Bebas_Neue'] text-2xl text-slate-900 tracking-wide uppercase mb-1">
                BIGGEST HISTORICAL OBSTACLE
              </h3>
              <p className="font-['DM_Sans'] text-xs text-slate-500 mb-4">
                What has gotten in your way previously?
              </p>

              <div className="space-y-2">
                {OBSTACLES.map((obs) => (
                  <button
                    key={obs}
                    type="button"
                    onClick={() => setObstacle(obs)}
                    className={`w-full py-2.5 px-3.5 min-h-[42px] rounded-xl text-xs font-semibold text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      obstacle === obs
                        ? "bg-blue-50/70 border-[#0A3161] text-[#0A3161] shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs"
                    }`}
                  >
                    <span>{obs}</span>
                    {obstacle === obs && <CheckCircle2 className="w-4 h-4 text-[#0A3161] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Q5: Training Environment */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
              STEP 05 OF 06
            </span>
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-slate-900 tracking-wide uppercase mb-2">
              TRAINING ENVIRONMENT
            </h2>
            <p className="font-['DM_Sans'] text-sm text-slate-600 mb-4">
              Where do you plan on completing your weekly training sessions?
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(["Home", "Gym", "Both"] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`py-3.5 px-3 rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    environment === env
                      ? "bg-blue-50/70 text-[#0A3161] border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <Dumbbell className="w-4 h-4 text-[#0A3161]" />
                  <span>{env}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q6: Support Level Required */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
              STEP 06 OF 06
            </span>
            <h2 className="font-['Bebas_Neue'] text-2xl sm:text-3xl text-slate-900 tracking-wide uppercase mb-2">
              HOW MUCH SUPPORT DO YOU HONESTLY NEED TO SUCCEED?
            </h2>
            <p className="font-['DM_Sans'] text-sm text-slate-600 mb-5">
              Be direct with yourself. Results depend on having the right level of structure and oversight.
            </p>

            <div className="space-y-3">
              {SUPPORT_LEVELS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSupportLevel(s.label)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex items-start justify-between gap-3 cursor-pointer ${
                    supportLevel === s.label
                      ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 text-[#0A3161] shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm sm:text-base text-slate-900 mb-0.5">
                      {s.label}
                    </div>
                    <div className="font-['DM_Sans'] text-xs text-slate-500">
                      {s.desc}
                    </div>
                  </div>
                  {supportLevel === s.label && (
                    <CheckCircle2 className="w-5 h-5 text-[#0A3161] shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Contact Details & Submission Card ── */}
          <div className="bg-white border-2 border-[#0A3161]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0A3161] text-xs font-['DM_Mono'] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                CONFIDENTIAL PRESCRIPTION DISPATCH
              </span>
              <h3 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase">
                WHERE SHOULD WE SEND YOUR PRESCRIPTION?
              </h3>
              <p className="font-['DM_Sans'] text-sm text-slate-600">
                Provide your details below to generate and secure your personalized training protocol.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address (For Prescription Dispatch) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-['DM_Mono'] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number (Optional — For Direct Consultation SMS)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 sm:py-5 bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider rounded-xl uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
            >
              {loading ? (
                <span>ANALYZING &amp; GENERATING PRESCRIPTION...</span>
              ) : (
                <>
                  <span>GENERATE MY TRAINING PRESCRIPTION</span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
