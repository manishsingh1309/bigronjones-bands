// Public marketing metadata for the BigRonJones Program Series — 8 standalone
// programs, $249 each. This file is browser-safe: it holds NO video links (those
// stay server-only in backend/lib/programContent.ts and are streamed gated).
//
// Every program includes the same structure: one 1-on-1 consultation with Ron &
// our nutritionist, a 4-day Gym Series, and a 4-day Home Series. All 8 programs' videos are
// loaded and stream gated, in-browser, from backend/lib/programContent.ts.

/** The price a program costs unless it overrides it. See programPrice(). */
export const PROGRAM_PRICE = 249;
export const GYM_DAYS = 4;
export const HOME_DAYS = 4;
export const TOTAL_VIDEOS = GYM_DAYS + HOME_DAYS;

export type ProgramSeriesItem = {
  id: number; // 1..8 — permanent identity, see DISPLAY_ORDER below
  /**
   * URL identity, e.g. "lean-muscle-development".
   *
   * MUST match the slug ronismytrainer.com uses for the same id: a buyer
   * follows /programs/lean-muscle-development there and lands on the same
   * path here, and the two sites are meant to feel like one product.
   *
   * Unlike `id`, a slug CAN be changed — but only by adding the old value to
   * LEGACY_SLUGS below, because live links, Ron's posts and already-sent
   * emails point at it.
   */
  slug: string;
  title: string;
  focus: string; // short focus line, all-caps friendly
  blurb: string; // exact checklist description
  image: string; // cover image path
  highlights: string[];
  comingSoon: boolean; // true while videos aren't loaded yet
  /**
   * This program's price in USD. Omit for the standard PROGRAM_PRICE.
   *
   * Read it through programPrice(), never directly, so a program without an
   * override still answers the question. The server re-derives the charge from
   * this same value — the browser is shown a price, it is never asked for one.
   */
  priceUsd?: number;
  // Optional overrides for any program whose shape ever differs from the
  // default 4-gym-days / 4-home-days. All 8 currently use the 4/4 default.
  gymChip?: string; // short card chip, default "4 Gym"
  homeChip?: string; // short card chip, default "4 Home"
  gymCount?: number; // # of gym videos, default 4 (sales page summary)
  homeCount?: number; // # of home videos, default 4
};

// Verbatim Section 3.A Approved Copy Constants
export const PROGRAM_MORE_THAN_HEADER = "MORE THAN A TRAINING PROGRAM";
export const PROGRAM_MORE_THAN_INTRO =
  "Your purchase includes structured training and two separate private video sessions designed to help you understand how to apply the program to your goals.";

export const PROGRAM_INCLUDED_DETAILS = [
  {
    title: "One private video consultation with BigRonJones® to discuss your goals, training experience, and program direction.",
    description: "",
  },
  {
    title: "One separate private nutrition consultation with our Nutritionist to discuss nutritional structure that supports your goals.",
    description: "",
  },
  {
    title: "Access to both gym-based and home-based training options included with your purchased program.",
    description: "",
  },
  {
    title: "Structured workout guidance designed to help you train with greater clarity and consistency.",
    description: "",
  },
];

export const PROGRAM_INCLUDES = PROGRAM_INCLUDED_DETAILS.map((d) => d.title);
export const PROGRAM_BUTTON_TEXT = "GET MY TRAINING PROGRAM — $249";

