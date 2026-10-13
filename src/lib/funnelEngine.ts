import { getProgramSeriesItem, type ProgramSeriesItem } from "./programSeries";

export const BAND_TOTAL_CAP = 30;
export const BAND_SHIPPING_USD = 15;
export const PRIMARY_PROGRAM_USD = 249;
export const DOWNSELL_PROGRAM_USD = 199;
export const TWO_PACK_DISCOUNT_PERCENT = 20; // 20% off each
export const TWO_PACK_PER_PROGRAM_USD = 199.20; // $249 * 0.8
export const TWO_PACK_TOTAL_USD = 398.40; // $199.20 * 2
export const ASCENSION_PIF_USD = 3000;
export const ASCENSION_IN_HOUSE_MONTHLY_USD = 750;

export type AssessmentAnswers = {
  gender: "Male" | "Female";
  goal: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  obstacle: string;
  environment: "Home" | "Gym" | "Both";
  supportLevel: string;
  email?: string;
  name?: string;
  phone?: string;
};

export type PrescriptionResult = {
  matchedProgram: ProgramSeriesItem;
  complementaryProgram: ProgramSeriesItem;
  recommendedAscension: "MFA" | "WWP";
  ascensionTitle: string;
};

// Authoritative mapping from Assessment Question 02 (Goal) to Program ID (1..8)
export const GOAL_TO_PROGRAM_MAP: Record<string, { programId: number; complementaryId: number }> = {
  "Improve Athletic Performance": { programId: 7, complementaryId: 3 }, // Performance Training -> Power & Endurance
  "Build Muscle": { programId: 4, complementaryId: 2 },                 // Lean Muscle Development -> Strength & Conditioning
  "Improve Everyday Fitness": { programId: 8, complementaryId: 6 },     // Everyday Performance -> Endurance & Conditioning
  "Get Stronger": { programId: 2, complementaryId: 4 },                 // Strength & Conditioning -> Lean Muscle Development
  "Improve Endurance": { programId: 3, complementaryId: 7 },            // Power & Endurance -> Performance Training
  "Improve Movement": { programId: 1, complementaryId: 5 },             // Movement Foundations -> Control & Consistency
  "Develop Better Control": { programId: 5, complementaryId: 1 },       // Control & Consistency -> Movement Foundations
  "Improve Overall Conditioning": { programId: 6, complementaryId: 8 }, // Endurance & Conditioning -> Everyday Performance
};

export function evaluatePrescription(answers: AssessmentAnswers): PrescriptionResult {
  const goalEntry = GOAL_TO_PROGRAM_MAP[answers.goal] || { programId: 7, complementaryId: 3 };
  const matched = getProgramSeriesItem(goalEntry.programId)!;
  const complementary = getProgramSeriesItem(goalEntry.complementaryId)!;
  const isFemale = answers.gender === "Female";

  return {
    matchedProgram: matched,
    complementaryProgram: complementary,
    recommendedAscension: isFemale ? "WWP" : "MFA",
    ascensionTitle: isFemale ? "Women’s Wellness Program" : "Men’s Fitness Alliance",
  };
}

export function validateTwoPackSelection(
  purchasedProgramId: number,
  selectedIds: number[]
): {
  valid: boolean;
  program1?: ProgramSeriesItem;
  program2?: ProgramSeriesItem;
  error?: string;
} {
  if (selectedIds.length !== 2) {
    return { valid: false, error: "Please select exactly two distinct programs." };
  }

  if (selectedIds[0] === selectedIds[1]) {
    return { valid: false, error: "Please select two distinct programs." };
  }

  if (selectedIds.includes(purchasedProgramId)) {
    return { valid: false, error: "You cannot re-select the program you already purchased." };
  }

  const p1 = getProgramSeriesItem(selectedIds[0]);
  const p2 = getProgramSeriesItem(selectedIds[1]);

  if (!p1 || !p2) {
    return { valid: false, error: "One or more selected programs are invalid." };
  }

  return {
    valid: true,
    program1: p1,
    program2: p2,
  };
}

export async function fetchBandInventoryStatus(): Promise<{
  totalCap: number;
  completedSales: number;
  remaining: number;
  isSoldOut: boolean;
}> {
  try {
    const res = await fetch("/api/funnels/status");
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[funnelEngine] Status fetch warning:", err);
  }

  return {
    totalCap: BAND_TOTAL_CAP,
    completedSales: 0,
    remaining: BAND_TOTAL_CAP,
    isSoldOut: false,
  };
}
