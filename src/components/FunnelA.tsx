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
import type { ProgramSeriesItem } from "../lib/programSeries";

type FunnelAStep =
  | "assessment"        // Step 1: Mandatory Fitness Assessment
  | "bands"             // Step 2: Free Bands ($15 S&H, if available)
  | "matched_program"   // Step 3: Matched Program ($249)
  | "downsell"          // If $249 declined: Downsell ($199)
  | "twopack_upsell"    // If $249 purchased: Choose 2 More Programs (20% off)
  | "ascension"         // After 2-Pack: MFA or WWP ($3,000)
  | "confirmation"      // Confirmed purchase
  | "neutral_exit";     // Declined both $249 and $199

export default function FunnelA() {
  const [step, setStep] = useState<FunnelAStep>("assessment");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [prescription, setPrescription] = useState<any>(null);
  const [bandsClaimed, setBandsClaimed] = useState(false);
  const [bandsSoldOut, setBandsSoldOut] = useState(false);
  const [purchasedPrimary, setPurchasedPrimary] = useState(false);
  const [purchasedDownsell, setPurchasedDownsell] = useState(false);
  const [purchasedTwoPack, setPurchasedTwoPack] = useState(false);
  const [twoPackTitles, setTwoPackTitles] = useState<string[]>([]);
  const [purchasedAscension, setPurchasedAscension] = useState(false);

  // Check band inventory on mount
  useEffect(() => {
    fetch("/api/funnels/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.isSoldOut) {
          setBandsSoldOut(true);
        }
      })
      .catch((e) => console.warn("[FunnelA] inventory probe warning:", e));
  }, []);

  // Check URL params for checkout returns (?session_id=...&type=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (params.get("session_id")) {
      if (type === "bands") {
        setBandsClaimed(true);
        setStep("matched_program");
      } else if (type === "primary_249") {
        setPurchasedPrimary(true);
        setStep("twopack_upsell");
      } else if (type === "downsell_199") {
        setPurchasedDownsell(true);
        setStep("confirmation");
      } else if (type === "twopack_398") {
        setPurchasedTwoPack(true);
        setStep("ascension");
      } else if (type === "ascension_3000") {
        setPurchasedAscension(true);
        setStep("confirmation");
      }
    }
  }, []);

  // Step numbering & metadata
  let stepNumber = 1;
  let totalSteps = 5;
  let stepLabel = "Fitness Assessment";

  if (step === "assessment") {
    stepNumber = 1;
    stepLabel = "Fitness Diagnostic Assessment";
  } else if (step === "bands") {
    stepNumber = 2;
    stepLabel = "Free Resistance Bands Offer";
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

    // Rule: At 30 completed sales, Funnel A assessment routes directly to matched $249 product, bypassing bands
    if (bandsSoldOut) {
      setStep("matched_program");
    } else {
      setStep("bands");
    }
  };

  const matchedProgram: ProgramSeriesItem | undefined = prescription?.matchedProgram;

  return (
    <FunnelShell
      currentStep={stepNumber}
      totalSteps={totalSteps}
      stepLabel={stepLabel}
      funnelTitle="Funnel Layout 1 • Assessment First"
      onBack={
        step === "bands"
          ? () => setStep("assessment")
          : step === "matched_program" && !bandsSoldOut
            ? () => setStep("bands")
            : undefined
      }
    >
      {/* 1. Mandatory Fitness Assessment */}
      {step === "assessment" && (
        <AssessmentStep
          funnelId="funnel_a"
          initialData={assessmentData || undefined}
          onComplete={handleAssessmentComplete}
        />
      )}

      {/* 2. Free Resistance Bands ($15 S&H, while available) */}
      {step === "bands" && (
        <BandOfferStep
          funnelId="funnel_a"
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          customerPhone={assessmentData?.phone}
          onAccept={() => {
            setBandsClaimed(true);
            setStep("matched_program");
          }}
          onDecline={() => setStep("matched_program")}
        />
      )}

      {/* 3. Assessment-Matched Program ($249) */}
      {step === "matched_program" && matchedProgram && (
        <MatchedProgramStep
          funnelId="funnel_a"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={() => {
            setPurchasedPrimary(true);
            setStep("twopack_upsell");
          }}
          onDecline={() => setStep("downsell")}
        />
      )}

      {/* 4. $199 Downsell (if $249 declined) */}
      {step === "downsell" && matchedProgram && (
        <DownsellStep
          funnelId="funnel_a"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={() => {
            setPurchasedDownsell(true);
            setStep("confirmation");
          }}
          onDecline={() => setStep("neutral_exit")}
        />
      )}

      {/* 5. Two-Program Upsell ($398.40) - only after $249 purchase */}
      {step === "twopack_upsell" && matchedProgram && (
        <TwoPackUpsellStep
          funnelId="funnel_a"
          purchasedProgramId={matchedProgram.id}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={(data) => {
            setPurchasedTwoPack(true);
            setStep("ascension");
          }}
          onDecline={() => setStep("ascension")}
        />
      )}

      {/* 6. Premium Coaching ($3,000 MFA or WWP) */}
      {step === "ascension" && (
        <AscensionStep
          funnelId="funnel_a"
          gender={assessmentData?.gender || "Male"}
          customerEmail={assessmentData?.email}
          customerName={assessmentData?.fullName}
          onAccept={() => {
            setPurchasedAscension(true);
            setStep("confirmation");
          }}
          onDecline={() => setStep("confirmation")}
        />
      )}

      {/* 7. Final Confirmation */}
      {step === "confirmation" && (
        <ConfirmationStep
          funnelId="funnel_a"
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
          }}
        />
      )}

      {/* 8. Neutral Exit (Declined both $249 and $199) */}
      {step === "neutral_exit" && (
        <NeutralExitStep
          funnelId="funnel_a"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          onRestart={() => setStep("assessment")}
        />
      )}
    </FunnelShell>
  );
}