export const programSeries: ProgramSeriesItem[] = [
  {
    id: 1,
    slug: "movement-foundations",
    title: "Movement Foundations",
    focus: "Build the Base",
    blurb: "A technique-first base of strength you can keep building on for years.",
    image: "/programs/thumb-1.jpg",
    highlights: ["4 gym days + 4 home days", "Gym & home options", "Joint-friendly progressions"],
    comingSoon: false,
  },
  {
    id: 2,
    slug: "strength-and-conditioning",
    title: "Strength & Conditioning",
    focus: "Build Momentum",
    blurb: "Full-body strength and conditioning that fit around a working week.",
    image: "/programs/thumb-2.jpg",
    highlights: ["Full-body strength", "Conditioning that fits real life", "Gym & home versions"],
    comingSoon: false,
  },
  {
    id: 3,
    slug: "power-and-endurance",
    title: "Power & Endurance",
    focus: "Build Drive",
    blurb: "Trains you to produce force, and to keep producing it.",
    image: "/programs/thumb-3.jpg",
    highlights: ["Work-capacity focus", "Smart progression", "Recovery built in"],
    comingSoon: false,
  },
  {
    id: 4,
    slug: "lean-muscle-development",
    title: "Lean Muscle Development",
    focus: "Forge Strength & Shape",
    blurb: "Structured volume across the whole body, built for lean muscle.",
    image: "/programs/thumb-4.jpg",
    highlights: ["Lean muscle focus", "Structured volume", "Train anywhere"],
    comingSoon: false,
  },
  {
    id: 5,
    slug: "control-and-consistency",
    title: "Control & Consistency",
    focus: "Own the Tempo",
    blurb: "Strength built through tempo and control, not heavier and heavier loads.",
    image: "/programs/thumb-5.jpg",
    highlights: ["Tempo & control", "Consistency systems", "Sustainable load"],
    comingSoon: false,
  },
  {
    id: 6,
    slug: "endurance-and-conditioning",
    title: "Endurance & Conditioning",
    focus: "Build Resilience",
    blurb: "Strength training with mobility woven through every session.",
    image: "/programs/thumb-6.jpg",
    highlights: ["Durability focus", "Mobility integrated", "Stay in the game"],
    comingSoon: false,
  },
  {
    id: 7,
    slug: "performance-training",
    title: "Performance Training",
    focus: "Reach Your Peak",
    blurb: "Sharpens speed, output, and the ability to repeat both.",
    image: "/programs/thumb-7.jpg",
    highlights: ["Performance focus", "Higher intensity", "Earned, not rushed"],
    comingSoon: false,
  },
  {
    id: 8,
    slug: "everyday-performance",
    title: "Everyday Performance",
    focus: "Build Mastery",
    blurb: "Strength, conditioning and movement quality in the same four days.",
    image: "/programs/thumb-8.jpg",
    highlights: ["Complete programming", "Strength + conditioning", "Train for life"],
    comingSoon: false,
  },
];

export const getProgramSeriesItem = (
  id: number | string,
): ProgramSeriesItem | undefined =>
  programSeries.find((p) => p.id === Number(id));

// ── Pricing ─────────────────────────────────────────────────────────────────

/** What this program costs, in USD. The ONLY way to ask — reading priceUsd
 *  directly misses every program that does not override it. */
export const programPrice = (p: ProgramSeriesItem): number =>
  p.priceUsd ?? PROGRAM_PRICE;

/** The cheapest program on sale. For headline copy that used to say a single
 *  price for all eight and now has to say "from". */
export const lowestProgramPrice = (): number =>
  Math.min(...programSeries.map(programPrice));

/** True when every program costs the same, so a page can say "$249 each"
 *  honestly instead of "from $1" when nothing is actually discounted. */
export const allProgramsSamePrice = (): boolean =>
  new Set(programSeries.map(programPrice)).size === 1;

// ── Slugs ───────────────────────────────────────────────────────────────────

/**
 * Slugs three programs used to answer to, kept because they are still live
 * somewhere we do not control: Ron's posts, a customer's bookmark, a link in
 * an email already sent. Each maps to the slug that replaced it, and the
 * router 301s rather than 404s.
 *
 * Deleting an entry here breaks those links permanently. Adding one costs
 * nothing. So entries go in and never come out.
 */
const LEGACY_SLUGS: Readonly<Record<string, string>> = {
  "muscle-building": "lean-muscle-development",
  "mobility-and-durability": "endurance-and-conditioning",
  "complete-training-system": "everyday-performance",
};

const BY_SLUG = new Map(programSeries.map((p) => [p.slug, p]));

/** Exact match on a current slug. Does NOT follow legacy slugs — use
 *  resolveProgramSlug when you are handling a URL a human might have. */
export const getProgramSeriesItemBySlug = (
  slug: string | undefined,
): ProgramSeriesItem | undefined => (slug ? BY_SLUG.get(slug.toLowerCase()) : undefined);

/**
 * Resolves whatever is in the URL to a program, reporting whether the caller
 * should redirect.
 *
 * Accepts a current slug, a retired slug, or a bare id ("4") — the last
 * because /programs/series/4 was the only shape these URLs had until now and
 * is all over the site's own history.
 */
export function resolveProgramSlug(
  raw: string | undefined,
): { program: ProgramSeriesItem; canonical: string; redirect: boolean } | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();

  const direct = BY_SLUG.get(key);
  if (direct) return { program: direct, canonical: direct.slug, redirect: false };

  const renamed = LEGACY_SLUGS[key];
  if (renamed) {
    const program = BY_SLUG.get(renamed);
    if (program) return { program, canonical: program.slug, redirect: true };
  }

  // Bare numeric id, e.g. the old /programs/series/4.
  if (/^[1-8]$/.test(key)) {
    const program = getProgramSeriesItem(Number(key));
    if (program) return { program, canonical: program.slug, redirect: true };
  }

  return null;
}

