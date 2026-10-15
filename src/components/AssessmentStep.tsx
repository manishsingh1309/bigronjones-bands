import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Sparkles,
  Dumbbell,
  Target,
  ShieldAlert,
  Home,
  Users,
  Check,
} from "lucide-react";
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
  isStarted?: boolean;
  onStartChange?: (started: boolean) => void;
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

const LEVELS = [
  { label: "Beginner", desc: "Less than 1 year of structured training. Focus on movement literacy and safe capacity." },
  { label: "Intermediate", desc: "1 to 3 years of consistent training. Ready for progressive overload and density." },
  { label: "Advanced", desc: "3+ years of intense training. Requires specialized mechanical loading & peak recovery." },
];

const OBSTACLES = [
  { label: "Consistency & Routine", desc: "Struggling to stay disciplined when motivation fades or life gets busy" },
  { label: "Motivation & Drive", desc: "Starting strong for 2-3 weeks, then hitting mental burnout and stopping" },
  { label: "Lack of Knowledge", desc: "Uncertain if current exercises, reps, and nutrition are actually working" },
  { label: "Personal Accountability", desc: "Easy to skip sessions when no expert coach is tracking your execution" },
  { label: "Demanding Work Schedule", desc: "Long work hours and travel leaving minimal energy for the gym" },
  { label: "Old Joint / Movement Limits", desc: "Prior injuries or chronic stiffness creating fear of getting hurt" },
  { label: "Not Knowing Exactly What To Do", desc: "Wandering through the gym doing random workouts without a blueprint" },
];

