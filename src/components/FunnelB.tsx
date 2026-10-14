import React, { useState, useEffect } from "react";
import FunnelShell from "./FunnelShell";
import AssessmentStep, { type AssessmentData } from "./AssessmentStep";
import BandOfferStep from "./BandOfferStep";
import MatchedProgramStep from "./MatchedProgramStep";
import DownsellStep from "./DownsellStep";
import TwoPackUpsellStep from "./TwoPackUpsellStep";
import AscensionStep from "./AscensionStep";
import ConfirmationStep from "./ConfirmationStep";
import NeutralExitStep from "./NeutralExitStep";
import { getProgramSeriesItem, type ProgramSeriesItem } from "../lib/programSeries";
import { evaluatePrescription } from "../lib/funnelEngine";

type FunnelBStep =
  | "bands"             // Step 1: Free Resistance Bands ($15 S&H)
  | "assessment"        // Step 2: Mandatory Fitness Assessment
  | "matched_program"   // Step 3: Matched Program ($249)
  | "downsell"          // If $249 declined: Downsell ($199)
  | "twopack_upsell"    // If $249 purchased: Choose 2 More Programs (20% off)
  | "ascension"         // After 2-Pack: MFA or WWP ($3,000)
  | "confirmation"      // Confirmed purchase
  | "neutral_exit";     // Declined both $249 and $199

