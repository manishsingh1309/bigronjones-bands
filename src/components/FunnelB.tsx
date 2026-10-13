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

type FunnelBStep =
  | "bands"             // Step 1: Free Resistance Bands ($15 S&H)
  | "assessment"        // Step 2: Mandatory Fitness Assessment
  | "matched_program"   // Step 3: Matched Program ($249)
  | "downsell"          // If $249 declined: Downsell ($199)
  | "twopack_upsell"    // If $249 purchased: Choose 2 More Programs (20% off)
  | "ascension"         // After 2-Pack: MFA or WWP ($3,000)
  | "confirmation"      // Confirmed purchase
  | "neutral_exit";     // Declined both $249 and $199

export default function FunnelB() {
  const [step, setStep] = useState<FunnelBStep>("bands");
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
          // Rule: At 30 completed sales, disable/redirect Funnel B band landing and route directly to Assessment!
          setStep("assessment");
        }
      })
      .catch((e) => console.warn("[FunnelB] inventory probe warning:", e));
  }, []);

  // Check URL params for checkout returns (?session_id=...&type=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (params.get("session_id")) {
      if (type === "bands") {
        setBandsClaimed(true);
        setStep("assessment");
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
    setStep("matched_program");
  };

  const matchedProgram: ProgramSeriesItem | undefined = prescription?.matchedProgram;

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
      {step === "matched_program" && matchedProgram && (
        <MatchedProgramStep
          funnelId="funnel_b"
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
          funnelId="funnel_b"
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
          funnelId="funnel_b"
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
          funnelId="funnel_b"
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
          }}
        />
      )}

      {/* 8. Neutral Exit (Declined both $249 and $199) */}
      {step === "neutral_exit" && (
        <NeutralExitStep
          funnelId="funnel_b"
          matchedProgram={matchedProgram}
          customerEmail={assessmentData?.email}
          onRestart={() => setStep("assessment")}
        />
      )}
    </FunnelShell>
  );
}