const ENVIRONMENTS = [
  { label: "Gym", desc: "Full commercial gym access (barbells, dumbbells, cables & machines)" },
  { label: "Home", desc: "Home setup (dumbbells, resistance bands, pull-up bar or bodyweight)" },
  { label: "Both", desc: "Hybrid schedule (flexible mix of commercial gym and quick home sessions)" },
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
  isStarted: controlledIsStarted,
  onStartChange,
}: AssessmentStepProps) {
  // Whether the survey has been started (only displays when customer selects "Start My Assessment")
  const [internalStarted, setInternalStarted] = useState<boolean>(false);
  const isStarted = controlledIsStarted !== undefined ? controlledIsStarted : internalStarted;

  const setStarted = (val: boolean) => {
    setInternalStarted(val);
    if (onStartChange) onStartChange(val);
  };

  // 0: Pathway, 1: Goal, 2: Level, 3: Obstacle, 4: Environment, 5: Support, 6: Contact Last Page
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Form answers state
  const [gender, setGender] = useState<"Male" | "Female">(initialData?.gender || "Male");
  const [goal, setGoal] = useState<string>(initialData?.goal || GOALS[0].label);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    initialData?.level || "Intermediate",
  );
  const [obstacle, setObstacle] = useState<string>(initialData?.obstacle || OBSTACLES[0].label);
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

  const cardRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleStartAssessment = () => {
    setStarted(true);
    setCurrentStepIndex(0);
    scrollToTop();
  };

  const handleNext = () => {
    setError(null);
    if (currentStepIndex < 6) {
      setCurrentStepIndex((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      scrollToTop();
    } else {
      setStarted(false);
      scrollToTop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Please provide your full name so Coach Ron can personalize your prescription.");
      return;
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please provide a valid email address to receive your training prescription.");
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
      } catch {
        setError("Error generating prescription. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 1: HERO / INTRO SCREEN (Displays before "Start My Assessment" is clicked)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isStarted) {
    return (
      <div className="w-full">
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

            {/* Primary Action Button (Client Requested: Survey only displays when this is clicked) */}
            <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto w-full mb-6">
              <button
                type="button"
                id="start-my-assessment-btn"
                onClick={handleStartAssessment}
                className="w-full bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider py-4 px-8 rounded-xl uppercase transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/25 cursor-pointer"
              >
                <span>START MY ASSESSMENT</span>
                <ArrowRight size={22} />
              </button>

              <p className="font-['DM_Mono'] text-xs sm:text-sm text-slate-500 tracking-wider">
                60-Second Diagnostic · 8 Tailored Protocols · Direct Coaching Oversight
              </p>
            </div>

            {/* Coach Ron Personal Quote Callout */}
            <div className="max-w-2xl mx-auto mt-10 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-left">
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
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 2: ACTIVE SURVEY — 1 QUESTION APPEARS AT A TIME WITH LAST CONTACT PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  const totalQuestions = 6;
  const isContactPage = currentStepIndex === 6;
  const progressPercent = Math.round(((currentStepIndex + 1) / 7) * 100);

  return (
    <div ref={cardRef} className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 md:py-16">
      {/* ── Top Survey Navigation & Progress Bar ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['DM_Mono'] font-bold text-slate-500 hover:text-[#0A3161] transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span>{currentStepIndex === 0 ? "BACK TO OVERVIEW" : "PREVIOUS QUESTION"}</span>
          </button>

          <span className="font-['DM_Mono'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A3161]">
            {isContactPage ? "FINAL STEP" : `QUESTION ${currentStepIndex + 1} OF ${totalQuestions}`}
          </span>
        </div>

        {/* Clean animated progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#0A3161] to-[#B31942] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-['DM_Sans'] flex items-center gap-2">
          <ShieldAlert size={18} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ── QUESTION CARD CONTAINER (Card for Single Question) ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl transition-all">
        {/* ── Q1: GENDER / PATHWAY ── */}
        {currentStepIndex === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 01 OF 06 · TRAINING PATHWAY
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                SELECT YOUR TRAINING PATHWAY
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                Men's and women's programming incorporate distinct hormonal recovery curves, load progression, and mechanical volume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(["Male", "Female"] as const).map((g) => {
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGender(g);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-6 min-h-[96px] rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 text-[#0A3161] border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#0A3161] text-white" : "bg-slate-100 text-slate-600"}`}>
                        {g === "Male" ? <Dumbbell size={22} /> : <Sparkles size={22} />}
                      </div>
                      <div>
                        <span className="font-['Bebas_Neue'] text-2xl tracking-wide uppercase block text-slate-900">
                          {g} Pathway
                        </span>
                        <span className="font-['DM_Sans'] text-xs text-slate-500">
                          {g === "Male" ? "Tailored for male physiology" : "Tailored for female physiology"}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-[#0A3161] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── Q2: PRIMARY GOAL ── */}
        {currentStepIndex === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 02 OF 06 · PRIMARY OBJECTIVE
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                WHAT IS YOUR PRIMARY TRAINING OBJECTIVE?
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                Select the single outcome that matters most to you right now. Coach Ron uses this to match your exact protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {GOALS.map((g) => {
                const isSelected = goal === g.label;
                return (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => {
                      setGoal(g.label);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="pr-3">
                      <span className="font-['Bebas_Neue'] text-xl tracking-wide uppercase text-slate-900 block mb-0.5">
                        {g.label}
                      </span>
                      <span className="font-['DM_Sans'] text-xs text-slate-500 leading-snug block">
                        {g.desc}
                      </span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#0A3161] shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-['DM_Mono'] text-slate-500 hover:text-slate-800 uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── Q3: EXPERIENCE LEVEL ── */}
        {currentStepIndex === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 03 OF 06 · EXPERIENCE & CAPACITY
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                CURRENT TRAINING EXPERIENCE & STRENGTH LEVEL
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                We adjust exercise complexity, movement tempo, and volume density to meet your exact baseline.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {LEVELS.map((lvl) => {
                const isSelected = level === lvl.label;
                return (
                  <button
                    key={lvl.label}
                    type="button"
                    onClick={() => {
                      setLevel(lvl.label as any);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="pr-3">
                      <span className="font-['Bebas_Neue'] text-2xl tracking-wide uppercase text-slate-900 block mb-1">
                        {lvl.label}
                      </span>
                      <span className="font-['DM_Sans'] text-xs sm:text-sm text-slate-500 block">
                        {lvl.desc}
                      </span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#0A3161] shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-['DM_Mono'] text-slate-500 hover:text-slate-800 uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── Q4: PRIMARY OBSTACLE ── */}
        {currentStepIndex === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 04 OF 06 · PRIMARY ROADBLOCK
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                WHAT IS YOUR #1 BIGGEST OBSTACLE?
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                Identifying your friction point allows Coach Ron to engineer the right behavioral scaffolding into your training.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {OBSTACLES.map((obs) => {
                const isSelected = obstacle === obs.label;
                return (
                  <button
                    key={obs.label}
                    type="button"
                    onClick={() => {
                      setObstacle(obs.label);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="pr-3">
                      <span className="font-['Bebas_Neue'] text-xl tracking-wide uppercase text-slate-900 block mb-0.5">
                        {obs.label}
                      </span>
                      <span className="font-['DM_Sans'] text-xs text-slate-500 block">
                        {obs.desc}
                      </span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#0A3161] shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-['DM_Mono'] text-slate-500 hover:text-slate-800 uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── Q5: TRAINING ENVIRONMENT ── */}
        {currentStepIndex === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 05 OF 06 · TRAINING ENVIRONMENT
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                WHERE DO YOU PLAN TO DO YOUR WORKOUTS?
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                All 8 BigRonJones® programs include both a 4-day gym series and a 4-day home series.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {ENVIRONMENTS.map((env) => {
                const isSelected = environment === env.label;
                return (
                  <button
                    key={env.label}
                    type="button"
                    onClick={() => {
                      setEnvironment(env.label as any);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#0A3161] text-white" : "bg-slate-100 text-slate-600"}`}>
                        {env.label === "Home" ? <Home size={22} /> : env.label === "Gym" ? <Dumbbell size={22} /> : <Target size={22} />}
                      </div>
                      <div>
                        <span className="font-['Bebas_Neue'] text-2xl tracking-wide uppercase text-slate-900 block mb-0.5">
                          {env.label} Training
                        </span>
                        <span className="font-['DM_Sans'] text-xs sm:text-sm text-slate-500 block">
                          {env.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-[#0A3161] shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-['DM_Mono'] text-slate-500 hover:text-slate-800 uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── Q6: LEVEL OF SUPPORT ── */}
        {currentStepIndex === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="font-['DM_Mono'] text-[11px] font-bold uppercase tracking-[0.25em] text-[#0A3161] block mb-1">
                STEP 06 OF 06 · COACHING & OVERSIGHT
              </span>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                DESIRED LEVEL OF SUPPORT & OVERSIGHT
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                Choose how closely you want Coach Ron and the team involved in your weekly execution and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {SUPPORT_LEVELS.map((sup) => {
                const isSelected = supportLevel === sup.label;
                return (
                  <button
                    key={sup.label}
                    type="button"
                    onClick={() => {
                      setSupportLevel(sup.label);
                      setTimeout(handleNext, 180);
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border-2 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A3161] ring-2 ring-[#0A3161]/20 shadow-md text-[#0A3161]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                    }`}
                  >
                    <div className="pr-3">
                      <span className="font-['Bebas_Neue'] text-xl tracking-wide uppercase text-slate-900 block mb-0.5">
                        {sup.label}
                      </span>
                      <span className="font-['DM_Sans'] text-xs text-slate-500 block">
                        {sup.desc}
                      </span>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#0A3161] shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-['DM_Mono'] text-slate-500 hover:text-slate-800 uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0A3161] hover:bg-[#082447] text-white font-['Bebas_Neue'] text-xl tracking-wider py-3 px-8 rounded-xl uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>CONTINUE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ── LAST PAGE: CONTACT CAPTURE & PRESCRIPTION REVEAL (Client Specific Requirement) ── */}
        {currentStepIndex === 6 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-['DM_Mono'] text-[10.5px] font-bold uppercase tracking-wider mb-2">
                <Check size={12} className="text-emerald-600" />
                <span>6 OF 6 QUESTIONS COMPLETED</span>
              </div>
              <h2 className="font-['Bebas_Neue'] text-3xl sm:text-5xl text-slate-900 tracking-wide uppercase leading-tight mb-2">
                WHERE SHOULD WE SEND YOUR PRESCRIPTION?
              </h2>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-slate-600">
                Coach Big Ron Jones's protocol engine has analyzed your 6 answers. Enter your name, email and phone to reveal your matched prescription.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div>
                <label className="block font-['DM_Mono'] text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white font-['DM_Sans'] text-slate-900 text-base focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-['DM_Mono'] text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. marcus@example.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white font-['DM_Sans'] text-slate-900 text-base focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none transition-all shadow-xs"
                  />
                </div>
                <span className="font-['DM_Sans'] text-[11px] text-slate-500 block mt-1">
                  Your prescription report and access dashboard will be tied to this address.
                </span>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-['DM_Mono'] text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-slate-400 text-[10px] font-normal tracking-normal">(For Delivery &amp; Consultation Notifications)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. (555) 234-5678"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white font-['DM_Sans'] text-slate-900 text-base focus:border-[#0A3161] focus:ring-2 focus:ring-[#0A3161]/20 outline-none transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B31942] hover:bg-[#8e1032] active:scale-[0.98] text-white font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-wider py-4 px-8 rounded-xl uppercase transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? "CALCULATING YOUR PRESCRIPTION..." : "VIEW MY PRESCRIPTION"}</span>
                {!loading && <ArrowRight size={22} />}
              </button>

              <div className="text-center font-['DM_Mono'] text-xs text-slate-500">
                🔒 100% Privacy Guaranteed · Zero Spam · Official BigRonJones® Match
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
