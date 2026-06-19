// Extended public-portal data (open contests, winners, brands, FAQ, comments).
// Built on top of src/lib/data.ts so existing pages keep working.

import { CONTESTANTS, PRODUCTS, PHOTOGRAPHERS } from "./data";

const U = (id: string, w = 1200, h = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export type OpenContest = {
  id: string;
  country: string;
  flag: string;
  year: number;
  status: "live" | "coming" | "closed";
  stage: string;
  opens: string;
  closes: string;
  cover: string;
  applicationsOpen: boolean;
  contestants: number;
};

export const OPEN_CONTESTS: OpenContest[] = [
  { id: "mc-in-2026", country: "India",  flag: "🇮🇳", year: 2026, status: "live",   stage: "Round of 16", opens: "12 Jan 2026", closes: "08 Mar 2026", cover: U("photo-1583001931096-959e9a1a6223", 1600, 1100), applicationsOpen: true,  contestants: 32 },
  { id: "mc-us-2026", country: "USA",    flag: "🇺🇸", year: 2026, status: "live",   stage: "Casting Week", opens: "02 Feb 2026", closes: "20 Apr 2026", cover: U("photo-1496360166961-10a51d5f367a", 1600, 1100), applicationsOpen: true,  contestants: 48 },
  { id: "mc-uk-2026", country: "UK",     flag: "🇬🇧", year: 2026, status: "coming", stage: "Applications", opens: "01 Apr 2026", closes: "15 Jun 2026", cover: U("photo-1485518882345-15568b007407", 1600, 1100), applicationsOpen: true,  contestants: 12 },
  { id: "mc-gl-2026", country: "Global", flag: "🌐", year: 2026, status: "coming", stage: "Pre-Casting",  opens: "01 May 2026", closes: "20 Aug 2026", cover: U("photo-1539109136881-3be0616acf4b", 1600, 1100), applicationsOpen: true,  contestants: 0  },
  { id: "mc-fr-2025", country: "France", flag: "🇫🇷", year: 2025, status: "closed", stage: "Crowned",      opens: "—",          closes: "—",          cover: U("photo-1469334031218-e382a71b716b", 1600, 1100), applicationsOpen: false, contestants: 64 },
  { id: "mc-jp-2025", country: "Japan",  flag: "🇯🇵", year: 2025, status: "closed", stage: "Crowned",      opens: "—",          closes: "—",          cover: U("photo-1483985988355-763728e1935b", 1600, 1100), applicationsOpen: false, contestants: 56 },
];

export type LegacyWinner = { id: string; year: number; country: string; name: string; portrait: string; quote: string };
export const LEGACY_WINNERS: LegacyWinner[] = [
  { id: "lw1", year: 2025, country: "France",  name: "Élodie Marchand", portrait: CONTESTANTS[3].image, quote: "ReeVibes gave me a sentence in fashion history." },
  { id: "lw2", year: 2024, country: "Brazil",  name: "Mariana Lopes",   portrait: CONTESTANTS[6].image, quote: "Curves became my signature, not my struggle." },
  { id: "lw3", year: 2023, country: "Nigeria", name: "Chiamaka Eze",    portrait: CONTESTANTS[13].image, quote: "I walked in a contestant, I left a maison." },
  { id: "lw4", year: 2022, country: "India",   name: "Aaliyah Khan",    portrait: CONTESTANTS[8].image, quote: "The runway finally fit me — not the other way around." },
  { id: "lw5", year: 2021, country: "Japan",   name: "Mei Tanaka",      portrait: CONTESTANTS[10].image, quote: "A new vocabulary of beauty was written here." },
];

export type Brand = { id: string; name: string; tagline: string; mark: string; cover: string };
export const BRANDS: Brand[] = [
  { id: "br1", name: "Maison Lumière",  tagline: "Atelier of light",        mark: "M·L",  cover: PRODUCTS[0].image },
  { id: "br2", name: "Atelier Reine",   tagline: "Sculpted couture",        mark: "A·R",  cover: PRODUCTS[3].image },
  { id: "br3", name: "Studio Onyx",     tagline: "Black silhouettes",       mark: "ONYX", cover: PRODUCTS[2].image },
  { id: "br4", name: "Curvy Couture",   tagline: "Drape & devotion",        mark: "C·C",  cover: PRODUCTS[1].image },
  { id: "br5", name: "Rose Éternelle",  tagline: "Heels & adornment",       mark: "RE",   cover: PRODUCTS[5].image },
  { id: "br6", name: "Velvet & Co.",    tagline: "After-dark wardrobe",     mark: "V&Co", cover: PRODUCTS[4].image },
];

export const FAQ_ITEMS = [
  { q: "Who can apply to ReeVibes?", a: "Women 18 and older from any country. We celebrate every silhouette — there is no measurement requirement." },
  { q: "Is there a participation fee?", a: "No. Applying to a ReeVibes season is free. Selected candidates are flown to casting at the maison's expense." },
  { q: "How does voting work?", a: "Each registered account may cast one vote per contestant per day during live rounds. Votes are weighted against editorial scores from our jury." },
  { q: "What happens after I'm selected?", a: "You receive a private digital casting invitation, signed media release, travel itinerary, and an editorial brief from our creative directors." },
  { q: "How are winners chosen?", a: "Each season blends 60% public vote, 30% jury score, and 10% editorial performance across our campaigns." },
  { q: "Can brands collaborate with ReeVibes?", a: "Yes. Reach the partnerships desk via the contact form — we onboard one new house per season." },
];

export type CommentItem = { id: string; user: string; avatar: string; time: string; text: string; likes: number };
export const SEED_COMMENTS: CommentItem[] = [
  { id: "cm1", user: "@vogue.elena",   avatar: U("photo-1494790108377-be9c29b29330", 100, 100), time: "2h", text: "She owns this frame. Pure editorial.",     likes: 42 },
  { id: "cm2", user: "@anaste.kim",    avatar: U("photo-1517841905240-472988babdf9", 100, 100), time: "5h", text: "Best look of the season so far.",          likes: 28 },
  { id: "cm3", user: "@studio.onyx",   avatar: U("photo-1561406636-b80293969660", 100, 100), time: "1d", text: "The silhouette is poetry. Bravo, maison.",   likes: 87 },
];

export const SHOP_THE_LOOK_TAGS: Record<string, string[]> = {
  // contestant slug -> product ids
  default: [PRODUCTS[0].id, PRODUCTS[2].id, PRODUCTS[5].id],
};

export const NOTIFICATIONS_SEED = [
  { id: "n1", icon: "approved",  title: "Application Approved",       body: "You're moving forward to Casting Week.",    time: "2h ago", unread: true },
  { id: "n2", icon: "casting",   title: "Casting Invitation",         body: "Paris atelier — 18 March, 10:00 CET.",       time: "1d ago", unread: true },
  { id: "n3", icon: "live",      title: "You're up next",             body: "Round of 16 · Battle 02 starts in 1h.",      time: "1d ago", unread: false },
  { id: "n4", icon: "judgement", title: "Judgement update",           body: "Jury scoring is now complete for Week 3.",   time: "3d ago", unread: false },
];

export { CONTESTANTS, PHOTOGRAPHERS, PRODUCTS };