/** Canonical public path for a program on THIS site. */
export const programPath = (p: ProgramSeriesItem): string => `/programs/${p.slug}`;

// ── Display order ───────────────────────────────────────────────────────────
//
// THE ID IS THE IDENTITY. THIS LIST IS ONLY THE RUNNING ORDER.
//
// Every purchase row in program_purchases stores program_id, every video in
// backend/lib/programContent.ts is keyed on program_id, and every checkout
// call sends program_id. Renumbering a program to move it up the page would
// silently hand every existing customer somebody else's training. So ids never
// move — 7 is Performance Training for as long as this business exists — and
// the order the customer sees is decided here instead.
//
// This list MUST stay identical to DISPLAY_ORDER in the ronismytrainer repo
// (frontend/src/content/programs.ts). The two sites sell the same eight
// programs; if the storefront lists them in one order and the member area in
// another, a buyer cannot tell whether they opened the thing they paid for.
//
// NOTHING ENFORCES THAT ACROSS REPOS. They are separate repositories with
// separate deploys and neither can import the other, so keeping the two lists
// in step is a manual discipline: change one, change the other in the same
// sitting. assertProgramSeriesIntegrity() below only guards THIS file's
// internal consistency — that every id 1–8 appears exactly once.
const DISPLAY_ORDER: readonly number[] = [
  7, // Performance Training
  4, // Lean Muscle Development
  8, // Everyday Performance
  2, // Strength & Conditioning
  3, // Power & Endurance
  1, // Movement Foundations
  5, // Control & Consistency
  6, // Endurance & Conditioning
];

/**
 * The eight programs in the order customers should SEE them.
 *
 * Use this for anything a customer looks at — the programs grid, "related
 * programs", the sales page. Use `programSeries` (id order) only where the
 * number itself is the point, such as admin tables.
 *
 * Sorted, never filtered: an id missing from DISPLAY_ORDER sorts to the front
 * rather than disappearing, so a mistake here is loud instead of quietly
 * removing a program nobody can buy any more.
 */
export const programSeriesByDisplayOrder: ProgramSeriesItem[] = [
  ...programSeries,
].sort((a, b) => DISPLAY_ORDER.indexOf(a.id) - DISPLAY_ORDER.indexOf(b.id));

/**
 * Catches the two mistakes that would be expensive and silent.
 *
 * Runs at module load, so a bad edit fails the build rather than shipping a
 * storefront that sells one thing and delivers another.
 */
function assertProgramSeriesIntegrity(): void {
  const ids = programSeries.map((p) => p.id).sort((a, b) => a - b);
  const expected = [1, 2, 3, 4, 5, 6, 7, 8];
  if (ids.join(",") !== expected.join(",")) {
    throw new Error(
      `programSeries must contain exactly ids 1–8, got [${ids.join(", ")}]. ` +
        `Ids are permanent: program_purchases rows and the video map are keyed on them.`,
    );
  }
  const ordered = [...DISPLAY_ORDER].sort((a, b) => a - b);
  if (ordered.join(",") !== expected.join(",")) {
    throw new Error(
      `DISPLAY_ORDER must list every id 1–8 exactly once, got [${DISPLAY_ORDER.join(", ")}].`,
    );
  }

  // Two programs sharing a slug means one of them is unreachable: the Map
  // keeps the last, and the other's URL silently serves its neighbour's sales
  // page — with the neighbour's Buy button.
  const slugs = programSeries.map((p) => p.slug);
  const duplicate = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (duplicate) {
    throw new Error(
      `Duplicate program slug "${duplicate}". Each program needs its own URL.`,
    );
  }
  const malformed = slugs.find((s) => !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(s));
  if (malformed) {
    throw new Error(
      `Program slug "${malformed}" is not URL-safe (lowercase, digits and inner hyphens only).`,
    );
  }

  // A retired slug that still names a live program would shadow it: the
  // redirect would fire first and the real page could never be reached.
  const collision = Object.keys(LEGACY_SLUGS).find((s) => slugs.includes(s));
  if (collision) {
    throw new Error(
      `"${collision}" is listed as a legacy slug but is also a live program slug.`,
    );
  }
}
assertProgramSeriesIntegrity();