function loadSessionState<T>(key: string): T | null {
  try {
    const s = sessionStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function saveSessionState(key: string, val: any) {
  try {
    sessionStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Session storage write error:", e);
  }
}

export default function FunnelB() {
  const [step, setStep] = useState<FunnelBStep>("bands");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(() =>
    loadSessionState<AssessmentData>("brj_funnel_assessment")
  );
  const [prescription, setPrescription] = useState<any>(() =>
    loadSessionState<any>("brj_funnel_prescription")
  );
  const [bandsClaimed, setBandsClaimed] = useState<boolean>(() =>
    Boolean(loadSessionState<boolean>("brj_bands_claimed"))
  );
  const [bandsSoldOut, setBandsSoldOut] = useState(false);
  const [purchasedPrimary, setPurchasedPrimary] = useState<boolean>(() =>
    Boolean(loadSessionState<boolean>("brj_purchased_primary"))
  );
  const [purchasedDownsell, setPurchasedDownsell] = useState<boolean>(() =>
    Boolean(loadSessionState<boolean>("brj_purchased_downsell"))
  );
  const [purchasedTwoPack, setPurchasedTwoPack] = useState<boolean>(() =>
    Boolean(loadSessionState<boolean>("brj_purchased_twopack"))
  );
  const [twoPackTitles, setTwoPackTitles] = useState<string[]>(() =>
    loadSessionState<string[]>("brj_twopack_titles") || []
  );
  const [purchasedAscension, setPurchasedAscension] = useState<boolean>(() =>
    Boolean(loadSessionState<boolean>("brj_purchased_ascension"))
  );
  const [coachingPlan, setCoachingPlan] = useState<"pif" | "in_house">(() =>
    loadSessionState<"pif" | "in_house">("brj_coaching_plan") || "pif"
  );

  // Check band inventory on mount
  useEffect(() => {
    fetch("/api/funnels/status")
      .then((res) => {
        if (!res.ok) throw new Error("status unavailable");
        return res.json();
      })
      .then((data) => {
        if (data.isSoldOut || (typeof data.remaining === "number" && data.remaining <= 0)) {
          setBandsSoldOut(true);
          // Rule: At 30 completed sales, disable/redirect Funnel B band landing and route directly to Assessment!
          setStep("assessment");
        }
      })
      .catch((e) => console.warn("[FunnelB] inventory probe note:", e?.message));
  }, []);

  // Check URL params for checkout returns (?session_id=...&type=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (params.get("session_id")) {
      if (type === "bands") {
        setBandsClaimed(true);
        saveSessionState("brj_bands_claimed", true);
        setStep("assessment");
      } else if (type === "primary_249") {
        setPurchasedPrimary(true);
        saveSessionState("brj_purchased_primary", true);
        setStep("twopack_upsell");
      } else if (type === "downsell_199") {
        setPurchasedDownsell(true);
        saveSessionState("brj_purchased_downsell", true);
        setStep("confirmation");
      } else if (type === "twopack_398") {
        setPurchasedTwoPack(true);
        saveSessionState("brj_purchased_twopack", true);
        setStep("ascension");
      } else if (type === "ascension_3000") {
        setPurchasedAscension(true);
        saveSessionState("brj_purchased_ascension", true);
        setStep("confirmation");
      }
    }
  }, []);

  // Authoritative fallback for matched program to guarantee UI never renders blank
  const getResolvedMatchedProgram = (): ProgramSeriesItem => {
    if (prescription?.matchedProgram) {
      return prescription.matchedProgram;
    }
    if (assessmentData) {
      const computed = evaluatePrescription(assessmentData);
      return computed.matchedProgram;
    }
    return getProgramSeriesItem(7)!;
  };

  const matchedProgram = getResolvedMatchedProgram();

  // Step numbering & metadata
  const totalSteps = bandsSoldOut ? 4 : 5;
  let stepNumber = 1;
  let stepLabel = "Free Resistance Bands Offer";

  if (step === "bands") {
    stepNumber = 1;
    stepLabel = "Free Resistance Bands ($15 S&H)";
  } else if (step === "assessment") {
    stepNumber = bandsSoldOut ? 1 : 2;
    stepLabel = "Mandatory Fitness Assessment";
  } else if (step === "matched_program") {
    stepNumber = bandsSoldOut ? 2 : 3;
    stepLabel = "Assessment-Matched Program ($249)";
  } else if (step === "downsell") {
    stepNumber = bandsSoldOut ? 2 : 3;
    stepLabel = "Self-Directed DIY Program ($199)";
  } else if (step === "twopack_upsell") {
    stepNumber = bandsSoldOut ? 3 : 4;
    stepLabel = "Choose 2 More Programs (20% Discount)";
  } else if (step === "ascension") {
    stepNumber = bandsSoldOut ? 4 : 5;
    stepLabel = "Premium Ascension Coaching ($3,000)";
  } else if (step === "confirmation") {
    stepNumber = totalSteps;
    stepLabel = "Order Confirmation & Access";
  } else if (step === "neutral_exit") {
    stepNumber = totalSteps;
    stepLabel = "Prescription Saved";
  }

  // Navigation handlers
  const handleAssessmentComplete = (data: AssessmentData, pres: any) => {
    setAssessmentData(data);
    setPrescription(pres);
    saveSessionState("brj_funnel_assessment", data);
    saveSessionState("brj_funnel_prescription", pres);
    setStep("matched_program");
  };

  const handleRestart = () => {
    if (bandsSoldOut) {
      setStep("assessment");
    } else {
      setStep("bands");
    }
  };

  return (
    <FunnelShell
      currentStep={stepNumber}
      totalSteps={totalSteps}
      stepLabel={stepLabel}
      funnelTitle="Funnel Layout 2 • Paid Ads to Bands First"
      onBack={
        step === "assessment" && !bandsSoldOut
          ? () => setStep("bands")
          : step === "matched_program"
            ? () => setStep("assessment")
            : undefined
      }
    >
      {/* 1. Free Resistance Bands ($15 S&H, while available) */}
      {step === "bands" && (
        <BandOfferStep
          funnelId="funnel_b"
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          customerPhone={assessmentData?.phone}
          onAccept={() => {
            setBandsClaimed(true);
            saveSessionState("brj_bands_claimed", true);
            setStep("assessment");
          }}
          onDecline={() => setStep("assessment")}
        />
      )}

      {/* 2. Mandatory Fitness Assessment */}
      {step === "assessment" && (
        <AssessmentStep
          funnelId="funnel_b"
          initialData={assessmentData || undefined}
          onComplete={handleAssessmentComplete}
        />
      )}

      {/* 3. Assessment-Matched Program ($249) */}
      {step === "matched_program" && (
        <MatchedProgramStep
          funnelId="funnel_b"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={() => {
            setPurchasedPrimary(true);
            saveSessionState("brj_purchased_primary", true);
            setStep("twopack_upsell");
          }}
          onDecline={() => setStep("downsell")}
        />
      )}

      {/* 4. $199 Downsell (if $249 declined) */}
      {step === "downsell" && (
        <DownsellStep
          funnelId="funnel_b"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={() => {
            setPurchasedDownsell(true);
            saveSessionState("brj_purchased_downsell", true);
            setStep("confirmation");
          }}
          onDecline={() => setStep("neutral_exit")}
        />
      )}

      {/* 5. Two-Program Upsell ($398.40) - only after $249 purchase */}
      {step === "twopack_upsell" && (
        <TwoPackUpsellStep
          funnelId="funnel_b"
          purchasedProgramId={matchedProgram.id}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={(data, selectedPrograms) => {
            setPurchasedTwoPack(true);
            saveSessionState("brj_purchased_twopack", true);
            if (selectedPrograms && selectedPrograms.length > 0) {
              const titles = selectedPrograms.map((p) => p.title);
              setTwoPackTitles(titles);
              saveSessionState("brj_twopack_titles", titles);
            }
            setStep("ascension");
          }}
          onDecline={() => setStep("ascension")}
        />
      )}

      {/* 6. Premium Coaching ($3,000 MFA or WWP) */}
      {step === "ascension" && (
        <AscensionStep
          funnelId="funnel_b"
          gender={assessmentData?.gender || "Male"}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={(orderData) => {
            setPurchasedAscension(true);
            saveSessionState("brj_purchased_ascension", true);
            if (orderData?.plan) {
              setCoachingPlan(orderData.plan);
              saveSessionState("brj_coaching_plan", orderData.plan);
            }
            setStep("confirmation");
          }}
          onDecline={() => setStep("confirmation")}
        />
      )}

      {/* 7. Final Confirmation */}
      {step === "confirmation" && (
        <ConfirmationStep
          funnelId="funnel_b"
          customerEmail={assessmentData?.email}
          orderSummary={{
            hasBands: bandsClaimed,
            primaryProgramTitle: matchedProgram?.title,
            isDownsell: purchasedDownsell,
            twoPackTitles,
            coachingProgramTitle: purchasedAscension
              ? assessmentData?.gender === "Female"
                ? "Women’s Wellness Program"
                : "Men’s Fitness Alliance"
              : undefined,
            coachingPlan,
          }}
        />
      )}

      {/* 8. Neutral Exit (Declined both $249 and $199) */}
      {step === "neutral_exit" && (
        <NeutralExitStep
          funnelId="funnel_b"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          onRestart={handleRestart}
        />
      )}
    </FunnelShell>
  );
}
