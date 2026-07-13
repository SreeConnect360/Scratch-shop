import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useRouterState, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound, S as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports, R as React2 } from "../_libs/react.mjs";
import { G as GoogleOAuthProvider } from "../_libs/react-oauth__google.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import fs from "node:fs";
import path from "node:path";
import { u as utils, w as writeFileSync, r as readSync } from "../_libs/xlsx.mjs";
import { R as Root, P as Portal, C as Content, a as Close, O as Overlay, T as Title, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { m as maplibregl } from "../_libs/maplibre-gl.mjs";
import { E as Earth, S as Search, C as Crown, U as UsersRound, L as Lock, a as CircleCheckBig, b as ChevronLeft, M as Menu, X, B as Bell, c as ChevronDown, d as ChevronRight, F as Funnel, P as Plus, e as Shield, f as ShoppingBag, T as Trash2, g as MapPin, h as Save, i as Pen, A as ArrowRight, j as CreditCard, k as CircleCheck, W as Wallet, l as Tag, m as LayoutGrid, n as Sparkles, o as Layers, p as Truck, R as RefreshCw, q as Users, r as Ticket, s as Star, t as Store, u as Radio, v as Camera, w as UserCheck, x as Flag, y as ChartColumn, z as Sun, D as Moon, G as Eye, H as ShieldAlert, I as EyeOff, J as ArrowUpRight, K as ListFilter, N as Download, O as Upload, Q as ArrowLeft, V as Check, Y as CirclePlus, Z as Video, _ as Play, $ as GripVertical, a0 as Link$1, a1 as Settings, a2 as History, a3 as SquareCheckBig, a4 as Square, a5 as Undo } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { o as objectType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const appCss = "/assets/styles-DMVJAg2D.css";
const ThemeContext = reactExports.createContext(null);
const STORAGE_KEY = "reevibes-theme";
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "dark";
  });
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }
  }, [theme]);
  const setTheme = (t) => setThemeState(t);
  const toggleTheme = () => setThemeState((t) => t === "dark" ? "light" : "dark");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value: { theme, setTheme, toggleTheme }, children });
}
function useTheme() {
  const ctx = reactExports.useContext(ThemeContext);
  if (!ctx) return { theme: "dark", toggleTheme: () => {
  }, setTheme: () => {
  } };
  return ctx;
}
const U$1 = (id, w = 1200, h = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
const HERO_IMAGES = [
  U$1("photo-1539109136881-3be0616acf4b"),
  U$1("photo-1496360166961-10a51d5f367a"),
  U$1("photo-1485518882345-15568b007407"),
  U$1("photo-1583001931096-959e9a1a6223")
];
const FACES = [
  "photo-1531123897727-8f129e1688ce",
  "photo-1488426862026-3ee34a7d66df",
  "photo-1542596594-649edbc13630",
  "photo-1502823403499-6ccfcf4fb453",
  "photo-1524504388940-b1c1722653e1",
  "photo-1494790108377-be9c29b29330",
  "photo-1517841905240-472988babdf9",
  "photo-1534528741775-53994a69daeb",
  "photo-1438761681033-6461ffad8d80",
  "photo-1521146764736-56c929d59c83",
  "photo-1508214751196-bcfd4ca60f91",
  "photo-1529139574466-a303027c1d8b",
  "photo-1496440737103-cd596325d314",
  "photo-1561406636-b80293969660",
  "photo-1503104834685-7205e8607eb9",
  "photo-1564415637254-92c66292cd64"
];
const NAMES = [
  ["Aaliyah Khan", "Mumbai"],
  ["Priya Sharma", "Bangalore"],
  ["Deepika Patel", "Ahmedabad"],
  ["Ananya Sen", "Kolkata"],
  ["Meera Reddy", "Hyderabad"],
  ["Neha Gupta", "Delhi"],
  ["Kavita Nair", "Kochi"],
  ["Aditi Rao", "Chennai"],
  ["Riya Kapoor", "Jaipur"],
  ["Shreya Ghoshal", "Pune"],
  ["Tanvi Shah", "Surat"],
  ["Pooja Hegde", "Lucknow"],
  ["Jyoti Singh", "Patna"],
  ["Kirti Kulhari", "Chandigarh"],
  ["Rashmi Desai", "Guwahati"],
  ["Sneha Reddy", "Bhubaneswar"]
];
const COUNTRIES = [
  "Maharashtra",
  "Karnataka",
  "Gujarat",
  "West Bengal",
  "Telangana",
  "Delhi",
  "Kerala",
  "Tamil Nadu",
  "Rajasthan",
  "Maharashtra",
  "Gujarat",
  "Uttar Pradesh",
  "Bihar",
  "Punjab",
  "Assam",
  "Odisha"
];
const CONTESTANTS = NAMES.map(([name, city], i) => ({
  id: `c-${i + 1}`,
  slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name,
  country: COUNTRIES[i],
  city,
  age: 22 + i % 9,
  height: `${170 + i % 12} cm`,
  measurements: `${88 + i % 10}-${66 + i % 8}-${94 + i % 10}`,
  status: ["Applied", "Approved", "Hold", "Casting", "Judgement", "Top16", "Top10"][i % 7],
  rank: i < 10 ? i + 1 : void 0,
  votes: Math.floor(2e4 - i * 873 + Math.random() * 1e3),
  image: U$1(FACES[i], 900, 1200),
  gallery: [0, 1, 2, 3, 4].map((k) => U$1(FACES[(i + k) % FACES.length], 1200, 1600)),
  bio: "A vision of modern femininity — sculpted by light, defined by presence. Her work moves between editorial campaigns, runway moments and intimate portraiture.",
  campaigns: ["Resort 25", "Atelier Noir", "Maison Lumière"],
  social: { instagram: `@${name.split(" ")[0].toLowerCase()}`, tiktok: `@${name.split(" ")[0].toLowerCase()}.official` }
}));
CONTESTANTS.slice(0, 10);
const BATTLES = [
  { id: "b1", round: "Round of 16 · Battle 01", a: CONTESTANTS[0], b: CONTESTANTS[1], votesA: 12400, votesB: 11820, endsAt: "02:14:33", status: "live" },
  { id: "b2", round: "Round of 16 · Battle 02", a: CONTESTANTS[2], b: CONTESTANTS[3], votesA: 9200, votesB: 14210, endsAt: "02:14:33", status: "live" },
  { id: "b3", round: "Round of 16 · Battle 03", a: CONTESTANTS[4], b: CONTESTANTS[5], votesA: 7820, votesB: 8104, endsAt: "05:00:00", status: "upcoming" },
  { id: "b4", round: "Round of 16 · Battle 04", a: CONTESTANTS[6], b: CONTESTANTS[7], votesA: 15330, votesB: 12109, endsAt: "—", status: "closed" }
];
const CAMPAIGNS = [
  { id: "k1", title: "Atelier Noir", house: "Maison Lumière", season: "Resort 25", image: U$1("photo-1469334031218-e382a71b716b", 1600, 1100), tag: "Editorial" },
  { id: "k2", title: "Études en Rose", house: "Curvy Couture", season: "Spring 25", image: U$1("photo-1483985988355-763728e1935b", 1600, 1100), tag: "Campaign" },
  { id: "k3", title: "La Femme Moderne", house: "Atelier Reine", season: "Fall 24", image: U$1("photo-1490481651871-ab68de25d43d", 1600, 1100), tag: "Runway" },
  { id: "k4", title: "Silhouettes", house: "Studio Onyx", season: "Pre-Fall 25", image: U$1("photo-1496747611176-843222e1e57c", 1600, 1100), tag: "Look Book" }
];
const PRODUCTS = [
  { id: "pr1", name: "Silk Slip — Noir", house: "Maison Lumière", price: "₹85,000", image: U$1("photo-1485518882345-15568b007407", 900, 1200), tag: "New", gender: "Women", category: "Tops" },
  { id: "pr2", name: "Cashmere Cape", house: "Atelier Reine", price: "₹1,50,000", image: U$1("photo-1496747611176-843222e1e57c", 900, 1200), gender: "Women", category: "Tops" },
  { id: "pr3", name: "Pearl Corset", house: "Studio Onyx", price: "₹1,25,000", image: U$1("photo-1539109136881-3be0616acf4b", 900, 1200), tag: "Limited", gender: "Women", category: "Tops" },
  { id: "pr4", name: "Crepe Gown", house: "Curvy Couture", price: "₹2,40,000", image: U$1("photo-1490481651871-ab68de25d43d", 900, 1200), gender: "Women", category: "Couture" },
  { id: "pr5", name: "Velvet Trench", house: "Velvet & Co.", price: "₹1,80,000", image: U$1("photo-1483985988355-763728e1935b", 900, 1200), gender: "Women", category: "Bottoms" },
  { id: "pr6", name: "Sculpted Heel", house: "Rose Éternelle", price: "₹65,000", image: U$1("photo-1469334031218-e382a71b716b", 900, 1200), gender: "Women", category: "Accessories" },
  // Men's Products
  { id: "prm1", name: "Tailored Linen Shirt", house: "Atelier Reine", price: "₹12,500", image: U$1("photo-1596755094514-f87e34085b2c", 900, 1200), tag: "Classic", gender: "Men", category: "Shirts" },
  { id: "prm2", name: "Premium Slim T-Shirt", house: "Studio Onyx", price: "₹6,800", image: U$1("photo-1521572267360-ee0c2909d518", 900, 1200), gender: "Men", category: "T-Shirts" },
  { id: "prm3", name: "Editorial Oversized Shirt", house: "Maison Lumière", price: "₹18,000", image: U$1("photo-1489987707025-afc232f7ea0f", 900, 1200), gender: "Men", category: "Shirts" },
  { id: "prm4", name: "Premium Pleated Bottoms", house: "Curvy Couture", price: "₹22,000", image: U$1("photo-1624378439575-d8705ad7ae80", 900, 1200), gender: "Men", category: "Bottoms" },
  // Women's extra items
  { id: "prw7", name: "Satin Crop Top", house: "Maison Lumière", price: "₹9,500", image: U$1("photo-1515886657613-9f3515b0c78f", 900, 1200), gender: "Women", category: "Tops" },
  { id: "prw8", name: "High-Waist Trousers", house: "Velvet & Co.", price: "₹18,500", image: U$1("photo-1594633312681-425c7b97ccd1", 900, 1200), gender: "Women", category: "Bottoms" },
  { id: "prw9", name: "Classic Cotton T-Shirt", house: "Studio Onyx", price: "₹5,200", image: U$1("photo-1554568218-0f1715e72254", 900, 1200), gender: "Women", category: "T-Shirts" }
];
const ALL_ROLES = [
  "General",
  "Contestant",
  "Photographer",
  "Admin",
  "Applications",
  "Ratings",
  "Casting Call",
  "Judgements"
];
const FIRST = ["Anaïs", "Sofia", "Amara", "Yuna", "Camila", "Zara", "Isabela", "Naomi", "Aaliyah", "Lucia", "Mei", "Olivia", "Inés", "Chiamaka", "Lara", "Valentina", "Élise", "Kenji", "Adaeze", "Marco", "Léa", "Hiro", "Ada", "Carlos", "Sara"];
const LAST = ["Laurent", "Marchetti", "Okafor", "Park", "Reyes", "Hadid", "Costa", "Bergström", "Khan", "Romano", "Tanaka", "Bennett", "Vidal", "Eze", "Petrov", "Cruz", "Moreau", "Watanabe", "Nwosu", "Bellucci", "Dubois", "Nakamura", "Eze", "Mendes", "Cohen"];
const PLATFORM_COUNTRIES = ["Maharashtra", "Karnataka", "Gujarat", "West Bengal", "Telangana", "Delhi", "Kerala", "Tamil Nadu", "Rajasthan", "Maharashtra", "Gujarat", "Uttar Pradesh", "Bihar", "Punjab", "Assam", "Odisha", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Maharashtra"];
const PLATFORM_USERS = FIRST.map((fn, i) => {
  const ln = LAST[i];
  const isContestant = i < 16;
  const roles = ["General"];
  if (isContestant) roles.push("Contestant");
  if (i === 16 || i === 17 || i === 18 || i === 19) roles.push("Photographer");
  if (i === 20) roles.push("Admin");
  if (i === 21) roles.push("Applications", "Ratings");
  if (i === 22) roles.push("Casting Call", "Judgements");
  const year = 1995 + i % 12;
  return {
    id: `USR-${String(1e3 + i)}`,
    firstName: fn,
    lastName: ln,
    gender: "Female",
    dob: `${year}-${String(i % 9 + 1).padStart(2, "0")}-${String(10 + i % 18).padStart(2, "0")}`,
    age: 2026 - year,
    country: PLATFORM_COUNTRIES[i] ?? "Global",
    email: `${fn.toLowerCase().replace(/[^a-z]/g, "")}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@reevibes.com`,
    phone: `+${30 + i % 60} ${100 + i} ${1e3 + i * 7}`,
    avatar: U$1(FACES[i % FACES.length], 200, 200),
    registeredAt: `2025-${String(i % 12 + 1).padStart(2, "0")}-${String(i % 27 + 1).padStart(2, "0")}`,
    roles,
    status: i % 11 === 0 ? "Invited" : i % 17 === 0 ? "Suspended" : "Active"
  };
});
const CONTESTANT_APPLICATIONS = PLATFORM_USERS.filter((u) => u.roles.includes("Contestant")).map((u, i) => {
  const c = CONTESTANTS[i];
  return {
    userId: u.id,
    contestantId: `MC-2026-${String(100 + i).padStart(3, "0")}`,
    contestYear: 2026,
    contestCountry: u.country,
    fullName: `${u.firstName} ${u.lastName}`,
    country: u.country,
    email: u.email,
    phone: u.phone,
    dob: u.dob,
    age: u.age,
    height: `${170 + i % 12} cm`,
    weight: `${58 + i % 14} kg`,
    bust: `${88 + i % 10} cm`,
    waist: `${66 + i % 8} cm`,
    hips: `${94 + i % 10} cm`,
    eyeColour: ["Brown", "Hazel", "Green", "Blue", "Amber"][i % 5],
    hairColour: ["Black", "Brunette", "Auburn", "Blonde", "Chestnut"][i % 5],
    shoeSize: `EU ${37 + i % 6}`,
    biography: c?.bio ?? "A vision of modern femininity, defined by presence and grace.",
    education: ["BA Fashion — Central Saint Martins", "MA Communications — Sciences Po", "BFA Performing Arts — NYU", "Business Admin — Bocconi"][i % 4],
    profession: ["Model & Creative", "Architect", "Brand Consultant", "Editor", "Performer", "Curator"][i % 6],
    social: { instagram: `@${u.firstName.toLowerCase()}.official`, tiktok: `@${u.firstName.toLowerCase()}` },
    agency: ["IMG Models", "Elite Paris", "Next Milan", "The Society", "Independent"][i % 5],
    photos: {
      portrait: c?.image ?? U$1(FACES[i % FACES.length], 900, 1200),
      fullBody: U$1(FACES[(i + 1) % FACES.length], 900, 1400),
      sideProfile: U$1(FACES[(i + 2) % FACES.length], 900, 1200),
      candid: U$1(FACES[(i + 3) % FACES.length], 900, 1200),
      additional: [U$1(FACES[(i + 4) % FACES.length], 900, 1200), U$1(FACES[(i + 5) % FACES.length], 900, 1200)]
    },
    videos: { intro: "", additional: [] },
    numPhotos: 6,
    numVideos: 2,
    applicationDate: `2026-${String(i % 9 + 1).padStart(2, "0")}-${String(10 + i % 18).padStart(2, "0")}`,
    currentStage: ["Applied", "Approved", "Casting", "Judgement", "Top16", "Top10"][i % 6],
    status: ["Pending", "Approved", "Hold", "Approved"][i % 4]
  };
});
const ABUSE_REPORTS = [
  { id: "r1", target: "Sofia Marchetti", reason: "Image not original", reporter: "@user.4421", severity: "Medium", status: "Reviewing" },
  { id: "r2", target: "Aaliyah Khan", reason: "Harassment in comments", reporter: "@user.0991", severity: "High", status: "Open" },
  { id: "r3", target: "Lucia Romano", reason: "Spam voting suspected", reporter: "system", severity: "Low", status: "Open" },
  { id: "r4", target: "Olivia Bennett", reason: "Misleading bio", reporter: "@user.7720", severity: "Low", status: "Resolved" }
];
const STATS = {
  totalVotes: 1248302,
  activeContestants: 128,
  liveViewers: 14820,
  revenue: "$284,120"
};
const U = (id, w = 1200, h = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
[
  { id: "lw1", year: 2025, country: "France", name: "Élodie Marchand", portrait: CONTESTANTS[3].image, quote: "ReeVibes gave me a sentence in fashion history." },
  { id: "lw2", year: 2024, country: "Brazil", name: "Mariana Lopes", portrait: CONTESTANTS[6].image, quote: "Curves became my signature, not my struggle." },
  { id: "lw3", year: 2023, country: "Nigeria", name: "Chiamaka Eze", portrait: CONTESTANTS[13].image, quote: "I walked in a contestant, I left a maison." },
  { id: "lw4", year: 2022, country: "India", name: "Aaliyah Khan", portrait: CONTESTANTS[8].image, quote: "The runway finally fit me — not the other way around." },
  { id: "lw5", year: 2021, country: "Japan", name: "Mei Tanaka", portrait: CONTESTANTS[10].image, quote: "A new vocabulary of beauty was written here." }
];
[
  { id: "br1", name: "Maison Lumière", tagline: "Atelier of light", mark: "M·L", cover: PRODUCTS[0].image },
  { id: "br2", name: "Atelier Reine", tagline: "Sculpted couture", mark: "A·R", cover: PRODUCTS[3].image },
  { id: "br3", name: "Studio Onyx", tagline: "Black silhouettes", mark: "ONYX", cover: PRODUCTS[2].image },
  { id: "br4", name: "Curvy Couture", tagline: "Drape & devotion", mark: "C·C", cover: PRODUCTS[1].image },
  { id: "br5", name: "Rose Éternelle", tagline: "Heels & adornment", mark: "RE", cover: PRODUCTS[5].image },
  { id: "br6", name: "Velvet & Co.", tagline: "After-dark wardrobe", mark: "V&Co", cover: PRODUCTS[4].image }
];
const SEED_COMMENTS = [
  { id: "cm1", user: "@vogue.elena", avatar: U("photo-1494790108377-be9c29b29330", 100, 100), time: "2h", text: "She owns this frame. Pure editorial.", likes: 42 },
  { id: "cm2", user: "@anaste.kim", avatar: U("photo-1517841905240-472988babdf9", 100, 100), time: "5h", text: "Best look of the season so far.", likes: 28 },
  { id: "cm3", user: "@studio.onyx", avatar: U("photo-1561406636-b80293969660", 100, 100), time: "1d", text: "The silhouette is poetry. Bravo, maison.", likes: 87 }
];
({
  // contestant slug -> product ids
  default: [PRODUCTS[0].id, PRODUCTS[2].id, PRODUCTS[5].id]
});
const NOTIFICATIONS_SEED = [
  { id: "n1", icon: "approved", title: "Application Approved", body: "You're moving forward to Casting Week.", time: "2h ago", unread: true },
  { id: "n2", icon: "casting", title: "Casting Invitation", body: "Paris atelier — 18 March, 10:00 CET.", time: "1d ago", unread: true },
  { id: "n3", icon: "live", title: "You're up next", body: "Round of 16 · Battle 02 starts in 1h.", time: "1d ago", unread: false },
  { id: "n4", icon: "judgement", title: "Judgement update", body: "Jury scoring is now complete for Week 3.", time: "3d ago", unread: false }
];
const rawUrl = "https://api.reevibes.com";
const BACKEND_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
const KEY = "reevibes:portal:v3";
const DEFAULT_CONTESTS = [
  { id: "ct-mh-26", country: "Maharashtra", year: 2026, stage: "Application", published: true },
  { id: "ct-ka-26", country: "Karnataka", year: 2026, stage: "Application", published: true },
  { id: "ct-dl-26", country: "Delhi", year: 2026, stage: "Casting", published: true },
  { id: "ct-tn-26", country: "Tamil Nadu", year: 2026, stage: "Application", published: true },
  { id: "ct-ts-26", country: "Telangana", year: 2026, stage: "Judgement", published: false }
];
const DEFAULT_REVIEWS = {
  "pr1": [
    { id: "rev1", userName: "Aditi Rao", rating: 5, comment: "Absolutely stunning dress! Fits perfectly and the silk material feels incredibly premium.", date: "2026-06-14", status: "Approved" },
    { id: "rev2", userName: "Priya Sharma", rating: 4, comment: "Beautiful design, though it was slightly loose around the waist. High quality styling.", date: "2026-06-12", status: "Approved" }
  ],
  "pr2": [
    { id: "rev3", userName: "Deepika Patel", rating: 5, comment: "Warm, luxurious, and elegant. Exceeded all my expectations.", date: "2026-06-15", status: "Approved" }
  ]
};
const DEFAULT_BUCKETS = [
  { id: "bkt1", name: "Summer Essentials", productIds: ["pr1", "pr3"], starProductId: "pr1" },
  { id: "bkt2", name: "Luxury Black Curation", productIds: ["pr2", "pr5"], starProductId: "pr2" }
];
const DEFAULT_VENDORS = [
  { id: "blankapparel", companyName: "Blank Apparel India", contactPerson: "Prakash Kumar", email: "wholesale@blankapparel.in", phone: "+91 9999911111", products: [], revenue: 0 }
];
const DEFAULT_WALLETS = {
  "USR-1000": 25e3,
  "usr-1000": 25e3
};
const DEFAULT_HOMEPAGE_LAYOUT = {
  sectionOrder: [
    "announcement",
    "navigation",
    "hero",
    "categories",
    "flashSale",
    "trending",
    "newArrivals",
    "campaign",
    "collections",
    "liveFeed",
    "bestSellers",
    "limitedStock",
    "influencerPicks",
    "reviews",
    "lookbook",
    "recentlyViewed",
    "recommended",
    "brandStory",
    "newsletter",
    "footer"
  ],
  announcement: {
    enabled: true,
    text: "Summer Sale Live — Flat 20% Off on First Order",
    linkUrl: "/categories",
    backgroundColor: "#7c2d12",
    countdownActive: true,
    countdownEndsAt: "2026-07-31T23:59:59"
  },
  navigation: {
    enabled: true,
    itemsOrder: ["Logo", "Men", "Women", "New Arrivals", "Trending", "Collections", "Search", "Wishlist", "Account", "Cart"],
    visibleItems: ["Logo", "Men", "Women", "New Arrivals", "Trending", "Collections", "Search", "Wishlist", "Account", "Cart"]
  },
  hero: {
    enabled: true,
    banners: [
      {
        id: "h1",
        type: "Image Banner",
        title: "Luxury Redefined",
        subtitle: "Season 03 Collection Out Now",
        buttonText: "Explore Collection",
        redirectUrl: "/categories",
        desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
        mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
        videoUrl: "",
        scheduleStart: "",
        scheduleEnd: ""
      },
      {
        id: "h2",
        type: "Image Banner",
        title: "The Art of Elegance",
        subtitle: "Premium Fabrics & Silhouettes",
        buttonText: "Discover Premium",
        redirectUrl: "/categories",
        desktopImage: "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=1200&h=600&q=80",
        mobileImage: "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=600&h=800&q=80",
        videoUrl: "",
        scheduleStart: "",
        scheduleEnd: ""
      }
    ]
  },
  categories: {
    enabled: true,
    items: [
      { id: "cat1", name: "Women", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&h=500&q=80", redirectUrl: "/categories", sortOrder: 1 },
      { id: "cat2", name: "Men", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&h=500&q=80", redirectUrl: "/categories", sortOrder: 2 },
      { id: "cat3", name: "New Arrivals", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&h=500&q=80", redirectUrl: "/categories", sortOrder: 3 },
      { id: "cat4", name: "Trending", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&h=500&q=80", redirectUrl: "/categories", sortOrder: 4 }
    ]
  },
  flashSale: {
    enabled: true,
    startDate: "2026-06-01T00:00:00",
    endDate: "2026-06-30T23:59:59",
    discount: 15,
    products: ["pr1", "prm2"]
  },
  trending: {
    enabled: true,
    autoMode: true,
    manualProducts: ["pr1", "pr2", "pr3"]
  },
  newArrival: {
    enabled: true,
    productCount: 3,
    layoutStyle: "grid"
  },
  campaign: {
    enabled: true,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&h=600&q=80",
    heading: "Summer Essentials 2026",
    ctaText: "Shop the Campaign",
    redirectUrl: "/categories"
  },
  collections: {
    enabled: true,
    collectionId: "Premium Collection",
    coverImage: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&h=650&q=80"
  },
  liveFeed: {
    enabled: true,
    mode: "demo"
  },
  bestSellers: {
    enabled: true,
    autoMode: true,
    manualProducts: ["pr3", "pr4", "pr5"]
  },
  limitedStock: {
    enabled: true,
    threshold: 5
  },
  influencerPicks: {
    enabled: true,
    products: ["pr1", "pr3", "prm1"]
  },
  reviews: {
    enabled: true,
    featuredReviewIds: ["rev1", "rev3"]
  },
  lookbook: {
    enabled: true,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&h=1200&q=80",
    taggedProducts: [
      { productId: "pr1", x: 30, y: 40 },
      { productId: "pr2", x: 70, y: 50 }
    ]
  },
  recentlyViewed: {
    enabled: true
  },
  recommended: {
    enabled: true,
    algorithm: "category"
  },
  brandStory: {
    enabled: true,
    text: "Founded in 2024, ReeVibes represents the intersection of digital pageantry and premium avant-garde apparel. Every piece is curated to tell a story of visual elegance and structural perfection.",
    image1: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&h=600&q=80",
    image2: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=500&h=600&q=80",
    videoUrl: ""
  },
  newsletter: {
    enabled: true,
    rewardAmount: 200
  },
  footer: {
    enabled: true,
    aboutText: "ReeVibes is a high-fidelity luxury e-commerce experience designed for global styling curators.",
    phone: "+91 98765 43210",
    email: "concierge@reevibes.com",
    address: "UB City, Level 14, Bangalore, Karnataka - 560001",
    socialFacebook: "https://facebook.com/reevibes",
    socialInstagram: "https://instagram.com/reevibes",
    socialPinterest: "https://pinterest.com/reevibes"
  },
  assistant: {
    enabled: true
  },
  chatbot: {
    enabled: true
  },
  // Backward compatibility keys
  heroBanners: [
    { id: "h1", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80", title: "Luxury Redefined", subtitle: "Season 03 Collection Out Now", link: "/" },
    { id: "h2", image: "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=1200&h=600&q=80", title: "The Art of Elegance", subtitle: "Premium Fabrics & Silhouettes", link: "/" }
  ],
  promoBanners: [
    { id: "p1", image: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=600&h=400&q=80", title: "Festive Season Specials", subtitle: "Save on curation", discount: "20% OFF" }
  ],
  trendingProducts: ["pr1", "pr2", "pr3"],
  featuredProducts: ["pr4", "pr5", "pr6"]
};
const DEFAULT = {
  buckets: DEFAULT_BUCKETS,
  user: null,
  votesByDay: {},
  ratings: {},
  favorites: [],
  comments: {},
  cart: [],
  shopCart: [],
  notifications: NOTIFICATIONS_SEED.map((n) => {
    let offset = 0;
    if (n.time.includes("2h")) offset = 2 * 3600 * 1e3;
    else if (n.time.includes("1d")) offset = 24 * 3600 * 1e3;
    else if (n.time.includes("3d")) offset = 3 * 24 * 3600 * 1e3;
    return { ...n, createdAt: Date.now() - offset };
  }),
  drafts: [],
  submitted: [],
  users: PLATFORM_USERS,
  applications: CONTESTANT_APPLICATIONS,
  reports: ABUSE_REPORTS,
  contests: DEFAULT_CONTESTS,
  positions: {},
  bestPhotos: [],
  voting: { open: true, rating: true },
  sponsorAssignments: {},
  applicationsWorkflow: {},
  castingWorkflow: {},
  judgeRatings: {},
  rateScores: {},
  addresses: {
    "USR-1000": ["123, Luxury Lane, Indiranagar, Bangalore - 560038", "Flat 402, Royal Residency, Juhu, Mumbai - 400049"]
  },
  majorAddresses: {
    "USR-1000": "123, Luxury Lane, Indiranagar, Bangalore - 560038"
  },
  wishlist: {
    "USR-1000": ["pr1", "pr3"]
  },
  shopWishlist: {
    "USR-1000": ["pr1", "pr2"]
  },
  orders: {
    "USR-1000": [
      {
        id: "ORD-9481",
        date: "2026-06-15T14:30:00Z",
        items: [{ productId: "pr2", name: "Cashmere Cape", house: "Atelier Reine", price: "₹1,50,000", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&h=1600&q=80", qty: 1, selectedSize: "M" }],
        total: 15e4,
        status: "Shipped",
        address: "123, Luxury Lane, Indiranagar, Bangalore - 560038",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-9500",
        date: "2026-07-09T18:45:00Z",
        items: [{ productId: "pr1", name: "Silk Slip — Noir", house: "Maison Lumière", price: "₹85,000", image: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1200&h=1600&q=80", qty: 1, selectedSize: "S" }],
        total: 85e3,
        status: "Processing",
        address: "123, Luxury Lane, Indiranagar, Bangalore - 560038",
        paymentStatus: "Paid"
      }
    ]
  },
  coupons: [
    { code: "FESTIVE20", discount: 20, type: "percentage", expiryDate: "2026-12-31", usageLimit: 100, userEligibility: "All", active: true },
    { code: "REEVIBES10", discount: 10, type: "percentage", expiryDate: "2026-12-31", usageLimit: 200, userEligibility: "All", active: true }
  ],
  products: PRODUCTS,
  returns: [
    {
      id: "RET-101",
      orderId: "ORD-9481",
      productId: "pr2",
      productName: "Cashmere Cape",
      customerId: "USR-1000",
      customerName: "Léa Dubois",
      reason: "Size Issue",
      comment: "The cape size is too large around the shoulders.",
      images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&h=300&q=80"],
      videos: [],
      status: "Pending",
      refundAmount: 15e4
    }
  ],
  wallets: DEFAULT_WALLETS,
  vendors: DEFAULT_VENDORS,
  productReviews: DEFAULT_REVIEWS,
  adminMode: "Contest",
  productViews: {},
  productCartAdditions: {},
  productPurchases: {},
  homepageLayout: DEFAULT_HOMEPAGE_LAYOUT,
  homepageLayoutDraft: DEFAULT_HOMEPAGE_LAYOUT
};
function load() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed };
  } catch {
    return DEFAULT;
  }
}
function save(s) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(s);
    if (window.localStorage.getItem(KEY) !== serialized) {
      window.localStorage.setItem(KEY, serialized);
    }
  } catch {
  }
}
const PortalContext = reactExports.createContext(null);
function PortalProvider({ children }) {
  const [state, setState] = reactExports.useState(DEFAULT);
  const [hydrated, setHydrated] = reactExports.useState(false);
  const fetchBackendVendorsAndProducts = reactExports.useCallback(async () => {
    try {
      const vendorsRes = await fetch(`${BACKEND_URL}/api/vendors`);
      let mappedVendors = DEFAULT_VENDORS;
      if (vendorsRes.ok) {
        const dbVendors = await vendorsRes.json();
        if (dbVendors && dbVendors.length > 0) {
          mappedVendors = dbVendors.map((v) => ({
            id: v.id,
            companyName: v.companyName || v.id,
            contactPerson: v.contactPerson || "",
            email: v.email || "",
            phone: v.phone || "",
            products: [],
            revenue: v.revenue || 0
          }));
        }
      }
      const res = await fetch(`${BACKEND_URL}/api/vendors/products`);
      if (res.ok) {
        const dbProducts = await res.json();
        const mapped = dbProducts.map((p) => ({
          ...p,
          id: String(p.id),
          house: p.house || p.brand || "Maison Curation",
          price: typeof p.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : p.price?.toString().startsWith("₹") ? p.price : `₹${p.price}`
        }));
        setState((s) => {
          const existingIds = new Set(mapped.map((p) => p.id));
          const currentProductIds = new Set(s.products.map((p) => p.id));
          const filteredDefault = PRODUCTS.filter((p) => !existingIds.has(String(p.id)) && currentProductIds.has(p.id));
          return {
            ...s,
            vendors: mappedVendors,
            products: [...filteredDefault, ...mapped]
          };
        });
      } else {
        setState((s) => ({ ...s, vendors: mappedVendors }));
      }
    } catch (err) {
      console.warn("Backend offline. Fallback to offline store data.", err);
    }
  }, []);
  reactExports.useEffect(() => {
    const loadedState = load();
    const checkedProducts = (loadedState.products || []).map((p) => {
      if (p.images && p.images.length > 0) {
        const first = p.images[0];
        if (first.startsWith(BACKEND_URL) || first.startsWith("http://localhost:8081")) {
          p.img = first;
        }
      }
      return p;
    });
    loadedState.products = checkedProducts;
    setState(loadedState);
    setHydrated(true);
    fetchBackendVendorsAndProducts();
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith("reevibes:")) {
        setState(load());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchBackendVendorsAndProducts]);
  reactExports.useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);
  const api = reactExports.useMemo(() => ({
    state,
    reloadProducts: fetchBackendVendorsAndProducts,
    signIn: (email, name) => {
      const match = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setState((s) => {
          const next = {
            ...s,
            user: {
              id: match.id,
              firstName: match.firstName,
              lastName: match.lastName,
              email: match.email,
              phone: match.phone,
              country: match.country,
              dob: match.dob,
              roles: match.roles
            }
          };
          save(next);
          return next;
        });
        return true;
      }
      return false;
    },
    signUp: (u) => setState((s) => {
      const next = { ...s, user: { id: `usr-${Date.now()}`, roles: ["General"], ...u } };
      save(next);
      return next;
    }),
    signOut: () => setState((s) => {
      const next = { ...s, user: null };
      save(next);
      return next;
    }),
    /* ───── engagement ───── */
    voteFor: (contestantId) => {
      if (!state.voting.open) return { ok: false, reason: "Voting closed by editor" };
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const last = state.votesByDay[contestantId];
      if (last === today) return { ok: false, reason: "Already voted today" };
      setState((s) => ({ ...s, votesByDay: { ...s.votesByDay, [contestantId]: today } }));
      return { ok: true };
    },
    rate: (contestantId, stars) => {
      if (!state.voting.rating) return;
      setState((s) => ({ ...s, ratings: { ...s.ratings, [contestantId]: stars } }));
    },
    toggleFavorite: (id) => setState((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
    comment: (contestantId, text) => setState((s) => {
      const list = s.comments[contestantId] ?? SEED_COMMENTS;
      const next = { id: `cm-${Date.now()}`, user: s.user ? `@${s.user.firstName.toLowerCase()}` : "@guest", avatar: s.user?.avatar ?? "", time: "now", text, likes: 0 };
      return { ...s, comments: { ...s.comments, [contestantId]: [next, ...list] } };
    }),
    likeComment: (contestantId, commentId) => setState((s) => {
      const list = (s.comments[contestantId] ?? SEED_COMMENTS).map((c) => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
      return { ...s, comments: { ...s.comments, [contestantId]: list } };
    }),
    addToCart: (item) => setState((s) => {
      const existing = s.cart.find((c) => c.productId === item.productId);
      const qty = item.qty ?? 1;
      const cart = existing ? s.cart.map((c) => c.productId === item.productId ? { ...c, qty: c.qty + qty } : c) : [...s.cart, { ...item, qty }];
      return { ...s, cart };
    }),
    removeFromCart: (id) => setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== id) })),
    clearCart: () => setState((s) => ({ ...s, cart: [] })),
    saveDraft: (d) => setState((s) => {
      const exists = s.drafts.some((x) => x.id === d.id);
      return { ...s, drafts: exists ? s.drafts.map((x) => x.id === d.id ? d : x) : [...s.drafts, d] };
    }),
    submitDraft: (d) => setState((s) => {
      const userId = s.user?.id;
      const nextUsers = userId ? s.users.map((u) => u.id === userId ? { ...u, roles: Array.from(/* @__PURE__ */ new Set([...u.roles, "Contestant"])) } : u) : s.users;
      return {
        ...s,
        drafts: s.drafts.filter((x) => x.id !== d.id),
        submitted: [...s.submitted, d],
        users: nextUsers,
        user: s.user ? { ...s.user, roles: Array.from(/* @__PURE__ */ new Set([...s.user.roles, "Contestant"])) } : s.user,
        notifications: [{ id: `n-${Date.now()}`, icon: "approved", title: "Application Submitted", body: "Our casting team will be in touch within 14 days.", time: "now", unread: true }, ...s.notifications]
      };
    }),
    markNotificationsRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, unread: false })) })),
    dismissNotification: (id) => setState((s) => ({ ...s, notifications: s.notifications.filter((n) => n.id !== id) })),
    /* ───── public → admin sync ───── */
    registerUser: (u) => {
      const id = `USR-${String(2e3 + Date.now()).slice(-6)}`;
      const year = u.dob ? Number(u.dob.slice(0, 4)) : 1998;
      const newUser = {
        id,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: u.gender ?? "",
        dob: u.dob ?? "",
        age: 2026 - year,
        country: u.country ?? "—",
        email: u.email,
        phone: u.phone ?? "",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.firstName + u.lastName)}`,
        registeredAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        roles: ["General"],
        status: "Active"
      };
      setState((s) => {
        const isAdmin = s.user?.roles?.includes("Admin");
        const next = {
          ...s,
          users: [newUser, ...s.users],
          user: isAdmin ? s.user : {
            id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone,
            country: u.country,
            dob: u.dob,
            gender: u.gender,
            roles: ["General"]
          }
        };
        save(next);
        return next;
      });
      return newUser;
    },
    submitApplication: (a) => setState((s) => {
      const userId = s.user?.id ?? `usr-${Date.now()}`;
      const cid = `MC-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(s.applications.length + 100).padStart(3, "0")}`;
      const full = {
        userId,
        contestantId: cid,
        contestYear: (/* @__PURE__ */ new Date()).getFullYear(),
        contestCountry: a.country,
        fullName: a.fullName,
        country: a.country,
        email: a.email,
        phone: a.phone ?? "",
        dob: a.dob ?? "",
        age: a.age ?? 25,
        height: a.height ?? "",
        weight: a.weight ?? "",
        bust: a.bust ?? "",
        waist: a.waist ?? "",
        hips: a.hips ?? "",
        eyeColour: a.eyeColour ?? "",
        hairColour: a.hairColour ?? "",
        shoeSize: a.shoeSize ?? "",
        biography: a.biography ?? "",
        education: a.education ?? "",
        profession: a.profession ?? "",
        social: a.social ?? {},
        socialLinks: a.socialLinks ?? [],
        streetAddress: a.streetAddress ?? "",
        city: a.city ?? "",
        stateProvince: a.stateProvince ?? "",
        zipCode: a.zipCode ?? "",
        experience: a.experience ?? "",
        photos: a.photos ?? { portrait: "", fullBody: "", sideProfile: "", candid: "", additional: [] },
        videos: a.videos ?? { intro: "", additional: [] },
        numPhotos: a.numPhotos ?? 0,
        numVideos: a.numVideos ?? 0,
        applicationDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        currentStage: "Applied",
        status: "Pending"
      };
      const nextUsers = s.users.map((u) => u.id === userId ? { ...u, roles: Array.from(/* @__PURE__ */ new Set([...u.roles, "Contestant"])) } : u);
      const nextUser = s.user ? { ...s.user, roles: Array.from(/* @__PURE__ */ new Set([...s.user.roles, "Contestant"])) } : null;
      const next = {
        ...s,
        applications: [full, ...s.applications],
        users: nextUsers,
        user: nextUser,
        notifications: [{ id: `n-${Date.now()}`, icon: "approved", title: "Application Received", body: `Your ${a.country} application is now in review.`, time: "now", unread: true }, ...s.notifications]
      };
      save(next);
      return next;
    }),
    reportAbuse: (r) => setState((s) => ({
      ...s,
      reports: [{
        id: `r-${Date.now()}`,
        target: r.target,
        reason: r.reason,
        reporter: r.reporter ?? (s.user ? `@${s.user.firstName.toLowerCase()}` : "@guest"),
        severity: r.severity ?? "Medium",
        status: "Open"
      }, ...s.reports]
    })),
    /* ───── admin actions ───── */
    updateUser: (id, patch) => setState((s) => {
      const nextUsers = s.users.map((u) => u.id === id ? { ...u, ...patch } : u);
      const isSelf = s.user?.id === id;
      const updatedMatch = nextUsers.find((u) => u.id === id);
      return {
        ...s,
        users: nextUsers,
        user: isSelf && updatedMatch ? {
          id: updatedMatch.id,
          firstName: updatedMatch.firstName,
          lastName: updatedMatch.lastName,
          email: updatedMatch.email,
          phone: updatedMatch.phone,
          country: updatedMatch.country,
          dob: updatedMatch.dob,
          avatar: updatedMatch.avatar,
          roles: updatedMatch.roles
        } : s.user
      };
    }),
    deleteUser: (id) => setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) })),
    setUserRoles: (id, roles) => setState((s) => {
      const nextUsers = s.users.map((u) => u.id === id ? { ...u, roles } : u);
      const isSelf = s.user?.id === id;
      return {
        ...s,
        users: nextUsers,
        user: isSelf && s.user ? { ...s.user, roles } : s.user
      };
    }),
    publishContest: (id, published) => setState((s) => ({ ...s, contests: s.contests.map((c) => c.id === id ? { ...c, published } : c) })),
    upsertContest: (c) => setState((s) => {
      const exists = s.contests.some((x) => x.id === c.id);
      return { ...s, contests: exists ? s.contests.map((x) => x.id === c.id ? c : x) : [c, ...s.contests] };
    }),
    removeContest: (id) => setState((s) => ({ ...s, contests: s.contests.filter((c) => c.id !== id) })),
    replaceContests: (list) => setState((s) => ({ ...s, contests: list })),
    setPosition: (contestantId, position) => setState((s) => {
      const next = { ...s.positions };
      if (position) next[contestantId] = position;
      else delete next[contestantId];
      return { ...s, positions: next };
    }),
    setMultiplePositions: (contestantIds, position) => setState((s) => {
      const next = { ...s.positions };
      contestantIds.forEach((id) => {
        if (position) next[id] = position;
        else delete next[id];
      });
      return { ...s, positions: next };
    }),
    updateApplication: (contestantId, patch) => setState((s) => ({
      ...s,
      applications: s.applications.map((a) => a.contestantId === contestantId ? { ...a, ...patch } : a)
    })),
    tagBestPhoto: (photoId, on) => setState((s) => ({
      ...s,
      bestPhotos: on ? Array.from(/* @__PURE__ */ new Set([...s.bestPhotos, photoId])) : s.bestPhotos.filter((p) => p !== photoId)
    })),
    assignSponsor: (contestantId, sponsorId) => setState((s) => {
      const next = { ...s.sponsorAssignments };
      if (sponsorId) next[contestantId] = sponsorId;
      else delete next[contestantId];
      return { ...s, sponsorAssignments: next };
    }),
    toggleVoting: (open) => setState((s) => ({ ...s, voting: { ...s.voting, open } })),
    toggleRating: (open) => setState((s) => ({ ...s, voting: { ...s.voting, rating: open } })),
    resolveReport: (id, status) => setState((s) => ({ ...s, reports: s.reports.map((r) => r.id === id ? { ...r, status } : r) })),
    setApplicationStatus: (contestantId, status) => setState((s) => ({ ...s, applicationsWorkflow: { ...s.applicationsWorkflow, [contestantId]: status } })),
    setCastingStatus: (contestantId, status) => setState((s) => ({ ...s, castingWorkflow: { ...s.castingWorkflow, [contestantId]: status } })),
    setJudgeRating: (userId, contestantId, criteria, score) => setState((s) => {
      const userMap = s.judgeRatings[userId] ?? {};
      const cMap = userMap[contestantId] ?? {};
      return { ...s, judgeRatings: { ...s.judgeRatings, [userId]: { ...userMap, [contestantId]: { ...cMap, [criteria]: score } } } };
    }),
    setRateScore: (userId, contestantId, score) => setState((s) => {
      const userMap = s.rateScores[userId] ?? {};
      return { ...s, rateScores: { ...s.rateScores, [userId]: { ...userMap, [contestantId]: score } } };
    }),
    addAddress: (userId, address) => setState((s) => {
      const list = s.addresses[userId] ?? [];
      const nextMajorAddresses = { ...s.majorAddresses };
      if (list.length === 0) {
        nextMajorAddresses[userId] = address;
      }
      return {
        ...s,
        addresses: { ...s.addresses, [userId]: [...list, address] },
        majorAddresses: nextMajorAddresses
      };
    }),
    removeAddress: (userId, index) => setState((s) => {
      const list = s.addresses[userId] ?? [];
      const addrToRemove = list[index];
      const nextList = list.filter((_, i) => i !== index);
      const major = s.majorAddresses?.[userId];
      const nextMajorAddresses = { ...s.majorAddresses };
      if (major === addrToRemove) {
        if (nextList.length > 0) {
          nextMajorAddresses[userId] = nextList[0];
        } else {
          delete nextMajorAddresses[userId];
        }
      }
      return {
        ...s,
        addresses: { ...s.addresses, [userId]: nextList },
        majorAddresses: nextMajorAddresses
      };
    }),
    updateAddress: (userId, index, address) => setState((s) => {
      const list = s.addresses[userId] ?? [];
      const oldAddr = list[index];
      const nextList = list.map((a, i) => i === index ? address : a);
      const major = s.majorAddresses?.[userId];
      const nextMajorAddresses = { ...s.majorAddresses };
      if (major === oldAddr) {
        nextMajorAddresses[userId] = address;
      }
      return {
        ...s,
        addresses: { ...s.addresses, [userId]: nextList },
        majorAddresses: nextMajorAddresses
      };
    }),
    setMajorAddress: (userId, address) => setState((s) => {
      const next = { ...s.majorAddresses, [userId]: address };
      return { ...s, majorAddresses: next };
    }),
    toggleWishlist: (userId, productId) => setState((s) => {
      const list = s.wishlist[userId] ?? [];
      const next = list.includes(productId) ? list.filter((id) => id !== productId) : [...list, productId];
      return { ...s, wishlist: { ...s.wishlist, [userId]: next } };
    }),
    createOrder: (userId, order) => setState((s) => {
      const list = s.orders[userId] ?? [];
      const orderId = `ORD-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newOrder = {
        id: orderId,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        items: order.items,
        total: order.total,
        status: "Processing",
        address: order.address,
        paymentStatus: "Paid"
      };
      const nextCoupons = order.appliedCoupon ? (s.coupons || []).map(
        (c) => c.code === order.appliedCoupon?.toUpperCase() ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c
      ) : s.coupons;
      const orderItemKeys = new Set((order.items || []).map((item) => `${item.productId}-${item.selectedSize || "M"}`));
      const nextShopCart = (s.shopCart || []).filter((item) => !orderItemKeys.has(`${item.productId}-${item.selectedSize || "M"}`));
      const nextProducts = (s.products || []).map((p) => {
        const orderItem = order.items.find((item) => String(item.productId) === String(p.id));
        if (orderItem) {
          const size = orderItem.selectedSize || "M";
          const updatedStock = { ...p.stockPerSize || {} };
          if (updatedStock[size] !== void 0) {
            updatedStock[size] = Math.max(0, updatedStock[size] - orderItem.qty);
          }
          let updatedPrice = p.price;
          let updatedDiscount = p.discount;
          let updatedLimit = p.discountLimitBuyers;
          let updatedExpiry = p.discountExpiryDate;
          const currentCount = p.discountBuyersCount || 0;
          const nextCount = currentCount + orderItem.qty;
          if (p.discountLimitBuyers && nextCount >= p.discountLimitBuyers) {
            updatedPrice = p.originalPrice || p.price;
            updatedDiscount = 0;
            updatedLimit = void 0;
            updatedExpiry = void 0;
          }
          return {
            ...p,
            stockPerSize: updatedStock,
            discountBuyersCount: p.discountLimitBuyers ? nextCount : currentCount,
            price: updatedPrice,
            discount: updatedDiscount,
            discountLimitBuyers: updatedLimit,
            discountExpiryDate: updatedExpiry
          };
        }
        return p;
      });
      return {
        ...s,
        orders: { ...s.orders, [userId]: [newOrder, ...list] },
        products: nextProducts,
        coupons: nextCoupons,
        cart: [],
        // clear cart on successful order
        shopCart: nextShopCart,
        notifications: [
          { id: `n-${Date.now()}`, icon: "order", title: "Order Placed Successfully", body: `Your order ${orderId} for ₹${order.total.toLocaleString()} has been placed.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    updateOrderStatus: (userId, orderId, status) => setState((s) => {
      const list = s.orders[userId] ?? [];
      const next = list.map((o) => o.id === orderId ? { ...o, status } : o);
      return {
        ...s,
        orders: { ...s.orders, [userId]: next },
        notifications: [
          { id: `n-${Date.now()}`, icon: "order", title: "Order Status Updated", body: `Order ${orderId} status changed to ${status}.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    addCoupon: (coupon) => setState((s) => {
      if (s.coupons.some((c) => c.code === coupon.code.toUpperCase())) return s;
      return {
        ...s,
        coupons: [
          ...s.coupons,
          {
            code: coupon.code.toUpperCase(),
            discount: coupon.discount,
            type: coupon.type ?? "percentage",
            expiryDate: coupon.expiryDate ?? "2026-12-31",
            usageLimit: coupon.usageLimit ?? 100,
            userEligibility: coupon.userEligibility ?? "All",
            active: true
          }
        ]
      };
    }),
    removeCoupon: (code) => setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.code !== code) })),
    setAdminMode: (mode) => setState((s) => ({ ...s, adminMode: mode })),
    createProduct: (p) => setState((s) => {
      const id = `pr-${Date.now()}`;
      const newProduct = {
        id,
        ...p
      };
      return { ...s, products: [newProduct, ...s.products] };
    }),
    updateProduct: (id, patch) => {
      setState((s) => ({
        ...s,
        products: s.products.map((p) => p.id === id ? { ...p, ...patch } : p)
      }));
      if (id.startsWith("vp-") || id.startsWith("vnd-") || id.includes("-catalog")) {
        const cleanedPatch = { ...patch };
        if (cleanedPatch.price !== void 0) {
          cleanedPatch.price = cleanedPatch.price.toString().replace(/[^0-9.]/g, "");
        }
        if (cleanedPatch.originalPrice !== void 0) {
          cleanedPatch.originalPrice = cleanedPatch.originalPrice.toString().replace(/[^0-9.]/g, "");
        }
        fetch(`${BACKEND_URL}/api/vendors/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanedPatch)
        }).catch((err) => console.error("Failed to sync product update to backend:", err));
      }
    },
    deleteProduct: (id) => {
      setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
      if (id.startsWith("vp-") || id.startsWith("vnd-") || id.includes("-catalog")) {
        fetch(`${BACKEND_URL}/api/vendors/products/${id}`, {
          method: "DELETE"
        }).catch((err) => console.error("Failed to sync product deletion to backend:", err));
      }
    },
    requestReturn: (req) => setState((s) => {
      const returnId = `RET-${Math.floor(100 + Math.random() * 900)}`;
      const newReturn = {
        id: returnId,
        ...req,
        status: "Return Requested"
      };
      return {
        ...s,
        returns: [newReturn, ...s.returns],
        notifications: [
          { id: `n-${Date.now()}`, icon: "refund", title: "Return Request Created", body: `Return request ${returnId} for order ${req.orderId} submitted.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    approveReturn: (returnId) => setState((s) => {
      const req = s.returns.find((r) => r.id === returnId);
      if (!req) return s;
      const updatedReturns = s.returns.map((r) => r.id === returnId ? {
        ...r,
        status: "Refund Completed",
        refundTransactionId: `pay_razor_${Math.random().toString(36).substring(2, 11)}`,
        refundDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        expectedCreditDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 10)
      } : r);
      let updatedWallets = s.wallets;
      if (req.refundMethod === "ReeVibes Wallet" || req.refundMethod === "Store Credit") {
        const userWallet = s.wallets[req.customerId] ?? 0;
        updatedWallets = { ...s.wallets, [req.customerId]: userWallet + req.refundAmount };
      }
      const userOrders = s.orders[req.customerId] ?? [];
      const updatedOrders = userOrders.map((o) => {
        if (o.id === req.orderId) {
          return {
            ...o,
            status: "Returned",
            paymentStatus: "Refunded",
            refundDetails: {
              status: "Refund Completed",
              amount: req.refundAmount,
              transactionId: `pay_razor_${Math.random().toString(36).substring(2, 11)}`,
              date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
            }
          };
        }
        return o;
      });
      return {
        ...s,
        returns: updatedReturns,
        wallets: updatedWallets,
        orders: { ...s.orders, [req.customerId]: updatedOrders },
        notifications: [
          { id: `n-${Date.now()}`, icon: "wallet", title: "Refund Issued", body: `Refund of ₹${req.refundAmount.toLocaleString()} credited successfully.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    rejectReturn: (returnId, rejectionReason) => setState((s) => {
      const req = s.returns.find((r) => r.id === returnId);
      if (!req) return s;
      const updatedReturns = s.returns.map((r) => r.id === returnId ? { ...r, status: "Rejected", rejectionReason: rejectionReason || "Insufficient evidence" } : r);
      return {
        ...s,
        returns: updatedReturns,
        notifications: [
          { id: `n-${Date.now()}`, icon: "refund", title: "Return Request Rejected", body: `Return request ${returnId} for order ${req.orderId} was rejected. Reason: ${rejectionReason || "Insufficient evidence"}.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    updateReturnDetails: (returnId, patch) => setState((s) => {
      const nextList = s.returns.map((r) => r.id === returnId ? { ...r, ...patch } : r);
      return { ...s, returns: nextList };
    }),
    suspendCustomer: (id) => setState((s) => ({
      ...s,
      users: s.users.map((u) => u.id === id ? { ...u, status: "Suspended" } : u)
    })),
    reactivateCustomer: (id) => setState((s) => ({
      ...s,
      users: s.users.map((u) => u.id === id ? { ...u, status: "Active" } : u)
    })),
    addWalletCredit: (userId, amount) => setState((s) => {
      const bal = s.wallets[userId] ?? 0;
      return {
        ...s,
        wallets: { ...s.wallets, [userId]: bal + amount },
        notifications: [
          { id: `n-${Date.now()}`, icon: "wallet", title: "Wallet Credit Added", body: `₹${amount.toLocaleString()} has been added to your wallet.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    moderateReview: (productId, reviewId, action) => setState((s) => {
      const productRevs = s.productReviews[productId] ?? [];
      const updated = productRevs.map((r) => r.id === reviewId ? { ...r, status: action === "approve" ? "Approved" : "Hidden" } : r);
      return { ...s, productReviews: { ...s.productReviews, [productId]: updated } };
    }),
    addReview: (productId, r) => setState((s) => {
      const productRevs = s.productReviews[productId] ?? [];
      const newReview = {
        id: `rev-${Date.now()}`,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        videos: r.videos,
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        status: "Approved"
      };
      return {
        ...s,
        productReviews: { ...s.productReviews, [productId]: [newReview, ...productRevs] }
      };
    }),
    updateHomepageLayout: (layout) => setState((s) => {
      const next = {
        ...s,
        homepageLayout: { ...s.homepageLayout, ...layout }
      };
      save(next);
      return next;
    }),
    updateHomepageLayoutDraft: (layout) => setState((s) => {
      const next = {
        ...s,
        homepageLayoutDraft: { ...s.homepageLayoutDraft, ...layout }
      };
      save(next);
      return next;
    }),
    publishHomepageLayout: () => setState((s) => {
      const next = {
        ...s,
        homepageLayout: { ...s.homepageLayoutDraft }
      };
      save(next);
      return next;
    }),
    revertHomepageLayout: () => setState((s) => {
      const next = {
        ...s,
        homepageLayoutDraft: { ...s.homepageLayout }
      };
      save(next);
      return next;
    }),
    createBucket: (name, productIds, starProductId) => setState((s) => {
      const newBucket = {
        id: `bkt-${Date.now()}`,
        name,
        productIds,
        starProductId
      };
      return { ...s, buckets: [...s.buckets || [], newBucket] };
    }),
    updateBucket: (id, patch) => setState((s) => {
      const next = (s.buckets || []).map((b) => b.id === id ? { ...b, ...patch } : b);
      return { ...s, buckets: next };
    }),
    deleteBucket: (id) => setState((s) => ({
      ...s,
      buckets: (s.buckets || []).filter((b) => b.id !== id)
    })),
    reorderBuckets: (buckets) => setState((s) => ({
      ...s,
      buckets
    })),
    createVendor: (v) => setState((s) => {
      const newVendor = {
        id: `vn-${Date.now()}`,
        companyName: v.companyName,
        contactPerson: v.contactPerson,
        email: v.email,
        phone: v.phone,
        products: [],
        revenue: 0
      };
      return { ...s, vendors: [...s.vendors, newVendor] };
    }),
    deleteVendor: (id) => setState((s) => ({ ...s, vendors: s.vendors.filter((v) => v.id !== id) })),
    // Isolated shop cart & wishlist implementations
    addToShopCart: (item) => setState((s) => {
      const cartList = s.shopCart || [];
      const existing = cartList.find((c) => c.productId === item.productId && c.selectedSize === item.selectedSize);
      const qty = item.qty ?? 1;
      let shopCart;
      if (existing) {
        shopCart = cartList.map((c) => c.productId === item.productId && c.selectedSize === item.selectedSize ? { ...c, qty: c.qty + qty } : c);
      } else {
        shopCart = [...cartList, { ...item, qty }];
      }
      const currentAdditions = s.productCartAdditions[item.productId] ?? 0;
      return {
        ...s,
        shopCart,
        productCartAdditions: { ...s.productCartAdditions, [item.productId]: currentAdditions + qty }
      };
    }),
    removeFromShopCart: (id, size) => setState((s) => ({
      ...s,
      shopCart: (s.shopCart || []).filter((c) => size ? !(c.productId === id && c.selectedSize === size) : c.productId !== id)
    })),
    clearShopCart: () => setState((s) => ({ ...s, shopCart: [] })),
    toggleShopWishlist: (userId, productId) => setState((s) => {
      const list = s.shopWishlist[userId] ?? [];
      const next = list.includes(productId) ? list.filter((id) => id !== productId) : [...list, productId];
      return { ...s, shopWishlist: { ...s.shopWishlist, [userId]: next } };
    }),
    recordProductView: (productId) => setState((s) => {
      const currentViews = s.productViews[productId] ?? 0;
      return {
        ...s,
        productViews: { ...s.productViews, [productId]: currentViews + 1 }
      };
    }),
    updateShopCartQty: (productId, selectedSize, qty) => setState((s) => {
      const shopCart = (s.shopCart || []).map(
        (c) => c.productId === productId && c.selectedSize === selectedSize ? { ...c, qty } : c
      );
      return { ...s, shopCart };
    }),
    restoreToShopCart: (item) => setState((s) => {
      const exists = (s.shopCart || []).some((c) => c.productId === item.productId && c.selectedSize === item.selectedSize);
      const shopCart = exists ? s.shopCart || [] : [...s.shopCart || [], item];
      return { ...s, shopCart };
    })
  }), [state]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalContext.Provider, { value: api, children });
}
function usePortal() {
  const ctx = reactExports.useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside <PortalProvider>");
  return ctx;
}
function useAppStore() {
  return usePortal();
}
function useCartTotal() {
  const { state } = usePortal();
  const count = (state.cart || []).reduce((n, c) => n + c.qty, 0);
  const total = (state.cart || []).reduce((n, c) => n + Number(String(c.price).replace(/[^0-9.]/g, "")) * c.qty, 0);
  const shopCount = (state.shopCart || []).reduce((n, c) => n + c.qty, 0);
  const shopTotal = (state.shopCart || []).reduce((n, c) => n + Number(String(c.price).replace(/[^0-9.]/g, "")) * c.qty, 0);
  return { count, total, shopCount, shopTotal };
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-label text-accent", children: "Error 404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-7xl", children: "Lost in transit." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "The page you're searching for has stepped off the runway." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-10 inline-flex items-center justify-center border border-foreground/40 px-8 py-3 editorial-label hover:bg-foreground hover:text-background transition-colors",
        children: "Return Home"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "editorial-label text-accent", children: "Something Interrupted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-5xl", children: "The frame didn't load." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-10 border border-foreground/40 px-8 py-3 editorial-label hover:bg-foreground hover:text-background transition-colors",
        children: "Try Again"
      }
    )
  ] }) });
}
const Route$S = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        name: "description",
        content: "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography."
      },
      { name: "author", content: "ReeVibes" },
      { property: "og:title", content: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        property: "og:description",
        content: "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ReeVibes — Indian Editorial Fashion Platform" },
      {
        name: "twitter:description",
        content: "ReeVibes is a luxury editorial platform celebrating beauty through Indian fashion contests, runway storytelling and cinematic photography."
      },
      {
        property: "og:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cd86e9d-e25a-451a-a79f-f4fbd87e82e1/id-preview-283b10d1--15bfd4a3-bd5c-4a0c-8a13-a093490e4357.lovable.app-1779169156629.png"
      },
      {
        name: "twitter:image",
        content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8cd86e9d-e25a-451a-a79f-f4fbd87e82e1/id-preview-283b10d1--15bfd4a3-bd5c-4a0c-8a13-a093490e4357.lovable.app-1779169156629.png"
      }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('reevibes-theme') || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(stored);
                  document.documentElement.setAttribute('data-theme', stored);
                } catch (e) {}
              })();
            `
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { suppressHydrationWarning: true, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$S.useRouteContext();
  const googleClientId = "479932225768-2adkuj5brs5epugtb8num4ncb3pq9rnb.apps.googleusercontent.com";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleOAuthProvider, { clientId: googleClientId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PortalProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { duration: 2e3, position: "top-right", closeButton: true })
  ] }) }) }) });
}
const BASE_URL$1 = "";
const Route$R = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/live-contest", "/angels", "/best-photography", "/about", "/apply", "/house-of-fashion", "/login", "/register"];
        const urls = paths.map((p) => `  <url><loc>${BASE_URL$1}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      }
    }
  }
});
const $$splitComponentImporter$J = () => import("../_shop-C3BSUCg7.mjs");
const QuickAddContext = reactExports.createContext(null);
const ShopNotificationContext = reactExports.createContext(null);
function useShopNotification() {
  const ctx = reactExports.useContext(ShopNotificationContext);
  if (!ctx) throw new Error("useShopNotification must be used inside ShopNotificationProvider");
  return ctx;
}
const Route$Q = createFileRoute("/_shop")({
  component: lazyRouteComponent($$splitComponentImporter$J, "component")
});
const $$splitComponentImporter$I = () => import("./admin.index-Bv59ARFI.mjs");
const Route$P = createFileRoute("/admin/")({
  head: () => ({
    meta: [{
      title: "Admin Overview — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("../_shop.index-DnWfbl7H.mjs");
const Route$O = createFileRoute("/_shop/")({
  head: () => ({
    meta: [{
      title: "Maison ReeVibes — Luxury Fashion E-Commerce"
    }, {
      name: "description",
      content: "Curated collections and luxury editorial statements celebrating beauty in diversity."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./FashionBattle.index-C4gMRTuy.mjs");
const Route$N = createFileRoute("/FashionBattle/")({
  head: () => ({
    meta: [{
      title: "ReeVibes — Where Curves Become Editorial"
    }, {
      name: "description",
      content: "A luxury editorial platform celebrating women through fashion contests, runway storytelling and cinematic photography."
    }, {
      property: "og:title",
      content: "ReeVibes — Luxury Fashion Contest Platform"
    }, {
      property: "og:image",
      content: HERO_IMAGES[0]
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const sponsorsDbPath = path.join(process.cwd(), "src", "lib", "sponsors-db.json");
const publishedDbPath = path.join(process.cwd(), "src", "lib", "published-sponsors-db.json");
const contestsDbPath = path.join(process.cwd(), "src", "lib", "contests-db.json");
function readJsonFile(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || JSON.stringify(fallback));
  } catch (error) {
    console.error(`Error reading ${path.basename(filePath)}:`, error);
    return fallback;
  }
}
function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${path.basename(filePath)}:`, error);
  }
}
const Route$M = createFileRoute("/api/sponsors")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const action = url.searchParams.get("action");
          if (action === "get-open-countries") {
            const contests = readJsonFile(contestsDbPath);
            const activeContests = contests.filter((c) => !c.deleted && c.status !== "Deleted");
            const countries = Array.from(new Set(activeContests.map((c) => c.country)));
            return new Response(JSON.stringify({ countries }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "get-sponsors") {
            const sponsors = readJsonFile(sponsorsDbPath);
            return new Response(JSON.stringify(sponsors), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "get-sponsors-by-country") {
            const country = url.searchParams.get("country");
            const sponsors = readJsonFile(sponsorsDbPath);
            if (!country) {
              return new Response(JSON.stringify(sponsors), {
                headers: { "Content-Type": "application/json" }
              });
            }
            const filtered = sponsors.filter((s) => {
              const active = s.status !== "Inactive";
              const matchesCountry = (s.countries || []).some(
                (c) => c.toLowerCase() === country.toLowerCase() || c.toLowerCase() === "global"
              );
              return active && matchesCountry;
            });
            return new Response(JSON.stringify(filtered), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "get-published-sponsors") {
            const published = readJsonFile(publishedDbPath);
            return new Response(JSON.stringify(published), {
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      },
      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const action = url.searchParams.get("action");
          const body = await request.json();
          const now = (/* @__PURE__ */ new Date()).toISOString();
          if (action === "save-sponsor") {
            const sponsors = readJsonFile(sponsorsDbPath);
            const sponsor = body;
            if (!sponsor.id || !sponsor.name) {
              return new Response(JSON.stringify({ error: "Sponsor ID and Name are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            const existingIdx = sponsors.findIndex((s) => s.id === sponsor.id);
            if (existingIdx > -1) {
              sponsors[existingIdx] = {
                ...sponsors[existingIdx],
                ...sponsor,
                updatedDate: now
              };
            } else {
              sponsors.push({
                ...sponsor,
                status: sponsor.status || "Active",
                createdDate: now,
                updatedDate: now
              });
            }
            writeJsonFile(sponsorsDbPath, sponsors);
            return new Response(JSON.stringify({ success: true, sponsor }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "delete-sponsor") {
            const { id } = body;
            if (!id) {
              return new Response(JSON.stringify({ error: "Sponsor ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            const sponsors = readJsonFile(sponsorsDbPath);
            const filtered = sponsors.filter((s) => s.id !== id);
            writeJsonFile(sponsorsDbPath, filtered);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "save-published-sponsors") {
            const { publishedSectionId, countryId, countryName, stageName, selectedSponsorIds, publishStatus } = body;
            if (!publishedSectionId || !countryId || !countryName) {
              return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            const published = readJsonFile(publishedDbPath);
            const existingIdx = published.findIndex((p) => p.publishedSectionId === publishedSectionId);
            const record = {
              publishedSectionId,
              countryId,
              countryName,
              stageName: stageName || "",
              selectedSponsorIds: selectedSponsorIds || [],
              publishStatus: publishStatus || "published",
              createdDate: existingIdx > -1 ? published[existingIdx].createdDate : now,
              updatedDate: now
            };
            if (existingIdx > -1) {
              published[existingIdx] = record;
            } else {
              published.push(record);
            }
            writeJsonFile(publishedDbPath, published);
            return new Response(JSON.stringify({ success: true, record }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          if (action === "sync-contests") {
            const contests = body;
            if (!Array.isArray(contests)) {
              return new Response(JSON.stringify({ error: "Body must be a contests array" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            writeJsonFile(contestsDbPath, contests);
            return new Response(JSON.stringify({ success: true }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
const INDIAN_FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 150" width="100%" height="100%">
<rect width="225" height="150" fill="#FF9933"/>
<rect y="50" width="225" height="100" fill="#FFFFFF"/>
<rect y="100" width="225" height="50" fill="#128807"/>
<g transform="translate(112.5,75)">
<circle r="20" fill="none" stroke="#000088" stroke-width="2"/>
<circle r="4" fill="#000088"/>
<path d="M0 -20 L0 20 M-20 0 L20 0 M-14.14 -14.14 L14.14 14.14 M-14.14 14.14 L14.14 -14.14 M-7.65 -18.48 L7.65 18.48 M-18.48 -7.65 L18.48 7.65 M-18.48 7.65 L18.48 -7.65 M-7.65 18.48 L7.65 -18.48" stroke="#000088" stroke-width="0.5"/>
</g>
</svg>`;
const Route$L = createFileRoute("/api/flags")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return new Response(INDIAN_FLAG_SVG, {
            headers: {
              "Content-Type": "image/svg+xml",
              "Cache-Control": "public, max-age=86400"
            }
          });
        } catch (error) {
          console.error("Error serving flag:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }
  }
});
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh"
];
const FALLBACK_LOGO_WHITE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyMCI+Ui5WPC90ZXh0Pjwvc3ZnPg==";
const FALLBACK_LOGO_BLACK = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iYmxhY2siIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyMCI+Ui5WPC90ZXh0Pjwvc3ZnPg==";
const Route$K = createFileRoute("/api/countries-logos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const countryParam = url.searchParams.get("country");
          if (countryParam) {
            return new Response(
              JSON.stringify({
                whiteLogo: FALLBACK_LOGO_WHITE,
                blackLogo: FALLBACK_LOGO_BLACK
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }
          return new Response(
            JSON.stringify({ countries: INDIAN_STATES }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("Error in /api/countries-logos API:", error);
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
const dbPath = path.join(process.cwd(), "src", "lib", "angels-posts-db.json");
function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading angels db:", error);
    return [];
  }
}
function writeDb(data) {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to angels db:", error);
  }
}
const Route$J = createFileRoute("/api/angels")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const posts = readDb();
          return new Response(JSON.stringify(posts), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            countryId,
            countryName,
            year,
            logoUrl,
            winnerContestantId,
            winnerName,
            winnerPhotoUrl
          } = body;
          if (!countryId || !countryName || !year || !winnerPhotoUrl) {
            return new Response(
              JSON.stringify({ error: "Missing required fields" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
          const posts = readDb();
          const existingIndex = posts.findIndex(
            (p) => p.countryId?.toLowerCase() === countryId.toLowerCase() && String(p.year) === String(year)
          );
          const now = (/* @__PURE__ */ new Date()).toISOString();
          if (existingIndex > -1) {
            posts[existingIndex] = {
              ...posts[existingIndex],
              logoUrl: logoUrl || posts[existingIndex].logoUrl,
              winnerContestantId,
              winnerName,
              winnerPhotoUrl,
              updatedDate: now
            };
          } else {
            const newPost = {
              angelsPostId: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              countryId,
              countryName,
              year,
              logoUrl: logoUrl || "",
              winnerContestantId: winnerContestantId || "",
              winnerName: winnerName || "",
              winnerPhotoUrl,
              source: "Winner Coronation Selection",
              publishStatus: "published",
              createdDate: now,
              updatedDate: now
            };
            posts.push(newPost);
          }
          writeDb(posts);
          return new Response(
            JSON.stringify({ success: true, message: "Posted to Angels successfully" }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
const $$splitComponentImporter$F = () => import("./admin.vote-control-DNuASmnw.mjs");
const Route$I = createFileRoute("/admin/vote-control")({
  head: () => ({
    meta: [{
      title: "Vote & Rated — Control Center"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./admin.users-D4u0HamM.mjs");
const Route$H = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{
      title: "Manage Users — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const logoDark = "/assets/logo-dark-theme-B-dXk_yP.png";
const logoLight = "/assets/logo-dark-theme-B-dXk_yP.png";
function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: toggleTheme,
      "aria-label": isDark ? "Switch to light theme" : "Switch to dark theme",
      title: isDark ? "Switch to light theme" : "Switch to dark theme",
      className: `relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-border-subtle bg-surface-2 text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors ${className}`,
      children: isDark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-4 h-4" })
    }
  );
}
function BrandLogo({ className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoLight, alt: "ReeVibes", className: `${className} dark:hidden`, suppressHydrationWarning: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoDark, alt: "ReeVibes", className: `${className} hidden dark:block`, suppressHydrationWarning: true })
  ] });
}
function AdminCard({ children, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `liquid-glass p-6 ${className ?? ""}`, children });
}
function AdminButton({ children, variant = "default", className, ...props }) {
  const styles = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground/5",
    ghost: "text-foreground/70 hover:text-foreground hover:bg-surface-2",
    accent: "bg-accent text-white hover:bg-accent/90"
  }[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...props, className: `editorial-label px-5 py-2.5 transition-all duration-300 active:scale-95 hover:scale-[1.03] rounded-full ${styles} ${className ?? ""}`, children });
}
function StatusChip({ status, tone = "neutral" }) {
  const tones = {
    neutral: "bg-foreground/5 border-foreground/20 text-foreground/80",
    accent: "bg-accent/5 border-accent/20 text-accent",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warn: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    danger: "bg-rose-500/10 border-rose-500/20 text-rose-400"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 border ${tones} text-[10px] uppercase tracking-[0.18em] rounded-full`, children: status });
}
const BASE_URL = `${BACKEND_URL}/api/vendors`;
async function fetchVendors() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch vendors");
  return res.json();
}
async function createVendor(vendor) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendor)
  });
  if (!res.ok) throw new Error("Failed to register vendor");
  return res.json();
}
async function deleteVendor(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vendor");
  return res.json();
}
async function fetchConnection(vendorId) {
  const res = await fetch(`${BASE_URL}/${vendorId}/connection`);
  if (!res.ok) throw new Error("Failed to fetch vendor connection");
  return res.json();
}
async function saveConnection(vendorId, connection) {
  const res = await fetch(`${BASE_URL}/${vendorId}/connection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection)
  });
  if (!res.ok) throw new Error("Failed to save vendor connection");
  return res.json();
}
async function triggerSync(vendorId) {
  const res = await fetch(`${BASE_URL}/${vendorId}/sync`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger sync");
  return res.json();
}
async function fetchSyncHistory(vendorId) {
  const res = await fetch(`${BASE_URL}/${vendorId}/sync/history`);
  if (!res.ok) throw new Error("Failed to fetch sync history");
  return res.json();
}
async function fetchProducts(filters) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${BASE_URL}/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
async function importProductsToCatalog(productIds) {
  const res = await fetch(`${BASE_URL}/products/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productIds })
  });
  if (!res.ok) throw new Error("Failed to import products to catalog");
  return res.json();
}
async function fetchProductDetail(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}
async function updateProductDetail(id, patch) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error("Failed to update product details");
  return res.json();
}
async function restoreProductVersion(id, versionId) {
  const res = await fetch(`${BASE_URL}/products/${id}/restore?versionId=${versionId}`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to restore product version");
  return res.json();
}
async function bulkProductsAction(productIds, action, value) {
  const res = await fetch(`${BASE_URL}/products/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productIds, action, value })
  });
  if (!res.ok) throw new Error("Failed to execute bulk action");
  return res.json();
}
async function mergeCategories(source, target) {
  const res = await fetch(`${BASE_URL}/categories/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, target })
  });
  if (!res.ok) throw new Error("Failed to merge categories");
  return res.json();
}
async function renameCategory(oldName, newName) {
  const res = await fetch(`${BASE_URL}/categories/rename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldName, newName })
  });
  if (!res.ok) throw new Error("Failed to rename category");
  return res.json();
}
async function fetchVendorAnalytics() {
  const res = await fetch(`${BASE_URL}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch vendor analytics");
  return res.json();
}
function VendorDashboard() {
  const { state, reloadProducts } = usePortal();
  const [vendors, setVendors] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [isOffline, setIsOffline] = reactExports.useState(false);
  const [isAddingVendor, setIsAddingVendor] = reactExports.useState(false);
  const [newVendorForm, setNewVendorForm] = reactExports.useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    logoUrl: "https://blankapparel.in/cdn/shop/files/favicon.png"
  });
  const [selectedVendor, setSelectedVendor] = reactExports.useState(null);
  const [activeSubTab, setActiveSubTab] = reactExports.useState("overview");
  const [products, setProducts] = reactExports.useState([]);
  const [loadingProducts, setLoadingProducts] = reactExports.useState(false);
  const [syncHistory, setSyncHistory] = reactExports.useState([]);
  const [analytics, setAnalytics] = reactExports.useState(null);
  const [syncLogs, setSyncLogs] = reactExports.useState([]);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("");
  const [selectedProductIds, setSelectedProductIds] = reactExports.useState([]);
  const [catalogTab, setCatalogTab] = reactExports.useState("all");
  const [tagInput, setTagInput] = reactExports.useState("");
  const [imageUrlInput, setImageUrlInput] = reactExports.useState("");
  const [showCloseConfirm, setShowCloseConfirm] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [viewOnly, setViewOnly] = reactExports.useState(false);
  const [productForm, setProductForm] = reactExports.useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: 0,
    category: "",
    brand: "",
    house: "",
    material: "",
    fabric: "",
    color: "",
    gender: "Unisex",
    sku: "",
    status: "DRAFT",
    visibility: "VISIBLE",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    images: [],
    image: "",
    sizes: ["S", "M", "L"],
    stockPerSize: { S: 10, M: 10, L: 10 },
    tag: "",
    tags: [],
    discountLimitBuyers: void 0,
    discountExpiryDate: "",
    discountBuyersCount: 0
  });
  const [productVersions, setProductVersions] = reactExports.useState([]);
  const [categoryMergeForm, setCategoryMergeForm] = reactExports.useState({ source: "", target: "" });
  const [categoryRenameForm, setCategoryRenameForm] = reactExports.useState({ oldName: "", newName: "" });
  const [connectionForm, setConnectionForm] = reactExports.useState({
    syncUrl: "",
    syncFrequency: "DAILY",
    apiKey: ""
  });
  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await fetchVendors();
      setVendors(data);
      setIsOffline(false);
    } catch (err) {
      console.warn("Backend offline, loading mock/local storage vendors:", err);
      setIsOffline(true);
      const fallback = (state.vendors || []).filter((v) => v.id === "blankapparel").map((v) => {
        const localProds = (state.products || []).filter((p) => p.vendorId === v.id || p.brand === v.companyName);
        return {
          ...v,
          totalProducts: localProds.length,
          activeProducts: localProds.filter((p) => p.status === "PUBLISHED" || !p.status).length,
          hiddenProducts: localProds.filter((p) => p.status === "HIDDEN").length,
          draftProducts: localProds.filter((p) => p.status === "DRAFT").length,
          connectionStatus: v.id === "blankapparel" || v.id === "vn1" || v.id === "vn2" ? "CONNECTED" : "DISCONNECTED",
          lastSyncTime: (/* @__PURE__ */ new Date()).toISOString(),
          syncFrequency: "DAILY",
          syncUrl: v.id === "blankapparel" ? "https://www.blankapparel.in/products.json" : ""
        };
      });
      setVendors(fallback);
      toast.info("Boutique Running in Offline Demo Mode.", { duration: 3e3 });
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadVendors();
  }, []);
  reactExports.useEffect(() => {
    if (!selectedVendor) return;
    const loadVendorDetails = async () => {
      setLoadingProducts(true);
      try {
        if (isOffline) {
          const allProds = state.products || [];
          const matched = allProds.filter((p) => p.vendorId === selectedVendor.id || p.brand === selectedVendor.companyName);
          setProducts(matched);
          setSyncLogs([
            { status: "SUCCESS", runTime: (/* @__PURE__ */ new Date()).toISOString(), logMessage: "Offline sandbox sync succeeded.", productsAdded: 0, productsUpdated: 0, productsRemoved: 0, durationMs: 450 }
          ]);
          setAnalytics({
            totalProducts: matched.length,
            publishedProducts: matched.filter((p) => p.status === "PUBLISHED" || !p.status).length,
            lowStockCount: matched.filter((p) => p.totalStock < 5).length,
            averagePrice: matched.length > 0 ? (matched.reduce((sum, p) => sum + Number(p.price.toString().replace(/[^0-9.]/g, "")), 0) / matched.length).toFixed(2) : "0"
          });
          setConnectionForm({
            syncUrl: selectedVendor.id === "blankapparel" ? "https://www.blankapparel.in/products.json" : "",
            syncFrequency: "DAILY",
            apiKey: ""
          });
          setLoadingProducts(false);
          return;
        }
        if (activeSubTab === "catalog" || activeSubTab === "overview") {
          if (selectedVendor.id === "blankapparel") {
            try {
              await triggerSync(selectedVendor.id);
            } catch (err) {
              console.error("Auto sync failed:", err);
            }
          }
          const prodData = await fetchProducts({ vendorId: selectedVendor.id, inCatalog: false });
          setProducts(prodData);
        }
        if (activeSubTab === "logs" || activeSubTab === "overview") {
          const logsData = await fetchSyncHistory(selectedVendor.id);
          setSyncLogs(logsData);
        }
        if (activeSubTab === "analytics") {
          const stats = await fetchVendorAnalytics();
          setAnalytics(stats);
        }
        if (activeSubTab === "settings") {
          const conn = await fetchConnection(selectedVendor.id);
          setConnectionForm({
            syncUrl: conn.syncUrl || "",
            syncFrequency: conn.syncFrequency || "DAILY",
            apiKey: conn.apiKey || ""
          });
        }
      } catch (err) {
        console.error("Failed to load online details, using mock data:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadVendorDetails();
  }, [selectedVendor, activeSubTab, isOffline]);
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      await createVendor(newVendorForm);
      toast.success("Vendor account registered successfully");
      setIsAddingVendor(false);
      setNewVendorForm({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        logoUrl: "https://blankapparel.in/cdn/shop/files/favicon.png"
      });
      loadVendors();
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleSyncVendor = async (vendorId) => {
    const toastId = toast.loading("Initiating vendor catalog synchronization...");
    try {
      const result = await triggerSync(vendorId);
      if (result.status === "SUCCESS") {
        toast.success(`Sync Succeeded: Added ${result.productsAdded}, Updated ${result.productsUpdated} products.`, { id: toastId });
      } else {
        toast.error("Sync Completed with issues. Check logs.", { id: toastId });
      }
      loadVendors();
      if (selectedVendor && selectedVendor.id === vendorId) {
        const prodData = await fetchProducts({ vendorId, inCatalog: false });
        setProducts(prodData);
        const logsData = await fetchSyncHistory(vendorId);
        setSyncLogs(logsData);
      }
    } catch (err) {
      toast.error("Sync failed: " + err.message, { id: toastId });
    }
  };
  const handleSendToCatalog = async () => {
    if (selectedProductIds.length === 0) return;
    const toastId = toast.loading(`Importing ${selectedProductIds.length} products to ReeVibes Catalog...`);
    try {
      await importProductsToCatalog(selectedProductIds);
      toast.success(`Successfully imported ${selectedProductIds.length} products to catalog!`, { id: toastId });
      setSelectedProductIds([]);
      const prodData = await fetchProducts({ vendorId: selectedVendor.id, inCatalog: false });
      setProducts(prodData);
      if (reloadProducts) {
        await reloadProducts();
      }
    } catch (err) {
      toast.error(err.message || "Failed to import products to catalog", { id: toastId });
    }
  };
  const handleDeleteVendor = async (id) => {
    if (!confirm("Are you sure you want to delete this vendor connection? All synced catalog products will be removed.")) return;
    try {
      await deleteVendor(id);
      toast.success("Vendor connection deleted");
      loadVendors();
      if (selectedVendor?.id === id) setSelectedVendor(null);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await saveConnection(selectedVendor.id, connectionForm);
      toast.success("Connection parameters saved successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleEditProduct = async (p) => {
    try {
      const detail = await fetchProductDetail(p.id);
      setEditingProduct(detail);
      const sizes = detail.sizes || Object.keys(detail.stockPerSize || {});
      const tagList = detail.tag ? detail.tag.split(",").map((t) => t.trim()).filter(Boolean) : [];
      setProductForm({
        name: detail.name,
        description: detail.description || "",
        price: String(detail.price || ""),
        originalPrice: String(detail.originalPrice || detail.price || ""),
        discount: detail.discount || 0,
        category: detail.category || "",
        brand: detail.brand || "",
        house: detail.brand || "",
        material: detail.material || "",
        fabric: detail.fabric || "",
        color: detail.color || "",
        gender: detail.gender || "Unisex",
        sku: detail.sku || "",
        status: detail.status || "DRAFT",
        visibility: detail.visibility || "VISIBLE",
        seoTitle: detail.seoTitle || "",
        seoDescription: detail.seoDescription || "",
        seoKeywords: detail.seoKeywords || "",
        images: detail.images || [],
        image: detail.image || detail.images && detail.images[0] || "",
        sizes: sizes.length > 0 ? sizes : ["S", "M", "L"],
        stockPerSize: detail.stockPerSize || { S: 10, M: 10, L: 10 },
        tag: detail.tag || "",
        tags: detail.tags || tagList,
        discountLimitBuyers: detail.discountLimitBuyers,
        discountExpiryDate: detail.discountExpiryDate || "",
        discountBuyersCount: detail.discountBuyersCount || 0
      });
      setProductVersions(detail.versions || []);
    } catch (err) {
      toast.error("Failed to load product: " + err.message);
    }
  };
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const actual = parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, ""));
      const disc = parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, ""));
      const discountPct = actual && disc && actual > disc ? Math.round((actual - disc) / actual * 100) : 0;
      const cleanStock = { ...productForm.stockPerSize || {} };
      Object.keys(cleanStock).forEach((k) => {
        if (cleanStock[k] === "" || cleanStock[k] === void 0) {
          cleanStock[k] = 0;
        }
      });
      const finalForm = {
        ...productForm,
        price: disc,
        originalPrice: actual,
        discount: discountPct,
        brand: productForm.house || productForm.brand,
        images: productForm.images || [],
        image: productForm.image || productForm.images && productForm.images[0] || "",
        stockPerSize: cleanStock
      };
      await updateProductDetail(editingProduct.id, finalForm);
      toast.success("Product details updated successfully");
      setEditingProduct(null);
      setViewOnly(false);
      const prodData = await fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleRestoreVersion = async (versionId) => {
    if (!confirm("Are you sure you want to restore the product to this version?")) return;
    try {
      await restoreProductVersion(editingProduct.id, versionId);
      toast.success("Product version restored successfully");
      handleEditProduct(editingProduct);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleMergeCategories = async (e) => {
    e.preventDefault();
    if (!categoryMergeForm.source || !categoryMergeForm.target) return;
    try {
      await mergeCategories(categoryMergeForm.source, categoryMergeForm.target);
      toast.success("Categories merged successfully");
      setCategoryMergeForm({ source: "", target: "" });
      const prodData = await fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleRenameCategory = async (e) => {
    e.preventDefault();
    if (!categoryRenameForm.oldName || !categoryRenameForm.newName) return;
    try {
      await renameCategory(categoryRenameForm.oldName, categoryRenameForm.newName);
      toast.success("Category renamed successfully");
      setCategoryRenameForm({ oldName: "", newName: "" });
      const prodData = await fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleBulkAction = async (action, value) => {
    if (selectedProductIds.length === 0) {
      toast.warning("Please select at least one product.");
      return;
    }
    try {
      await bulkProductsAction(selectedProductIds, action, value);
      toast.success(`Bulk action '${action}' completed successfully.`);
      setSelectedProductIds([]);
      const prodData = await fetchProducts({ vendorId: selectedVendor.id });
      setProducts(prodData);
    } catch (err) {
      toast.error(err.message);
    }
  };
  products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || p.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesCategory = categoryFilter === "" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  if (loading && vendors.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-accent animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Connecting to ReeVibes PostgreSQL Catalog Database..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    !selectedVendor ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl text-foreground", children: "Authorized Vendor Connections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Manage external Shopify integrations, cron schedules, and sync queues" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setIsAddingVendor(!isAddingVendor),
            className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 rounded-full cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " Connect Catalog Source"
            ]
          }
        )
      ] }),
      isAddingVendor && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in slide-in-from-top-4 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-amber-200", children: "Register Partner Catalog Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsAddingVendor(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddVendor, className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Vendor Company Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                placeholder: "e.g. Blank Apparel India",
                className: "w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none",
                value: newVendorForm.companyName,
                onChange: (e) => setNewVendorForm({ ...newVendorForm, companyName: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Contact Liaison" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                placeholder: "e.g. Prakash Kumar",
                className: "w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none",
                value: newVendorForm.contactPerson,
                onChange: (e) => setNewVendorForm({ ...newVendorForm, contactPerson: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Liaison Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                type: "email",
                placeholder: "wholesale@blankapparel.in",
                className: "w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none",
                value: newVendorForm.email,
                onChange: (e) => setNewVendorForm({ ...newVendorForm, email: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Phone / WhatsApp Line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                required: true,
                placeholder: "+91 9999911111",
                className: "w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none",
                value: newVendorForm.phone,
                onChange: (e) => setNewVendorForm({ ...newVendorForm, phone: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Vendor Logo URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                placeholder: "Logo URL",
                className: "w-full bg-surface border border-border-subtle p-2.5 text-xs text-foreground rounded-lg outline-none",
                value: newVendorForm.logoUrl,
                onChange: (e) => setNewVendorForm({ ...newVendorForm, logoUrl: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex justify-end gap-3 pt-4 border-t border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { type: "button", variant: "outline", onClick: () => setIsAddingVendor(false), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer", children: "Register Vendor Account" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: vendors.map((v) => {
        const statusColor = v.connectionStatus === "CONNECTED" ? "success" : v.connectionStatus === "ERROR" ? "danger" : "neutral";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "liquid-glass relative rounded-3xl overflow-hidden border border-white/10 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col group p-6 space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden", children: v.logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.logoUrl, alt: v.companyName, className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "w-6 h-6 text-accent" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-xl text-foreground font-bold tracking-tight", children: v.companyName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: v.connectionStatus || "DISCONNECTED", tone: statusColor }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono", children: [
                        "Sync: ",
                        v.syncFrequency || "MANUAL"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleDeleteVendor(v.id),
                    className: "text-muted-foreground/30 hover:text-rose-400 p-1.5 transition-colors",
                    title: "Delete connection",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 border-y border-white/5 py-4 my-2 text-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] uppercase font-mono tracking-wider", children: "Total Synced" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg text-white mt-1", children: v.totalProducts || 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] uppercase font-mono tracking-wider", children: "Published" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg text-emerald-400 mt-1", children: v.activeProducts || 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[10px] uppercase font-mono tracking-wider", children: "In Queue / Draft" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg text-amber-300 mt-1", children: v.draftProducts || 0 })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center text-xs text-muted-foreground pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                "Last synced: ",
                v.lastSyncTime ? new Date(v.lastSyncTime).toLocaleString() : "Never"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => handleSyncVendor(v.id),
                    className: "flex-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                      " Sync Catalog"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => {
                      setSelectedVendor(v);
                      setActiveSubTab("overview");
                    },
                    className: "flex-1 bg-accent text-white hover:bg-accent/90 py-2 text-[10px] uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                    children: [
                      "Manage Catalog ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                    ]
                  }
                )
              ] })
            ]
          },
          v.id
        );
      }) })
    ] }) : (
      /* 2. VENDOR DETAILS VIEW (TABS INCLUDED) */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-2 border border-white/10 p-5 rounded-3xl liquid-glass", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSelectedVendor(null),
                className: "p-2 border border-white/10 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-accent font-semibold font-mono", children: "Vendor Dashboard" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-semibold", children: selectedVendor.id })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl text-foreground font-bold mt-0.5", children: selectedVendor.companyName })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            selectedProductIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleSendToCatalog,
                className: "bg-accent text-white hover:bg-accent/90 border border-accent/20 px-5 py-2 text-[11px] uppercase tracking-widest font-bold rounded-full flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3.5 h-3.5" }),
                  " Send to Product Catalog (",
                  selectedProductIds.length,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleSyncVendor(selectedVendor.id),
                className: "bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                  " Trigger Manual Sync"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setActiveSubTab("settings");
                },
                className: "bg-surface-3 hover:bg-surface-4 text-white border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider font-semibold rounded-full flex items-center gap-2 cursor-pointer transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3.5 h-3.5" }),
                  " Connection Settings"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-white/10 overflow-x-auto pb-px", children: [
          { id: "overview", label: "Overview", icon: LayoutGrid },
          { id: "catalog", label: "Products Catalog", icon: ShoppingBag },
          { id: "logs", label: "Sync Logs", icon: History }
        ].map((tabItem) => {
          const active = activeSubTab === tabItem.id;
          const Icon = tabItem.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveSubTab(tabItem.id),
              className: `flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${active ? "text-accent border-accent bg-accent/5 font-bold" : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
                " ",
                tabItem.label
              ]
            },
            tabItem.id
          );
        }) }),
        loadingProducts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 text-accent animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Retrieving catalog records from database..." })
        ] }),
        !loadingProducts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          activeSubTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
              ["Total Synced Products", products.length, "Catalog total"],
              ["Published Products", products.filter((p) => p.status?.toUpperCase() === "PUBLISHED").length, "Live on shop"],
              ["Pending Queue", products.filter((p) => p.status?.toUpperCase() === "DRAFT").length, "Requires review"],
              ["Hidden / Disabled", products.filter((p) => p.status?.toUpperCase() === "HIDDEN").length, "Remains in DB"]
            ].map(([k, v, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-3", children: v }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-accent mt-2 uppercase font-mono tracking-wider", children: d })
            ] }, k)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "lg:col-span-2 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold border-b border-white/5 pb-2", children: "Recent Synchronizations" }),
                syncLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic py-6 text-center", children: "No logs recorded yet. Run a manual sync." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3.5 max-h-80 overflow-y-auto pr-2", children: syncLogs.slice(0, 5).map((logItem, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: logItem.status, tone: logItem.status === "SUCCESS" ? "success" : "danger" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono text-muted-foreground", children: new Date(logItem.runTime).toLocaleString() })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/80 line-clamp-1 font-mono", children: logItem.logMessage?.split("\n").pop() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[10px] text-muted-foreground font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      "Added: ",
                      logItem.productsAdded,
                      " | Updated: ",
                      logItem.productsUpdated
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      "Duration: ",
                      (logItem.durationMs / 1e3).toFixed(1),
                      "s"
                    ] })
                  ] })
                ] }, idx)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold border-b border-white/5 pb-2", children: "Liaison Contact Cards" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 pb-2 border-b border-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-white font-mono", children: selectedVendor.email })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 pb-2 border-b border-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Liaison:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-white font-bold", children: selectedVendor.contactPerson })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 pb-2 border-b border-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-white font-mono", children: selectedVendor.phone })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 pb-2 border-b border-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "API Sync URL:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-accent truncate block", title: selectedVendor.syncUrl, children: selectedVendor.syncUrl || "None" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          activeSubTab === "catalog" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-white/10 gap-6 text-xs font-bold uppercase tracking-wider mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setCatalogTab("all");
                    setSelectedProductIds([]);
                  },
                  className: `pb-2.5 transition-colors cursor-pointer ${catalogTab === "all" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    "All Products (",
                    products.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setCatalogTab("published");
                    setSelectedProductIds([]);
                  },
                  className: `pb-2.5 transition-colors cursor-pointer ${catalogTab === "published" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    "Published (",
                    products.filter((p) => p.status === "PUBLISHED" || !p.status).length,
                    ")"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center flex-1 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search catalog products name, SKU...",
                    className: "w-full bg-surface border border-white/10 pl-10 pr-4 py-2 text-xs outline-none text-foreground rounded-lg",
                    value: searchTerm,
                    onChange: (e) => setSearchTerm(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: statusFilter,
                  onChange: (e) => setStatusFilter(e.target.value),
                  className: "bg-surface border border-white/10 p-2 text-xs text-foreground outline-none rounded-lg cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Review Statuses" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DRAFT", children: "Queue (Draft)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PUBLISHED", children: "Published (Live)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIDDEN", children: "Hidden" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ARCHIVED", children: "Archived (Removed)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: categoryFilter,
                  onChange: (e) => setCategoryFilter(e.target.value),
                  className: "bg-surface border border-white/10 p-2 text-xs text-foreground outline-none rounded-lg cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Categories" }),
                    uniqueCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
                  ]
                }
              )
            ] }) }),
            (() => {
              const filtered = products.filter((p) => {
                if (catalogTab === "published") {
                  return p.status === "PUBLISHED" || !p.status;
                }
                return true;
              }).filter((p) => {
                if (statusFilter && p.status !== statusFilter) return false;
                if (categoryFilter && p.category !== categoryFilter) return false;
                if (searchTerm) {
                  const term = searchTerm.toLowerCase();
                  return p.name.toLowerCase().includes(term) || p.sku && p.sku.toLowerCase().includes(term);
                }
                return true;
              });
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl mb-6 text-xs backdrop-blur-md", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: selectedProductIds.length === filtered.length && filtered.length > 0,
                          onChange: (e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(filtered.map((p) => String(p.id)));
                            } else {
                              setSelectedProductIds([]);
                            }
                          },
                          className: "rounded border-white/20 text-accent focus:ring-accent w-4 h-4 bg-transparent"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-muted-foreground uppercase tracking-wider text-[10px]", children: [
                        "Select All (",
                        filtered.length,
                        ")"
                      ] })
                    ] }),
                    selectedProductIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-mono font-bold", children: [
                      "[",
                      selectedProductIds.length,
                      " Selected]"
                    ] })
                  ] }),
                  selectedProductIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleBulkAction("PUBLISH"),
                        className: "bg-accent text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-accent/90 transition-all cursor-pointer shadow-lg shadow-accent/20",
                        children: "Publish Selected"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleBulkAction("HIDE"),
                        className: "bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer",
                        children: "Hide Selected"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          const newCat = prompt("Enter the category to move these products to:");
                          if (newCat) handleBulkAction("CATEGORY", newCat);
                        },
                        className: "bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer",
                        children: "Move Category"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          const discInput = prompt("Enter discount percentage (0 to 100):");
                          if (discInput !== null) handleBulkAction("DISCOUNT", discInput);
                        },
                        className: "bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full border border-white/10 cursor-pointer",
                        children: "Apply Discount"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleBulkAction("DELETE"),
                        className: "bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold py-1.5 px-4 rounded-full cursor-pointer",
                        children: "Delete Selected"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setSelectedProductIds([]),
                        className: "bg-transparent text-muted-foreground hover:text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded-full cursor-pointer",
                        children: "Clear"
                      }
                    )
                  ] })
                ] }),
                filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 border-2 border-dashed border-white/10 rounded-3xl text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No catalog products match current search or filters." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: filtered.map((p) => {
                  const isChecked = selectedProductIds.includes(String(p.id));
                  const discountPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
                  const isComplete = !!p.name && !!p.description && !!p.category && !!p.gender && (!!p.tag || p.tags && p.tags.length > 0) && !!p.color && (!!p.material || !!p.fabric) && !!p.house && !!p.originalPrice && !!p.price && p.sizes && p.sizes.length > 0 && (p.images && p.images.length > 0 || !!p.image) && !!p.sku;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `liquid-glass relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col group ${isChecked ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/20"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            onClick: () => {
                              if (isChecked) {
                                setSelectedProductIds(selectedProductIds.filter((id) => id !== String(p.id)));
                              } else {
                                setSelectedProductIds([...selectedProductIds, String(p.id)]);
                              }
                            },
                            className: "absolute top-2.5 left-2.5 z-10 p-1.5 bg-black/60 rounded-full hover:bg-black text-white hover:text-accent transition-colors",
                            children: isChecked ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-4 h-4 text-white/50" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            title: isComplete ? "Product information fully complete" : "Product information incomplete",
                            className: `absolute top-3 right-3 w-3 h-3 rounded-full border border-white/20 z-10 shadow-lg ${isComplete ? "bg-blue-500 shadow-blue-500/80 animate-pulse" : "bg-yellow-500 shadow-yellow-500/80 animate-pulse"}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] bg-zinc-950 overflow-hidden relative", children: [
                          p.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-muted-foreground/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2.5 left-2.5 bg-black/65 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold", children: p.category }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2.5 right-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            StatusChip,
                            {
                              status: p.status,
                              tone: p.status === "PUBLISHED" ? "success" : p.status === "HIDDEN" ? "neutral" : p.status === "DRAFT" ? "warn" : "danger"
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex-1 flex flex-col justify-between space-y-2 text-xs", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] text-muted-foreground uppercase font-mono", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.brand }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: p.type || p.category || "Apparel" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-serif text-sm font-bold text-white truncate mt-0.5", title: p.name, children: p.name }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mt-1", children: p.discount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif font-bold text-accent", children: [
                                "₹",
                                discountPrice.toLocaleString()
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "line-through text-muted-foreground text-[10px]", children: [
                                "₹",
                                p.price.toLocaleString()
                              ] })
                            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif font-bold text-white", children: [
                              "₹",
                              p.price.toLocaleString()
                            ] }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1.5 font-mono space-y-0.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                "Sizes: ",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "—" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                  "Stock: ",
                                  p.totalStock ?? 0,
                                  " units"
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${p.totalStock > 0 ? "text-emerald-400" : "text-rose-400"}`, children: p.totalStock > 0 ? "In Stock" : "Out of Stock" })
                              ] })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              onClick: () => {
                                setViewOnly(true);
                                handleEditProduct(p);
                              },
                              className: "w-full border border-white/10 hover:border-accent hover:text-accent bg-transparent py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
                                " View Details"
                              ]
                            }
                          )
                        ] })
                      ]
                    },
                    p.id
                  );
                }) })
              ] });
            })()
          ] }),
          activeSubTab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-white/5 pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-5 h-5 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold", children: "Merge Catalog Categories" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-normal", children: "Combine all product catalog items currently listed under the Source Category into the Target Category. This helps clean up crawled taxonomy." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleMergeCategories, className: "space-y-4 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Source Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      required: true,
                      value: categoryMergeForm.source,
                      onChange: (e) => setCategoryMergeForm({ ...categoryMergeForm, source: e.target.value }),
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Select Source --" }),
                        uniqueCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Target Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      required: true,
                      placeholder: "e.g. Tops & Corsets",
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none",
                      value: categoryMergeForm.target,
                      onChange: (e) => setCategoryMergeForm({ ...categoryMergeForm, target: e.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs", children: "Merge Categories" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-white/5 pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold", children: "Rename Category" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-normal", children: "Rename a specific category globally. All products under the old category will immediately transition to the new name." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRenameCategory, className: "space-y-4 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Old Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      required: true,
                      value: categoryRenameForm.oldName,
                      onChange: (e) => setCategoryRenameForm({ ...categoryRenameForm, oldName: e.target.value }),
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Select Category --" }),
                        uniqueCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "New Category Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      required: true,
                      placeholder: "New Category Name",
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none",
                      value: categoryRenameForm.newName,
                      onChange: (e) => setCategoryRenameForm({ ...categoryRenameForm, newName: e.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs", children: "Rename Category" })
              ] })
            ] })
          ] }),
          activeSubTab === "brands" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300", children: uniqueBrands.map((brand) => {
            const count = products.filter((p) => p.brand === brand).length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "flex justify-between items-center p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-mono text-accent", children: "Authorized Brand" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-serif text-base font-bold text-white mt-0.5", children: brand })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-white/5 border border-white/10 text-white font-mono text-xs px-3 py-1.5 rounded-full", children: [
                count,
                " Products"
              ] })
            ] }, brand);
          }) }),
          activeSubTab === "analytics" && analytics && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Total Scraped Products" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-3", children: analytics.totalProducts })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Published Products" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-3 text-emerald-400", children: analytics.publishedProducts })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Out / Low Stock Warnings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-3 text-rose-400", children: analytics.lowStockCount })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Average Catalog Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-3xl mt-3 text-accent", children: [
                  "₹",
                  analytics.averagePrice
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-xl font-bold border-b border-white/5 pb-2", children: "Catalog Health Indicators" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: "Publish Rate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-zinc-900 border border-white/5 rounded-full overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_#d4af37] transition-all duration-500",
                      style: { width: `${analytics.publishedProducts / (analytics.totalProducts || 1) * 100}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      (analytics.publishedProducts / (analytics.totalProducts || 1) * 100).toFixed(1),
                      "% Published"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      analytics.totalProducts - analytics.publishedProducts,
                      " Awaiting Review"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: "Stock Coverage" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-zinc-900 border border-white/5 rounded-full overflow-hidden relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-500",
                      style: { width: `${(analytics.totalProducts - analytics.lowStockCount) / (analytics.totalProducts || 1) * 100}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      ((analytics.totalProducts - analytics.lowStockCount) / (analytics.totalProducts || 1)).toFixed(1),
                      "% Healthy Coverage"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      analytics.lowStockCount,
                      " Low stock items"
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          activeSubTab === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold border-b border-white/5 pb-2", children: "Full Integration History" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/10 text-muted-foreground font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5", children: "Sync Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Added" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Updated" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Removed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Logs" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: syncLogs.map((logItem, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-white/5 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-mono", children: new Date(logItem.runTime).toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: logItem.status, tone: logItem.status === "SUCCESS" ? "success" : "danger" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-mono", children: [
                  (logItem.durationMs / 1e3).toFixed(1),
                  "s"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-mono text-emerald-400 font-bold", children: [
                  "+",
                  logItem.productsAdded
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-mono text-blue-400", children: [
                  "~",
                  logItem.productsUpdated
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-mono text-rose-400", children: [
                  "-",
                  logItem.productsRemoved
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => alert(logItem.logMessage),
                    className: "text-accent hover:underline cursor-pointer",
                    children: "View Output"
                  }
                ) })
              ] }, idx)) })
            ] }) })
          ] }) }),
          activeSubTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4 animate-in fade-in duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold border-b border-white/5 pb-2", children: "Shopify Connection Parameters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveSettings, className: "space-y-4 max-w-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Shopify Products Feed URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    required: true,
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none font-mono",
                    value: connectionForm.syncUrl,
                    onChange: (e) => setConnectionForm({ ...connectionForm, syncUrl: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "Auto-Sync Cycle" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: connectionForm.syncFrequency,
                    onChange: (e) => setConnectionForm({ ...connectionForm, syncFrequency: e.target.value }),
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground outline-none rounded-lg cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MANUAL", children: "Manual Trigger Only" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HOURLY", children: "Hourly Chrono Sync" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DAILY", children: "Daily at 2:00 AM" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-semibold text-muted-foreground", children: "API Passphrase Key (Optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "password",
                    placeholder: "••••••••••••••••",
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none font-mono",
                    value: connectionForm.apiKey,
                    onChange: (e) => setConnectionForm({ ...connectionForm, apiKey: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer text-xs", children: "Save Credentials" })
            ] })
          ] })
        ] })
      ] })
    ),
    editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-5xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          viewOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5 text-accent animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl font-bold", children: viewOnly ? "Catalog Product Viewer" : "Catalog Product Editor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono mt-0.5", children: [
              "ID: ",
              editingProduct.id
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (viewOnly) {
                setEditingProduct(null);
                setViewOnly(false);
              } else {
                setShowCloseConfirm(true);
              }
            },
            className: "text-muted-foreground hover:text-white cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveProduct, className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("fieldset", { disabled: viewOnly, className: "space-y-6 border-0 p-0 m-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Product Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    required: true,
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                    value: productForm.name,
                    onChange: (e) => setProductForm({ ...productForm, name: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    rows: 4,
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-none leading-relaxed",
                    value: productForm.description,
                    onChange: (e) => setProductForm({ ...productForm, description: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent",
                      value: ["Tops", "Bottoms", "Couture", "Accessories", "Shirts", "T-Shirts"].includes(productForm.category) ? productForm.category : "Other",
                      onChange: (e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setProductForm({ ...productForm, category: "" });
                        } else {
                          setProductForm({ ...productForm, category: val });
                        }
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tops", children: "Tops" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bottoms", children: "Bottoms" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Couture", children: "Couture" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Accessories", children: "Accessories" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Shirts", children: "Shirts" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "T-Shirts", children: "T-Shirts" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", children: "Other (Type custom)..." })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Gender" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: productForm.gender,
                      onChange: (e) => setProductForm({ ...productForm, gender: e.target.value }),
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Women", children: "Women" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Men", children: "Men" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unisex", children: "Unisex" })
                      ]
                    }
                  )
                ] })
              ] }),
              !["Tops", "Bottoms", "Couture", "Accessories", "Shirts", "T-Shirts"].includes(productForm.category) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-accent", children: "Custom Category Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    required: true,
                    placeholder: "Enter new category...",
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                    value: productForm.category,
                    onChange: (e) => setProductForm({ ...productForm, category: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Product Tags" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Type a tag (e.g. Hoodies, Cargos, Summer) and press Enter",
                        className: "flex-1 bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: tagInput,
                        onChange: (e) => setTagInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = tagInput.trim();
                            if (val && !(productForm.tags || []).includes(val)) {
                              const updated = [...productForm.tags || [], val];
                              setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                              setTagInput("");
                            }
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const val = tagInput.trim();
                          if (val && !(productForm.tags || []).includes(val)) {
                            const updated = [...productForm.tags || [], val];
                            setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                            setTagInput("");
                          }
                        },
                        className: "bg-accent/20 border border-accent/30 text-accent px-4 text-xs font-bold rounded-lg hover:bg-accent/30 transition-colors cursor-pointer",
                        children: "Add"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: (productForm.tags || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground italic", children: "No tags added yet." }) : (productForm.tags || []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-accent/10 border border-accent/25 text-accent text-[10px] px-2.5 py-1 rounded-full font-semibold", children: [
                    t,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const updated = (productForm.tags || []).filter((x) => x !== t);
                          setProductForm({ ...productForm, tags: updated, tag: updated.join(", ") });
                        },
                        className: "text-accent hover:text-rose-400 font-bold ml-1 transition-colors",
                        children: "✕"
                      }
                    )
                  ] }, t)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Colour" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      placeholder: "e.g. Noir, Beige, Emerald",
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                      value: productForm.color || "",
                      onChange: (e) => setProductForm({ ...productForm, color: e.target.value })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Fabric Material" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      placeholder: "e.g. 100% Silk, Cotton",
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                      value: productForm.material || "",
                      onChange: (e) => setProductForm({ ...productForm, material: e.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Brand / House" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      required: true,
                      className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                      value: productForm.house || productForm.brand || "",
                      onChange: (e) => setProductForm({ ...productForm, house: e.target.value, brand: e.target.value })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Review Queue Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: productForm.status,
                    onChange: (e) => setProductForm({ ...productForm, status: e.target.value }),
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DRAFT", children: "Queue (Draft)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PUBLISHED", children: "Published (Live)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIDDEN", children: "Hidden" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ARCHIVED", children: "Archived (Removed)" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] uppercase tracking-wider text-accent font-bold", children: "Pricing, Discount & Expiry Controls" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Actual Price (INR)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        required: true,
                        placeholder: "e.g. ₹1,25,000 or 125000",
                        className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: productForm.originalPrice || "",
                        onChange: (e) => setProductForm({ ...productForm, originalPrice: e.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Discounted Price (INR)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        required: true,
                        placeholder: "e.g. ₹85,000 or 85000",
                        className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: productForm.price || "",
                        onChange: (e) => setProductForm({ ...productForm, price: e.target.value })
                      }
                    )
                  ] })
                ] }),
                parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, "")) < parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, "")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/5 pt-3 space-y-3 animate-in fade-in duration-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold text-accent", children: "Discount Reversion Rules" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground", children: "Revert after N sales" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          placeholder: "e.g. 50",
                          className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                          value: productForm.discountLimitBuyers || "",
                          onChange: (e) => setProductForm({ ...productForm, discountLimitBuyers: e.target.value ? parseInt(e.target.value) : void 0 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground", children: "Revert on Date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "date",
                          className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                          value: productForm.discountExpiryDate || "",
                          onChange: (e) => setProductForm({ ...productForm, discountExpiryDate: e.target.value })
                        }
                      )
                    ] })
                  ] }),
                  productForm.discountBuyersCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground italic", children: [
                    "Current buyers at discount: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: productForm.discountBuyersCount })
                  ] })
                ] }),
                (() => {
                  const actual = parseFloat(String(productForm.originalPrice || "").replace(/[^0-9.]/g, ""));
                  const disc = parseFloat(String(productForm.price || "").replace(/[^0-9.]/g, ""));
                  const pct = actual && disc && actual > disc ? Math.round((actual - disc) / actual * 100) : 0;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs border-t border-white/5 pt-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Calculated Discount:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono font-bold text-sm px-2.5 py-1 rounded-full ${pct > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground"}`, children: pct > 0 ? `${pct}% Off` : "0% (No Discount)" })
                  ] });
                })()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[10px] uppercase tracking-wider text-accent font-bold", children: "Sizes & Stock Levels" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const currentSizes = productForm.sizes || [];
                        setProductForm({
                          ...productForm,
                          sizes: [...currentSizes, ""],
                          stockPerSize: { ...productForm.stockPerSize || {}, "": 10 }
                        });
                      },
                      className: "text-[9px] bg-accent text-white py-1 px-3 rounded-full font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors cursor-pointer",
                      children: "+ Add Size"
                    }
                  )
                ] }),
                (productForm.sizes || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic text-center py-2", children: "No sizes defined. Add at least one size." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1 scrollbar-thin", children: (productForm.sizes || []).map((size, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border border-white/10 rounded-xl bg-zinc-950/80 flex flex-col gap-2 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Size Variant #",
                      idx + 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const updatedSizes = (productForm.sizes || []).filter((_, i) => i !== idx);
                          const updatedStock = { ...productForm.stockPerSize || {} };
                          delete updatedStock[size];
                          setProductForm({
                            ...productForm,
                            sizes: updatedSizes,
                            stockPerSize: updatedStock
                          });
                        },
                        className: "text-rose-400 hover:text-rose-500 cursor-pointer text-xs",
                        title: "Delete size variant",
                        children: "✕"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] text-muted-foreground uppercase font-bold", children: "Size Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "e.g. S, XL, 32",
                          className: "w-full bg-surface border border-white/10 p-1.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono text-center",
                          value: size,
                          onChange: (e) => {
                            const newSizeName = e.target.value;
                            const oldSizeName = productForm.sizes[idx];
                            const updatedSizes = [...productForm.sizes];
                            updatedSizes[idx] = newSizeName;
                            const updatedStock = { ...productForm.stockPerSize };
                            const qty = updatedStock[oldSizeName] !== void 0 ? updatedStock[oldSizeName] : 10;
                            delete updatedStock[oldSizeName];
                            if (newSizeName) {
                              updatedStock[newSizeName] = qty;
                            }
                            setProductForm({
                              ...productForm,
                              sizes: updatedSizes,
                              stockPerSize: updatedStock
                            });
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] text-muted-foreground uppercase font-bold", children: "Stock Qty" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "Qty",
                          className: "w-full bg-surface border border-white/10 p-1.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono text-center",
                          value: (productForm.stockPerSize || {})[size] !== void 0 ? String(productForm.stockPerSize[size]) : "",
                          onChange: (e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                              setProductForm({
                                ...productForm,
                                stockPerSize: {
                                  ...productForm.stockPerSize || {},
                                  [size]: val === "" ? "" : parseInt(val)
                                }
                              });
                            }
                          }
                        }
                      )
                    ] })
                  ] })
                ] }, idx)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border border-white/10 rounded-2xl bg-white/5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[10px] uppercase tracking-wider text-accent font-bold font-serif", children: [
                  "Product Images (",
                  productForm.images ? productForm.images.length : 0,
                  ")"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-muted-foreground", children: "Add Image URL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "https://example.com/image.jpg",
                        className: "flex-1 bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                        value: imageUrlInput,
                        onChange: (e) => setImageUrlInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = imageUrlInput.trim();
                            if (val && !(productForm.images || []).includes(val)) {
                              const updated = [...productForm.images || [], val];
                              setProductForm({
                                ...productForm,
                                images: updated,
                                image: productForm.image || val
                              });
                              setImageUrlInput("");
                            }
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const val = imageUrlInput.trim();
                          if (val && !(productForm.images || []).includes(val)) {
                            const updated = [...productForm.images || [], val];
                            setProductForm({
                              ...productForm,
                              images: updated,
                              image: productForm.image || val
                            });
                            setImageUrlInput("");
                          }
                        },
                        className: "bg-accent/20 border border-accent/30 text-accent px-4 text-xs font-bold rounded-lg hover:bg-accent/30 transition-colors cursor-pointer",
                        children: "Add"
                      }
                    )
                  ] })
                ] }),
                (productForm.images || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic text-center py-2", children: "No images added. Please add at least one image URL." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin", children: (productForm.images || []).map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 border border-white/10 rounded-xl bg-zinc-950/80 backdrop-blur", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, className: "w-10 h-14 object-cover rounded-lg border border-white/10", onError: (e) => {
                    e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200";
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setProductForm({ ...productForm, image: img });
                      },
                      className: "p-1.5 rounded-lg hover:bg-white/5 transition-colors",
                      title: "Set as product thumbnail",
                      children: productForm.image === img ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-amber-400 fill-amber-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-white/40 hover:text-amber-400" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-[9px] font-mono text-muted-foreground truncate", children: img }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: idx === 0,
                        onClick: () => {
                          const next = [...productForm.images || []];
                          [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                          setProductForm({ ...productForm, images: next, image: next[0] });
                        },
                        className: "p-1 hover:text-accent disabled:opacity-30 text-xs cursor-pointer",
                        children: "▲"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: idx === (productForm.images || []).length - 1,
                        onClick: () => {
                          const next = [...productForm.images || []];
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          setProductForm({ ...productForm, images: next, image: next[0] });
                        },
                        className: "p-1 hover:text-accent disabled:opacity-30 text-xs cursor-pointer",
                        children: "▼"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const next = (productForm.images || []).filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, images: next, image: next[0] || "" });
                        },
                        className: "p-1 text-rose-400 hover:text-rose-500 text-xs ml-1 cursor-pointer",
                        children: "✕"
                      }
                    )
                  ] })
                ] }, idx)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "SKU Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    required: true,
                    className: "w-full bg-surface border border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                    value: productForm.sku,
                    onChange: (e) => setProductForm({ ...productForm, sku: e.target.value })
                  }
                )
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-3 pt-4 border-t border-white/5", children: viewOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setEditingProduct(null);
                setViewOnly(false);
              },
              className: "border border-white/10 text-foreground px-6 py-2.5 rounded-full hover:bg-white/5 font-semibold text-xs cursor-pointer",
              children: "Close"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowCloseConfirm(true),
                className: "border border-white/10 text-foreground px-5 py-2.5 rounded-full hover:bg-white/5 font-semibold text-xs cursor-pointer",
                children: "Discard"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90 rounded-full cursor-pointer", children: "Save Changes" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-l border-white/10 pl-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg font-bold", children: "Version Audit History" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-normal", children: "Every synchronization change detects and backs up variations. Restore past pricing or descriptions instantly." }),
          productVersions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-muted-foreground italic text-xs", children: "No modifications logged yet. Current version is initial sync state." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-h-[50vh] overflow-y-auto pr-2 font-sans", children: productVersions.map((vNode, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 rounded-2xl p-3.5 bg-white/5 text-xs space-y-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/5 pb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: new Date(vNode.versionTimestamp).toLocaleString() }),
              !viewOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleRestoreVersion(vNode.id),
                  className: "text-accent hover:underline font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Undo, { className: "w-3 h-3" }),
                    " Restore"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 font-mono text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Price:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
                  "₹",
                  vNode.price
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Category:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: vNode.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Brand:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: vNode.brand })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock Summary:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-200", children: vNode.stockSummary })
              ] })
            ] }),
            vNode.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground italic line-clamp-2 mt-2 leading-relaxed", children: [
              '"',
              vNode.description,
              '"'
            ] })
          ] }, idx)) })
        ] })
      ] }),
      showCloseConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-950 border border-amber-500/20 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-12 h-12 text-amber-400 mx-auto animate-bounce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-white", children: "Unsaved Changes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "You have unsaved changes in this product catalog entry. Do you want to save them before closing?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowCloseConfirm(false);
                document.querySelector("form")?.requestSubmit();
              },
              className: "bg-accent text-white py-2 px-4 rounded-xl text-xs font-bold hover:bg-accent/90 cursor-pointer",
              children: "Save & Close"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setShowCloseConfirm(false);
                setEditingProduct(null);
                setViewOnly(false);
              },
              className: "bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer",
              children: "Discard Changes"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowCloseConfirm(false),
              className: "bg-white/10 hover:bg-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold cursor-pointer",
              children: "Keep Editing"
            }
          )
        ] })
      ] }) })
    ] }) })
  ] });
}
const formatOrderDateTime = (dateStr) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strTime = String(hours).padStart(2, "0") + ":" + minutes + " " + ampm;
  return `${day} ${month} ${year} • ${strTime}`;
};
function ShopAdminPortal({ tab }) {
  const [filterMonth, setFilterMonth] = reactExports.useState("--");
  const [filterYear, setFilterYear] = reactExports.useState("--");
  const { state, createProduct, updateProduct, deleteProduct, updateOrderStatus, approveReturn, rejectReturn, updateReturnDetails, suspendCustomer, reactivateCustomer, addCoupon, removeCoupon, moderateReview, createVendor: createVendor2, deleteVendor: deleteVendor2, addWalletCredit, updateHomepageLayoutDraft, publishHomepageLayout, revertHomepageLayout, createBucket, updateBucket, deleteBucket, reorderBuckets } = usePortal();
  const productsList = state.products || [];
  const ordersList = Object.entries(state.orders).flatMap(
    ([userId, list]) => list.map((o) => ({ ...o, userId, customerName: state.users.find((u) => u.id === userId)?.firstName + " " + (state.users.find((u) => u.id === userId)?.lastName || "") }))
  );
  const filteredOrders = reactExports.useMemo(() => {
    let list = [...ordersList];
    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeB - timeA;
    });
    const isMonthUnselected = filterMonth === "--";
    const isYearUnselected = filterYear === "--";
    if (!isMonthUnselected) {
      const targetMonth = parseInt(filterMonth, 10);
      list = list.filter((o) => {
        const d = new Date(o.date);
        return !isNaN(d.getTime()) && d.getMonth() === targetMonth;
      });
    }
    if (!isYearUnselected) {
      const targetYear = parseInt(filterYear, 10);
      list = list.filter((o) => {
        const d = new Date(o.date);
        return !isNaN(d.getTime()) && d.getFullYear() === targetYear;
      });
    }
    return list;
  }, [ordersList, filterMonth, filterYear]);
  const returnsList = state.returns || [];
  const customersList = state.users || [];
  const couponsList = state.coupons || [];
  const vendorsList = state.vendors || [];
  const [catalogTab, setCatalogTab] = reactExports.useState("all");
  const [catalogSection, setCatalogSection] = reactExports.useState("main");
  const [selectedCatalogVendor, setSelectedCatalogVendor] = reactExports.useState("blankapparel");
  const [selectedProductIds, setSelectedProductIds] = reactExports.useState([]);
  const [tagInput, setTagInput] = reactExports.useState("");
  const [imageUrlInput, setImageUrlInput] = reactExports.useState("");
  const [showCloseConfirm, setShowCloseConfirm] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = reactExports.useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = reactExports.useState(null);
  const [selectedReturnDetails, setSelectedReturnDetails] = reactExports.useState(null);
  const [selectedProductPreview, setSelectedProductPreview] = reactExports.useState(null);
  const [rejectionModalReturnId, setRejectionModalReturnId] = reactExports.useState(null);
  const [selectedRejectionReason, setSelectedRejectionReason] = reactExports.useState("Return window expired");
  const [customRejectionText, setCustomRejectionText] = reactExports.useState("");
  const [pickupModalReturnId, setPickupModalReturnId] = reactExports.useState(null);
  const [pickupDateInput, setPickupDateInput] = reactExports.useState("");
  const [productForm, setProductForm] = reactExports.useState({
    name: "",
    house: "",
    price: "",
    image: "",
    images: [],
    tag: "",
    tags: [],
    gender: "Women",
    category: "Tops",
    categoriesList: [],
    sizes: ["S", "M", "L"],
    stockPerSize: { S: 10, M: 10, L: 10 },
    sku: "",
    originalPrice: "",
    description: "",
    material: "",
    color: "",
    discountLimitBuyers: void 0,
    discountExpiryDate: "",
    discountBuyersCount: 0,
    type: "",
    fabric: "",
    collections: "",
    visibility: "VISIBLE",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false,
    isRecommended: false,
    productInfo: ""
  });
  const [isAddingProduct, setIsAddingProduct] = reactExports.useState(false);
  const [couponForm, setCouponForm] = reactExports.useState({
    code: "",
    discount: 10,
    type: "percentage",
    expiryType: "limited",
    // "unlimited" | "limited"
    expiryDate: "2026-12-31",
    userLimitType: "limited",
    // "unlimited" | "limited"
    usageLimit: 100,
    userEligibility: "All"
  });
  const [isAddingCoupon, setIsAddingCoupon] = reactExports.useState(false);
  const [vendorForm, setVendorForm] = reactExports.useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: ""
  });
  const [isAddingVendor, setIsAddingVendor] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [importedProducts, setImportedProducts] = reactExports.useState([]);
  const [currentImportIndex, setCurrentImportIndex] = reactExports.useState(0);
  const [isReviewingImports, setIsReviewingImports] = reactExports.useState(false);
  const [isManualCreate, setIsManualCreate] = reactExports.useState(false);
  const [productToDeleteIndex, setProductToDeleteIndex] = reactExports.useState(null);
  const [sortField, setSortField] = reactExports.useState(null);
  const [sortDirection, setSortDirection] = reactExports.useState("desc");
  const [showSortDropdown, setShowSortDropdown] = reactExports.useState(false);
  const [newSizeName, setNewSizeName] = reactExports.useState("");
  const [newSizeQty, setNewSizeQty] = reactExports.useState(10);
  const [newImageUrl, setNewImageUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (vendorsList.length > 0 && (!selectedCatalogVendor || !vendorsList.some((v) => v.id === selectedCatalogVendor))) {
      setSelectedCatalogVendor(vendorsList[0].id);
    }
  }, [vendorsList, selectedCatalogVendor]);
  const [draftLayout, setDraftLayout] = reactExports.useState(null);
  const [activeSectionId, setActiveSectionId] = reactExports.useState("announcement");
  const [expandedSlideIndexMap, setExpandedSlideIndexMap] = reactExports.useState({});
  const [previewDevice, setPreviewDevice] = reactExports.useState("desktop");
  const [editingBucket, setEditingBucket] = reactExports.useState(null);
  const [isAddingBucket, setIsAddingBucket] = reactExports.useState(false);
  const [bucketForm, setBucketForm] = reactExports.useState({
    name: "",
    productIds: [],
    starProductId: ""
  });
  const [bucketProductSearch, setBucketProductSearch] = reactExports.useState("");
  const [rearrangeMode, setRearrangeMode] = reactExports.useState(false);
  const [draggedIdx, setDraggedIdx] = reactExports.useState(null);
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
  };
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) return;
    const reordered = [...state.buckets || []];
    const [removed] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIndex, 0, removed);
    reorderBuckets(reordered);
    setDraggedIdx(null);
  };
  reactExports.useEffect(() => {
    if (state && state.homepageLayoutDraft && !draftLayout) {
      const layoutCopy = { ...state.homepageLayoutDraft };
      if (!layoutCopy.assistant) {
        layoutCopy.assistant = { enabled: true };
      }
      if (!layoutCopy.chatbot) {
        layoutCopy.chatbot = { enabled: true };
      }
      setDraftLayout(layoutCopy);
    }
  }, [state, draftLayout]);
  reactExports.useEffect(() => {
    if (!draftLayout?.announcement?.countdownActive || !draftLayout?.announcement?.enabled) return;
    const endsAt = new Date(draftLayout.announcement.countdownEndsAt);
    if (isNaN(endsAt.getTime())) return;
    const checkExpiry = () => {
      if (endsAt.getTime() <= Date.now()) {
        setDraftLayout((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            announcement: {
              ...prev.announcement,
              enabled: false
            }
          };
          updateHomepageLayoutDraft(updated);
          return updated;
        });
      }
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 1e3);
    return () => clearInterval(interval);
  }, [draftLayout?.announcement?.countdownActive, draftLayout?.announcement?.countdownEndsAt, draftLayout?.announcement?.enabled]);
  const [modal, setModal] = reactExports.useState(null);
  const triggerModal = (type, title, desc, action) => {
    setModal({ type, title, desc, action });
  };
  const handleEditProduct = (p) => {
    setEditingProduct(p);
    const tagList = p.tag ? p.tag.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const productDraft = {
      id: p.id,
      name: p.name,
      house: p.house || p.brand || "",
      price: p.price,
      image: p.image,
      tag: p.tag || "",
      tags: p.tags || tagList,
      gender: p.gender || "Women",
      category: p.category || "Tops",
      categoriesList: p.categoriesList || (p.category ? [p.category] : []),
      sizes: p.sizes || ["S", "M", "L"],
      stockPerSize: p.stockPerSize || { S: 10, M: 10, L: 10 },
      sku: p.sku || `SKU-${Math.floor(1e4 + Math.random() * 9e4)}`,
      originalPrice: p.originalPrice || p.price,
      description: p.description || "",
      material: p.material || "",
      color: p.color || "",
      images: p.images || [],
      discountLimitBuyers: p.discountLimitBuyers,
      discountExpiryDate: p.discountExpiryDate || "",
      discountBuyersCount: p.discountBuyersCount || 0,
      type: p.type || "",
      fabric: p.fabric || "",
      collections: p.collections || "",
      visibility: p.visibility || "VISIBLE",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      seoKeywords: p.seoKeywords || "",
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isTrending: p.isTrending || false,
      isRecommended: p.isRecommended || false,
      productInfo: p.productInfo || ""
    };
    setImportedProducts([productDraft]);
    setCurrentImportIndex(0);
    setIsReviewingImports(true);
  };
  const handleDeleteProduct = (id) => {
    triggerModal("danger", "Delete Product", "Are you sure you want to permanently delete this product? This action cannot be undone.", () => {
      deleteProduct(id);
    });
  };
  const handleCouponSubmit = (e) => {
    e.preventDefault();
    const finalExpiryDate = couponForm.expiryType === "unlimited" ? "unlimited" : couponForm.expiryDate;
    const finalUsageLimit = couponForm.userLimitType === "unlimited" ? -1 : couponForm.usageLimit;
    addCoupon({
      code: couponForm.code,
      discount: couponForm.discount,
      type: couponForm.type,
      expiryDate: finalExpiryDate,
      usageLimit: finalUsageLimit,
      userEligibility: couponForm.userEligibility
    });
    setIsAddingCoupon(false);
    setCouponForm({
      code: "",
      discount: 10,
      type: "percentage",
      expiryType: "limited",
      expiryDate: "2026-12-31",
      userLimitType: "limited",
      usageLimit: 100,
      userEligibility: "All"
    });
    triggerModal("success", "Coupon Created", "New coupon successfully generated and active.", () => {
    });
  };
  const handleDownloadTemplate = () => {
    const headers = [
      "Product Name",
      "Description",
      "Category",
      "Gender",
      "Colour",
      "Fabric Material",
      "Product Information",
      "Brand",
      "Product Type",
      "Sizes",
      "Quantities",
      "Price",
      "Discounted Price",
      "Images URLs"
    ];
    const data = [
      [
        "Classic Cotton Tee",
        "A premium quality daily-wear classic cotton t-shirt with breathable fabric.",
        "T-Shirts",
        "Unisex",
        "Sage Green",
        "100% Organic Cotton",
        "Product details\nTop highlights\nMaterial composition	60% Cotton, 40% Polyester\nPattern	Solid\nFit type	Regular Fit\nSleeve type	Half Sleeve\nCollar style	Polo Collar\nLength	Standard Length\nCountry of Origin	India\n\nAbout this item\nNeck : Polo Neck\nFit : Regular Fit\nMaterial : 60% Cotton and 40% Polyester\nOccasion : Casual\nPattern : Solid",
        "Blank Apparel",
        "Casual T-Shirt",
        "S,M,L",
        "12,5,10",
        "1299",
        "999",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
      ],
      [
        "Luxe Linen Shirt",
        "Relaxed fit linen shirt perfect for summer outings and casual styling.",
        "Shirts",
        "Men",
        "Off-White",
        "Pure Linen",
        "Product details\nTop highlights\nMaterial composition	100% Linen\nPattern	Solid\nFit type	Relaxed Fit\nSleeve type	Long Sleeve\nCollar style	Spread Collar\n\nAbout this item\nStyle Name	Modern\nNeck Style	Collared Neck\nSleeve Type	Long Sleeve",
        "Atelier Royale",
        "Casual Shirt",
        "M,L",
        "10,12",
        "2499",
        "1999",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"
      ]
    ];
    const ws = utils.aoa_to_sheet([headers, ...data]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Products Template");
    writeFileSync(wb, "products_import_template.xlsx");
    toast.success("Excel template downloaded successfully!");
  };
  const handleExcelImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result);
        const workbook = readSync(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length <= 1) {
          toast.error("The Excel sheet is empty or contains no product rows.");
          return;
        }
        const headers = jsonData[0].map((h) => String(h || "").trim().toLowerCase());
        const rows = jsonData.slice(1);
        const colIndex = (name) => headers.findIndex((h) => h === name.toLowerCase());
        const idxName = colIndex("Product Name");
        const idxDesc = colIndex("Description");
        const idxCat = colIndex("Category");
        const idxGender = colIndex("Gender");
        const idxColor = colIndex("Colour");
        const idxMaterial = colIndex("Fabric Material");
        const idxBrand = colIndex("Brand");
        const idxType = colIndex("Product Type");
        const idxSizes = colIndex("Sizes");
        const idxQuantities = colIndex("Quantities");
        const idxPrice = colIndex("Price");
        const idxDiscountedPrice = colIndex("Discounted Price");
        const idxImages = colIndex("Images URLs");
        const idxProductInfo = headers.findIndex((h) => h.includes("product information") || h.includes("product info") || h === "information");
        if (idxName === -1) {
          toast.error("Could not find 'Product Name' column in Excel file.");
          return;
        }
        const parsed = [];
        rows.forEach((row) => {
          if (!row || row.length === 0 || !row[idxName]) return;
          const sizesStr = idxSizes !== -1 ? String(row[idxSizes] || "").trim() : "S,M,L";
          const quantitiesStr = idxQuantities !== -1 ? String(row[idxQuantities] || "").trim() : "10,10,10";
          const sizesList = sizesStr.split(",").map((s) => s.trim()).filter(Boolean);
          const quantitiesList = quantitiesStr.split(",").map((q) => parseInt(q.trim()) || 0);
          const stockPerSize = {};
          sizesList.forEach((sz, idx) => {
            stockPerSize[sz] = quantitiesList[idx] !== void 0 ? quantitiesList[idx] : 10;
          });
          const rawPrice = idxPrice !== -1 ? String(row[idxPrice] || "").replace(/[^0-9.]/g, "") : "";
          const rawDiscountedPrice = idxDiscountedPrice !== -1 ? String(row[idxDiscountedPrice] || "").replace(/[^0-9.]/g, "") : "";
          let price = rawPrice;
          let originalPrice = rawPrice;
          if (rawDiscountedPrice) {
            price = rawDiscountedPrice;
            originalPrice = rawPrice;
          } else {
            price = rawPrice;
            originalPrice = "";
          }
          const imagesStr = idxImages !== -1 ? String(row[idxImages] || "").trim() : "";
          const imagesList = imagesStr.split(",").map((img) => img.trim()).filter(Boolean);
          const mainImage = imagesList[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";
          const rawCat = idxCat !== -1 ? String(row[idxCat] || "").trim() : "Tops";
          let category = "Tops";
          const lowerCat = rawCat.toLowerCase();
          if (lowerCat.includes("shirt")) {
            category = lowerCat.includes("t-shirt") || lowerCat.includes("tee") ? "T-Shirts" : "Shirts";
          } else if (lowerCat.includes("bottom") || lowerCat.includes("pant") || lowerCat.includes("jean")) {
            category = "Bottoms";
          } else if (lowerCat.includes("access")) {
            category = "Accessories";
          } else if (lowerCat.includes("couture") || lowerCat.includes("dress")) {
            category = "Couture";
          } else if (lowerCat.includes("top") || lowerCat.includes("corset")) {
            category = "Tops";
          } else {
            category = rawCat;
          }
          const rawGender = idxGender !== -1 ? String(row[idxGender] || "").trim() : "Unisex";
          let gender = "Unisex";
          if (rawGender.toLowerCase().startsWith("wom")) gender = "Women";
          else if (rawGender.toLowerCase().startsWith("men")) gender = "Men";
          const product = {
            name: String(row[idxName] || ""),
            description: idxDesc !== -1 ? String(row[idxDesc] || "") : "",
            category,
            gender,
            color: idxColor !== -1 ? String(row[idxColor] || "") : "",
            material: idxMaterial !== -1 ? String(row[idxMaterial] || "") : "",
            fabric: idxMaterial !== -1 ? String(row[idxMaterial] || "") : "",
            house: idxBrand !== -1 ? String(row[idxBrand] || "") : "Blank Apparel",
            type: idxType !== -1 ? String(row[idxType] || "") : "",
            productInfo: idxProductInfo !== -1 ? String(row[idxProductInfo] || "") : "",
            sizes: sizesList.length > 0 ? sizesList : ["S", "M", "L"],
            stockPerSize,
            price: price ? `₹${parseInt(price).toLocaleString()}` : "₹999",
            originalPrice: originalPrice ? `₹${parseInt(originalPrice).toLocaleString()}` : "",
            image: mainImage,
            images: imagesList.length > 0 ? imagesList : [mainImage],
            sku: `SKU-${Math.floor(1e4 + Math.random() * 9e4)}`,
            tag: "New",
            tags: ["Imported"],
            visibility: "VISIBLE",
            isFeatured: false,
            isNewArrival: true,
            isTrending: false,
            isRecommended: false
          };
          parsed.push(product);
        });
        if (parsed.length === 0) {
          toast.error("No valid product rows parsed from Excel sheet.");
          return;
        }
        setImportedProducts(parsed);
        setCurrentImportIndex(0);
        setIsReviewingImports(true);
        toast.success(`Successfully parsed ${parsed.length} products! Please review them.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse Excel file. Make sure it is a valid format.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };
  const handleSaveImportedProducts = (publishLive = true) => {
    importedProducts.forEach((p) => {
      const actual = parseFloat(String(p.originalPrice || "").replace(/[^0-9.]/g, ""));
      const disc = parseFloat(String(p.price || "").replace(/[^0-9.]/g, ""));
      const discountPct = actual && disc && actual > disc ? Math.round((actual - disc) / actual * 100) : 0;
      const finalForm = {
        ...p,
        discount: discountPct,
        status: publishLive ? "PUBLISHED" : "UNPUBLISHED",
        visibility: publishLive ? "VISIBLE" : "HIDDEN"
      };
      if (editingProduct) {
        updateProduct(editingProduct.id, finalForm);
      } else {
        createProduct(finalForm);
      }
    });
    setIsReviewingImports(false);
    setImportedProducts([]);
    if (editingProduct) {
      triggerModal("success", "Product Updated", "The product has been successfully updated in the catalog.", () => {
      });
      setEditingProduct(null);
    } else if (isManualCreate) {
      const msg = publishLive ? `Successfully created and published ${importedProducts.length} new products to the catalog.` : `Successfully created ${importedProducts.length} new draft products (unpublished) in the catalog.`;
      triggerModal("success", "Products Created", msg, () => {
      });
      setIsManualCreate(false);
    } else {
      const msg = publishLive ? `Successfully imported and published ${importedProducts.length} products to the catalog.` : `Successfully imported ${importedProducts.length} draft products (unpublished) to the catalog.`;
      triggerModal("success", "Products Imported", msg, () => {
      });
    }
  };
  const updateImportedProductField = (field, value) => {
    const updated = [...importedProducts];
    updated[currentImportIndex] = {
      ...updated[currentImportIndex],
      [field]: value
    };
    setImportedProducts(updated);
  };
  const updateImportedProductStock = (size, qty) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...prod.stockPerSize, [size]: qty };
    const newSizes = Object.keys(newStock).filter((sz) => newStock[sz] >= 0);
    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
  };
  const handlePrevImport = () => {
    if (currentImportIndex > 0) {
      setCurrentImportIndex(currentImportIndex - 1);
    }
  };
  const handleNextImport = () => {
    if (currentImportIndex < importedProducts.length - 1) {
      setCurrentImportIndex(currentImportIndex + 1);
    }
  };
  const handleAddSizeToImport = () => {
    const size = newSizeName.trim().toUpperCase();
    if (!size) return;
    const qty = Math.max(0, newSizeQty);
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...prod.stockPerSize || {}, [size]: qty };
    const newSizes = Object.keys(newStock);
    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
    setNewSizeName("");
    setNewSizeQty(10);
    toast.success(`Size ${size} added successfully.`);
  };
  const handleRemoveSizeFromImport = (size) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const newStock = { ...prod.stockPerSize || {} };
    delete newStock[size];
    const newSizes = Object.keys(newStock);
    updated[currentImportIndex] = {
      ...prod,
      stockPerSize: newStock,
      sizes: newSizes
    };
    setImportedProducts(updated);
    toast.success(`Size ${size} removed.`);
  };
  const handleAddImageToImport = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...prod.images || []];
    if (imagesList.includes(url)) {
      toast.error("Image URL already exists.");
      return;
    }
    imagesList.push(url);
    const mainImage = prod.image || url;
    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: mainImage
    };
    setImportedProducts(updated);
    setNewImageUrl("");
    toast.success("Image URL added.");
  };
  const handleRemoveImageFromImport = (urlToRemove) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = (prod.images || []).filter((url) => url !== urlToRemove);
    const mainImage = prod.image === urlToRemove ? imagesList[0] || "" : prod.image;
    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: mainImage
    };
    setImportedProducts(updated);
    toast.success("Image removed.");
  };
  const handleMoveImageLeft = (idx) => {
    if (idx === 0) return;
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...prod.images || []];
    const temp = imagesList[idx];
    imagesList[idx] = imagesList[idx - 1];
    imagesList[idx - 1] = temp;
    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: imagesList[0] || ""
    };
    setImportedProducts(updated);
    toast.success("Image moved left.");
  };
  const handleMoveImageRight = (idx) => {
    const updated = [...importedProducts];
    const prod = updated[currentImportIndex];
    const imagesList = [...prod.images || []];
    if (idx === imagesList.length - 1) return;
    const temp = imagesList[idx];
    imagesList[idx] = imagesList[idx + 1];
    imagesList[idx + 1] = temp;
    updated[currentImportIndex] = {
      ...prod,
      images: imagesList,
      image: imagesList[0] || ""
    };
    setImportedProducts(updated);
    toast.success("Image moved right.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    modal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-3.5 h-3.5 rounded-full ${modal.type === "success" ? "bg-emerald-400" : modal.type === "danger" ? "bg-rose-400" : "bg-amber-400"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: modal.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: modal.desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setModal(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              modal.action();
              setModal(null);
            },
            className: `editorial-label px-5 py-2.5 text-white ${modal.type === "danger" ? "bg-rose-600 hover:bg-rose-700" : "bg-accent hover:bg-accent/90"}`,
            children: "Confirm"
          }
        )
      ] })
    ] }) }),
    selectedProductPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass bg-background/95 border border-accent/20 max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Product Preview Curation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedProductPreview(null), className: "text-muted-foreground hover:text-foreground cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6 text-xs leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-40 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden border border-black/10 dark:border-white/5 bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedProductPreview.image, className: "w-full h-full object-cover", alt: "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-black/5 dark:border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-foreground", children: selectedProductPreview.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-accent font-semibold mt-0.5", children: selectedProductPreview.house })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: selectedProductPreview.category })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Gender" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: selectedProductPreview.gender })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-serif font-bold text-accent", children: selectedProductPreview.price })
            ] }),
            selectedProductPreview.originalPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Original Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground line-through font-serif", children: selectedProductPreview.originalPrice })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-b border-black/5 dark:border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Colour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedProductPreview.color || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Fabric" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: selectedProductPreview.fabricMaterial || selectedProductPreview.material || selectedProductPreview.fabric || "—" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Sizes & Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1 font-mono", children: [
              Object.entries(selectedProductPreview.stockPerSize || {}).map(([sz, qty]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[10px]", children: [
                sz,
                ": ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-accent", children: qty })
              ] }, sz)),
              Object.keys(selectedProductPreview.stockPerSize || {}).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "No stock defined" })
            ] })
          ] }),
          selectedProductPreview.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground block text-[9px] uppercase font-bold", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground leading-normal line-clamp-3 italic", children: [
              '"',
              selectedProductPreview.description,
              '"'
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4 border-t border-black/10 dark:border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setSelectedProductPreview(null), children: "Close Preview" }) })
    ] }) }),
    selectedCustomerDetails && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Customer Curation Dossier" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCustomerDetails(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 text-xs leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Account Identity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ID:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 font-mono", children: selectedCustomerDetails.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Name:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 font-semibold", children: [
              selectedCustomerDetails.firstName,
              " ",
              selectedCustomerDetails.lastName
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.phone || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Registered:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.registeredAt })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Styling Parameters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Gender:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.gender || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "DOB:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.dob || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Country:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedCustomerDetails.country || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: selectedCustomerDetails.status, tone: selectedCustomerDetails.status === "Active" ? "success" : "danger" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Wallet:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 font-semibold text-accent", children: [
              "₹",
              (state.wallets[selectedCustomerDetails.id] ?? 0).toLocaleString()
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Saved Shipping Destinations" }),
        (state.addresses[selectedCustomerDetails.id] ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "No addresses saved." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-4 space-y-1 text-muted-foreground", children: (state.addresses[selectedCustomerDetails.id] ?? []).map((addr, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: addr }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Order History" }),
        (state.orders[selectedCustomerDetails.id] ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "No orders placed yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto pr-2 divide-y divide-white/5", children: (state.orders[selectedCustomerDetails.id] ?? []).map((ord) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 flex justify-between items-center text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold font-mono", children: [
              ord.id,
              " · ",
              ord.date
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: ord.items.map((it) => `${it.name} (${it.selectedSize}) x${it.qty}`).join(", ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-accent", children: [
              "₹",
              ord.total.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: ord.status })
          ] })
        ] }, ord.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setSelectedCustomerDetails(null), children: "Close dossier" }) })
    ] }) }),
    selectedOrderDetails && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Order Delivery Dossier" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedOrderDetails(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Order ID:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 font-mono font-bold text-accent", children: selectedOrderDetails.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Order Date & Time:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 font-semibold", children: formatOrderDateTime(selectedOrderDetails.date) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Customer ID:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                const cust = state.users.find((u) => u.id === selectedOrderDetails.userId);
                if (cust) {
                  setSelectedCustomerDetails(cust);
                  setSelectedOrderDetails(null);
                }
              },
              className: "font-mono font-bold text-accent hover:underline text-left cursor-pointer",
              children: selectedOrderDetails.userId
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Customer Name:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: selectedOrderDetails.customerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Delivery Address:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 leading-normal", children: selectedOrderDetails.address })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-white/5 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Payment / Total:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 font-serif font-bold text-accent", children: [
            "₹",
            selectedOrderDetails.total.toLocaleString(),
            " (",
            selectedOrderDetails.paymentStatus || "Paid",
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Items of the Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 border border-white/10 rounded-2xl p-3 bg-white/5 max-h-40 overflow-y-auto", children: selectedOrderDetails.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-3 py-1 first:pt-0 border-t border-white/5 first:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, className: "w-8 h-10 object-cover rounded-md border border-white/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                  item.house,
                  " · Size: ",
                  item.selectedSize || "M"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: item.price }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                "Qty: ",
                item.qty
              ] })
            ] })
          ] }, idx)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setSelectedOrderDetails(null), children: "Close dossier" }) })
    ] }) }),
    rejectionModalReturnId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-5 h-5 text-rose-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Reject Return Request" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRejectionModalReturnId(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Select Rejection Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: selectedRejectionReason,
              onChange: (e) => setSelectedRejectionReason(e.target.value),
              className: "w-full bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Return window expired", children: "Return window expired" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Product used or damaged by customer", children: "Product used or damaged by customer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Missing original tags", children: "Missing original tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Missing original packaging", children: "Missing original packaging" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Insufficient evidence", children: "Insufficient evidence" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Non-returnable product", children: "Non-returnable product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", children: "Other" })
              ]
            }
          )
        ] }),
        selectedRejectionReason === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Custom Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              required: true,
              placeholder: "Provide specific details for rejection...",
              value: customRejectionText,
              onChange: (e) => setCustomRejectionText(e.target.value),
              className: "w-full h-24 bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg resize-none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setRejectionModalReturnId(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              const finalReason = selectedRejectionReason === "Other" ? customRejectionText : selectedRejectionReason;
              rejectReturn(rejectionModalReturnId, finalReason);
              setRejectionModalReturnId(null);
              setCustomRejectionText("");
            },
            className: "editorial-label bg-rose-600 hover:bg-rose-700 text-white px-5 py-2",
            children: "Reject Request"
          }
        )
      ] })
    ] }) }),
    pickupModalReturnId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-sm w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "w-5 h-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Schedule Pickup" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPickupModalReturnId(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider font-mono", children: "Pickup Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: pickupDateInput,
            onChange: (e) => setPickupDateInput(e.target.value),
            className: "w-full bg-surface border border-white/10 p-2 text-sm outline-none text-foreground rounded-lg"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setPickupModalReturnId(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (!pickupDateInput) return;
              updateReturnDetails(pickupModalReturnId, {
                status: "Pickup Scheduled",
                pickupDate: pickupDateInput
              });
              setPickupModalReturnId(null);
              setPickupDateInput("");
            },
            className: "editorial-label bg-accent text-white px-5 py-2",
            children: "Confirm Pickup"
          }
        )
      ] })
    ] }) }),
    selectedReturnDetails && (() => {
      const activeReturn = state.returns.find((r) => r.id === selectedReturnDetails.id);
      if (!activeReturn) return null;
      const customer = state.users.find((u) => u.id === activeReturn.customerId);
      const order = Object.values(state.orders).flat().find((o) => o.id === activeReturn.orderId);
      const statuses = [
        "Return Requested",
        "Under Review",
        "Return Approved",
        "Pickup Scheduled",
        "Item Received",
        "Refund Processed",
        "Refund Completed"
      ];
      let currentStepIndex = -1;
      if (activeReturn.status === "Pending") currentStepIndex = 0;
      else if (activeReturn.status === "Under Review") currentStepIndex = 1;
      else if (activeReturn.status === "Return Approved") currentStepIndex = 2;
      else if (activeReturn.status === "Pickup Scheduled") currentStepIndex = 3;
      else if (activeReturn.status === "Item Received") currentStepIndex = 4;
      else if (activeReturn.status === "Refund Processed") currentStepIndex = 5;
      else if (activeReturn.status === "Refund Completed" || activeReturn.status === "Approved") currentStepIndex = 6;
      else if (activeReturn.status === "Rejected") currentStepIndex = -2;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 text-accent animate-spin-slow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: "Return Request Dossier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5", children: [
                "ID: ",
                activeReturn.id
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedReturnDetails(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px] border-b border-white/5 pb-1", children: "Customer Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 leading-normal", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Name:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: activeReturn.customerName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ID:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      if (customer) {
                        setSelectedCustomerDetails(customer);
                        setSelectedReturnDetails(null);
                      }
                    },
                    className: "font-mono text-accent hover:underline",
                    children: activeReturn.customerId
                  }
                ) })
              ] }),
              customer && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Email:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: customer.email })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: customer.phone || "—" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px] border-b border-white/5 pb-1", children: "Order & Item Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 leading-normal", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Order ID:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      if (order) {
                        setSelectedOrderDetails(order);
                        setSelectedReturnDetails(null);
                      }
                    },
                    className: "font-mono text-accent hover:underline",
                    children: activeReturn.orderId
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Product:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-right", children: activeReturn.productName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Size:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: activeReturn.selectedSize || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Quantity:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: activeReturn.qty || 1 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-white/5 pt-1.5 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Refund Method:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-amber-200", children: activeReturn.refundMethod || "Original Payment Method" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Refund Amount:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif font-bold text-accent", children: [
                  "₹",
                  activeReturn.refundAmount.toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Return Request Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 rounded-2xl p-4 bg-white/5 text-xs space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Reason:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 font-semibold text-white", children: activeReturn.reason })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Description:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-3 leading-relaxed text-muted-foreground italic", children: [
                '"',
                activeReturn.comment || "No comment provided.",
                '"'
              ] })
            ] }),
            activeReturn.rejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 border-t border-rose-500/20 pt-2 text-rose-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Rejection:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 font-semibold", children: activeReturn.rejectionReason })
            ] }),
            activeReturn.pickupDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 border-t border-white/5 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Pickup:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-3 text-emerald-300 font-mono", children: [
                "Scheduled for ",
                activeReturn.pickupDate
              ] })
            ] })
          ] })
        ] }),
        (activeReturn.images && activeReturn.images.length > 0 || activeReturn.videos && activeReturn.videos.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Evidence Uploaded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-white/10 rounded-2xl p-4 bg-white/5 flex flex-wrap gap-3", children: [
            activeReturn.images?.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: img, target: "_blank", rel: "noopener noreferrer", className: "group relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, className: "w-full h-full object-cover group-hover:scale-105 transition-transform" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-white", children: "View" })
            ] }, i)),
            activeReturn.videos?.map((vid, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-24 h-16 rounded-lg border border-white/10 bg-black flex flex-col justify-center items-center text-[8px] text-muted-foreground p-1 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: "Video Evidence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate w-full mt-1", children: vid.split("/").pop() })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-accent uppercase tracking-wider text-[10px]", children: "Return Status Timeline" }),
          activeReturn.status === "Rejected" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border border-rose-500/20 rounded-xl bg-rose-500/5 text-rose-300 text-center flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Return Request Rejected: ",
              activeReturn.rejectionReason
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1 relative pt-4 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-7 left-[7%] right-[7%] h-0.5 bg-white/10 -z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-accent shadow-[0_0_8px_rgba(217,119,6,0.5)] transition-all duration-500",
                style: { width: `${currentStepIndex / 6 * 100}%` }
              }
            ) }),
            statuses.map((stepName, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${isActive ? "bg-accent border-accent text-white shadow-[0_0_12px_#d97706]" : isCompleted ? "bg-accent/20 border-accent text-accent" : "bg-zinc-950 border-white/20 text-muted-foreground"}`,
                    children: isCompleted ? "✓" : idx + 1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-[8px] leading-tight font-semibold tracking-wider transition-colors max-w-[80px] ${isActive ? "text-accent font-bold" : isCompleted ? "text-white" : "text-muted-foreground"}`,
                    children: stepName
                  }
                )
              ] }, stepName);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-4 border-t border-white/10 justify-end", children: [
          activeReturn.status !== "Rejected" && activeReturn.status !== "Refund Completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => updateReturnDetails(activeReturn.id, { status: "Under Review" }),
                className: "bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-white/10",
                children: "Request More Info"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => updateReturnDetails(activeReturn.id, { status: "Return Approved" }),
                className: "bg-emerald-600/35 hover:bg-emerald-600 text-emerald-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-emerald-500/20",
                children: "Approve Return"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setPickupModalReturnId(activeReturn.id);
                  setPickupDateInput(new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString().split("T")[0]);
                },
                className: "bg-blue-600/35 hover:bg-blue-600 text-blue-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-blue-500/20",
                children: "Schedule Pickup"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => updateReturnDetails(activeReturn.id, { status: "Item Received" }),
                className: "bg-indigo-600/35 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-indigo-500/20",
                children: "Mark Item Received"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  triggerModal("success", "Issue Refund & Complete Return", `Approve refund and complete payout of ₹${activeReturn.refundAmount.toLocaleString()}? This will instantly credit the customer wallet/account and mark it completed.`, () => {
                    approveReturn(activeReturn.id);
                  });
                },
                className: "bg-accent hover:bg-accent/90 text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg shadow-lg",
                children: "Issue Refund"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setRejectionModalReturnId(activeReturn.id);
                  setSelectedRejectionReason("Return window expired");
                  setCustomRejectionText("");
                },
                className: "bg-rose-600/35 hover:bg-rose-600 text-rose-200 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded-lg border border-rose-500/20",
                children: "Reject Return"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => setSelectedReturnDetails(null), children: "Close Dossier" })
        ] })
      ] }) });
    })(),
    tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        ["Live Users", "148", "Active right now"],
        ["Active Sessions", "3,489", "Today's traffic"],
        ["Orders Today", ordersList.filter((o) => o.date.slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).length.toString(), "Real-time updates"],
        ["Revenue Today", "₹" + ordersList.filter((o) => o.date.slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).reduce((sum, o) => sum + o.total, 0).toLocaleString(), "Paid orders"]
      ].map(([k, v, d]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-3xl mt-3", children: v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-accent mt-2 uppercase tracking-wider", children: d })
      ] }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Top Categories & Sales" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [
            ["Tops & Corsets", "₹12,45,000", "72% conversion"],
            ["Bottoms & Pants", "₹8,90,000", "65% conversion"],
            ["Couture Dresses", "₹24,50,000", "42% conversion"],
            ["Shirts & Tees", "₹4,12,000", "88% conversion"]
          ].map(([cat, rev, rate]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border-subtle pb-3 last:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: cat }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: rate })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-sm", children: rev })
          ] }, cat)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Refund Metrics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Total Returns Queue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold text-lg", children: returnsList.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Pending Approval" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-amber-300 font-bold", children: returnsList.filter((r) => r.status === "Pending").length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Approved Refunds" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-emerald-300 font-bold", children: returnsList.filter((r) => r.status === "Approved").length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border-subtle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground italic", children: [
              "Razorpay Auto-Payout integration status: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-semibold uppercase tracking-widest text-[9px]", children: "ONLINE" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    tab === "buckets" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Buckets Curation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Group catalog products into editorial sets with star-product thumbnails" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setRearrangeMode(!rearrangeMode),
              className: `editorial-label px-5 py-2.5 flex items-center gap-2 border rounded-sm cursor-pointer ${rearrangeMode ? "bg-amber-600 border-amber-600 text-white hover:bg-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.3)]" : "border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent"}`,
              children: rearrangeMode ? "Exit Rearrange" : "Rearrange Order"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setEditingBucket(null);
                setBucketForm({ name: "", productIds: [], starProductId: "" });
                setBucketProductSearch("");
                setIsAddingBucket(!isAddingBucket);
              },
              className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                " ",
                isAddingBucket ? "Collapse Form" : "Create Bucket"
              ]
            }
          )
        ] })
      ] }),
      isAddingBucket && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in slide-in-from-top-4 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg", children: editingBucket ? "Edit Curation Bucket" : "Create New Curation Bucket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
              if (!bucketForm.name.trim()) return;
              if (editingBucket) {
                updateBucket(editingBucket.id, bucketForm);
                setEditingBucket(null);
                setIsAddingBucket(false);
                triggerModal("success", "Bucket Updated", "The curation bucket has been updated successfully.", () => {
                });
              } else {
                createBucket(bucketForm.name, bucketForm.productIds, bucketForm.starProductId);
                setIsAddingBucket(false);
                triggerModal("success", "Bucket Created", "New curation bucket successfully generated.", () => {
                });
              }
              setBucketForm({ name: "", productIds: [], starProductId: "" });
              setBucketProductSearch("");
            },
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Bucket Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    required: true,
                    className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground",
                    placeholder: "e.g. Summer Essentials, Red Carpet Couture",
                    value: bucketForm.name,
                    onChange: (e) => setBucketForm({ ...bucketForm, name: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Select Products for Bucket" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      placeholder: "Search products by name or brand/house...",
                      className: "w-full bg-surface border border-border-subtle pl-10 pr-4 py-2 text-xs outline-none text-foreground rounded-xl mb-2",
                      value: bucketProductSearch,
                      onChange: (e) => setBucketProductSearch(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 overflow-y-auto border border-border-subtle bg-surface p-2 rounded-xl space-y-1.5 scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-2", children: productsList.filter((p) => {
                  const isPublished = !p.status || p.status === "PUBLISHED" || p.status === "published";
                  if (!isPublished) return false;
                  if (!bucketProductSearch) return true;
                  const keywords = bucketProductSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
                  if (keywords.length === 0) return true;
                  let score = 0;
                  keywords.forEach((kw) => {
                    const name = String(p.name || "").toLowerCase();
                    const house = String(p.house || "").toLowerCase();
                    const category = String(p.category || "").toLowerCase();
                    const gender = String(p.gender || "").toLowerCase();
                    const fabric = String(p.fabricMaterial || p.material || p.fabric || "").toLowerCase();
                    const description = String(p.description || "").toLowerCase();
                    const color = String(p.color || "").toLowerCase();
                    const type = String(p.type || "").toLowerCase();
                    const sku = String(p.sku || "").toLowerCase();
                    const sizes = (p.sizes || []).map((s) => String(s || "").toLowerCase());
                    const sizesStr = sizes.join(",");
                    const stocks = Object.entries(p.stockPerSize || {}).map(([sz, qty]) => `${String(sz).toLowerCase()}:${qty}`);
                    const stocksStr = stocks.join(" ");
                    const price = String(p.price || "").toLowerCase();
                    const originalPrice = String(p.originalPrice || "").toLowerCase();
                    if (["men", "man", "gentlemen", "boy", "male"].includes(kw)) {
                      if (gender === "men" || gender === "unisex") {
                        score++;
                        return;
                      }
                    }
                    if (["women", "woman", "lady", "ladies", "girl", "female"].includes(kw)) {
                      if (gender === "women" || gender === "unisex") {
                        score++;
                        return;
                      }
                    }
                    const catNorm = category.replace("s", "");
                    const kwNorm = kw.replace("s", "");
                    if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
                      score++;
                      return;
                    }
                    if (name.includes(kw) || house.includes(kw) || description.includes(kw) || color.includes(kw) || fabric.includes(kw) || type.includes(kw) || sku.includes(kw) || sizesStr.includes(kw) || stocksStr.includes(kw) || price.includes(kw) || originalPrice.includes(kw)) {
                      score++;
                      return;
                    }
                  });
                  return score === keywords.length;
                }).map((p) => {
                  const isChecked = bucketForm.productIds.includes(p.id);
                  const isStar = bucketForm.starProductId === p.id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `flex items-center justify-between text-xs p-1.5 rounded transition-colors ${isChecked ? "bg-white/5 border border-white/5" : "hover:bg-white/5 border border-transparent"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none flex-1 truncate", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: isChecked,
                              onChange: (e) => {
                                const nextProductIds = e.target.checked ? [...bucketForm.productIds, p.id] : bucketForm.productIds.filter((id) => id !== p.id);
                                let nextStar = bucketForm.starProductId;
                                if (!e.target.checked && bucketForm.starProductId === p.id) {
                                  nextStar = nextProductIds[0] || "";
                                } else if (e.target.checked && !bucketForm.starProductId) {
                                  nextStar = p.id;
                                }
                                setBucketForm({
                                  ...bucketForm,
                                  productIds: nextProductIds,
                                  starProductId: nextStar
                                });
                              },
                              className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-6 h-8 object-cover rounded" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                            p.name,
                            " (",
                            p.house,
                            ")"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedProductPreview(p);
                              },
                              className: "p-1 text-muted-foreground hover:text-accent transition-colors cursor-pointer",
                              title: "View Product Details",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const nextProductIds = isChecked ? bucketForm.productIds : [...bucketForm.productIds, p.id];
                                setBucketForm({
                                  ...bucketForm,
                                  productIds: nextProductIds,
                                  starProductId: isStar ? "" : p.id
                                });
                              },
                              className: `p-1 hover:text-amber-400 transition-colors cursor-pointer ${isStar ? "text-amber-400" : "text-muted-foreground/30"}`,
                              title: isStar ? "Remove Star (Thumbnail)" : "Set as Star (Thumbnail)",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-4.5 h-4.5 ${isStar ? "fill-current" : ""}` })
                            }
                          )
                        ] })
                      ]
                    },
                    p.id
                  );
                }) })
              ] }),
              bucketForm.productIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Select Star Product (Use as Thumbnail)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground",
                    value: bucketForm.starProductId || "",
                    onChange: (e) => setBucketForm({ ...bucketForm, starProductId: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Choose Star Product --" }),
                      productsList.filter((p) => bucketForm.productIds.includes(p.id)).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                        p.name,
                        " (Thumbnail)"
                      ] }, p.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-border-subtle", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { type: "button", variant: "outline", onClick: () => setIsAddingBucket(false), children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90", children: editingBucket ? "Save Changes" : "Create Bucket" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${rearrangeMode ? "flex flex-col gap-3" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"}`, children: (state.buckets || []).map((b, idx) => {
        const starProd = productsList.find((p) => p.id === b.starProductId) || productsList.find((p) => b.productIds.includes(p.id));
        const thumbnail = starProd?.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&h=500&q=80";
        if (rearrangeMode) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              draggable: true,
              onDragStart: (e) => handleDragStart(e, idx),
              onDragOver: (e) => handleDragOver(e),
              onDrop: (e) => handleDrop(e, idx),
              className: "liquid-glass border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-4 flex items-center justify-between cursor-move hover:bg-amber-500/10 transition-all select-none animate-in fade-in duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-amber-500 font-bold font-mono text-sm px-2", children: "☰" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "w-10 h-14 object-cover rounded-lg border border-white/10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-foreground font-bold", children: b.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5", children: [
                      b.productIds.length,
                      " Products Linked · Position #",
                      idx + 1
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded ${b.hidden ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`, children: b.hidden ? "Hidden" : "Visible" }) })
              ]
            },
            b.id
          );
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden bg-transparent border border-white/10 rounded-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-zinc-950 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbnail, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold", children: [
              b.productIds.length,
              " Products"
            ] }),
            b.starProductId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 right-3 bg-amber-500 text-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold flex items-center gap-1 rounded-full", children: "★ Star Selection" }),
            b.hidden && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-3 right-3 bg-rose-600 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold rounded-full", children: "Hidden" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col justify-between space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground text-[10px]", children: "Curation Bucket" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg mt-1 text-foreground", children: b.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 line-clamp-2", children: [
                "Contains: ",
                b.productIds.map((pid) => productsList.find((p) => p.id === pid)?.name || pid).join(", ") || "No products linked"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border-subtle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setEditingBucket(b);
                    setBucketForm({
                      name: b.name,
                      productIds: b.productIds,
                      starProductId: b.starProductId || ""
                    });
                    setBucketProductSearch("");
                    setIsAddingBucket(true);
                  },
                  className: "flex-1 border border-foreground/30 hover:border-foreground py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    updateBucket(b.id, { hidden: !b.hidden });
                    toast.success(b.hidden ? `Bucket "${b.name}" is now visible in collections.` : `Bucket "${b.name}" is now hidden from collections.`);
                  },
                  className: `border py-2 px-3 text-[10px] flex items-center justify-center cursor-pointer ${b.hidden ? "border-rose-500/30 hover:border-rose-500 text-rose-400" : "border-emerald-500/30 hover:border-emerald-500 text-emerald-400"}`,
                  title: b.hidden ? "Unhide Bucket" : "Hide Bucket",
                  children: b.hidden ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    triggerModal("danger", "Delete Bucket", "Are you sure you want to permanently delete this curation bucket?", () => {
                      deleteBucket(b.id);
                    });
                  },
                  className: "border border-rose-500/30 hover:border-rose-500 text-rose-400 py-2 px-3 text-[10px] flex items-center justify-center cursor-pointer",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ] }, b.id);
      }) })
    ] }),
    tab === "homepage" && draftLayout && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-2 border border-border-subtle p-4 rounded-2xl liquid-glass", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Homepage Layout Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Customize, reorder, and publish sections for shop.reevibes.com" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                updateHomepageLayoutDraft(draftLayout);
                window.open("/?preview=true", "_blank");
              },
              className: "editorial-label text-xs bg-surface-3 hover:bg-surface-4 text-foreground border border-border-subtle px-4 py-2 rounded-full transition-all inline-flex items-center gap-1 cursor-pointer",
              children: [
                "External Preview ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                triggerModal(
                  "warning",
                  "Publish Homepage",
                  "Are you sure you want to push all draft modifications live to shop.reevibes.com? This will overwrite the active homepage layout.",
                  () => {
                    updateHomepageLayoutDraft(draftLayout);
                    publishHomepageLayout();
                    triggerModal("success", "Homepage Published", "The new homepage layout has been published successfully and is now live.", () => {
                    });
                  }
                );
              },
              className: "editorial-label text-xs bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition-all shadow-md",
              children: "Publish Live"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                triggerModal(
                  "danger",
                  "Revert Layout Changes",
                  "Are you sure you want to discard all your draft changes and restore the homepage layout to the last published live version?",
                  () => {
                    revertHomepageLayout();
                    setDraftLayout(null);
                    triggerModal("success", "Reverted Successfully", "Draft layout has been reverted to the live version.", () => {
                    });
                  }
                );
              },
              className: "editorial-label text-xs border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 px-4 py-2 rounded-full transition-all",
              children: "Revert Changes"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-12 max-w-4xl mx-auto w-full space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-md", children: "Sections Panel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    const id = `section-${Date.now()}`;
                    const name = prompt("Enter Section Name:", "New Curation Section");
                    if (!name) return;
                    setDraftLayout({
                      ...draftLayout,
                      sectionOrder: [...draftLayout.sectionOrder, id],
                      [id]: {
                        id,
                        name,
                        subname: "",
                        enabled: true,
                        bucketIds: [],
                        productIds: []
                      }
                    });
                    setActiveSectionId(id);
                  },
                  className: "bg-accent/20 text-accent hover:bg-accent hover:text-white px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer",
                  children: "+ Add Section"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    const id = `subbanner-${Date.now()}`;
                    const name = prompt("Enter Sub Banner Title:", "New Sub Banner");
                    if (!name) return;
                    setDraftLayout({
                      ...draftLayout,
                      sectionOrder: [...draftLayout.sectionOrder, id],
                      [id]: {
                        id,
                        title: name,
                        subtitle: "",
                        buttonText: "Explore Collection",
                        redirectUrl: "/shop",
                        desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                        mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                        videoUrl: "",
                        scale: 1,
                        xOffset: 0,
                        yOffset: 0,
                        enabled: true
                      }
                    });
                    setActiveSectionId(id);
                  },
                  className: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2.5 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer",
                  children: "+ Sub Banner"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[380px] overflow-y-auto pr-2 divide-y divide-white/5 scrollbar-thin", children: (() => {
            const filteredList = draftLayout.sectionOrder.filter(
              (id) => ["announcement", "hero", "recentlyViewed"].includes(id) || id.startsWith("section-") || id.startsWith("subbanner-")
            ).concat(["chatbot", "assistant"]);
            return filteredList.map((secId, idx) => {
              const sec = draftLayout[secId];
              if (!sec) return null;
              const isSelected = activeSectionId === secId;
              let displayName = secId;
              if (secId === "announcement") displayName = "Top Announcement";
              else if (secId === "hero") displayName = "Hero Banner Carousel";
              else if (secId === "recentlyViewed") displayName = "Recently Viewed Products";
              else if (secId === "chatbot") displayName = "AI Chatbot";
              else if (secId === "assistant") displayName = "Floating 3D Robot";
              else if (secId.startsWith("section-")) displayName = `Section: ${sec.name || "Unnamed"}`;
              else if (secId.startsWith("subbanner-")) displayName = `Sub Banner: ${sec.title || sec.name || "Unnamed"}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center justify-between py-2.5 transition-all ${isSelected ? "bg-accent/10 -mx-2 px-2 border-l-2 border-accent" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setActiveSectionId(secId),
                        className: "text-left hover:text-accent transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground", children: displayName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: sec.enabled ? "Active" : "Disabled" })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setDraftLayout({
                              ...draftLayout,
                              [secId]: { ...sec, enabled: !sec.enabled }
                            });
                          },
                          className: `p-1 rounded ${sec.enabled ? "text-accent" : "text-muted-foreground/40 hover:text-muted-foreground"}`,
                          title: sec.enabled ? "Hide Section" : "Show Section",
                          children: sec.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      secId !== "assistant" && secId !== "chatbot" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            disabled: idx === 0,
                            onClick: () => {
                              const globalIdx = draftLayout.sectionOrder.indexOf(secId);
                              const prevSecId = filteredList[idx - 1];
                              const prevGlobalIdx = draftLayout.sectionOrder.indexOf(prevSecId);
                              const nextOrder = [...draftLayout.sectionOrder];
                              nextOrder[globalIdx] = prevSecId;
                              nextOrder[prevGlobalIdx] = secId;
                              setDraftLayout({ ...draftLayout, sectionOrder: nextOrder });
                            },
                            className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer",
                            title: "Move Up",
                            children: "▲"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            disabled: idx === filteredList.length - 2,
                            onClick: () => {
                              const globalIdx = draftLayout.sectionOrder.indexOf(secId);
                              const nextSecId = filteredList[idx + 1];
                              const nextGlobalIdx = draftLayout.sectionOrder.indexOf(nextSecId);
                              const nextOrder = [...draftLayout.sectionOrder];
                              nextOrder[globalIdx] = nextSecId;
                              nextOrder[nextGlobalIdx] = secId;
                              setDraftLayout({ ...draftLayout, sectionOrder: nextOrder });
                            },
                            className: "p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer",
                            title: "Move Down",
                            children: "▼"
                          }
                        )
                      ] }),
                      (secId.startsWith("section-") || secId.startsWith("subbanner-")) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => {
                            if (confirm("Remove this custom section?")) {
                              const nextOrder = draftLayout.sectionOrder.filter((id) => id !== secId);
                              const nextDraft = { ...draftLayout, sectionOrder: nextOrder };
                              delete nextDraft[secId];
                              setDraftLayout(nextDraft);
                              if (activeSectionId === secId) {
                                setActiveSectionId(nextOrder[0] || "announcement");
                              }
                            }
                          },
                          className: "p-1 text-rose-400 hover:text-rose-500 cursor-pointer",
                          title: "Delete Section",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ]
                },
                secId
              );
            });
          })() })
        ] }),
        activeSectionId && draftLayout[activeSectionId] && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-4 animate-in slide-in-from-bottom-2 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-serif text-md capitalize", children: [
              activeSectionId.replace(/([A-Z])/g, " $1"),
              " Editor"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Enabled:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: draftLayout[activeSectionId].enabled,
                  onChange: (e) => {
                    setDraftLayout({
                      ...draftLayout,
                      [activeSectionId]: { ...draftLayout[activeSectionId], enabled: e.target.checked }
                    });
                  },
                  className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
            activeSectionId === "announcement" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Banner Message Text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground",
                    value: draftLayout.announcement.text,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      announcement: { ...draftLayout.announcement, text: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Redirect Link URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono",
                    value: draftLayout.announcement.linkUrl,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      announcement: { ...draftLayout.announcement, linkUrl: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Background Theme Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "color",
                      className: "w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer",
                      value: draftLayout.announcement.backgroundColor,
                      onChange: (e) => setDraftLayout({
                        ...draftLayout,
                        announcement: { ...draftLayout.announcement, backgroundColor: e.target.value }
                      })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "flex-1 bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono",
                      value: draftLayout.announcement.backgroundColor,
                      onChange: (e) => setDraftLayout({
                        ...draftLayout,
                        announcement: { ...draftLayout.announcement, backgroundColor: e.target.value }
                      })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-white/5 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Enable Countdown Timer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: draftLayout.announcement.countdownActive,
                    onChange: (e) => {
                      const active = e.target.checked;
                      const endsAt = new Date(draftLayout.announcement.countdownEndsAt);
                      const isFuture = active && !isNaN(endsAt.getTime()) && endsAt.getTime() > Date.now();
                      setDraftLayout({
                        ...draftLayout,
                        announcement: {
                          ...draftLayout.announcement,
                          countdownActive: active,
                          enabled: isFuture ? true : draftLayout.announcement.enabled
                        }
                      });
                    },
                    className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                  }
                )
              ] }),
              draftLayout.announcement.countdownActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Countdown End Timestamp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "datetime-local",
                    className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground font-mono rounded cursor-pointer",
                    value: draftLayout.announcement.countdownEndsAt ? draftLayout.announcement.countdownEndsAt.slice(0, 16) : "",
                    onChange: (e) => {
                      const val = e.target.value;
                      const isoVal = val ? val + ":00" : "";
                      const endsAt = new Date(isoVal);
                      const isFuture = !isNaN(endsAt.getTime()) && endsAt.getTime() > Date.now();
                      setDraftLayout({
                        ...draftLayout,
                        announcement: {
                          ...draftLayout.announcement,
                          countdownEndsAt: isoVal,
                          enabled: isFuture ? true : draftLayout.announcement.enabled
                        }
                      });
                    }
                  }
                )
              ] })
            ] }),
            activeSectionId === "navigation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Configure Menu Links Visibility & Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 bg-white/5 border border-white/10 rounded-xl p-3", children: draftLayout.navigation.itemsOrder.map((navItem, navIdx) => {
                const isVisible = draftLayout.navigation.visibleItems.includes(navItem);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1.5 border-b border-white/5 last:border-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: navItem }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isVisible,
                        onChange: (e) => {
                          const nextVisible = e.target.checked ? [...draftLayout.navigation.visibleItems, navItem] : draftLayout.navigation.visibleItems.filter((x) => x !== navItem);
                          setDraftLayout({
                            ...draftLayout,
                            navigation: { ...draftLayout.navigation, visibleItems: nextVisible }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        disabled: navIdx === 0,
                        onClick: () => {
                          const order = [...draftLayout.navigation.itemsOrder];
                          const t = order[navIdx];
                          order[navIdx] = order[navIdx - 1];
                          order[navIdx - 1] = t;
                          setDraftLayout({
                            ...draftLayout,
                            navigation: { ...draftLayout.navigation, itemsOrder: order }
                          });
                        },
                        className: "text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20",
                        children: "▲"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        disabled: navIdx === draftLayout.navigation.itemsOrder.length - 1,
                        onClick: () => {
                          const order = [...draftLayout.navigation.itemsOrder];
                          const t = order[navIdx];
                          order[navIdx] = order[navIdx + 1];
                          order[navIdx + 1] = t;
                          setDraftLayout({
                            ...draftLayout,
                            navigation: { ...draftLayout.navigation, itemsOrder: order }
                          });
                        },
                        className: "text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-20",
                        children: "▼"
                      }
                    )
                  ] })
                ] }, navItem);
              }) })
            ] }),
            activeSectionId === "chatbot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold block", children: "AI Chatbot Visibility" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "The AI Chatbot appears as a floating chat bubble at the bottom of the e-commerce store, allowing users to ask questions, get product recommendations, and receive support." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-white/5 pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Enable AI Chatbot" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: draftLayout.chatbot?.enabled !== false,
                    onChange: (e) => {
                      setDraftLayout({
                        ...draftLayout,
                        chatbot: { ...draftLayout.chatbot, enabled: e.target.checked }
                      });
                    },
                    className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                  }
                )
              ] })
            ] }),
            activeSectionId === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold block", children: "Floating 3D Robot Visibility" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "The interactive 3D Robot animation appears fixed at the bottom-right corner of the homepage, tracking the user's mouse cursor for a premium interactive experience." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-white/5 pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Enable Floating 3D Robot" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: draftLayout.assistant?.enabled !== false,
                    onChange: (e) => {
                      setDraftLayout({
                        ...draftLayout,
                        assistant: { ...draftLayout.assistant, enabled: e.target.checked }
                      });
                    },
                    className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                  }
                )
              ] })
            ] }),
            activeSectionId === "hero" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Carousel Slideshow Banners" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      const newId = `h-${Date.now()}`;
                      const newBanner = {
                        id: newId,
                        type: "Image Banner",
                        title: "Brand Statement Title",
                        subtitle: "Campaign details or seasonal promo",
                        buttonText: "Explore Collection",
                        redirectUrl: "/shop/categories",
                        desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                        mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                        videoUrl: "",
                        scheduleStart: "",
                        scheduleEnd: ""
                      };
                      const updated = [...draftLayout.hero.banners, newBanner];
                      setDraftLayout({
                        ...draftLayout,
                        hero: { ...draftLayout.hero, banners: updated }
                      });
                      setExpandedSlideIndexMap((prev) => ({ ...prev, hero: updated.length - 1 }));
                    },
                    className: "bg-accent/20 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider",
                    children: "+ Add Slide Frame"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[400px] overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin", children: draftLayout.hero.banners.map((b, bIdx) => {
                const isExpanded = (expandedSlideIndexMap["hero"] ?? 0) === bIdx;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 first:pt-0 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all",
                      onClick: () => setExpandedSlideIndexMap((prev) => ({ ...prev, hero: bIdx })),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                          b.desktopImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: b.desktopImage,
                              className: "w-10 h-7 object-cover rounded border border-white/10",
                              alt: ""
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-accent font-mono text-[10px]", children: [
                            "Frame #",
                            bIdx + 1,
                            " (",
                            b.type,
                            ") ",
                            isExpanded ? "▼" : "▶"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            onClick: (e) => {
                              e.stopPropagation();
                              const updated = draftLayout.hero.banners.filter((x) => x.id !== b.id);
                              setDraftLayout({
                                ...draftLayout,
                                hero: { ...draftLayout.hero, banners: updated }
                              });
                              setExpandedSlideIndexMap((prev) => ({ ...prev, hero: Math.max(0, bIdx - 1) }));
                            },
                            className: "text-rose-400 hover:text-rose-500 text-[10px] uppercase font-semibold",
                            children: "Remove"
                          }
                        )
                      ]
                    }
                  ),
                  isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-2 p-2 bg-black/20 rounded-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        value: b.type,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, type: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        },
                        className: "col-span-2 bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Image Banner", children: "Image Banner" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Video Banner", children: "Video Banner" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Collection Banner", children: "Collection Banner" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Brand Campaign Banner", children: "Brand Campaign Banner" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Title",
                        className: "bg-surface border border-border-subtle p-2 outline-none",
                        value: b.title,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, title: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Subtitle",
                        className: "bg-surface border border-border-subtle p-2 outline-none",
                        value: b.subtitle,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, subtitle: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Button text",
                        className: "bg-surface border border-border-subtle p-2 outline-none",
                        value: b.buttonText || "Shop Now",
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, buttonText: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Redirect URL",
                        className: "bg-surface border border-border-subtle p-2 outline-none font-mono",
                        value: b.redirectUrl,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, redirectUrl: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Desktop Image URL",
                        className: "col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono",
                        value: b.desktopImage,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, desktopImage: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Mobile Image URL",
                        className: "col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono",
                        value: b.mobileImage,
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, mobileImage: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Video URL Option",
                        className: "col-span-2 bg-surface border border-border-subtle p-2 outline-none font-mono",
                        value: b.videoUrl || "",
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, videoUrl: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Schedule Start (YYYY-MM-DD)",
                        className: "bg-surface border border-border-subtle p-2 outline-none",
                        value: b.scheduleStart || "",
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, scheduleStart: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        placeholder: "Schedule End (YYYY-MM-DD)",
                        className: "bg-surface border border-border-subtle p-2 outline-none",
                        value: b.scheduleEnd || "",
                        onChange: (e) => {
                          const updated = draftLayout.hero.banners.map((x) => x.id === b.id ? { ...x, scheduleEnd: e.target.value } : x);
                          setDraftLayout({ ...draftLayout, hero: { ...draftLayout.hero, banners: updated } });
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex gap-3 mt-2 p-2 bg-zinc-950/40 border border-white/5 rounded", children: [
                      b.desktopImage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Desktop Preview:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.desktopImage, className: "w-full h-20 object-cover rounded border border-white/10", alt: "" })
                      ] }),
                      b.mobileImage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Mobile Preview:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.mobileImage, className: "w-full h-20 object-cover rounded border border-white/10", alt: "" })
                      ] }),
                      b.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Video Preview:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-20 bg-zinc-900 border border-white/10 rounded flex items-center justify-center text-[10px] text-accent font-semibold truncate px-1", children: b.videoUrl.split("/").pop() })
                      ] })
                    ] })
                  ] })
                ] }, b.id);
              }) })
            ] }),
            activeSectionId === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Category Card Listings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: draftLayout.categories.items.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white/5 border border-white/10 rounded-xl space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold font-mono text-[10px] text-accent", children: [
                  cat.name,
                  " Category"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    placeholder: "Redirect Link",
                    className: "w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono",
                    value: cat.redirectUrl,
                    onChange: (e) => {
                      const updated = draftLayout.categories.items.map((x) => x.id === cat.id ? { ...x, redirectUrl: e.target.value } : x);
                      setDraftLayout({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    placeholder: "Image URL",
                    className: "w-full bg-surface border border-border-subtle p-2 text-xs outline-none font-mono",
                    value: cat.image,
                    onChange: (e) => {
                      const updated = draftLayout.categories.items.map((x) => x.id === cat.id ? { ...x, image: e.target.value } : x);
                      setDraftLayout({ ...draftLayout, categories: { ...draftLayout.categories, items: updated } });
                    }
                  }
                )
              ] }, cat.id)) })
            ] }),
            activeSectionId === "flashSale" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Start Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                      value: draftLayout.flashSale.startDate,
                      onChange: (e) => setDraftLayout({
                        ...draftLayout,
                        flashSale: { ...draftLayout.flashSale, startDate: e.target.value }
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "End Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                      value: draftLayout.flashSale.endDate,
                      onChange: (e) => setDraftLayout({
                        ...draftLayout,
                        flashSale: { ...draftLayout.flashSale, endDate: e.target.value }
                      })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Discount Percentage (%)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                    value: draftLayout.flashSale.discount,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      flashSale: { ...draftLayout.flashSale, discount: Number(e.target.value) }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Select Products for Rotation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin", children: productsList.map((p) => {
                  const isSelected = draftLayout.flashSale.products.includes(p.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      p.name,
                      " (",
                      p.price,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: (e) => {
                          const next = e.target.checked ? [...draftLayout.flashSale.products, p.id] : draftLayout.flashSale.products.filter((x) => x !== p.id);
                          setDraftLayout({
                            ...draftLayout,
                            flashSale: { ...draftLayout.flashSale, products: next }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                      }
                    )
                  ] }, p.id);
                }) })
              ] })
            ] }),
            activeSectionId === "trending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Automatic Scoring Algorithm Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: draftLayout.trending.autoMode,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      trending: { ...draftLayout.trending, autoMode: e.target.checked }
                    }),
                    className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic leading-relaxed", children: "Auto Mode calculates dynamic popularity metrics based on User Page Views + Cart Additions + Checkout Purchases." }),
              !draftLayout.trending.autoMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Manual Overrides Products" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin", children: productsList.map((p) => {
                  const isSelected = draftLayout.trending.manualProducts.includes(p.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: (e) => {
                          const next = e.target.checked ? [...draftLayout.trending.manualProducts, p.id] : draftLayout.trending.manualProducts.filter((x) => x !== p.id);
                          setDraftLayout({
                            ...draftLayout,
                            trending: { ...draftLayout.trending, manualProducts: next }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                      }
                    )
                  ] }, p.id);
                }) })
              ] })
            ] }),
            activeSectionId === "newArrivals" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Display Product Count" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                    value: draftLayout.newArrival?.productCount || 3,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      newArrival: { ...draftLayout.newArrival, productCount: Number(e.target.value) }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Layout Style Curation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                    value: draftLayout.newArrival?.layoutStyle || "grid",
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      newArrival: { ...draftLayout.newArrival, layoutStyle: e.target.value }
                    }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "grid", children: "Grid Grid Layout" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "carousel", children: "Horizontal Carousel Slideshow" })
                    ]
                  }
                )
              ] })
            ] }),
            activeSectionId === "campaign" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Campaign Headline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.campaign.heading,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      campaign: { ...draftLayout.campaign, heading: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "CTA Button Label" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.campaign.ctaText || "Shop Campaign",
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      campaign: { ...draftLayout.campaign, ctaText: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Redirect Link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.campaign.redirectUrl,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      campaign: { ...draftLayout.campaign, redirectUrl: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Campaign Large Image URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.campaign.image,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      campaign: { ...draftLayout.campaign, image: e.target.value }
                    })
                  }
                )
              ] })
            ] }),
            activeSectionId === "collections" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Collection Label" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                    value: draftLayout.collections.collectionId,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      collections: { ...draftLayout.collections, collectionId: e.target.value }
                    }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Premium Collection", children: "Premium Collection" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Office Wear", children: "Office Wear" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Party Wear", children: "Party Wear" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Casual Wear", children: "Casual Wear" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Luxury Collection", children: "Luxury Collection" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Featured Cover Image URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.collections.coverImage,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      collections: { ...draftLayout.collections, coverImage: e.target.value }
                    })
                  }
                )
              ] })
            ] }),
            activeSectionId === "liveFeed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Purchase Alert Feeds Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                  value: draftLayout.liveFeed.mode,
                  onChange: (e) => setDraftLayout({
                    ...draftLayout,
                    liveFeed: { ...draftLayout.liveFeed, mode: e.target.value }
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "real", children: "Real Database Orders" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "demo", children: "Demo Simulation Feed" })
                  ]
                }
              )
            ] }),
            activeSectionId === "bestSellers" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Auto-cured by Sales Volume" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: draftLayout.bestSellers.autoMode,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      bestSellers: { ...draftLayout.bestSellers, autoMode: e.target.checked }
                    }),
                    className: "rounded border-white/10 text-accent focus:ring-accent w-4 h-4"
                  }
                )
              ] }),
              !draftLayout.bestSellers.autoMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 animate-in fade-in duration-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Manual Product Curation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin", children: productsList.map((p) => {
                  const isSelected = draftLayout.bestSellers.manualProducts.includes(p.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: (e) => {
                          const next = e.target.checked ? [...draftLayout.bestSellers.manualProducts, p.id] : draftLayout.bestSellers.manualProducts.filter((x) => x !== p.id);
                          setDraftLayout({
                            ...draftLayout,
                            bestSellers: { ...draftLayout.bestSellers, manualProducts: next }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                      }
                    )
                  ] }, p.id);
                }) })
              ] })
            ] }),
            activeSectionId === "limitedStock" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Stock Warning Threshold Curation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono text-sm",
                  value: draftLayout.limitedStock.threshold,
                  onChange: (e) => setDraftLayout({
                    ...draftLayout,
                    limitedStock: { ...draftLayout.limitedStock, threshold: Number(e.target.value) }
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Alert displays if size stocks fall below this value." })
            ] }),
            activeSectionId === "influencerPicks" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Select Styled Influencer Products" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1 scrollbar-thin", children: productsList.map((p) => {
                const isSelected = draftLayout.influencerPicks.products.includes(p.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: (e) => {
                        const next = e.target.checked ? [...draftLayout.influencerPicks.products, p.id] : draftLayout.influencerPicks.products.filter((x) => x !== p.id);
                        setDraftLayout({
                          ...draftLayout,
                          influencerPicks: { ...draftLayout.influencerPicks, products: next }
                        });
                      },
                      className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5"
                    }
                  )
                ] }, p.id);
              }) })
            ] }),
            activeSectionId === "reviews" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Feature Customer Reviews" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-2 scrollbar-thin", children: Object.entries(state.productReviews).flatMap(
                ([pId, list]) => list.map((r) => ({ ...r, productId: pId }))
              ).map((r) => {
                const isSelected = draftLayout.reviews.featuredReviewIds.includes(r.id);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 border-b border-white/5 pb-2 last:border-0 justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: r.userName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "italic text-muted-foreground truncate w-44", children: [
                      '"',
                      r.comment,
                      '"'
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: (e) => {
                        const next = e.target.checked ? [...draftLayout.reviews.featuredReviewIds, r.id] : draftLayout.reviews.featuredReviewIds.filter((x) => x !== r.id);
                        setDraftLayout({
                          ...draftLayout,
                          reviews: { ...draftLayout.reviews, featuredReviewIds: next }
                        });
                      },
                      className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 mt-0.5"
                    }
                  )
                ] }, r.id);
              }) })
            ] }),
            activeSectionId === "lookbook" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Lookbook Banner Image URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.lookbook.image,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      lookbook: { ...draftLayout.lookbook, image: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Interactive Image Coordinate Curation Tagging" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Click coordinates on the image container to overlay shoppable points." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] max-w-[200px] bg-zinc-950 border border-white/10 rounded-xl overflow-hidden mx-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: draftLayout.lookbook.image,
                      alt: "Lookbook Tag Preview",
                      className: "w-full h-full object-cover cursor-crosshair select-none",
                      onClick: (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.round((e.clientX - rect.left) / rect.width * 100);
                        const y = Math.round((e.clientY - rect.top) / rect.height * 100);
                        const pId = prompt("Enter product ID to tag (e.g. pr1, pr2, prm1):", "pr1");
                        if (pId && productsList.some((p) => p.id === pId)) {
                          setDraftLayout({
                            ...draftLayout,
                            lookbook: {
                              ...draftLayout.lookbook,
                              taggedProducts: [...draftLayout.lookbook.taggedProducts, { productId: pId, x, y }]
                            }
                          });
                        } else if (pId) {
                          alert("Product ID not found in the catalog!");
                        }
                      }
                    }
                  ),
                  draftLayout.lookbook.taggedProducts.map((tag, tIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute w-4 h-4 bg-accent border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-ping-slow shadow-lg cursor-pointer",
                      style: { left: `${tag.x}%`, top: `${tag.y}%`, transform: "translate(-50%, -50%)" },
                      onClick: (e) => {
                        e.stopPropagation();
                        if (confirm("Delete this tagged product point?")) {
                          const nextTags = draftLayout.lookbook.taggedProducts.filter((_, idx) => idx !== tIdx);
                          setDraftLayout({
                            ...draftLayout,
                            lookbook: { ...draftLayout.lookbook, taggedProducts: nextTags }
                          });
                        }
                      },
                      children: tIdx + 1
                    },
                    tIdx
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent block", children: "Tagged Items:" }),
                  draftLayout.lookbook.taggedProducts.map((tag, tIdx) => {
                    const match = productsList.find((p) => p.id === tag.productId);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-0.5 border-b border-white/5 last:border-0 font-mono text-[9px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "#",
                        tIdx + 1,
                        ": ",
                        match?.name || tag.productId,
                        " (",
                        tag.x,
                        "%, ",
                        tag.y,
                        "%)"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => {
                            const nextTags = draftLayout.lookbook.taggedProducts.filter((_, idx) => idx !== tIdx);
                            setDraftLayout({
                              ...draftLayout,
                              lookbook: { ...draftLayout.lookbook, taggedProducts: nextTags }
                            });
                          },
                          className: "text-rose-400",
                          children: "Remove"
                        }
                      )
                    ] }, tIdx);
                  })
                ] })
              ] })
            ] }),
            activeSectionId === "recommended" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Recommendation Curation Engine" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                  value: draftLayout.recommended.algorithm,
                  onChange: (e) => setDraftLayout({
                    ...draftLayout,
                    recommended: { ...draftLayout.recommended, algorithm: e.target.value }
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "category", children: "Category Viewed History" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ai", children: "AI Deep Learning Curation" })
                  ]
                }
              )
            ] }),
            activeSectionId === "brandStory" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Story Paragraph Content" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    rows: 4,
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.brandStory.text,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      brandStory: { ...draftLayout.brandStory, text: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Collage Image #1 URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.brandStory.image1,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      brandStory: { ...draftLayout.brandStory, image1: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Collage Image #2 URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.brandStory.image2,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      brandStory: { ...draftLayout.brandStory, image2: e.target.value }
                    })
                  }
                )
              ] })
            ] }),
            activeSectionId === "newsletter" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Sign-up Reward Amount (INR)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono text-sm",
                  value: draftLayout.newsletter.rewardAmount,
                  onChange: (e) => setDraftLayout({
                    ...draftLayout,
                    newsletter: { ...draftLayout.newsletter, rewardAmount: Number(e.target.value) }
                  })
                }
              )
            ] }),
            activeSectionId === "footer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "About Description Text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    rows: 3,
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.footer.aboutText,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      footer: { ...draftLayout.footer, aboutText: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Concierge Contact Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.footer.phone,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      footer: { ...draftLayout.footer, phone: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Business Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground font-mono",
                    value: draftLayout.footer.email,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      footer: { ...draftLayout.footer, email: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Headquarters Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground",
                    value: draftLayout.footer.address,
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      footer: { ...draftLayout.footer, address: e.target.value }
                    })
                  }
                )
              ] })
            ] }),
            (activeSectionId.startsWith("banner-") || activeSectionId.startsWith("subbanner-")) && draftLayout[activeSectionId] && (() => {
              const secData = draftLayout[activeSectionId];
              const slides = secData.banners || [];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Section Title / Header" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                      value: secData.title || secData.name || "",
                      onChange: (e) => setDraftLayout({
                        ...draftLayout,
                        [activeSectionId]: {
                          ...secData,
                          title: e.target.value,
                          name: e.target.value
                        }
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-muted-foreground font-semibold", children: [
                    "Banner Photo Slides (",
                    slides.length,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const newBanner = {
                          id: `slide-${Date.now()}`,
                          title: secData.title || "Showcase Banner",
                          subtitle: "",
                          buttonText: "Explore Collection",
                          redirectUrl: "/shop",
                          desktopImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80",
                          mobileImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&h=800&q=80",
                          scale: 1,
                          xOffset: 0,
                          yOffset: 0
                        };
                        const updated = [...slides, newBanner];
                        setDraftLayout({
                          ...draftLayout,
                          [activeSectionId]: {
                            ...secData,
                            banners: updated
                          }
                        });
                        setExpandedSlideIndexMap((prev) => ({ ...prev, [activeSectionId]: updated.length - 1 }));
                      },
                      className: "bg-accent/20 text-accent hover:bg-accent hover:text-white px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider cursor-pointer",
                      children: "+ Add Photo Slide"
                    }
                  )
                ] }),
                slides.length === 0 && (secData.desktopImage || secData.mobileImage) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-accent/10 border border-accent/20 rounded-xl space-y-2 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-semibold", children: "Existing single-image banner found. Convert to slideshow?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setDraftLayout({
                          ...draftLayout,
                          [activeSectionId]: {
                            ...secData,
                            banners: [
                              {
                                id: "slide-root",
                                title: secData.title || secData.name || "Showcase Banner",
                                subtitle: secData.subtitle || "",
                                buttonText: secData.buttonText || "Explore",
                                redirectUrl: secData.redirectUrl || "/shop",
                                desktopImage: secData.desktopImage,
                                mobileImage: secData.mobileImage || secData.desktopImage,
                                scale: secData.scale || 1,
                                xOffset: secData.xOffset || 0,
                                yOffset: secData.yOffset || 0
                              }
                            ]
                          }
                        });
                      },
                      className: "bg-accent text-white px-3 py-1 rounded hover:bg-accent/90 text-[10px] font-bold",
                      children: "Convert to Slideshow"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 max-h-[350px] overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin", children: slides.map((b, bIdx) => {
                  const isExpanded = (expandedSlideIndexMap[activeSectionId] ?? 0) === bIdx;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 first:pt-0 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex justify-between items-center bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all",
                        onClick: () => setExpandedSlideIndexMap((prev) => ({ ...prev, [activeSectionId]: bIdx })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                            b.desktopImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: b.desktopImage,
                                className: "w-10 h-7 object-cover rounded border border-white/10",
                                alt: ""
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-accent font-mono text-[10px]", children: [
                              "Slide Photo #",
                              bIdx + 1,
                              " ",
                              isExpanded ? "▼" : "▶"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                const updated = slides.filter((x) => x.id !== b.id);
                                setDraftLayout({
                                  ...draftLayout,
                                  [activeSectionId]: {
                                    ...secData,
                                    banners: updated
                                  }
                                });
                                setExpandedSlideIndexMap((prev) => ({ ...prev, [activeSectionId]: Math.max(0, bIdx - 1) }));
                              },
                              className: "text-rose-400 hover:text-rose-500 text-[10px] uppercase font-semibold cursor-pointer",
                              children: "Remove"
                            }
                          )
                        ]
                      }
                    ),
                    isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs p-2 bg-black/20 rounded-lg", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Desktop Image URL" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Desktop Image URL",
                            className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                            value: b.desktopImage || "",
                            onChange: (e) => {
                              const updated = slides.map((x) => x.id === b.id ? { ...x, desktopImage: e.target.value } : x);
                              setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Mobile Image URL (Optional)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Mobile Image URL",
                            className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                            value: b.mobileImage || "",
                            onChange: (e) => {
                              const updated = slides.map((x) => x.id === b.id ? { ...x, mobileImage: e.target.value } : x);
                              setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Redirect Link URL" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Redirect Link URL",
                            className: "w-full bg-surface border border-border-subtle p-2 outline-none font-mono",
                            value: b.redirectUrl || "",
                            onChange: (e) => {
                              const updated = slides.map((x) => x.id === b.id ? { ...x, redirectUrl: e.target.value } : x);
                              setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Title" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Slide Title",
                            className: "w-full bg-surface border border-border-subtle p-2 outline-none",
                            value: b.title || "",
                            onChange: (e) => {
                              const updated = slides.map((x) => x.id === b.id ? { ...x, title: e.target.value } : x);
                              setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Subtitle" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Slide Subtitle",
                            className: "w-full bg-surface border border-border-subtle p-2 outline-none",
                            value: b.subtitle || "",
                            onChange: (e) => {
                              const updated = slides.map((x) => x.id === b.id ? { ...x, subtitle: e.target.value } : x);
                              setDraftLayout({ ...draftLayout, [activeSectionId]: { ...secData, banners: updated } });
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex gap-3 mt-2 p-2 bg-zinc-950/40 border border-white/5 rounded", children: [
                        b.desktopImage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Desktop Preview:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.desktopImage, className: "w-full h-16 object-cover rounded border border-white/10", alt: "" })
                        ] }),
                        b.mobileImage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Mobile Preview:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.mobileImage, className: "w-full h-16 object-cover rounded border border-white/10", alt: "" })
                        ] })
                      ] })
                    ] })
                  ] }, b.id);
                }) })
              ] });
            })(),
            activeSectionId.startsWith("bucket-") && draftLayout[activeSectionId] && (() => {
              const bkt = state.buckets?.find((b) => b.id === draftLayout[activeSectionId].id);
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white/5 border border-white/10 rounded-xl space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-emerald-400", children: "Curated Curation Set" }),
                bkt ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-white", children: bkt.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "ID: ",
                    bkt.id
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "Product Count: ",
                    bkt.productIds?.length || 0
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "Designated Star Product: ",
                    productsList.find((p) => p.id === bkt.starProductId)?.name || "None"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold text-accent mb-1", children: "Products Included:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-32 overflow-y-auto scrollbar-thin", children: bkt.productIds?.map((pid) => {
                      const p = productsList.find((pr) => pr.id === pid);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p?.name || pid })
                      ] }, pid);
                    }) })
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-rose-400 italic", children: "This bucket was deleted or is missing. Please select another bucket or remove this section." })
              ] }) });
            })(),
            activeSectionId === "recentlyViewed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Recently Viewed Section" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "This section automatically loads the products recently viewed by customers on this device. Toggle the checkbox at the top to activate/deactivate the section layout." })
            ] }),
            activeSectionId.startsWith("section-") && draftLayout[activeSectionId] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Section Display Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                    value: draftLayout[activeSectionId].name || "",
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      [activeSectionId]: { ...draftLayout[activeSectionId], name: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Section Subname / Subtitle" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full bg-surface border border-border-subtle p-2 outline-none text-foreground text-xs",
                    value: draftLayout[activeSectionId].subname || "",
                    onChange: (e) => setDraftLayout({
                      ...draftLayout,
                      [activeSectionId]: { ...draftLayout[activeSectionId], subname: e.target.value }
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Add Curated Buckets to Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1.5 scrollbar-thin", children: (state.buckets || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground italic", children: "No buckets available. Create one in the Buckets tab first." }) : (state.buckets || []).map((bkt) => {
                  const isSelected = (draftLayout[activeSectionId].bucketIds || []).includes(bkt.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-semibold", children: bkt.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: (e) => {
                          const currentBuckets = draftLayout[activeSectionId].bucketIds || [];
                          const next = e.target.checked ? [...currentBuckets, bkt.id] : currentBuckets.filter((id) => id !== bkt.id);
                          setDraftLayout({
                            ...draftLayout,
                            [activeSectionId]: { ...draftLayout[activeSectionId], bucketIds: next }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer"
                      }
                    )
                  ] }, bkt.id);
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-muted-foreground font-semibold", children: "Add Individual Products to Section" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 overflow-y-auto border border-border-subtle bg-surface p-2 rounded space-y-1.5 scrollbar-thin font-sans", children: productsList.map((p) => {
                  const isSelected = (draftLayout[activeSectionId].productIds || []).includes(p.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-mono", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate max-w-[200px] text-foreground font-sans", children: [
                      p.name,
                      " (",
                      p.price,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isSelected,
                        onChange: (e) => {
                          const currentProducts = draftLayout[activeSectionId].productIds || [];
                          const next = e.target.checked ? [...currentProducts, p.id] : currentProducts.filter((id) => id !== p.id);
                          setDraftLayout({
                            ...draftLayout,
                            [activeSectionId]: { ...draftLayout[activeSectionId], productIds: next }
                          });
                        },
                        className: "rounded border-white/10 text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer"
                      }
                    )
                  ] }, p.id);
                }) })
              ] })
            ] }),
            !["announcement", "navigation", "hero", "categories", "flashSale", "trending", "newArrivals", "campaign", "collections", "liveFeed", "bestSellers", "limitedStock", "influencerPicks", "reviews", "lookbook", "recommended", "brandStory", "newsletter", "footer"].includes(activeSectionId) && !activeSectionId.startsWith("banner-") && !activeSectionId.startsWith("subbanner-") && !activeSectionId.startsWith("bucket-") && !activeSectionId.startsWith("section-") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-muted-foreground italic", children: "No specialized controls required. Use the switch above to toggle section visibility." })
          ] })
        ] })
      ] }) })
    ] }),
    tab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-2 flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search catalog by name, brand, SKU…",
                className: "w-full bg-surface border border-border-subtle pl-10 pr-4 py-2.5 text-xs outline-none focus:border-accent",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowSortDropdown(!showSortDropdown),
                className: `border p-2.5 rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs h-[38px] ${sortField ? "border-accent text-accent bg-accent/5 font-bold" : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20"}`,
                title: "Sort catalog products",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ListFilter, { className: "w-4 h-4" }),
                  sortField && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "capitalize text-[10px]", children: [
                    sortField,
                    " (",
                    sortDirection === "desc" ? "↓" : "↑",
                    ")"
                  ] })
                ]
              }
            ),
            showSortDropdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-1.5 w-44 bg-zinc-950 border border-white/15 rounded-xl shadow-2xl z-40 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider text-muted-foreground font-bold p-2 border-b border-white/5", children: "Sort products by" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (sortField === "date") {
                      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
                    } else {
                      setSortField("date");
                      setSortDirection("desc");
                    }
                    setShowSortDropdown(false);
                  },
                  className: `w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center transition-colors cursor-pointer hover:bg-white/5 ${sortField === "date" ? "text-accent font-bold bg-accent/5" : "text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date Created" }),
                    sortField === "date" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", children: sortDirection === "desc" ? "Newest First" : "Oldest First" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (sortField === "price") {
                      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
                    } else {
                      setSortField("price");
                      setSortDirection("desc");
                    }
                    setShowSortDropdown(false);
                  },
                  className: `w-full text-left px-3 py-2 text-xs rounded-lg flex justify-between items-center transition-colors cursor-pointer hover:bg-white/5 ${sortField === "price" ? "text-accent font-bold bg-accent/5" : "text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Price" }),
                    sortField === "price" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", children: sortDirection === "desc" ? "Highest First" : "Lowest First" })
                  ]
                }
              ),
              sortField && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setSortField(null);
                    setShowSortDropdown(false);
                  },
                  className: "w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-rose-400 hover:text-rose-500 transition-colors mt-1.5 pt-2 border-t border-white/5 cursor-pointer",
                  children: "Reset Sort"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleDownloadTemplate,
              className: "editorial-label border border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent px-4 py-2.5 flex items-center gap-2 rounded-sm cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                " Download Template"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "editorial-label border border-white/10 hover:border-accent text-foreground hover:text-accent bg-transparent px-4 py-2.5 flex items-center gap-2 rounded-sm cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
            " Import Excel",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: ".xlsx,.xls,.csv",
                onChange: handleExcelImport,
                className: "hidden"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setEditingProduct(null);
                setIsManualCreate(true);
                const newProductDraft = {
                  name: "",
                  house: "",
                  price: "",
                  image: "",
                  images: [],
                  tag: "New",
                  tags: ["Manual"],
                  gender: "Women",
                  category: "Tops",
                  sizes: ["S", "M", "L"],
                  stockPerSize: { S: 10, M: 10, L: 10 },
                  sku: `SKU-${Math.floor(1e4 + Math.random() * 9e4)}`,
                  originalPrice: "",
                  description: "",
                  material: "",
                  color: "",
                  productInfo: "",
                  type: "",
                  fabric: "",
                  visibility: "VISIBLE",
                  isFeatured: false,
                  isNewArrival: true,
                  isTrending: false,
                  isRecommended: false
                };
                setImportedProducts([newProductDraft]);
                setCurrentImportIndex(0);
                setIsReviewingImports(true);
              },
              className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                " Create Product"
              ]
            }
          )
        ] })
      ] }),
      isReviewingImports && importedProducts.length > 0 && (() => {
        const currentItem = importedProducts[currentImportIndex];
        if (!currentItem) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass bg-background/95 border border-accent/20 max-w-5xl w-full p-6 md:p-8 max-h-[95vh] overflow-y-auto shadow-2xl relative text-foreground flex flex-col md:flex-row gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-64 shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 pb-4 md:pb-0 md:pr-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-amber-500 font-bold", children: editingProduct ? "Edit Product" : isManualCreate ? "New Product" : "Import Review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-1", children: editingProduct ? "Modify existing product details" : isManualCreate ? "Create and manage new draft items" : `Total parsed: ${importedProducts.length} products` })
            ] }),
            !editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  const newProductDraft = {
                    name: "",
                    house: "",
                    price: "",
                    image: "",
                    images: [],
                    tag: "New",
                    tags: ["Manual"],
                    gender: "Women",
                    category: "Tops",
                    sizes: ["S", "M", "L"],
                    stockPerSize: { S: 10, M: 10, L: 10 },
                    sku: `SKU-${Math.floor(1e4 + Math.random() * 9e4)}`,
                    originalPrice: "",
                    description: "",
                    material: "",
                    color: "",
                    productInfo: "",
                    type: "",
                    fabric: "",
                    visibility: "VISIBLE",
                    isFeatured: false,
                    isNewArrival: true,
                    isTrending: false,
                    isRecommended: false
                  };
                  setImportedProducts([...importedProducts, newProductDraft]);
                  setCurrentImportIndex(importedProducts.length);
                },
                className: "w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-accent/40 text-accent hover:border-accent hover:bg-accent/5 text-xs font-bold transition-all cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " Add new product"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto max-h-48 md:max-h-[60vh] pr-2 space-y-2 scrollbar-thin", children: importedProducts.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group/card w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCurrentImportIndex(idx),
                  className: `w-full text-left p-2.5 pr-8 rounded-xl border text-xs transition-all flex-1 flex items-center gap-2 ${idx === currentImportIndex ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.1)]" : "bg-black/5 dark:bg-white/5 border-transparent text-muted-foreground hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded bg-zinc-950 shrink-0 overflow-hidden border border-black/10 dark:border-white/5", children: p.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-full h-full object-cover", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-[8px] text-muted-foreground", children: "IMG" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate flex-1 font-serif", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate text-[11px]", children: p.name || `Product ${idx + 1}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-muted-foreground truncate", children: p.house || "No brand" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    setProductToDeleteIndex(idx);
                  },
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/45 hover:text-rose-500 transition-colors p-1 cursor-pointer",
                  title: "Delete this draft product",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] }, idx)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-black/10 dark:border-white/5 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", children: editingProduct ? "Editing Product" : isManualCreate ? "Creating Card" : "Reviewing Card" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-serif text-xl font-bold mt-1 text-foreground", children: [
                  "Product ",
                  currentImportIndex + 1,
                  " of ",
                  importedProducts.length
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: currentImportIndex === 0,
                    onClick: handlePrevImport,
                    className: "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-black/5 p-2 rounded-full border border-black/10 dark:border-white/10 transition-all text-foreground cursor-pointer",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: currentImportIndex === importedProducts.length - 1,
                    onClick: handleNextImport,
                    className: "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-black/5 p-2 rounded-full border border-black/10 dark:border-white/10 transition-all text-foreground cursor-pointer",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Product Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      required: true,
                      className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                      value: currentItem.name,
                      onChange: (e) => updateImportedProductField("name", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Brand / House" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                      value: currentItem.house,
                      onChange: (e) => updateImportedProductField("house", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      rows: 3,
                      className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-none leading-normal",
                      value: currentItem.description,
                      onChange: (e) => updateImportedProductField("description", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Category" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: currentItem.category,
                        onChange: (e) => updateImportedProductField("category", e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Gender" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none cursor-pointer focus:border-accent",
                        value: currentItem.gender,
                        onChange: (e) => updateImportedProductField("gender", e.target.value),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Women", children: "Women" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Men", children: "Men" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Unisex", children: "Unisex" })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Colour" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: currentItem.color || "",
                        onChange: (e) => updateImportedProductField("color", e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Fabric / Material" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: currentItem.material || "",
                        onChange: (e) => {
                          updateImportedProductField("material", e.target.value);
                          updateImportedProductField("fabric", e.target.value);
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Product Information" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      rows: 4,
                      placeholder: "Heading-based details. E.g.\n### Product details\nMaterial composition: 60% Cotton, 40% Polyester\n\n### About this item\nFit: Regular Fit",
                      className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2.5 text-xs text-foreground rounded-lg outline-none focus:border-accent resize-y min-h-[100px] leading-normal font-mono",
                      value: currentItem.productInfo || "",
                      onChange: (e) => updateImportedProductField("productInfo", e.target.value)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Original Price (regular)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                        value: currentItem.originalPrice || "",
                        placeholder: "e.g. ₹1,299",
                        onChange: (e) => {
                          const val = e.target.value;
                          const parsedVal = val.replace(/[^0-9.]/g, "");
                          updateImportedProductField("originalPrice", parsedVal ? `₹${parseInt(parsedVal).toLocaleString()}` : "");
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Discounted Price (sale)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        required: true,
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                        value: currentItem.price,
                        placeholder: "e.g. ₹999",
                        onChange: (e) => {
                          const val = e.target.value;
                          const parsedVal = val.replace(/[^0-9.]/g, "");
                          updateImportedProductField("price", parsedVal ? `₹${parseInt(parsedVal).toLocaleString()}` : "");
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Product Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent",
                        value: currentItem.type || "",
                        onChange: (e) => updateImportedProductField("type", e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "SKU Reference" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-surface border border-black/10 dark:border-white/10 p-2 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                        value: currentItem.sku,
                        onChange: (e) => updateImportedProductField("sku", e.target.value)
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border border-black/10 dark:border-white/10 rounded-2xl p-3 bg-black/5 dark:bg-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-accent block", children: "Sizes and Quantities" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-32 overflow-y-auto pr-1 scrollbar-thin", children: Object.entries(currentItem.stockPerSize || {}).map(([sz, qty]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 border border-black/10 dark:border-white/10 rounded-xl p-2 bg-black/5 dark:bg-white/5 relative group", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[9px] uppercase text-muted-foreground font-mono font-bold block", children: [
                      "Size ",
                      sz
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          min: "0",
                          className: "w-full bg-transparent border-0 p-0 text-xs text-foreground outline-none font-mono focus:ring-0",
                          value: qty,
                          onChange: (e) => updateImportedProductStock(sz, Math.max(0, parseInt(e.target.value) || 0))
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleRemoveSizeFromImport(sz),
                          className: "text-muted-foreground hover:text-rose-500 transition-colors p-1",
                          title: `Remove size ${sz}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ] }, sz)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-black/10 dark:border-white/10 pt-2 mt-2 flex items-end gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8px] uppercase text-muted-foreground font-bold block", children: "Size" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "XL",
                          className: "w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent uppercase",
                          value: newSizeName,
                          onChange: (e) => setNewSizeName(e.target.value)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-16 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8px] uppercase text-muted-foreground font-bold block", children: "Qty" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          min: "0",
                          className: "w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent text-center font-mono",
                          value: newSizeQty,
                          onChange: (e) => setNewSizeQty(Math.max(0, parseInt(e.target.value) || 0))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleAddSizeToImport,
                        className: "bg-accent/20 border border-accent/30 text-accent hover:bg-accent hover:text-white px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200",
                        children: "Add"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border border-black/10 dark:border-white/10 rounded-2xl p-3 bg-black/5 dark:bg-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase font-bold tracking-wider text-accent block", children: "Images Dossier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto py-1 scrollbar-thin max-h-24", children: [
                    (currentItem.images || []).map((imgUrl, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === (currentItem.images || []).length - 1;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-16 h-20 rounded-lg overflow-hidden border border-black/15 dark:border-white/15 bg-black shrink-0 group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgUrl, className: "w-full h-full object-cover", alt: "" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleRemoveImageFromImport(imgUrl),
                            className: "absolute top-0.5 right-0.5 bg-black/60 hover:bg-rose-600 text-white rounded-full p-0.5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10",
                            title: "Remove image",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2 h-2" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none", children: [
                          !isFirst ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleMoveImageLeft(idx),
                              className: "bg-black/80 hover:bg-accent text-white p-0.5 rounded cursor-pointer pointer-events-auto shadow-md",
                              title: "Move left",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-2.5 h-2.5" })
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                          !isLast ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleMoveImageRight(idx),
                              className: "bg-black/80 hover:bg-accent text-white p-0.5 rounded cursor-pointer pointer-events-auto shadow-md",
                              title: "Move right",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-2.5 h-2.5" })
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
                        ] }),
                        currentItem.image === imgUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-accent/80 text-[7px] font-bold text-center text-white py-0.5", children: "MAIN" })
                      ] }, idx);
                    }),
                    (currentItem.images || []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground italic py-4", children: "No images added." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8px] uppercase text-muted-foreground font-bold block", children: "New Image URL" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "Paste image url...",
                          className: "w-full bg-surface border border-black/10 dark:border-white/10 p-1 text-xs text-foreground rounded-lg outline-none focus:border-accent font-mono",
                          value: newImageUrl,
                          onChange: (e) => setNewImageUrl(e.target.value)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleAddImageToImport,
                        className: "bg-accent/20 border border-accent/30 text-accent hover:bg-accent hover:text-white px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200",
                        children: "Add"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setImportedProducts([]);
                    setIsReviewingImports(false);
                    setIsManualCreate(false);
                    setEditingProduct(null);
                  },
                  className: "editorial-label border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground dark:hover:text-white px-5 py-2.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer",
                  children: editingProduct ? "Cancel" : isManualCreate ? "Cancel" : "Cancel Import"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleSaveImportedProducts(true),
                  className: "editorial-label bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-sm shadow-lg font-bold flex items-center gap-2 cursor-pointer transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                    " ",
                    editingProduct ? "Save Changes" : isManualCreate ? "Publish Products" : "Publish"
                  ]
                }
              ),
              !editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleSaveImportedProducts(false),
                  className: "editorial-label bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-sm shadow-lg font-bold flex items-center gap-2 cursor-pointer transition-colors border border-white/5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
                    " ",
                    isManualCreate ? "Add Products" : "Add (Unpublished)"
                  ]
                }
              )
            ] })
          ] })
        ] }) });
      })(),
      productToDeleteIndex !== null && (() => {
        const prodToDelete = importedProducts[productToDeleteIndex];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-zinc-950 border border-rose-500/20 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-12 h-12 text-rose-500 mx-auto animate-bounce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-bold text-white font-serif", children: "Remove Draft Card?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            "Are you sure you want to delete ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: prodToDelete?.name || `Product ${productToDeleteIndex + 1}` }),
            " from the creation list? This action cannot be undone."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (productToDeleteIndex !== null) {
                    const updated = importedProducts.filter((_, i) => i !== productToDeleteIndex);
                    if (updated.length === 0) {
                      setIsReviewingImports(false);
                      setImportedProducts([]);
                      setIsManualCreate(false);
                      setEditingProduct(null);
                    } else {
                      setImportedProducts(updated);
                      if (currentImportIndex >= updated.length) {
                        setCurrentImportIndex(Math.max(0, updated.length - 1));
                      } else if (currentImportIndex === productToDeleteIndex) {
                        setCurrentImportIndex(Math.max(0, productToDeleteIndex - 1));
                      }
                    }
                    setProductToDeleteIndex(null);
                  }
                },
                className: "bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors",
                children: "Confirm Delete"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setProductToDeleteIndex(null),
                className: "bg-white/10 hover:bg-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-colors",
                children: "Cancel"
              }
            )
          ] })
        ] }) });
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-white/10 gap-8 text-sm font-serif mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setCatalogSection("main");
              setCatalogTab("all");
              setSelectedProductIds([]);
            },
            className: `pb-3 transition-colors cursor-pointer font-bold ${catalogSection === "main" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
            children: "Main Catalog"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setCatalogSection("vendors");
              setCatalogTab("all");
              setSelectedCatalogVendor(vendorsList[0]?.id || "blankapparel");
              setSelectedProductIds([]);
            },
            className: `pb-3 transition-colors cursor-pointer font-bold ${catalogSection === "vendors" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
            children: "Vendors"
          }
        )
      ] }),
      catalogSection === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-4 bg-white/5 p-1 rounded-full w-fit border border-white/5", children: vendorsList.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setSelectedCatalogVendor(v.id);
            setCatalogTab("all");
            setSelectedProductIds([]);
          },
          className: `px-4 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${selectedCatalogVendor === v.id ? "bg-accent text-white" : "text-muted-foreground hover:text-white"}`,
          children: v.companyName || v.id
        },
        v.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-white/10 gap-6 text-xs font-bold uppercase tracking-wider mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setCatalogTab("all");
              setSelectedProductIds([]);
            },
            className: `pb-2.5 transition-colors cursor-pointer ${catalogTab === "all" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              "All Products (",
              (catalogSection === "main" ? productsList : productsList.filter((p) => p.vendorId === selectedCatalogVendor && p.inCatalog === true)).length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setCatalogTab("unpublished");
              setSelectedProductIds([]);
            },
            className: `pb-2.5 transition-colors cursor-pointer ${catalogTab === "unpublished" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              "Unpublished (",
              (catalogSection === "main" ? productsList.filter((p) => p.status && p.status !== "PUBLISHED") : productsList.filter((p) => p.vendorId === selectedCatalogVendor && p.inCatalog === true && p.status && p.status !== "PUBLISHED")).length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setCatalogTab("published");
              setSelectedProductIds([]);
            },
            className: `pb-2.5 transition-colors cursor-pointer ${catalogTab === "published" ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              "Published (",
              (catalogSection === "main" ? productsList.filter((p) => p.status === "PUBLISHED" || !p.status) : productsList.filter((p) => p.vendorId === selectedCatalogVendor && p.inCatalog === true && (p.status === "PUBLISHED" || !p.status))).length,
              ")"
            ]
          }
        )
      ] }),
      (() => {
        let filtered = productsList;
        if (catalogSection === "main") ;
        else if (catalogSection === "vendors") {
          filtered = filtered.filter((p) => p.vendorId === selectedCatalogVendor && p.inCatalog === true);
        }
        if (catalogTab === "published") {
          filtered = filtered.filter((p) => p.status === "PUBLISHED" || !p.status);
        } else if (catalogTab === "unpublished") {
          filtered = filtered.filter((p) => p.status && p.status !== "PUBLISHED");
        }
        if (searchTerm) {
          const keywords = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
          if (keywords.length > 0) {
            filtered = filtered.filter((p) => {
              let score = 0;
              keywords.forEach((kw) => {
                const name = String(p.name || "").toLowerCase();
                const house = String(p.house || "").toLowerCase();
                const category = String(p.category || "").toLowerCase();
                const gender = String(p.gender || "").toLowerCase();
                const fabric = String(p.fabricMaterial || p.material || p.fabric || "").toLowerCase();
                const description = String(p.description || "").toLowerCase();
                const color = String(p.color || "").toLowerCase();
                const type = String(p.type || "").toLowerCase();
                const sku = String(p.sku || "").toLowerCase();
                const sizes = (p.sizes || []).map((s) => String(s || "").toLowerCase());
                const sizesStr = sizes.join(",");
                const stocks = Object.entries(p.stockPerSize || {}).map(([sz, qty]) => `${String(sz).toLowerCase()}:${qty}`);
                const stocksStr = stocks.join(" ");
                const price = String(p.price || "").toLowerCase();
                const originalPrice = String(p.originalPrice || "").toLowerCase();
                if (["men", "man", "gentlemen", "boy", "male"].includes(kw)) {
                  if (gender === "men" || gender === "unisex") {
                    score++;
                    return;
                  }
                }
                if (["women", "woman", "lady", "ladies", "girl", "female"].includes(kw)) {
                  if (gender === "women" || gender === "unisex") {
                    score++;
                    return;
                  }
                }
                const catNorm = category.replace("s", "");
                const kwNorm = kw.replace("s", "");
                if (catNorm.includes(kwNorm) || kwNorm.includes(catNorm)) {
                  score++;
                  return;
                }
                if (name.includes(kw) || house.includes(kw) || description.includes(kw) || color.includes(kw) || fabric.includes(kw) || type.includes(kw) || sku.includes(kw) || sizesStr.includes(kw) || stocksStr.includes(kw) || price.includes(kw) || originalPrice.includes(kw)) {
                  score++;
                  return;
                }
              });
              return score === keywords.length;
            });
          }
        }
        if (sortField === "date") {
          const getProductTimestamp = (prod) => {
            if (prod.id && String(prod.id).startsWith("pr-")) {
              const parts = String(prod.id).split("-");
              const ts = parseInt(parts[1]);
              if (!isNaN(ts)) return ts;
            }
            const numericPart = parseInt(String(prod.id).replace(/\D/g, ""));
            return isNaN(numericPart) ? 0 : numericPart;
          };
          filtered = [...filtered].sort((a, b) => {
            const tsA = getProductTimestamp(a);
            const tsB = getProductTimestamp(b);
            return sortDirection === "desc" ? tsB - tsA : tsA - tsB;
          });
        } else if (sortField === "price") {
          const getProductPrice = (prod) => {
            const basePrice = parseFloat(String(prod.price || "").replace(/[^0-9.]/g, ""));
            if (isNaN(basePrice)) return 0;
            const pct = prod.discount || 0;
            if (pct > 0) {
              return basePrice * (1 - pct / 100);
            }
            return basePrice;
          };
          filtered = [...filtered].sort((a, b) => {
            const pA = getProductPrice(a);
            const pB = getProductPrice(b);
            return sortDirection === "desc" ? pB - pA : pA - pB;
          });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl mb-6 text-xs backdrop-blur-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedProductIds.length === filtered.length && filtered.length > 0,
                    onChange: (e) => {
                      if (e.target.checked) {
                        setSelectedProductIds(filtered.map((p) => String(p.id)));
                      } else {
                        setSelectedProductIds([]);
                      }
                    },
                    className: "rounded border-white/20 text-accent focus:ring-accent w-4 h-4 bg-transparent"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-muted-foreground uppercase tracking-wider text-[10px]", children: [
                  "Select All (",
                  filtered.length,
                  ")"
                ] })
              ] }),
              selectedProductIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-mono font-bold", children: [
                "[",
                selectedProductIds.length,
                " Selected]"
              ] })
            ] }),
            selectedProductIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    selectedProductIds.forEach((id) => {
                      const p = productsList.find((x) => String(x.id) === id);
                      if (p) {
                        updateProduct(id, { ...p, status: "PUBLISHED" });
                      }
                    });
                    setSelectedProductIds([]);
                    triggerModal("success", "Bulk Published", "Selected products are now published to the user shop portal.", () => {
                    });
                  },
                  className: "bg-accent text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-accent/90 transition-all cursor-pointer shadow-lg shadow-accent/20",
                  children: "Bulk Publish"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setSelectedProductIds([]),
                  className: "bg-white/5 border border-white/10 text-foreground px-3 py-1.5 text-[10px] uppercase tracking-widest font-semibold rounded-full hover:bg-white/10 transition-colors cursor-pointer",
                  children: "Deselect All"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((p) => {
            const isChecked = selectedProductIds.includes(String(p.id));
            const isComplete = !!p.name && !!p.description && !!p.category && !!p.gender && (!!p.tag || p.tags && p.tags.length > 0) && !!p.color && (!!p.material || !!p.fabric) && (p.house || p.brand) && !!p.originalPrice && !!p.price && p.sizes && p.sizes.length > 0 && (p.images && p.images.length > 0 || !!p.image) && !!p.sku && !!p.type && !!p.seoTitle && !!p.seoDescription && !!p.seoKeywords;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass liquid-glass-card-hover relative flex flex-col group overflow-hidden border border-white/5 rounded-2xl bg-white/[0.02]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isChecked,
                  onChange: (e) => {
                    if (e.target.checked) {
                      setSelectedProductIds([...selectedProductIds, String(p.id)]);
                    } else {
                      setSelectedProductIds(selectedProductIds.filter((id) => id !== String(p.id)));
                    }
                  },
                  className: "rounded border-white/30 text-accent focus:ring-accent w-4 h-4 bg-zinc-950/80 backdrop-blur cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 z-20 flex items-center", children: (() => {
                let dotColorClass = "bg-yellow-500 shadow-yellow-500/80";
                let tooltipTitle = "Product information incomplete";
                if (p.status === "PUBLISHED") {
                  dotColorClass = "bg-emerald-500 shadow-emerald-500/80";
                  tooltipTitle = "Published live";
                } else if (isComplete) {
                  dotColorClass = "bg-blue-500 shadow-blue-500/80";
                  tooltipTitle = "Product fully complete but unpublished";
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    title: tooltipTitle,
                    className: `w-2.5 h-2.5 rounded-full border border-white/20 shadow-md animate-pulse ${dotColorClass}`
                  }
                );
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-zinc-950 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }),
                p.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-3 left-3 bg-accent/95 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5", children: p.tag })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col justify-between space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      p.house || p.brand,
                      " · ",
                      p.category
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent uppercase font-mono tracking-wider", children: p.type || "Product" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-base mt-1 text-white font-bold line-clamp-1", children: p.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-sm font-semibold", children: p.price }),
                    p.originalPrice && p.originalPrice !== p.price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-muted-foreground text-xs", children: p.originalPrice })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2 border-t border-white/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: p.status === "PUBLISHED" ? "text-emerald-400" : "text-amber-500", children: p.status === "PUBLISHED" ? "Published" : "Unpublished" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const isPublished = p.status === "PUBLISHED";
                          updateProduct(p.id, {
                            status: isPublished ? "UNPUBLISHED" : "PUBLISHED",
                            visibility: isPublished ? "HIDDEN" : "VISIBLE"
                          });
                          toast.success(isPublished ? "Product hidden" : "Product published live");
                        },
                        className: "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 outline-none cursor-pointer transition-colors",
                        children: p.status === "PUBLISHED" ? "Hide" : "Unhide"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleEditProduct(p), className: "flex-1 border border-white/10 hover:border-white/20 py-2 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 rounded-xl cursor-pointer bg-white/[0.02]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }),
                      " Edit"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteProduct(p.id), className: "border border-rose-500/20 hover:border-rose-500/45 text-rose-400 py-2 px-3 text-[10px] flex items-center justify-center rounded-xl cursor-pointer bg-rose-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
                  ] })
                ] })
              ] })
            ] }, p.id);
          }) })
        ] });
      })()
    ] }),
    tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Orders Lifecycle Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Month:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: filterMonth,
                onChange: (e) => setFilterMonth(e.target.value),
                className: "bg-surface border border-border-subtle rounded-md text-xs px-2.5 py-1.5 text-white outline-none focus:border-accent",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "--", children: "--" }),
                  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(idx), children: m }, m))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Year:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: filterYear,
                onChange: (e) => setFilterYear(e.target.value),
                className: "bg-surface border border-border-subtle rounded-md text-xs px-2.5 py-1.5 text-white outline-none focus:border-accent",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "--", children: "--" }),
                  Array.from(/* @__PURE__ */ new Set([
                    ...Array.from(new Set(ordersList.map((o) => {
                      const d = new Date(o.date);
                      return isNaN(d.getTime()) ? null : d.getFullYear();
                    }).filter((y) => typeof y === "number"))),
                    (/* @__PURE__ */ new Date()).getFullYear(),
                    2026,
                    2025,
                    2024
                  ])).sort((a, b) => b - a).map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(y), children: y }, y))
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Order ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Order Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Total (INR)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Delivery Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border-subtle text-sm", children: filteredOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-2/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedOrderDetails(o),
              className: "text-accent hover:underline text-left font-bold cursor-pointer",
              children: o.id
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 whitespace-nowrap text-xs text-muted-foreground", children: formatOrderDateTime(o.date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: o.customerName || "Member" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: o.items.map((item) => `${item.name} (${item.selectedSize || "M"}) x${item.qty}`).join(", ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 font-serif", children: [
            "₹",
            o.total.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusChip,
            {
              status: o.status,
              tone: o.status === "Delivered" ? "success" : o.status === "Processing" ? "warn" : o.status === "Shipped" ? "accent" : "neutral"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 text-right space-x-1 whitespace-nowrap", children: [
            o.status === "Processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateOrderStatus(o.userId, o.id, "Accepted"), className: "bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded", children: "Accept" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateOrderStatus(o.userId, o.id, "Rejected"), className: "bg-rose-600 hover:bg-rose-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded", children: "Reject" })
            ] }),
            o.status === "Accepted" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateOrderStatus(o.userId, o.id, "Shipped"), className: "bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded", children: "Ship Package" }),
            o.status === "Shipped" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateOrderStatus(o.userId, o.id, "Delivered"), className: "bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-2 py-1 rounded", children: "Deliver" })
          ] })
        ] }, o.id)) })
      ] }) })
    ] }),
    tab === "returns" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Returns Queue & Razorpay Auto-Refund" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Manage customer return requests, schedule courier pickups, and issue payouts." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Return ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Order ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Item Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Reason / Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border-subtle text-sm", children: returnsList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "py-6 text-center text-xs text-muted-foreground italic", children: "No returns registered in system queue." }) }) : returnsList.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-2/40 group cursor-pointer", onClick: () => setSelectedReturnDetails(r), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 font-mono text-xs text-accent font-bold group-hover:underline", children: r.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 font-mono text-xs", children: r.orderId }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white", children: r.customerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: r.customerId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-white", children: r.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
              "Size: ",
              r.selectedSize || "—",
              " · Qty: ",
              r.qty || 1
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-amber-200", children: r.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground max-w-xs truncate", children: r.comment })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 font-serif font-semibold", children: [
            "₹",
            r.refundAmount.toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusChip,
            {
              status: r.status,
              tone: r.status === "Refund Completed" || r.status === "Approved" ? "success" : r.status === "Pending" || r.status === "Under Review" ? "warn" : r.status === "Rejected" ? "danger" : "accent"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-right whitespace-nowrap", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSelectedReturnDetails(r),
              className: "bg-accent/20 hover:bg-accent text-accent hover:text-white text-[10px] uppercase font-bold px-2 py-1 rounded",
              children: "Details"
            }
          ) }) })
        ] }, r.id)) })
      ] }) })
    ] }),
    tab === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Customer Directories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border-subtle text-muted-foreground text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Customer Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Wallet Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right", children: "Orders Count" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border-subtle text-sm", children: customersList.map((c) => {
          const bal = state.wallets[c.id] ?? 0;
          const orderCount = state.orders[c.id]?.length ?? 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-2/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSelectedCustomerDetails(c),
                className: "font-mono text-xs text-accent hover:underline text-left cursor-pointer",
                children: c.id
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 font-semibold", children: [
              c.firstName,
              " ",
              c.lastName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: c.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 font-serif font-semibold text-accent", children: [
              "₹",
              bal.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-right font-semibold pr-2", children: orderCount })
          ] }, c.id);
        }) })
      ] }) })
    ] }),
    tab === "coupons" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Active Store Coupons" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setIsAddingCoupon(!isAddingCoupon),
            className: "editorial-label bg-accent text-white px-5 py-2.5 hover:bg-accent/90 flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " Add Coupon"
            ]
          }
        )
      ] }),
      isAddingCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in slide-in-from-top-4 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg", children: "Create Coupon Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCouponSubmit, className: "grid md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Coupon Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none", placeholder: "DIWALI30", value: couponForm.code, onChange: (e) => setCouponForm({ ...couponForm, code: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Discount Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "number", className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none", value: couponForm.discount, onChange: (e) => setCouponForm({ ...couponForm, discount: Number(e.target.value) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Coupon Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground", value: couponForm.type, onChange: (e) => setCouponForm({ ...couponForm, type: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "percentage", children: "Percentage (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fixed", children: "Fixed Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wallet", children: "Wallet Cashback" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "User Eligibility Limit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground", value: couponForm.userLimitType, onChange: (e) => setCouponForm({ ...couponForm, userLimitType: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unlimited", children: "Unlimited Users" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "limited", children: "Limited Users" })
            ] })
          ] }),
          couponForm.userLimitType === "limited" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Max User Count" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "number", min: "1", className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none", value: couponForm.usageLimit, onChange: (e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Coupon Expiry Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground", value: couponForm.expiryType, onChange: (e) => setCouponForm({ ...couponForm, expiryType: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "unlimited", children: "Unlimited Time (No Expiry)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "limited", children: "Limited Time (Expires)" })
            ] })
          ] }),
          couponForm.expiryType === "limited" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground font-semibold", children: "Expiry Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "date", className: "w-full bg-surface border border-border-subtle p-2 text-sm outline-none text-foreground", value: couponForm.expiryDate, onChange: (e) => setCouponForm({ ...couponForm, expiryDate: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-3 flex justify-end gap-3 pt-4 border-t border-border-subtle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { type: "button", variant: "outline", onClick: () => setIsAddingCoupon(false), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "editorial-label bg-accent text-white px-6 py-2.5 hover:bg-accent/90", children: "Add Coupon" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: couponsList.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "relative overflow-hidden flex flex-col justify-between min-h-48 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xl font-bold tracking-widest text-accent", children: c.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: [
            c.type,
            " discount"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1 my-3 text-muted-foreground border-y border-white/5 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground/80", children: "Expiry:" }),
            " ",
            c.expiryDate === "unlimited" || !c.expiryDate ? "Unlimited (No Expiry)" : c.expiryDate
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground/80", children: "Claims:" }),
            " ",
            c.usageLimit === -1 || !c.usageLimit ? `${c.usedCount || 0} / Unlimited` : `${c.usedCount || 0} / ${c.usageLimit} users`
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-2xl font-bold", children: c.type === "percentage" ? `${c.discount}% OFF` : `₹${c.discount.toLocaleString()} OFF` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeCoupon(c.code), className: "text-xs text-rose-400 hover:text-rose-500 uppercase font-semibold", children: "Delete" })
        ] })
      ] }, c.code)) })
    ] }),
    tab === "reviews" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "space-y-6 animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Product Reviews Moderation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Object.entries(state.productReviews).flatMap(
        ([productId, list]) => list.map((r) => ({ ...r, productId }))
      ).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border-subtle pb-4 last:border-0 flex justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif font-bold text-sm", children: r.userName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono", children: r.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center text-amber-400", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3 h-3 fill-current ${i < r.rating ? "text-amber-400" : "text-zinc-600"}` }, i)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm italic", children: [
            '"',
            r.comment,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
            "Product Code: ",
            r.productId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 justify-center shrink-0", children: r.status === "Approved" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => moderateReview(r.productId, r.id, "hide"), className: "text-[10px] uppercase font-bold border border-rose-500/30 hover:border-rose-500 text-rose-400 px-3 py-1.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }),
          " Hide Review"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => moderateReview(r.productId, r.id, "approve"), className: "text-[10px] uppercase font-bold border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 px-3 py-1.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
          " Approve"
        ] }) })
      ] }, r.id)) })
    ] }),
    tab === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsx(VendorDashboard, {})
  ] });
}
const CONTEST_NAV = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/admin/open-contest", label: "Open Contest", icon: Sparkles },
  { to: "/admin/top-16", label: "Top 16", icon: Crown },
  { to: "/admin/live-contest", label: "Live Contest", icon: Radio },
  { to: "/admin/vote-control", label: "Vote & Rate", icon: Lock },
  { to: "/admin/sponsors", label: "Sponsors", icon: Sparkles },
  { to: "/admin/photographers", label: "Photographers", icon: Camera },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/contestants", label: "Contestants", icon: UserCheck },
  { to: "/admin/abuse-reports", label: "Abuse Reports", icon: Flag },
  { to: "/admin/reports", label: "Reports", icon: ChartColumn }
];
const SHOP_NAV = [
  { to: "/admin", search: { tab: "overview" }, label: "Overview", icon: LayoutGrid },
  { to: "/admin", search: { tab: "homepage" }, label: "Homepage Layout", icon: Sparkles },
  { to: "/admin", search: { tab: "buckets" }, label: "Buckets Curation", icon: Layers },
  { to: "/admin", search: { tab: "products" }, label: "Products Catalog", icon: ShoppingBag },
  { to: "/admin", search: { tab: "orders" }, label: "Orders Tracker", icon: Truck },
  { to: "/admin", search: { tab: "returns" }, label: "Returns & Refunds", icon: RefreshCw },
  { to: "/admin", search: { tab: "customers" }, label: "Customers Directory", icon: Users },
  { to: "/admin", search: { tab: "coupons" }, label: "Coupons Manager", icon: Ticket },
  { to: "/admin", search: { tab: "reviews" }, label: "Reviews Moderator", icon: Star },
  { to: "/admin", search: { tab: "vendors" }, label: "Vendors & Partners", icon: Store }
];
function ModuleToggle() {
  const { state, setAdminMode } = usePortal();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mb-6 p-1 bg-surface-2 border border-border-subtle rounded flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setAdminMode("Contest"),
        className: `flex-1 text-center py-2 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 ${state.adminMode !== "Shop" ? "bg-foreground text-background shadow-md animate-in fade-in" : "text-muted-foreground hover:text-foreground"}`,
        children: "Contest"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setAdminMode("Shop"),
        className: `flex-1 text-center py-2 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 ${state.adminMode === "Shop" ? "bg-foreground text-background shadow-md animate-in fade-in" : "text-muted-foreground hover:text-foreground"}`,
        children: "Shop"
      }
    )
  ] });
}
function NavList({ onClick }) {
  const { state } = usePortal();
  const path2 = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });
  const navList = state.adminMode === "Shop" ? SHOP_NAV : CONTEST_NAV;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-0.5", children: navList.map((item) => {
    let active = false;
    if (state.adminMode === "Shop") {
      const itemSearch = "search" in item ? item.search : {};
      active = search.tab === itemSearch.tab || !search.tab && itemSearch.tab === "overview";
    } else {
      active = "exact" in item && item.exact ? path2 === item.to : path2 === item.to || item.to !== "/admin" && path2.startsWith(item.to);
    }
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.to,
        search: "search" in item ? item.search : void 0,
        onClick,
        className: "group relative flex items-center gap-3 py-2.5 pl-6 pr-4 text-[13px] text-foreground/65 hover:text-foreground transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute left-0 top-1/2 -translate-y-1/2 h-4 w-px transition-all ${active ? "bg-accent" : "bg-transparent"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3.5 h-3.5 ${active ? "text-accent" : "text-foreground/40"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: active ? "text-foreground" : "", style: { letterSpacing: "0.04em" }, children: item.label })
        ]
      }
    ) }, item.label);
  }) });
}
function AdminLayout({ title, eyebrow, actions, children }) {
  const { state } = usePortal();
  const [open, setOpen] = reactExports.useState(false);
  const search = useRouterState({ select: (s) => s.location.search });
  const activeTab = search.tab || "overview";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-border-subtle liquid-glass rounded-none z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "px-6 pt-8 pb-4 block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "w-32 h-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mt-2", children: "Operations Studio" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 editorial-label text-muted-foreground/50 mb-3", children: "Modules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-t border-border-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-xs", children: "LD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Léa Dubois" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "Main Admin" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-background/90 backdrop-blur px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, { className: "h-6 w-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-muted-foreground", children: "Admin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "lg:hidden fixed inset-0 z-50 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif", children: "Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleToggle, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavList, { onClick: () => setOpen(false) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:pl-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 hidden lg:flex items-center justify-between border-b border-border-subtle bg-background/85 backdrop-blur px-10 h-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "editorial-label text-foreground/80", children: "Season 03 · Live" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search contestants, sponsors, sessions…", className: "bg-transparent outline-none w-72 placeholder:text-muted-foreground/50" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative text-foreground/70 hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center text-[10px]", children: "LD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 text-muted-foreground" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 lg:px-10 pt-10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-border-subtle", children: [
        state.adminMode === "Shop" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent mb-3 font-semibold uppercase tracking-widest text-[10px]", children: "Luxury E-Commerce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif text-3xl lg:text-4xl capitalize", children: [
            "Shop - ",
            activeTab
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent mb-3", children: eyebrow }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl lg:text-4xl", children: title })
        ] }),
        state.adminMode === "Shop" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded uppercase", children: "Connected to shop.reevibes.com" }) }) : actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: actions })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 lg:px-10 py-10", children: state.adminMode === "Shop" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShopAdminPortal, { tab: activeTab }) : children })
    ] })
  ] });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function isDesktopPointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
}
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const Route$G = createFileRoute("/admin/top-16")({
  head: () => ({ meta: [{ title: "Top 16 — Admin" }] }),
  component: Top16Page
});
function CountryLogo({ countryName, className }) {
  const [whiteLogo, setWhiteLogo] = reactExports.useState(null);
  const [blackLogo, setBlackLogo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let activeName = countryName;
    if (activeName.toLowerCase() === "global") {
      activeName = "Globe";
    }
    fetch(`/api/countries-logos?country=${encodeURIComponent(activeName)}`).then((res) => res.json()).then((data) => {
      if (data.whiteLogo) setWhiteLogo(data.whiteLogo);
      if (data.blackLogo) setBlackLogo(data.blackLogo);
    }).catch((err) => console.error("Error loading country logo:", err));
  }, [countryName]);
  if (!whiteLogo && !blackLogo) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-xl tracking-wider text-foreground select-none opacity-80 uppercase", children: countryName });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [
    whiteLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: whiteLogo, alt: countryName, className: `${className} dark:block hidden` }),
    blackLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: blackLogo, alt: countryName, className: `${className} dark:hidden block` }),
    !blackLogo && whiteLogo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: whiteLogo, alt: countryName, className })
  ] });
}
function featuredImage(f) {
  return f.media.find((m) => m.isFeatured)?.image ?? f.media[0]?.image ?? f.contestant.image;
}
function applicationToFinalist(app, rank, score, status) {
  let mediaItems = [];
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(`reevibes:top16:media:${app.contestantId}`);
      if (raw) mediaItems = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  if (mediaItems.length === 0) {
    if (app.photos?.portrait) {
      mediaItems.push({
        id: `${app.contestantId}-m-portrait`,
        image: app.photos.portrait,
        caption: "Editorial portrait — North light.",
        alt: `${app.fullName} — portrait`,
        positions: ["TOP 16"],
        isFeatured: true,
        shopItems: []
      });
    }
    if (app.photos?.fullBody) {
      mediaItems.push({
        id: `${app.contestantId}-m-fullBody`,
        image: app.photos.fullBody,
        caption: "Campaign moment · Maison Lumière.",
        alt: `${app.fullName} — full body`,
        positions: [],
        isFeatured: !app.photos?.portrait,
        shopItems: []
      });
    }
    if (app.photos?.sideProfile) {
      mediaItems.push({
        id: `${app.contestantId}-m-side`,
        image: app.photos.sideProfile,
        caption: "Studio composition · side profile.",
        alt: `${app.fullName} — side profile`,
        positions: [],
        isFeatured: false,
        shopItems: []
      });
    }
    if (app.photos?.candid) {
      mediaItems.push({
        id: `${app.contestantId}-m-candid`,
        image: app.photos.candid,
        caption: "Candid moment.",
        alt: `${app.fullName} — candid`,
        positions: [],
        isFeatured: false,
        shopItems: []
      });
    }
    if (Array.isArray(app.photos?.additional)) {
      app.photos.additional.forEach((img, idx) => {
        if (img) {
          mediaItems.push({
            id: `${app.contestantId}-m-add-${idx}`,
            image: img,
            caption: `Additional frame ${idx + 1}.`,
            alt: `${app.fullName} — additional frame`,
            positions: [],
            isFeatured: false,
            shopItems: []
          });
        }
      });
    }
  }
  const videoItems = [];
  if (app.videos?.intro) {
    videoItems.push({
      id: `${app.contestantId}-v-intro`,
      url: app.videos.intro,
      title: "Introduction Reel",
      duration: "00:32"
    });
  }
  if (Array.isArray(app.videos?.additional)) {
    app.videos.additional.forEach((vUrl, idx) => {
      if (vUrl) {
        videoItems.push({
          id: `${app.contestantId}-v-add-${idx}`,
          url: vUrl,
          title: `Reel ${idx + 2}`,
          duration: "01:00"
        });
      }
    });
  }
  if (videoItems.length === 0) {
    videoItems.push({
      id: `${app.contestantId}-v0`,
      url: "",
      title: "Introduction Reel",
      duration: "00:32"
    });
  }
  return {
    contestant: {
      id: app.contestantId,
      slug: app.fullName.toLowerCase().replace(/[^a-z]+/g, "-"),
      name: app.fullName,
      country: app.country,
      city: app.city || "—",
      age: app.age,
      height: app.height || "—",
      measurements: app.bust ? `${app.bust}-${app.waist}-${app.hips}` : "—",
      status: "Top16",
      rank,
      votes: Math.floor(15e3 + Math.random() * 5e3),
      image: app.photos?.portrait || app.photos?.fullBody || "",
      gallery: [app.photos?.portrait, app.photos?.fullBody, app.photos?.sideProfile, app.photos?.candid].filter(Boolean),
      bio: app.biography || "A vision of modern femininity.",
      campaigns: ["Resort 25", "Atelier Noir"],
      social: { instagram: app.social?.instagram, tiktok: app.social?.tiktok },
      hairColour: app.hairColour || "—",
      eyeColour: app.eyeColour || "—",
      dob: app.dob || "—",
      bust: app.bust || "",
      waist: app.waist || "",
      hips: app.hips || ""
    },
    rank,
    score,
    status,
    completion: "Submitted",
    videos: videoItems,
    media: mediaItems
  };
}
function matchCountryName(a, b) {
  const norm = (s) => {
    let low = s.toLowerCase().trim();
    if (low === "uk") return "united kingdom";
    if (low === "usa") return "united states";
    return low;
  };
  return norm(a) === norm(b);
}
function buildCountriesFromStore(state, selectedYear, selectedMonth) {
  const ratingUsers = state.users.filter((u) => u.roles.includes("Ratings"));
  const judgementUsers = state.users.filter((u) => u.roles.includes("Judgements"));
  let savedStatuses = {};
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("reevibes:top16:statuses");
      if (raw) savedStatuses = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  const proceededCountries = Array.from(new Set(
    state.applications.filter((a) => state.positions[a.contestantId] === "Top16" && a.contestYear === selectedYear).map((a) => a.country || a.contestCountry).filter(Boolean)
  ));
  const dynamicDefs = [];
  const hasGlobalProceeded = proceededCountries.some((cName) => matchCountryName(cName, "Global") || matchCountryName(cName, "Globe"));
  if (hasGlobalProceeded) {
    dynamicDefs.push({
      id: "global",
      name: "Global",
      edition: `Season ${selectedYear}`,
      banner: HERO_IMAGES[0],
      stage: "Top 16 · Composition",
      isLive: true
    });
  }
  proceededCountries.forEach((cName) => {
    const isGlobal = matchCountryName(cName, "Global") || matchCountryName(cName, "Globe");
    if (isGlobal) return;
    dynamicDefs.push({
      id: cName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: cName,
      edition: `Edition ${selectedYear}`,
      banner: HERO_IMAGES[0],
      stage: "Top 16 · Composition",
      isLive: true
    });
  });
  const nonGlobal = dynamicDefs.filter((d) => d.id !== "global").map((d, i) => {
    const proceededApps = state.applications.filter((a) => {
      const matchCountry = matchCountryName(a.country, d.name) || matchCountryName(a.country, d.id);
      const inTop16 = state.positions[a.contestantId] === "Top16";
      const matchYear = a.contestYear === selectedYear;
      return matchCountry && inTop16 && matchYear;
    });
    const finalists = proceededApps.map((app, idx) => {
      const ratingScores = ratingUsers.map((u) => state.rateScores[u.id]?.[app.contestantId]).filter((s) => typeof s === "number");
      const rateAvg = ratingScores.length ? ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length : 0;
      const judgeAvgScores = judgementUsers.map((u) => {
        const m = state.judgeRatings[u.id]?.[app.contestantId];
        return m ? Object.values(m).filter((n) => typeof n === "number").reduce((a, b) => a + b, 0) / Object.values(m).length : NaN;
      }).filter((n) => !Number.isNaN(n));
      const intlAvg = judgeAvgScores.length ? judgeAvgScores.reduce((a, b) => a + b, 0) / judgeAvgScores.length : 0;
      const totalScore = rateAvg + intlAvg || 9.5 - idx * 0.1;
      const savedStatus = savedStatuses[app.contestantId];
      const status = savedStatus || (idx < 16 ? "Enabled" : "Reserve");
      return applicationToFinalist(app, idx + 1, totalScore, status);
    });
    return {
      ...d,
      finalists
    };
  });
  const proceededGlobalApps = state.applications.filter((a) => {
    const matchCountry = matchCountryName(a.country, "Global") || matchCountryName(a.country, "Globe");
    const inTop16 = state.positions[a.contestantId] === "Top16";
    const matchYear = a.contestYear === selectedYear;
    return matchCountry && inTop16 && matchYear;
  });
  let globalFinalists = [];
  if (proceededGlobalApps.length > 0) {
    globalFinalists = proceededGlobalApps.map((app, idx) => {
      const ratingScores = ratingUsers.map((u) => state.rateScores[u.id]?.[app.contestantId]).filter((s) => typeof s === "number");
      const rateAvg = ratingScores.length ? ratingScores.reduce((a, b) => a + b, 0) / ratingScores.length : 0;
      const judgeAvgScores = judgementUsers.map((u) => {
        const m = state.judgeRatings[u.id]?.[app.contestantId];
        return m ? Object.values(m).filter((n) => typeof n === "number").reduce((a, b) => a + b, 0) / Object.values(m).length : NaN;
      }).filter((n) => !Number.isNaN(n));
      const intlAvg = judgeAvgScores.length ? judgeAvgScores.reduce((a, b) => a + b, 0) / judgeAvgScores.length : 0;
      const totalScore = rateAvg + intlAvg || 9.5 - idx * 0.1;
      const savedStatus = savedStatuses[app.contestantId];
      const status = savedStatus || (idx < 16 ? "Enabled" : "Reserve");
      return applicationToFinalist(app, idx + 1, totalScore, status);
    });
  }
  const globalDef = hasGlobalProceeded ? {
    id: "global",
    name: "Global",
    edition: `Season ${selectedYear}`,
    banner: HERO_IMAGES[0],
    stage: "Top 16 · Composition",
    isLive: true
  } : null;
  return globalDef ? [{ ...globalDef, finalists: globalFinalists }, ...nonGlobal] : nonGlobal;
}
const YEARS = [2026, 2025, 2024];
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function Top16Page() {
  const { state, updateApplication } = useAppStore();
  const [selectedYear, setSelectedYear] = reactExports.useState(2026);
  const [selectedMonth, setSelectedMonth] = reactExports.useState("All");
  const [countries, setCountries] = reactExports.useState(() => buildCountriesFromStore(state, 2026));
  reactExports.useEffect(() => {
    setCountries(buildCountriesFromStore(state, selectedYear));
  }, [state, selectedYear, selectedMonth]);
  const [activeCountryId, setActiveCountryId] = reactExports.useState(null);
  const [query, setQuery] = reactExports.useState("");
  const [statusF, setStatusF] = reactExports.useState("All");
  const [active, setActive] = reactExports.useState(null);
  const [promote, setPromote] = reactExports.useState(null);
  const [showPublishPopup, setShowPublishPopup] = reactExports.useState(false);
  const activeCountry = countries.find((c) => c.id === activeCountryId) ?? null;
  function patchCountry(id, mut) {
    setCountries((arr) => arr.map((c) => c.id === id ? mut(c) : c));
  }
  function updateFinalist(countryId, fid, patch) {
    if (patch.status !== void 0) {
      try {
        const raw = window.localStorage.getItem("reevibes:top16:statuses");
        const savedStatuses = raw ? JSON.parse(raw) : {};
        savedStatuses[fid] = patch.status;
        window.localStorage.setItem("reevibes:top16:statuses", JSON.stringify(savedStatuses));
      } catch (e) {
        console.error(e);
      }
    }
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const next = { ...f, ...patch };
          const appPatch = {};
          if (patch.contestant) {
            if (patch.contestant.name !== void 0) appPatch.fullName = patch.contestant.name;
            if (patch.contestant.country !== void 0) {
              appPatch.country = patch.contestant.country;
              appPatch.contestCountry = patch.contestant.country;
            }
            if (patch.contestant.city !== void 0) appPatch.city = patch.contestant.city;
            if (patch.contestant.bio !== void 0) appPatch.biography = patch.contestant.bio;
          }
          if (patch.media !== void 0) {
            const featured = next.media.find((m) => m.isFeatured)?.image || next.media[0]?.image || "";
            appPatch.photos = {
              portrait: featured,
              fullBody: next.media[1]?.image || "",
              sideProfile: next.media[2]?.image || "",
              candid: next.media[3]?.image || "",
              additional: next.media.slice(4).map((m) => m.image)
            };
          }
          if (patch.videos !== void 0) {
            appPatch.videos = {
              intro: next.videos[0]?.url || "",
              additional: next.videos.slice(1).map((v) => v.url)
            };
          }
          if (Object.keys(appPatch).length > 0) {
            updateApplication(fid, appPatch);
          }
          return next;
        }
        return f;
      })
    }));
    setActive((a) => a && a.contestant.id === fid ? { ...a, ...patch } : a);
  }
  function mutateMedia(countryId, fid, fn) {
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const nextMedia = fn(f.media);
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(`reevibes:top16:media:${fid}`, JSON.stringify(nextMedia));
            } catch (e) {
              console.error(e);
            }
          }
          const next = { ...f, media: nextMedia };
          const featured = nextMedia.find((m) => m.isFeatured)?.image || nextMedia[0]?.image || "";
          updateApplication(fid, {
            photos: {
              portrait: featured,
              fullBody: nextMedia[1]?.image || "",
              sideProfile: nextMedia[2]?.image || "",
              candid: nextMedia[3]?.image || "",
              additional: nextMedia.slice(4).map((m) => m.image)
            }
          });
          return next;
        }
        return f;
      })
    }));
    setActive((a) => {
      if (a && a.contestant.id === fid) {
        const nextMedia = fn(a.media);
        return { ...a, media: nextMedia };
      }
      return a;
    });
  }
  function updateMedia(countryId, fid, mediaId, patch) {
    mutateMedia(
      countryId,
      fid,
      (media) => media.map((m) => m.id === mediaId ? { ...m, ...patch } : m)
    );
  }
  function deleteMedia(countryId, fid, mediaId) {
    mutateMedia(countryId, fid, (media) => media.filter((m) => m.id !== mediaId));
  }
  function setFeatured(countryId, fid, mediaId) {
    mutateMedia(
      countryId,
      fid,
      (media) => media.map((m) => ({ ...m, isFeatured: m.id === mediaId }))
    );
  }
  function reorderMedia(countryId, fid, from, to) {
    mutateMedia(countryId, fid, (media) => {
      const next = [...media];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }
  function mutateVideos(countryId, fid, fn) {
    patchCountry(countryId, (c) => ({
      ...c,
      finalists: c.finalists.map((f) => {
        if (f.contestant.id === fid) {
          const nextVideos = fn(f.videos);
          const next = { ...f, videos: nextVideos };
          updateApplication(fid, {
            videos: {
              intro: nextVideos[0]?.url || "",
              additional: nextVideos.slice(1).map((v) => v.url)
            }
          });
          return next;
        }
        return f;
      })
    }));
    setActive((a) => {
      if (a && a.contestant.id === fid) {
        const nextVideos = fn(a.videos);
        return { ...a, videos: nextVideos };
      }
      return a;
    });
  }
  function toggleStatus(country, f) {
    if (f.status === "Enabled") {
      const candidate = country.finalists.find((x) => x.status === "Reserve");
      if (candidate) {
        setPromote({ vacant: f, candidate });
        return;
      }
      updateFinalist(country.id, f.contestant.id, { status: "Disabled" });
    } else if (f.status === "Reserve") {
      updateFinalist(country.id, f.contestant.id, { status: "Enabled" });
    } else {
      updateFinalist(country.id, f.contestant.id, { status: "Reserve" });
    }
  }
  function confirmPromote() {
    if (!promote || !activeCountry) return;
    updateFinalist(activeCountry.id, promote.vacant.contestant.id, { status: "Reserve" });
    updateFinalist(activeCountry.id, promote.candidate.contestant.id, { status: "Enabled" });
    setPromote(null);
  }
  if (!activeCountry) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      AdminLayout,
      {
        eyebrow: "Module · Global Finalist Orchestration",
        title: "Live Countries · Top 16 Studio",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Export Lineups" }) }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mb-6 bg-surface p-4 border border-border-subtle rounded", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground text-xs", children: "Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: selectedYear,
                  onChange: (e) => setSelectedYear(Number(e.target.value)),
                  className: "bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground",
                  children: YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, className: "bg-background", children: y }, y))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground text-xs", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: selectedMonth,
                  onChange: (e) => setSelectedMonth(e.target.value),
                  className: "bg-transparent border border-border-subtle px-3 py-1.5 text-sm rounded bg-background text-foreground",
                  children: MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, className: "bg-background", children: m }, m))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCard, { className: "lg:col-span-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Live Editions", value: countries.filter((c) => c.isLive).length, accent: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Finalists in Composition", value: countries.reduce((n, c) => n + c.finalists.filter((f) => f.status === "Enabled").length, 0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Reserve Bench", value: countries.reduce((n, c) => n + c.finalists.filter((f) => f.status === "Reserve").length, 0), small: true })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminCard, { className: "lg:col-span-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { className: "w-3 h-3" }),
                " Global Orchestration"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 leading-relaxed", children: "Select a country to enter its editorial finalist studio. Each lineup runs in isolation with its own campaign media, sponsors and reserve bench." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(LiveCountryCard, { country: c, onOpen: () => setActiveCountryId(c.id) }, c.id)) })
        ]
      }
    );
  }
  const enabled = activeCountry.finalists.filter((f) => f.status === "Enabled");
  const reserves = activeCountry.finalists.filter((f) => f.status === "Reserve");
  const disabled = activeCountry.finalists.filter((f) => f.status === "Disabled");
  const filterList = (list) => list.filter((f) => {
    if (statusF !== "All" && f.status !== statusF) return false;
    if (query && !f.contestant.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AdminLayout,
    {
      eyebrow: `Module · ${activeCountry.name}`,
      title: "Top 16 · Editorial Studio",
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "ghost", onClick: () => setActiveCountryId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3 h-3" }),
          " All Countries"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", children: "Save Draft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: () => {
          if (!activeCountry) return;
          try {
            const raw = window.localStorage.getItem("reevibes:published-lineups");
            const list = raw ? JSON.parse(raw) : [];
            if (!list.includes(activeCountry.id)) {
              list.push(activeCountry.id);
              window.localStorage.setItem("reevibes:published-lineups", JSON.stringify(list));
            }
            const rawMeta = window.localStorage.getItem("reevibes:published-countries-meta");
            const meta = rawMeta ? JSON.parse(rawMeta) : {};
            meta[activeCountry.id] = {
              id: activeCountry.id,
              name: activeCountry.name,
              year: "2026"
            };
            window.localStorage.setItem("reevibes:published-countries-meta", JSON.stringify(meta));
            setShowPublishPopup(true);
          } catch (e) {
            console.error(e);
          }
        }, children: "Publish Line Up" })
      ] }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border-subtle bg-surface mb-6 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl lg:text-5xl", children: activeCountry.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Top 16", value: enabled.length, accent: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Reserves", value: reserves.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hairline-v h-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Stage", value: activeCountry.isLive ? "Live" : "Off", small: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminCard, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4 md:items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 border-b border-border-subtle pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  placeholder: "Search finalist by name…",
                  className: "w-full bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Selector,
              {
                value: statusF,
                onChange: (v) => setStatusF(v),
                options: ["All", "Enabled", "Reserve", "Disabled"]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" }), title: "Top 16 · Live Lineup", subtitle: "Editorial finalists composing the live broadcast lineup." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-12", children: [
            filterList(enabled).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FinalistCard, { finalist: f, onOpen: () => setActive(f), onToggle: () => toggleStatus(activeCountry, f) }, f.contestant.id)),
            filterList(enabled).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full text-center text-sm text-muted-foreground py-16 border border-dashed border-border-subtle", children: "No active finalists match your filters." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "w-3 h-3" }), title: `Reserve Bench · ${reserves.length} Stand-By`, subtitle: "Editorial reserves on stand-by — promote into the live lineup at any moment.", accent: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 p-4 border border-dashed border-accent/30 bg-accent/[0.02]", children: [
            filterList(reserves).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FinalistCard, { finalist: f, onOpen: () => setActive(f), onToggle: () => toggleStatus(activeCountry, f) }, f.contestant.id)),
            filterList(reserves).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full text-center text-sm text-muted-foreground py-10", children: "No reserves match your filters." })
          ] }),
          filterList(disabled).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }), title: "Disabled", subtitle: "Archived from the live lineup." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3", children: filterList(disabled).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FinalistCard, { finalist: f, onOpen: () => setActive(f), onToggle: () => toggleStatus(activeCountry, f) }, f.contestant.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!active, onOpenChange: (o) => !o && setActive(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogContent,
          {
            className: "max-w-none w-screen h-screen p-0 m-0 rounded-none border-0 bg-background/95 backdrop-blur-2xl overflow-y-auto sm:rounded-none translate-x-0 translate-y-0 top-0 left-0",
            style: { transform: "none", left: 0, top: 0 },
            children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(
              FinalistDetail,
              {
                finalist: active,
                selectedYear,
                activeCountry,
                onUpdate: (patch) => updateFinalist(activeCountry.id, active.contestant.id, patch),
                onUpdateMedia: (mid, patch) => updateMedia(activeCountry.id, active.contestant.id, mid, patch),
                onDeleteMedia: (mid) => deleteMedia(activeCountry.id, active.contestant.id, mid),
                onSetFeatured: (mid) => setFeatured(activeCountry.id, active.contestant.id, mid),
                onReorderMedia: (from, to) => reorderMedia(activeCountry.id, active.contestant.id, from, to),
                onMutateVideos: (fn) => mutateVideos(activeCountry.id, active.contestant.id, fn),
                onAddMedia: (url) => {
                  const nextMedia = {
                    id: `m-${Date.now()}`,
                    image: url,
                    caption: "Editorial frame",
                    alt: "Contestant photo",
                    positions: ["TOP 16"],
                    isFeatured: false,
                    shopItems: []
                  };
                  mutateMedia(activeCountry.id, active.contestant.id, (arr) => [...arr, nextMedia]);
                },
                onClose: () => setActive(null)
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!promote, onOpenChange: (o) => !o && setPromote(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl bg-background border border-border-subtle p-0", children: promote && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReservePromotionPanel,
          {
            vacant: promote.vacant,
            candidate: promote.candidate,
            onCancel: () => setPromote(null),
            onConfirm: confirmPromote
          }
        ) }) }),
        showPublishPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background dark:bg-zinc-950 border border-border-subtle dark:border-zinc-800 w-full max-w-md rounded-lg shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Line Up Published" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Line up published to Live Contest Dashboard successfully." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowPublishPopup(false),
              className: "bg-accent hover:bg-accent/90 text-white font-semibold text-sm px-6 py-2 rounded transition-colors shadow-md",
              children: "OK"
            }
          ) })
        ] }) })
      ]
    }
  );
}
function LiveCountryCard({ country, onOpen }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { y: -3 },
      onClick: onOpen,
      className: "group relative border border-border-subtle cursor-pointer bg-surface p-6 flex flex-col justify-between min-h-[200px] hover:border-accent transition-all duration-300 animate-in fade-in zoom-in-95",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] tracking-[0.2em] uppercase text-muted-foreground", children: [
            country.isLive ? "LIVE" : "PRE-LIVE",
            " · 2026"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-foreground/40 group-hover:text-accent transition-colors" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountryLogo, { countryName: country.name, className: "max-h-12 w-auto max-w-[80%] object-contain filter brightness-100 group-hover:scale-105 transition-transform duration-300" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-muted-foreground border-t border-border-subtle/30 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            country.finalists.filter((f) => f.status === "Enabled").length,
            " Finalists"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            country.finalists.filter((f) => f.status === "Reserve").length,
            " Reserves"
          ] })
        ] })
      ]
    }
  );
}
function Metric({ label, value, accent, small }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-serif ${small ? "text-xl" : "text-3xl"} ${accent ? "text-accent" : ""}`, children: value })
  ] });
}
function SectionHeader({ icon, title, subtitle, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 flex items-end justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `editorial-label flex items-center gap-2 mb-2 ${accent ? "text-accent" : "text-foreground/60"}`, children: [
      icon,
      " Section"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: title }),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5 max-w-xl", children: subtitle })
  ] }) });
}
function Selector({ value, onChange, options }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative md:w-48", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: "w-full appearance-none bg-surface-2 border border-border-subtle px-3 py-2 text-xs text-foreground/80 hover:border-accent/40 transition-colors focus:outline-none",
        children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" })
  ] });
}
function completionTone(c) {
  if (c === "Submitted") return "border-accent/50 bg-accent/[0.04]";
  if (c === "Draft") return "border-amber-400/30 bg-amber-400/[0.03]";
  return "border-border-subtle";
}
function completionLabel(c) {
  return c === "Submitted" ? "Profile Submitted" : c === "Draft" ? "Saved Draft" : "No Data";
}
function FinalistCard({ finalist, onOpen, onToggle }) {
  const { contestant: c, rank, score, status, completion } = finalist;
  const dim = status === "Disabled";
  const hero = featuredImage(finalist);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      whileHover: { y: -2 },
      className: `group relative border ${completionTone(completion)} ${dim ? "opacity-40" : ""} cursor-pointer transition-all`,
      onClick: onOpen,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-surface-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.img,
          {
            src: hero,
            alt: c.name,
            className: "absolute inset-0 w-full h-full object-cover",
            initial: { scale: 1.05 },
            whileHover: { scale: 1.1 },
            transition: { duration: 0.8, ease: "easeOut" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 font-serif text-white text-2xl leading-none", children: [
          status === "Reserve" ? "R" : "",
          String(rank).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status, tone: status === "Enabled" ? "accent" : status === "Reserve" ? "warn" : "neutral" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-base leading-tight", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-white/60 mt-0.5", children: c.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3 text-[10px] uppercase tracking-[0.2em]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/70", children: [
              "Score · ",
              score.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70", children: completionLabel(completion) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onToggle();
            },
            className: "editorial-label text-white border border-white/40 px-3 py-1 hover:border-accent hover:text-accent transition-colors",
            children: status === "Enabled" ? "Disable" : status === "Reserve" ? "Promote" : "Reserve"
          }
        ) })
      ] })
    }
  );
}
function FinalistDetail({
  finalist,
  selectedYear,
  activeCountry,
  onUpdate,
  onUpdateMedia,
  onDeleteMedia,
  onSetFeatured,
  onReorderMedia,
  onMutateVideos,
  onClose,
  onAddMedia
}) {
  const { contestant: c } = finalist;
  const hero = featuredImage(finalist);
  const [dragIndex, setDragIndex] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-black overflow-hidden flex items-center justify-center", style: { minHeight: "60vh" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero, alt: "", className: "w-full h-full object-cover blur-2xl scale-110" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: hero,
          alt: c.name,
          className: "relative z-10 max-h-[60vh] w-auto object-contain shadow-2xl"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-5 right-5 p-2 bg-black/60 text-white hover:bg-accent transition-colors z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-8 right-8 text-white z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-accent", children: [
          "Finalist · Rank ",
          String(finalist.rank).padStart(2, "0"),
          " · ",
          finalist.status
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-4xl lg:text-5xl mt-2", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-white/70 mt-2", children: [
          c.country,
          " · ",
          c.city,
          " · Score ",
          finalist.score.toFixed(2)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-8 space-y-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-px bg-border-subtle", children: [
        ["Status", finalist.status],
        ["Media", completionLabel(finalist.completion)],
        ["Photographer", finalist.media.find((m) => m.photographerId) ? "Assigned" : "Pending"],
        ["Live-Ready", finalist.completion === "Submitted" ? "Yes" : "No"]
      ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1.5 text-foreground", children: v })
      ] }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Contestant Profile Settings", subtitle: "Edit base name, country, city, and biography/description details.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 bg-surface p-6 border border-border-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground block mb-1", children: "Contestant Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: c.name,
                onChange: (e) => {
                  onUpdate({
                    contestant: { ...c, name: e.target.value }
                  });
                },
                className: "w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground block mb-1", children: "Country" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: c.country,
                onChange: (e) => {
                  onUpdate({
                    contestant: { ...c, country: e.target.value }
                  });
                },
                className: "w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground block mb-1", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: c.city,
                onChange: (e) => {
                  onUpdate({
                    contestant: { ...c, city: e.target.value }
                  });
                },
                className: "w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "editorial-label text-muted-foreground block mb-1", children: "Biography / Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: c.bio,
              onChange: (e) => {
                onUpdate({
                  contestant: { ...c, bio: e.target.value }
                });
              },
              rows: 6,
              className: "w-full bg-surface-2 border border-border-subtle px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent resize-none"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          title: "Introduction Films",
          subtitle: "Multiple editorial reels — drag to sequence playback order.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onMutateVideos((arr) => [...arr, {
                id: `vid-${Date.now()}`,
                url: "",
                title: `Reel ${arr.length + 1}`,
                duration: "00:00"
              }]),
              className: "editorial-label text-accent border border-accent/30 px-3 py-1.5 hover:bg-accent/5 transition-colors inline-flex items-center gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                " Add Film"
              ]
            }
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            VideoList,
            {
              videos: finalist.videos,
              onMutate: onMutateVideos
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          title: "Campaign Media Studio",
          subtitle: "Editorial frames · photographer credits · position tags · sponsors · shoppable looks. Drag to reorder · star to feature.",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-4", children: [
            finalist.media.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                draggable: true,
                onDragStart: () => setDragIndex(idx),
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== idx) onReorderMedia(dragIndex, idx);
                  setDragIndex(null);
                },
                onDragEnd: () => setDragIndex(null),
                className: `transition-opacity ${dragIndex === idx ? "opacity-40" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CampaignMediaCard,
                  {
                    media: m,
                    onChange: (p) => onUpdateMedia(m.id, p),
                    onDelete: () => onDeleteMedia(m.id),
                    onSetFeatured: () => onSetFeatured(m.id),
                    contestant: c,
                    selectedYear,
                    activeCountry
                  }
                )
              },
              m.id
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(UploadZone, { onUpload: onAddMedia })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 -mx-8 px-8 py-5 bg-background/95 backdrop-blur border-t border-border-subtle flex flex-col sm:flex-row gap-3 justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "ghost", onClick: () => onUpdate({ media: [] }), children: "Delete All Media" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "outline", onClick: () => onUpdate({ completion: "Draft" }), children: "Save Draft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: () => onUpdate({ completion: "Submitted" }), children: "Publish Portfolio" })
        ] })
      ] })
    ] })
  ] });
}
function Section({ title, subtitle, action, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent mb-1.5", children: "Module" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5 max-w-lg", children: subtitle })
      ] }),
      action
    ] }),
    children
  ] });
}
function VideoList({ videos, onMutate }) {
  const [dragIdx, setDragIdx] = reactExports.useState(null);
  const [confirmId, setConfirmId] = reactExports.useState(null);
  function update(id, patch) {
    onMutate((arr) => arr.map((v) => v.id === id ? { ...v, ...patch } : v));
  }
  function remove(id) {
    onMutate((arr) => arr.filter((v) => v.id !== id));
  }
  function reorder(from, to) {
    onMutate((arr) => {
      const next = [...arr];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  }
  if (videos.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border-subtle aspect-video flex flex-col items-center justify-center text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-6 h-6 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label", children: "No films yet · add an introduction reel" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 xl:grid-cols-3 gap-4", children: videos.map((v, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        draggable: true,
        onDragStart: () => setDragIdx(idx),
        onDragOver: (e) => e.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          if (dragIdx !== null && dragIdx !== idx) reorder(dragIdx, idx);
          setDragIdx(null);
        },
        onDragEnd: () => setDragIdx(null),
        className: `group border border-border-subtle bg-surface transition-all hover:border-accent ${dragIdx === idx ? "opacity-40" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video bg-black flex items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 border border-white/40 rounded-full flex items-center justify-center text-white group-hover:border-accent group-hover:text-accent transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 ml-0.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/60 backdrop-blur p-1.5 text-white/80 cursor-grab", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-3 h-3" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-accent transition-colors", title: "Replace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setConfirmId(v.id),
                  className: "bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-rose-400 transition-colors",
                  title: "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 editorial-label text-white/60 bg-black/40 px-1.5 py-0.5", children: v.duration }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 editorial-label text-white/80 bg-black/40 px-1.5 py-0.5", children: [
              "#",
              idx + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: v.title,
                onChange: (e) => update(v.id, { title: e.target.value }),
                placeholder: "Film title…",
                className: "w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: v.url,
                onChange: (e) => update(v.id, { url: e.target.value }),
                placeholder: "Video URL (e.g. YouTube/Vimeo)…",
                className: "w-full bg-transparent border-b border-border-subtle text-xs py-1 focus:outline-none focus:border-accent text-muted-foreground"
              }
            )
          ] })
        ]
      },
      v.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmId, onOpenChange: (o) => !o && setConfirmId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this film?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will remove the introduction film from the contestant's portfolio. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          if (confirmId) remove(confirmId);
          setConfirmId(null);
        }, children: "Delete Film" })
      ] })
    ] }) })
  ] });
}
function CampaignMediaCard({
  media,
  onChange,
  onDelete,
  onSetFeatured,
  contestant,
  selectedYear,
  activeCountry
}) {
  const { theme } = useTheme();
  const positions = ["TOP 16", "TOP 8", "TOP 4", "FINALS", "WINNER", "BEST PHOTOGRAPHY"];
  const [tab, setTab] = reactExports.useState("details");
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  const [dbPhotographers, setDbPhotographers] = reactExports.useState([]);
  const [showPublishPopup, setShowPublishPopup] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("reevibes:photographers");
      if (raw) {
        setDbPhotographers(JSON.parse(raw));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  const [sponsors, setSponsors] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const country = activeCountry?.name || contestant.country;
    if (!country) return;
    fetch(`/api/sponsors?action=get-sponsors-by-country&country=${encodeURIComponent(country)}`).then((res) => res.json()).then((data) => {
      if (Array.isArray(data)) {
        setSponsors(data);
      }
    }).catch((err) => console.error("Error loading country sponsors:", err));
  }, [activeCountry, contestant.country]);
  const filteredPhotographers = reactExports.useMemo(() => {
    return dbPhotographers.filter((p) => {
      const isActive = p.status === "Active";
      const matchCountry = p.assignedCountries.some((cName) => {
        const norm = (s) => {
          let low = s.toLowerCase().trim();
          if (low === "uk") return "united kingdom";
          if (low === "usa") return "united states";
          return low;
        };
        return norm(cName) === norm(contestant.country);
      });
      return isActive && matchCountry;
    });
  }, [dbPhotographers, contestant.country]);
  function togglePosition(p) {
    const has = media.positions.includes(p);
    const nextPositions = has ? media.positions.filter((x) => x !== p) : [...media.positions, p];
    if (p === "BEST PHOTOGRAPHY" && has) {
      try {
        const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
        if (raw) {
          const list = JSON.parse(raw);
          const portfolioId = `portfolio-${contestant.id}-${media.id}`;
          const filtered = list.filter((x) => x.portfolioId !== portfolioId);
          window.localStorage.setItem("reevibes:best-photography:portfolio", JSON.stringify(filtered));
        }
      } catch (e) {
        console.error(e);
      }
    }
    onChange({ positions: nextPositions });
  }
  const handlePublishPortfolio = () => {
    if (!media.photographerId) return;
    const photographer = filteredPhotographers.find((p) => p.id === media.photographerId);
    if (!photographer) return;
    try {
      const raw = window.localStorage.getItem("reevibes:best-photography:portfolio");
      const list = raw ? JSON.parse(raw) : [];
      const portfolioId = `portfolio-${contestant.id}-${media.id}`;
      const existingIdx = list.findIndex((x) => x.portfolioId === portfolioId);
      const record = {
        portfolioId,
        contestantId: contestant.id,
        contestantName: contestant.name,
        countryId: activeCountry ? activeCountry.id : contestant.country.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        countryName: contestant.country,
        year: selectedYear || 2026,
        photoId: media.id,
        photoUrl: media.image,
        photographerId: photographer.id,
        photographerName: photographer.name,
        positionTag: "BEST PHOTOGRAPHY",
        publishStatus: "published",
        createdDate: existingIdx !== -1 ? list[existingIdx].createdDate : (/* @__PURE__ */ new Date()).toISOString(),
        updatedDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (existingIdx !== -1) {
        list[existingIdx] = record;
      } else {
        list.push(record);
      }
      window.localStorage.setItem("reevibes:best-photography:portfolio", JSON.stringify(list));
      setShowPublishPopup(true);
    } catch (e) {
      console.error(e);
    }
  };
  function addShopItem() {
    onChange({
      shopItems: [
        ...media.shopItems,
        { id: `si-${Date.now()}`, name: "", url: "" }
      ]
    });
  }
  function updateShopItem(id, patch) {
    onChange({ shopItems: media.shopItems.map((s) => s.id === id ? { ...s, ...patch } : s) });
  }
  function removeShopItem(id) {
    onChange({ shopItems: media.shopItems.filter((s) => s.id !== id) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border ${media.isFeatured ? "border-accent shadow-[0_0_24px_-6px_rgba(255,90,140,0.35)]" : "border-border-subtle"} bg-surface group transition-all`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-black flex items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-25", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: media.image, alt: "", className: "w-full h-full object-cover blur-xl scale-110" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: media.image,
          alt: media.alt,
          className: "relative z-10 max-h-full max-w-full object-contain"
        }
      ),
      media.positions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 z-20 flex flex-col gap-1 items-start opacity-0 group-hover:opacity-100 transition-opacity", children: media.positions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border border-white/40 text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] bg-black/50 backdrop-blur", children: p }, p)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/60 backdrop-blur p-1.5 text-white/80 inline-flex cursor-grab", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-3 h-3" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onSetFeatured,
            title: media.isFeatured ? "Featured image" : "Set as featured",
            className: `p-1.5 backdrop-blur transition-colors ${media.isFeatured ? "bg-accent text-white" : "bg-black/60 text-white/80 hover:text-accent"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `w-3.5 h-3.5 ${media.isFeatured ? "fill-current" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-accent transition-colors", title: "Replace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setConfirmDelete(true),
              className: "bg-black/60 backdrop-blur p-1.5 text-white/80 hover:text-rose-400 transition-colors",
              title: "Delete photo",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] }),
      media.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 z-20 inline-flex items-center gap-1 bg-accent text-white px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] group-hover:opacity-0 transition-opacity", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5 fill-current" }),
        " Featured"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border-subtle", children: ["details", "shop"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(t),
        className: `flex-1 py-2 editorial-label transition-colors ${tab === t ? "text-accent border-b border-accent" : "text-muted-foreground hover:text-foreground"}`,
        children: t === "details" ? "Details & Credits" : `Shop · ${media.shopItems.length}`
      },
      t
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      tab === "details" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Caption", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: media.caption,
            onChange: (e) => onChange({ caption: e.target.value }),
            rows: 2,
            className: "w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent resize-none"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Alt Text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: media.alt,
            onChange: (e) => onChange({ alt: e.target.value }),
            className: "w-full bg-transparent border-b border-border-subtle text-sm py-1.5 focus:outline-none focus:border-accent"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Position Tags · Stage Visibility", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: positions.map((p) => {
          const active = media.positions.includes(p);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => togglePosition(p),
              className: `px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border transition-colors ${active ? "border-accent text-accent bg-accent/5" : "border-border-subtle text-muted-foreground hover:text-foreground"}`,
              children: p
            },
            p
          );
        }) }) }),
        media.positions.includes("BEST PHOTOGRAPHY") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Photographer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: media.photographerId ?? "",
              onChange: (e) => onChange({ photographerId: e.target.value || void 0 }),
              className: "w-full bg-surface-2 border border-border-subtle px-2.5 py-2 text-xs focus:outline-none focus:border-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select photographer —" }),
                filteredPhotographers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AdminButton,
            {
              variant: "accent",
              onClick: handlePublishPortfolio,
              disabled: !media.photographerId,
              className: "w-full py-2 text-xs font-semibold uppercase tracking-wider",
              children: "Publish Portfolio"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sponsor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: media.sponsorId ?? "",
            onChange: (e) => onChange({ sponsorId: e.target.value || void 0 }),
            className: "w-full bg-surface-2 border border-border-subtle px-2.5 py-2 text-xs focus:outline-none focus:border-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— No sponsor —" }),
              sponsors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                s.name,
                " · ",
                s.type
              ] }, s.id))
            ]
          }
        ) })
      ] }),
      showPublishPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background border border-border-subtle w-full max-w-md rounded shadow-2xl p-6 text-foreground animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl font-bold tracking-tight", children: "Portfolio Updated" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-6", children: "Best Photography portfolio has been updated successfully." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowPublishPopup(false),
            className: "bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider px-6 py-2.5 rounded transition-colors shadow-md",
            children: "OK"
          }
        ) })
      ] }) }),
      tab === "shop" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground", children: "Shoppable Looks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: addShopItem,
              className: "editorial-label text-accent border border-accent/30 px-2.5 py-1 hover:bg-accent/5 transition-colors inline-flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                " Add Item"
              ]
            }
          )
        ] }),
        media.shopItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border-subtle text-center py-6 text-xs text-muted-foreground", children: "No shoppable items yet. Add a dress, heels, handbag, earrings…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: media.shopItems.map((item) => {
          const preset = PRODUCTS.find((p) => p.id === item.productId);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border-subtle bg-surface-2 p-3 space-y-2 group/item", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3.5 h-3.5 text-accent mt-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: item.productId ?? "",
                  onChange: (e) => {
                    const pid = e.target.value || void 0;
                    const p = PRODUCTS.find((x) => x.id === pid);
                    updateShopItem(item.id, {
                      productId: pid,
                      name: p ? p.name : item.name
                    });
                  },
                  className: "w-full bg-background border border-border-subtle px-2 py-1.5 text-xs focus:outline-none focus:border-accent",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Custom item —" }),
                    PRODUCTS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                      p.name,
                      " · ",
                      p.price
                    ] }, p.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: item.name,
                  onChange: (e) => updateShopItem(item.id, { name: e.target.value }),
                  placeholder: "Item name · e.g. Silk Slip Dress",
                  className: "w-full bg-transparent border-b border-border-subtle text-sm py-1 focus:outline-none focus:border-accent"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border-subtle", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "w-3 h-3 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: item.url,
                    onChange: (e) => updateShopItem(item.id, { url: e.target.value }),
                    placeholder: "https://…",
                    className: "w-full bg-transparent text-xs py-1 focus:outline-none"
                  }
                )
              ] }),
              preset && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: preset.image, alt: preset.name, className: "w-10 h-12 object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground", children: [
                  preset.house,
                  " · ",
                  preset.price
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => removeShopItem(item.id),
                className: "p-1 text-muted-foreground hover:text-rose-400 transition-colors opacity-50 group-hover/item:opacity-100",
                title: "Remove item",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            )
          ] }) }, item.id);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmDelete, onOpenChange: setConfirmDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this photo?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently remove the photo and all its credits, tags and shoppable items from the contestant's portfolio." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          onDelete();
          setConfirmDelete(false);
        }, children: "Delete Photo" })
      ] })
    ] }) })
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-muted-foreground mb-1.5", children: label }),
    children
  ] });
}
function UploadZone({ onUpload }) {
  const [drag, setDrag] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: () => fileInputRef.current?.click(),
      onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          onUpload(url);
        }
      },
      className: `border border-dashed ${drag ? "border-accent bg-accent/[0.04]" : "border-border-subtle"} aspect-[3/4] flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-accent transition-colors`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            onChange: handleFileChange,
            accept: "image/*",
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border border-foreground/30 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-foreground/80", children: "Upload / Drop Editorial Frame" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-2 max-w-[200px]", children: "JPG · PNG · TIFF up to 30MB. Portrait 3:4 recommended." })
      ]
    }
  );
}
function ReservePromotionPanel({
  vacant,
  candidate,
  onCancel,
  onConfirm
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editorial-label text-accent mb-2", children: "Reserve Promotion Workflow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl mb-2", children: "Confirm lineup replacement" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-md", children: "Disabling an enabled finalist promotes the highest-ranked reserve into the live lineup. The operation is recorded in audit history." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-px bg-border-subtle mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PromoteSide, { title: "Vacating Rank", finalist: vacant, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PromoteSide, { title: "Promoting", finalist: candidate, tone: "accent" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-4 bg-surface-2 border border-border-subtle flex items-center gap-3 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "Rank ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: String(vacant.rank).padStart(2, "0") }),
        " will be filled by ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: candidate.contestant.name }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "ghost", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, { variant: "accent", onClick: onConfirm, children: "Confirm Promotion" })
    ] })
  ] });
}
function PromoteSide({ title, finalist, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `editorial-label mb-3 ${tone === "accent" ? "text-accent" : "text-rose-300"}`, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: featuredImage(finalist), alt: "", className: "w-16 h-20 object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg leading-tight", children: finalist.contestant.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mt-1", children: [
          finalist.contestant.country,
          " · Score ",
          finalist.score.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editorial-label text-muted-foreground mt-0.5", children: [
          "Current rank · ",
          String(finalist.rank).padStart(2, "0")
        ] })
      ] })
    ] })
  ] });
}
const $$splitComponentImporter$D = () => import("./admin.sponsors-Bnk4wz7d.mjs");
const Route$F = createFileRoute("/admin/sponsors")({
  head: () => ({
    meta: [{
      title: "Sponsors — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./admin.reports-BbDwJkVi.mjs");
const Route$E = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [{
      title: "Reports — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./admin.photographers-C71qoBlN.mjs");
const Route$D = createFileRoute("/admin/photographers")({
  head: () => ({
    meta: [{
      title: "Photographers — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./admin.open-contest-BpLhmpCR.mjs");
const Route$C = createFileRoute("/admin/open-contest")({
  head: () => ({
    meta: [{
      title: "Open Contest — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./admin.live-contest-61XvDLQN.mjs");
const Route$B = createFileRoute("/admin/live-contest")({
  head: () => ({
    meta: [{
      title: "Live Contest — Battle Studio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./admin.contestants-B-9Uq4uo.mjs");
const Route$A = createFileRoute("/admin/contestants")({
  head: () => ({
    meta: [{
      title: "Manage Contestants — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./admin.abuse-reports-2YqtnWGP.mjs");
const Route$z = createFileRoute("/admin/abuse-reports")({
  head: () => ({
    meta: [{
      title: "Abuse Reports — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("../_shop.search-B2m3eipn.mjs");
const searchParamsSchema = objectType({
  q: stringType().optional()
});
const Route$y = createFileRoute("/_shop/search")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  head: (ctx) => {
    const q = ctx.match?.search?.q || "";
    return {
      meta: [{
        title: q ? `Search: "${q}" — ReeVibes` : "Search Results — ReeVibes"
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("../_shop.register-B0-LaaZR.mjs");
const Route$x = createFileRoute("/_shop/register")({
  head: () => ({
    meta: [{
      title: "Shop Register — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("../_shop.login-DMqxFptS.mjs");
const Route$w = createFileRoute("/_shop/login")({
  head: () => ({
    meta: [{
      title: "Shop Sign In — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("../_shop.forgot-password-oYXFHYdG.mjs");
const Route$v = createFileRoute("/_shop/forgot-password")({
  head: () => ({
    meta: [{
      title: "Forgot Password — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("../_shop.categories-BdoGSyRG.mjs");
const categoriesSearchSchema = objectType({
  gender: enumType(["Men", "Women", "Unisex", "All"]).optional(),
  tag: stringType().optional(),
  bucketId: stringType().optional(),
  view: stringType().optional(),
  q: stringType().optional()
});
const Route$u = createFileRoute("/_shop/categories")({
  validateSearch: (search) => categoriesSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Categories — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const MapContext = reactExports.createContext(null);
const STYLE_PRESETS = {
  bright: "https://tiles.openfreemap.org/styles/bright",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  positron: "https://tiles.openfreemap.org/styles/positron",
  satellite: {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "Tiles &copy; Esri"
      },
      "cartodb-labels": {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap, &copy; CARTO"
      }
    },
    layers: [
      {
        id: "esri-satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 20
      },
      {
        id: "cartodb-labels-layer",
        type: "raster",
        source: "cartodb-labels",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  }
};
const Map = React2.forwardRef(
  ({
    center = [77.5946, 12.9716],
    // Default to Bangalore, India
    zoom = 12,
    viewport,
    onViewportChange,
    blank = false,
    styles,
    children
  }, ref) => {
    const containerRef = reactExports.useRef(null);
    const mapRef = reactExports.useRef(null);
    const [mapInstance, setMapInstance] = reactExports.useState(null);
    const [mapStyle, setMapStyle] = reactExports.useState("bright");
    const [showStyles, setShowStyles] = reactExports.useState(false);
    const getStyleUrl = (currentStyle) => {
      if (blank) return { version: 8, sources: {}, layers: [] };
      if (styles) {
        return styles.light;
      }
      return STYLE_PRESETS[currentStyle];
    };
    reactExports.useImperativeHandle(ref, () => ({
      easeTo: (options) => {
        mapRef.current?.easeTo(options);
      },
      flyTo: (options) => {
        mapRef.current?.flyTo(options);
      },
      getMap: () => mapRef.current
    }));
    reactExports.useEffect(() => {
      if (!containerRef.current) return;
      const initialCenter = viewport ? viewport.center : center;
      const initialZoom = viewport ? viewport.zoom : zoom;
      const initialBearing = viewport?.bearing ?? 0;
      const initialPitch = viewport?.pitch ?? 0;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getStyleUrl(mapStyle),
        center: initialCenter,
        zoom: initialZoom,
        bearing: initialBearing,
        pitch: initialPitch,
        attributionControl: false
      });
      mapRef.current = map;
      map.on("load", () => {
        setMapInstance(map);
      });
      map.on("move", () => {
        if (onViewportChange) {
          const centerLngLat = map.getCenter();
          onViewportChange({
            center: [centerLngLat.lng, centerLngLat.lat],
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            pitch: map.getPitch()
          });
        }
      });
      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }, []);
    reactExports.useEffect(() => {
      if (!mapRef.current || blank) return;
      mapRef.current.setStyle(getStyleUrl(mapStyle));
    }, [mapStyle, blank]);
    reactExports.useEffect(() => {
      if (!mapRef.current || viewport) return;
      const currentCenter = mapRef.current.getCenter();
      if (Math.abs(currentCenter.lng - center[0]) > 1e-4 || Math.abs(currentCenter.lat - center[1]) > 1e-4) {
        mapRef.current.setCenter(center);
      }
    }, [center]);
    reactExports.useEffect(() => {
      if (!mapRef.current || viewport) return;
      if (Math.abs(mapRef.current.getZoom() - zoom) > 0.1) {
        mapRef.current.setZoom(zoom);
      }
    }, [zoom]);
    reactExports.useEffect(() => {
      if (!mapRef.current || !viewport) return;
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const centerChanged = Math.abs(currentCenter.lng - viewport.center[0]) > 1e-4 || Math.abs(currentCenter.lat - viewport.center[1]) > 1e-4;
      const zoomChanged = Math.abs(currentZoom - viewport.zoom) > 0.1;
      if (centerChanged || zoomChanged) {
        mapRef.current.jumpTo({
          center: viewport.center,
          zoom: viewport.zoom,
          bearing: viewport.bearing,
          pitch: viewport.pitch
        });
      }
    }, [viewport]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-lg font-sans", children: [
      !blank && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-3 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowStyles(!showStyles),
            className: "flex items-center gap-1.5 bg-black/80 hover:bg-black/95 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Style" })
            ]
          }
        ),
        showStyles && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1.5 w-28 bg-black/90 border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg flex flex-col z-30", children: ["bright", "liberty", "positron", "satellite"].map((style) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setMapStyle(style);
              setShowStyles(false);
            },
            className: `px-3 py-2 text-left text-xs capitalize transition-colors hover:bg-white/10 cursor-pointer ${mapStyle === style ? "text-[#d4af37] font-bold bg-white/5" : "text-white/80"}`,
            children: style
          },
          style
        )) })
      ] }) }),
      mapInstance && /* @__PURE__ */ jsxRuntimeExports.jsx(MapContext.Provider, { value: { map: mapInstance }, children })
    ] });
  }
);
Map.displayName = "Map";
function MapMarker({
  longitude,
  latitude,
  draggable = false,
  onDrag,
  children
}) {
  const { map } = reactExports.useContext(MapContext) || {};
  const markerRef = reactExports.useRef(null);
  const elementRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!map) return;
    const el = document.createElement("div");
    el.style.display = "inline-block";
    const marker = new maplibregl.Marker({
      element: el,
      draggable
    }).setLngLat([longitude, latitude]).addTo(map);
    markerRef.current = marker;
    if (onDrag) {
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onDrag({ lng: lngLat.lng, lat: lngLat.lat });
      });
    }
    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map]);
  reactExports.useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);
  reactExports.useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setDraggable(draggable);
    }
  }, [draggable]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "none" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: elementRef, children }),
    markerRef.current && elementRef.current && /* @__PURE__ */ jsxRuntimeExports.jsx(MarkerPortal, { element: elementRef.current, target: markerRef.current.getElement() })
  ] });
}
function MarkerPortal({ element, target }) {
  reactExports.useEffect(() => {
    target.appendChild(element);
    return () => {
      if (target.contains(element)) {
        target.removeChild(element);
      }
    };
  }, [element, target]);
  return null;
}
function MarkerContent({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative transform -translate-y-1/2", children });
}
const cartSearchSchema = objectType({
  buyNow: stringType().optional(),
  productId: stringType().optional(),
  size: stringType().optional()
});
const Route$t = createFileRoute("/_shop/cart")({
  validateSearch: (search) => cartSearchSchema.parse(search),
  component: ShopCart
});
function ShopCart() {
  const {
    state,
    removeFromShopCart,
    clearShopCart,
    createOrder,
    addAddress,
    updateAddress,
    updateShopCartQty,
    restoreToShopCart,
    addWalletCredit
  } = usePortal();
  const navigate = useNavigate();
  const user = state.user;
  const cartItems = state.shopCart || [];
  const search = Route$t.useSearch();
  const isBuyNow = search.buyNow === "true";
  const [checkoutStep, setCheckoutStep] = reactExports.useState(
    isBuyNow ? "address" : "cart"
  );
  const [selectedKeys, setSelectedKeys] = reactExports.useState([]);
  const [checkoutItems, setCheckoutItems] = reactExports.useState([]);
  const [lastRemovedItem, setLastRemovedItem] = reactExports.useState(null);
  const [showUndoNotification, setShowUndoNotification] = reactExports.useState(false);
  const [activeAddressIdx, setActiveAddressIdx] = reactExports.useState(0);
  const [isEditingAddress, setIsEditingAddress] = reactExports.useState(false);
  const [editName, setEditName] = reactExports.useState("");
  const [editStreet, setEditStreet] = reactExports.useState("");
  const [editCity, setEditCity] = reactExports.useState("");
  const [editDistrict, setEditDistrict] = reactExports.useState("");
  const [editState, setEditState] = reactExports.useState("");
  const [editPincode, setEditPincode] = reactExports.useState("");
  const [editPhone, setEditPhone] = reactExports.useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newStreet, setNewStreet] = reactExports.useState("");
  const [newCity, setNewCity] = reactExports.useState("");
  const [newDistrict, setNewDistrict] = reactExports.useState("");
  const [newState, setNewState] = reactExports.useState("");
  const [newPincode, setNewPincode] = reactExports.useState("");
  const [newPhone, setNewPhone] = reactExports.useState("");
  const [mapCenter, setMapCenter] = reactExports.useState([77.5946, 12.9716]);
  const [markerPos, setMarkerPos] = reactExports.useState(null);
  const [isLocating, setIsLocating] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (newPincode.trim().length === 6 && /^\d+$/.test(newPincode.trim())) {
      fetch(`https://api.postalpincode.in/pincode/${newPincode.trim()}`).then((res) => res.json()).then((data) => {
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const office = data[0].PostOffice[0];
          setNewCity(office.Name || office.Block || "");
          setNewDistrict(office.District || "");
          setNewState(office.State || "");
          toast.success("India Pincode details retrieved!");
          const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${newPincode.trim()}`;
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: { "User-Agent": "ReeVibes-Shop-Portal" }
          }).then((res) => res.json()).then((d) => {
            if (d && d[0]) {
              const lngNum = parseFloat(d[0].lon);
              const latNum = parseFloat(d[0].lat);
              setMapCenter([lngNum, latNum]);
              setMarkerPos([lngNum, latNum]);
            }
          });
        }
      }).catch(console.error);
    }
  }, [newPincode]);
  reactExports.useEffect(() => {
    if (editPincode.trim().length === 6 && /^\d+$/.test(editPincode.trim())) {
      fetch(`https://api.postalpincode.in/pincode/${editPincode.trim()}`).then((res) => res.json()).then((data) => {
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const office = data[0].PostOffice[0];
          setEditCity(office.Name || office.Block || "");
          setEditDistrict(office.District || "");
          setEditState(office.State || "");
          toast.success("India Pincode details retrieved!");
          const query = `${office.Name || ""}, ${office.District || ""}, ${office.State || ""} - ${editPincode.trim()}`;
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
            headers: { "User-Agent": "ReeVibes-Shop-Portal" }
          }).then((res) => res.json()).then((d) => {
            if (d && d[0]) {
              const lngNum = parseFloat(d[0].lon);
              const latNum = parseFloat(d[0].lat);
              setMapCenter([lngNum, latNum]);
              setMarkerPos([lngNum, latNum]);
            }
          });
        }
      }).catch(console.error);
    }
  }, [editPincode]);
  const handleReverseGeocode = async (lng, lat) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || addr.industrial || "";
        const city = addr.city || addr.town || addr.village || addr.municipality || "";
        const district = addr.county || addr.district || "";
        const stateVal = addr.state || "";
        const pincode = addr.postcode || "";
        if (isEditingAddress) {
          setEditStreet(street);
          setEditCity(city);
          setEditDistrict(district);
          setEditState(stateVal);
          setEditPincode(pincode ? pincode.replace(/\D/g, "").slice(0, 6) : "");
        } else {
          setNewStreet(street);
          setNewCity(city);
          setNewDistrict(district);
          setNewState(stateVal);
          setNewPincode(pincode ? pincode.replace(/\D/g, "").slice(0, 6) : "");
        }
        toast.success("Location address resolved!");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setMapCenter([longitude, latitude]);
        setMarkerPos([longitude, latitude]);
        setIsLocating(false);
        handleReverseGeocode(longitude, latitude);
      },
      (error) => {
        setIsLocating(false);
        toast.error("Failed to detect location. Please search or point manually.");
      },
      { enableHighAccuracy: true, timeout: 1e4 }
    );
  };
  const handleGeocodeActiveAddress = async () => {
    const street = isEditingAddress ? editStreet : newStreet;
    const city = isEditingAddress ? editCity : newCity;
    const district = isEditingAddress ? editDistrict : newDistrict;
    const stateVal = isEditingAddress ? editState : newState;
    const pincode = isEditingAddress ? editPincode : newPincode;
    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (!query) {
      toast.error("Please enter some address details first.");
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      });
      const data = await res.json();
      if (data && data[0]) {
        const { lon, lat } = data[0];
        const lngNum = parseFloat(lon);
        const latNum = parseFloat(lat);
        setMapCenter([lngNum, latNum]);
        setMarkerPos([lngNum, latNum]);
        toast.success("Address located on map!");
      } else {
        toast.error("Entered location is invalid!");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Entered location is invalid!");
    }
  };
  const [paymentMethod, setPaymentMethod] = reactExports.useState("razorpay");
  const [couponCode, setCouponCode] = reactExports.useState("");
  const [activeCoupon, setActiveCoupon] = reactExports.useState(null);
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState("");
  const [stockCheckDialog, setStockCheckDialog] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isBuyNow && search.productId && search.size) {
      const key = `${search.productId}-${search.size}`;
      setSelectedKeys([key]);
      const matched = cartItems.filter(
        (item) => item.productId === search.productId && item.selectedSize === search.size
      );
      if (matched.length > 0) {
        setCheckoutItems(matched);
      }
    } else if (cartItems.length > 0 && selectedKeys.length === 0) {
      setSelectedKeys(cartItems.map((item) => `${item.productId}-${item.selectedSize || "M"}`));
    }
  }, [cartItems, isBuyNow, search.productId, search.size]);
  const validSelectedKeys = selectedKeys.filter(
    (k) => cartItems.some((item) => `${item.productId}-${item.selectedSize || "M"}` === k)
  );
  const selectedItems = cartItems.filter(
    (item) => validSelectedKeys.includes(`${item.productId}-${item.selectedSize || "M"}`)
  );
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")) * item.qty,
    0
  );
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const discountPercent = activeCoupon ? activeCoupon.discount : 0;
  const discountAmount = Math.round(selectedTotal * discountPercent / 100);
  const finalTotal = Math.max(0, selectedTotal - discountAmount);
  const getParsedAddresses = () => {
    const rawList = user ? state.addresses[user.id] || [] : [];
    return rawList.map((addrStr) => {
      try {
        if (addrStr.trim().startsWith("{")) {
          return JSON.parse(addrStr);
        }
      } catch (e) {
      }
      return {
        name: user ? `${user.firstName} ${user.lastName}` : "Customer Name",
        address: addrStr,
        phone: user?.phone || ""
      };
    });
  };
  const parsedAddresses = getParsedAddresses();
  const handleToggleSelectAll = () => {
    if (validSelectedKeys.length === cartItems.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(cartItems.map((item) => `${item.productId}-${item.selectedSize || "M"}`));
    }
  };
  const handleToggleSelectItem = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      setSelectedKeys([...selectedKeys, key]);
    }
  };
  const handleRemoveItem = (item) => {
    setLastRemovedItem(item);
    setShowUndoNotification(true);
    removeFromShopCart(item.productId, item.selectedSize);
    setTimeout(() => {
      setLastRemovedItem((prev) => {
        if (prev?.productId === item.productId && prev?.selectedSize === item.selectedSize) {
          setShowUndoNotification(false);
        }
        return prev;
      });
    }, 8e3);
  };
  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      restoreToShopCart(lastRemovedItem);
      setShowUndoNotification(false);
      setLastRemovedItem(null);
      toast.success(`Restored ${lastRemovedItem.name} to cart!`);
    }
  };
  const handleStartEditAddress = (idx) => {
    const addr = parsedAddresses[idx];
    setEditName(addr.name);
    setEditPhone(addr.phone);
    setIsEditingAddress(true);
    const parts = addr.address.split(", ");
    let street = "";
    let city = "";
    let district = "";
    let stateVal = "";
    let pincode = "";
    if (parts.length >= 4) {
      street = parts[0];
      city = parts[1];
      if (parts.length === 5) {
        district = parts[2];
        const stateAndPin = parts[3].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      } else {
        district = "";
        const stateAndPin = parts[2].split(" - ");
        stateVal = stateAndPin[0] || "";
        pincode = stateAndPin[1] || "";
      }
    } else {
      street = addr.address;
    }
    setEditStreet(street);
    setEditCity(city);
    setEditDistrict(district);
    setEditState(stateVal);
    setEditPincode(pincode);
    const query = [street, city, district, stateVal, pincode].filter(Boolean).join(", ");
    if (query) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: { "User-Agent": "ReeVibes-Shop-Portal" }
      }).then((res) => res.json()).then((data) => {
        if (data && data[0]) {
          const lngNum = parseFloat(data[0].lon);
          const latNum = parseFloat(data[0].lat);
          setMapCenter([lngNum, latNum]);
          setMarkerPos([lngNum, latNum]);
        }
      }).catch(console.error);
    }
  };
  const handleSaveEditedAddress = () => {
    if (!user || !editName.trim() || !editStreet.trim() || !editCity.trim() || !editState.trim() || !editPincode.trim() || !editPhone.trim()) {
      toast.error("Please fill in all address details.");
      return;
    }
    const fullAddressText = `${editStreet.trim()}, ${editCity.trim()}, ${editDistrict.trim() ? editDistrict.trim() + ", " : ""}${editState.trim()} - ${editPincode.trim()}`;
    const updatedStr = JSON.stringify({
      name: editName.trim(),
      address: fullAddressText.trim(),
      phone: editPhone.trim()
    });
    updateAddress(user.id, activeAddressIdx, updatedStr);
    setIsEditingAddress(false);
    setMarkerPos(null);
    toast.success("Address updated successfully.");
  };
  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!user || !newName.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newPincode.trim() || !newPhone.trim()) {
      toast.error("Please fill in all details for the new address.");
      return;
    }
    const fullAddressText = `${newStreet.trim()}, ${newCity.trim()}, ${newDistrict.trim() ? newDistrict.trim() + ", " : ""}${newState.trim()} - ${newPincode.trim()}`;
    const newStr = JSON.stringify({
      name: newName.trim(),
      address: fullAddressText.trim(),
      phone: newPhone.trim()
    });
    addAddress(user.id, newStr);
    setNewName("");
    setNewStreet("");
    setNewCity("");
    setNewDistrict("");
    setNewState("");
    setNewPincode("");
    setNewPhone("");
    setIsAddingNewAddress(false);
    setMarkerPos(null);
    setActiveAddressIdx(parsedAddresses.length);
    toast.success("New shipping address added!");
  };
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const coupon = state.coupons.find(
      (c) => c.code === couponCode.trim().toUpperCase() && c.active
    );
    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }
    if (coupon.expiryDate && coupon.expiryDate !== "unlimited") {
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      if (todayStr > coupon.expiryDate) {
        toast.error("This coupon has expired.");
        return;
      }
    }
    if (coupon.usageLimit !== void 0 && coupon.usageLimit !== -1) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        toast.error("Coupon usage limit has been reached.");
        return;
      }
    }
    setActiveCoupon(coupon);
    setAppliedCoupon(coupon.code);
    const initialDiscount = Math.round(selectedTotal * coupon.discount / 100);
    toast.success(`Coupon applied: ₹${initialDiscount.toLocaleString()} OFF`);
  };
  const handleStartPlaceOrder = () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      navigate({ to: "/login" });
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to purchase.");
      return;
    }
    const inStockItems = [];
    const outOfStockItems = [];
    selectedItems.forEach((item) => {
      const catalogProduct = state.products?.find((p) => p.id === item.productId);
      if (!catalogProduct) {
        outOfStockItems.push({
          item,
          maxAvailable: 0,
          reason: "Product is no longer available in the catalog."
        });
        return;
      }
      const sizeStock = catalogProduct.stockPerSize?.[item.selectedSize || "M"] ?? 0;
      if (sizeStock === 0) {
        outOfStockItems.push({
          item,
          maxAvailable: 0,
          reason: `Size ${item.selectedSize || "M"} is completely out of stock.`
        });
      } else if (sizeStock < item.qty) {
        outOfStockItems.push({
          item,
          maxAvailable: sizeStock,
          reason: `Requested quantity is ${item.qty}, but only ${sizeStock} pieces are left.`
        });
        inStockItems.push({
          item,
          maxAvailable: sizeStock
        });
      } else {
        inStockItems.push({
          item,
          maxAvailable: sizeStock
        });
      }
    });
    if (outOfStockItems.length > 0) {
      setStockCheckDialog({
        open: true,
        inStockItems,
        outOfStockItems
      });
    } else {
      setCheckoutItems(selectedItems);
      setCheckoutStep("address");
    }
  };
  const handleConfirmStockAdjustment = () => {
    if (!stockCheckDialog) return;
    stockCheckDialog.inStockItems.forEach(({ item, maxAvailable }) => {
      if (item.qty > maxAvailable) {
        updateShopCartQty(item.productId, item.selectedSize || "M", maxAvailable);
      }
    });
    stockCheckDialog.outOfStockItems.forEach(({ item, maxAvailable }) => {
      if (maxAvailable === 0) {
        removeFromShopCart(item.productId, item.selectedSize);
      }
    });
    const finalCheckoutItems = stockCheckDialog.inStockItems.map(({ item, maxAvailable }) => ({
      ...item,
      qty: Math.min(item.qty, maxAvailable)
    })).filter((item) => item.qty > 0);
    if (finalCheckoutItems.length === 0) {
      toast.error("No items are available in stock. Order cannot be placed.");
      setStockCheckDialog(null);
      return;
    }
    setCheckoutItems(finalCheckoutItems);
    setStockCheckDialog(null);
    setCheckoutStep("address");
    toast.success("Proceeding with only available in-stock items.");
  };
  const handleProceedToPayment = () => {
    if (parsedAddresses.length === 0) {
      toast.error("Please add a shipping address first.");
      return;
    }
    setCheckoutStep("payment");
  };
  const handleFinalOrderSubmit = () => {
    if (!user) return;
    const selectedAddressText = parsedAddresses[activeAddressIdx] ? `${parsedAddresses[activeAddressIdx].name}, ${parsedAddresses[activeAddressIdx].address}, Phone: ${parsedAddresses[activeAddressIdx].phone}` : "";
    if (!selectedAddressText) {
      toast.error("Please select a shipping address.");
      setCheckoutStep("address");
      return;
    }
    if (paymentMethod === "wallet") {
      const balance = state.wallets[user.id] ?? 0;
      if (balance < finalTotal) {
        toast.error("Insufficient wallet balance. Please choose another payment method.");
        return;
      }
      addWalletCredit(user.id, -finalTotal);
    }
    createOrder(user.id, {
      items: checkoutItems,
      total: finalTotal,
      address: selectedAddressText,
      appliedCoupon: appliedCoupon || void 0
    });
    toast.success("Thank you! Your order has been placed successfully.");
    navigate({ to: "/account", search: { tab: "orders" } });
  };
  if (cartItems.length === 0 && checkoutStep === "cart") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-white/5 dark:bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-6 h-6 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Your Cart is Empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-sm", children: "Explore our curated collections to discover statement pieces tailored for you." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/",
          className: "bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95",
          children: "Continue Shopping"
        }
      )
    ] });
  }
  const isAllSelected = validSelectedKeys.length === cartItems.length;
  const isSomeSelected = validSelectedKeys.length > 0 && validSelectedKeys.length < cartItems.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-16 py-12 space-y-8 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest pb-4 border-b border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCheckoutStep("cart"),
          className: `pb-1 ${checkoutStep === "cart" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`,
          children: "1. Shopping Cart"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          disabled: checkoutStep === "cart",
          onClick: () => setCheckoutStep("address"),
          className: `pb-1 ${checkoutStep === "address" ? "text-accent border-b-2 border-accent" : "text-muted-foreground disabled:opacity-50"}`,
          children: "2. Delivery Address"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          disabled: checkoutStep !== "payment",
          className: `pb-1 ${checkoutStep === "payment" ? "text-accent border-b-2 border-accent" : "text-muted-foreground disabled:opacity-50"}`,
          children: "3. Secure Payment"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
        checkoutStep === "cart" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl md:text-5xl", children: "Your Shopping Cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-4 px-6 flex items-center justify-between rounded-3xl border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: isAllSelected,
                  ref: (el) => {
                    if (el) {
                      el.indeterminate = isSomeSelected;
                    }
                  },
                  onChange: handleToggleSelectAll,
                  className: "w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-background accent-accent cursor-pointer"
                }
              ),
              "Select All (",
              cartItems.length,
              " items)"
            ] }),
            validSelectedKeys.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-accent animate-pulse", children: [
              validSelectedKeys.length,
              " selected"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "liquid-glass overflow-hidden divide-y divide-white/10 dark:divide-white/10 rounded-3xl border border-white/10", children: cartItems.map((item) => {
            const itemKey = `${item.productId}-${item.selectedSize || "M"}`;
            const isSelected = validSelectedKeys.includes(itemKey);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all duration-300 ${isSelected ? "bg-white/[0.02]" : "opacity-60 hover:opacity-85"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center self-stretch", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: isSelected,
                      onChange: () => handleToggleSelectItem(itemKey),
                      className: "w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-background accent-accent cursor-pointer"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: item.image,
                      className: "w-20 aspect-[3/4] object-cover rounded-xl border border-white/10 shadow-md"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: item.house }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-foreground hover:text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/product/$productId", params: { productId: item.productId }, children: item.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      "Size:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground uppercase", children: item.selectedSize || "M" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Quantity:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          value: item.qty,
                          onChange: (e) => {
                            const newQty = parseInt(e.target.value, 10);
                            updateShopCartQty(item.productId, item.selectedSize || "M", newQty);
                            toast.success(`Quantity updated to ${newQty}`);
                          },
                          className: "bg-white/5 dark:bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-foreground outline-none focus:border-accent",
                          children: [...Array(10)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, className: "bg-zinc-950 text-white", children: i + 1 }, i + 1))
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:text-right space-y-2 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif text-base font-semibold", children: [
                      "₹",
                      (Number(String(item.price).replace(/[^0-9.]/g, "")) * item.qty).toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleRemoveItem(item),
                        className: "text-rose-400 hover:text-rose-500 hover:scale-105 transition-all p-2 rounded-full hover:bg-rose-500/10 border border-transparent",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4.5 h-4.5" })
                      }
                    )
                  ] })
                ]
              },
              itemKey
            );
          }) })
        ] }),
        checkoutStep === "address" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Verify Shipping Address" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setIsAddingNewAddress(!isAddingNewAddress),
                className: "text-xs uppercase tracking-widest font-bold text-accent hover:text-accent/80 flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " ",
                  isAddingNewAddress ? "View Addresses" : "Add Address"
                ]
              }
            )
          ] }),
          isAddingNewAddress || parsedAddresses.length === 0 ? (
            /* Add New Address Form */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddNewAddressSubmit, className: "space-y-4 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-serif text-lg text-accent", children: "Add New Shipping Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 flex flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pin Location on Map" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent/80 font-mono text-[9px]", children: "Drag pin to refine" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[250px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_4px_24px_rgba(212,175,55,0.05)] bg-white/5 backdrop-blur-md", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { center: mapCenter, zoom: 14, children: markerPos && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MapMarker,
                      {
                        draggable: true,
                        longitude: markerPos[0],
                        latitude: markerPos[1],
                        onDrag: (lngLat) => {
                          setMarkerPos([lngLat.lng, lngLat.lat]);
                          handleReverseGeocode(lngLat.lng, lngLat.lat);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkerContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-8 h-8 rounded-full bg-accent/20 border border-accent animate-ping" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-5 h-5 rounded-full bg-accent border-2 border-white shadow-[0_0_10px_rgba(212,175,55,0.8)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white" }) })
                        ] }) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleDetectLocation,
                        disabled: isLocating,
                        className: "absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-accent border border-accent/30 hover:border-accent px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg disabled:opacity-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: `w-3.5 h-3.5 ${isLocating ? "animate-bounce text-accent" : "text-accent"}` }),
                          isLocating ? "Locating..." : "Detect Location"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleGeocodeActiveAddress,
                      className: "w-full bg-white/5 hover:bg-white/10 text-accent border border-accent/20 hover:border-accent/40 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer",
                      children: "Locate Entered Address on Map"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Recipient Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          required: true,
                          type: "text",
                          placeholder: "e.g. Léa Dubois",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newName,
                          onChange: (e) => setNewName(e.target.value)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Contact Phone Number" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          required: true,
                          type: "text",
                          placeholder: "e.g. +91 98765 43210",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newPhone,
                          onChange: (e) => setNewPhone(e.target.value)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "India Pin Code" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          required: true,
                          type: "text",
                          maxLength: 6,
                          placeholder: "e.g. 560038",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newPincode,
                          onChange: (e) => setNewPincode(e.target.value.replace(/\D/g, ""))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "City / Town" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          required: true,
                          type: "text",
                          placeholder: "City Name",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newCity,
                          onChange: (e) => setNewCity(e.target.value)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "District" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "text",
                          placeholder: "District",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newDistrict,
                          onChange: (e) => setNewDistrict(e.target.value)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "State" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          required: true,
                          type: "text",
                          placeholder: "State Name",
                          className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                          value: newState,
                          onChange: (e) => setNewState(e.target.value)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-wider font-semibold", children: "Street / Detailed Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        required: true,
                        type: "text",
                        placeholder: "Apartment/Flat No, Area, Street Name",
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-foreground outline-none focus:border-accent",
                        value: newStreet,
                        onChange: (e) => setNewStreet(e.target.value)
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    className: "bg-accent text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-all cursor-pointer",
                    children: "Save & Select Address"
                  }
                ),
                parsedAddresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setIsAddingNewAddress(false);
                      setMarkerPos(null);
                    },
                    className: "bg-white/10 text-foreground px-5 py-2.5 rounded-full text-xs cursor-pointer",
                    children: "Cancel"
                  }
                )
              ] })
            ] })
          ) : (
            /* Address Carousel with Left/Right Arrows Shifting */
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: parsedAddresses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Shift between your saved delivery endpoints using the arrows below." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between py-6 px-12 md:px-16 bg-white/[0.02] border border-white/5 rounded-3xl", children: [
                parsedAddresses.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setIsEditingAddress(false);
                      setMarkerPos(null);
                      setActiveAddressIdx((prev) => prev === 0 ? parsedAddresses.length - 1 : prev - 1);
                    },
                    className: "absolute left-4 p-2.5 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 z-10 cursor-pointer",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md mx-auto liquid-glass border border-accent/20 bg-gradient-to-b from-accent/5 to-black/35 p-6 rounded-3xl relative overflow-hidden shadow-xl space-y-4", children: isEditingAddress ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs uppercase tracking-widest text-accent font-bold", children: "Edit Current Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[160px] w-full rounded-xl overflow-hidden border border-white/10 bg-white/5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { center: mapCenter, zoom: 14, children: markerPos && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MapMarker,
                      {
                        draggable: true,
                        longitude: markerPos[0],
                        latitude: markerPos[1],
                        onDrag: (lngLat) => {
                          setMarkerPos([lngLat.lng, lngLat.lat]);
                          handleReverseGeocode(lngLat.lng, lngLat.lat);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkerContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute w-6 h-6 rounded-full bg-accent/20 border border-accent animate-ping" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-4 h-4 rounded-full bg-accent border-2 border-white shadow-[0_0_8px_rgba(212,175,55,0.8)]" })
                        ] }) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleDetectLocation,
                        disabled: isLocating,
                        className: "absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-accent border border-accent/30 px-2 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold backdrop-blur-md transition-all cursor-pointer shadow-lg",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-2.5 h-2.5" }),
                          "Detect"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                      placeholder: "Recipient Name",
                      value: editName,
                      onChange: (e) => setEditName(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        maxLength: 6,
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                        placeholder: "Pin Code",
                        value: editPincode,
                        onChange: (e) => setEditPincode(e.target.value.replace(/\D/g, ""))
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                        placeholder: "City",
                        value: editCity,
                        onChange: (e) => setEditCity(e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                        placeholder: "District",
                        value: editDistrict,
                        onChange: (e) => setEditDistrict(e.target.value)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                        placeholder: "State",
                        value: editState,
                        onChange: (e) => setEditState(e.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 pr-12 text-xs text-foreground outline-none focus:border-accent",
                        placeholder: "Street / Detailed Address",
                        value: editStreet,
                        onChange: (e) => setEditStreet(e.target.value)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleGeocodeActiveAddress,
                        className: "absolute right-2 top-1.5 text-[9px] uppercase tracking-wider text-accent font-bold hover:underline bg-black/40 px-2 py-1 rounded border border-accent/20 cursor-pointer",
                        children: "Locate"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      className: "w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-accent",
                      placeholder: "Phone Number",
                      value: editPhone,
                      onChange: (e) => setEditPhone(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: handleSaveEditedAddress,
                        className: "bg-accent text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-accent/90 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                          " Save Changes"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          setIsEditingAddress(false);
                          setMarkerPos(null);
                        },
                        className: "bg-white/10 text-foreground px-4 py-2 rounded-full text-xs cursor-pointer",
                        children: "Cancel"
                      }
                    )
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] uppercase tracking-widest text-accent font-bold", children: [
                      "Address ",
                      activeAddressIdx + 1,
                      " of ",
                      parsedAddresses.length
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => handleStartEditAddress(activeAddressIdx),
                        className: "text-[10px] uppercase tracking-wider text-accent hover:underline flex items-center gap-1 font-bold",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }),
                          " Edit Card"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif text-lg text-white font-semibold", children: parsedAddresses[activeAddressIdx]?.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: parsedAddresses[activeAddressIdx]?.address }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-accent font-mono", children: [
                    "Phone: ",
                    parsedAddresses[activeAddressIdx]?.phone
                  ] })
                ] }) }),
                parsedAddresses.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setIsEditingAddress(false);
                      setActiveAddressIdx((prev) => prev === parsedAddresses.length - 1 ? 0 : prev + 1);
                    },
                    className: "absolute right-4 p-2.5 rounded-full bg-white/5 border border-white/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 z-10 cursor-pointer",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setCheckoutStep("cart"),
                    className: "bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-xs text-foreground transition-colors",
                    children: "Back to Cart"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleProceedToPayment,
                    className: "bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5",
                    children: [
                      "Proceed to Payment ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: 'No addresses saved. Please click "Add Address" above to enter shipping details.' }) }) })
          )
        ] }),
        checkoutStep === "payment" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-white/10 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl", children: "Select Secure Payment Method" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPaymentMethod("razorpay"),
                className: `p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === "razorpay" ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: `w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "razorpay" ? "text-accent" : "text-transparent"}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-6 h-6 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Razorpay Checkout" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPaymentMethod("card"),
                className: `p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === "card" ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: `w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "card" ? "text-accent" : "text-transparent"}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-6 h-6 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Credit / Debit Card" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setPaymentMethod("wallet"),
                className: `p-5 border rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === "wallet" ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: `w-5 h-5 self-end -mr-2 -mt-2 ${paymentMethod === "wallet" ? "text-accent" : "text-transparent"}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-6 h-6 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider block", children: "Wallet Balance" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-accent mt-1 block", children: [
                      "₹",
                      (state.wallets[user?.id || ""] ?? 0).toLocaleString()
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          paymentMethod === "wallet" && (state.wallets[user?.id || ""] ?? 0) < finalTotal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "⚠️ Your wallet balance is insufficient to complete this transaction (Missing ₹",
              (finalTotal - (state.wallets[user?.id || ""] ?? 0)).toLocaleString(),
              ")."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  if (user) {
                    addWalletCredit(user.id, finalTotal);
                    toast.success("Wallet credited with sufficient funds for demo purposes!");
                  }
                },
                className: "text-xs text-accent font-bold underline block",
                children: "Quick Add Demo Funds"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setCheckoutStep("address"),
                className: "bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-xs text-foreground transition-colors",
                children: "Back to Address"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleFinalOrderSubmit,
                disabled: paymentMethod === "wallet" && (state.wallets[user?.id || ""] ?? 0) < finalTotal,
                className: "bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5",
                children: "Confirm Payment & Place Order"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass p-6 space-y-6 shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl border-b border-white/10 pb-4", children: "Checkout Summary" }),
        checkoutStep === "cart" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleApplyCoupon, className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-muted-foreground uppercase tracking-widest font-semibold", children: "Promo Coupon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "absolute left-3 top-3.5 w-3.5 h-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "FESTIVE20",
                  className: "w-full bg-white/5 dark:bg-white/5 border border-white/10 pl-10 pr-3 py-2.5 text-xs outline-none uppercase rounded-full focus:border-accent transition-colors",
                  value: couponCode,
                  onChange: (e) => setCouponCode(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "bg-white/10 hover:bg-white/20 border border-white/15 px-5 text-xs font-semibold uppercase tracking-widest rounded-full text-foreground transition-all",
                children: "Apply"
              }
            )
          ] }),
          appliedCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-emerald-400 font-semibold uppercase tracking-widest", children: [
            "Applied Code: ",
            appliedCoupon
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t border-white/10 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "Items Subtotal (",
              checkoutStep === "cart" ? selectedCount : checkoutItems.reduce((s, c) => s + c.qty, 0),
              " items)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif", children: [
              "₹",
              selectedTotal.toLocaleString()
            ] })
          ] }),
          discountAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-emerald-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Coupon Discount (",
              discountPercent,
              "%)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif", children: [
              "-₹",
              discountAmount.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-bold uppercase tracking-widest text-[10px]", children: "FREE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-base font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Estimated Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-serif text-accent text-lg", children: [
              "₹",
              finalTotal.toLocaleString()
            ] })
          ] })
        ] }),
        checkoutStep === "cart" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleStartPlaceOrder,
            disabled: selectedItems.length === 0,
            className: "w-full bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
            children: [
              "Place Order ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] }) })
    ] }),
    showUndoNotification && lastRemovedItem && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300 w-[90%] max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-accent/30 bg-black/90 text-white px-6 py-4 rounded-full flex items-center justify-between shadow-2xl backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold truncate", children: [
        "Removed ",
        lastRemovedItem.name,
        " (",
        lastRemovedItem.selectedSize,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleUndoRemove,
          className: "text-xs text-accent hover:text-accent-rose font-bold uppercase tracking-wider underline cursor-pointer shrink-0 ml-3",
          children: "Undo"
        }
      )
    ] }) }),
    stockCheckDialog?.open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "liquid-glass border border-accent/20 max-w-xl w-full bg-zinc-950 p-6 rounded-3xl space-y-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-2xl text-white", children: "Stock Availability Notice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Some products in your selection have stock limitations or are unavailable." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin", children: [
        stockCheckDialog.outOfStockItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs uppercase tracking-widest text-rose-400 font-bold", children: "Out of Stock / Insufficient Quantities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: stockCheckDialog.outOfStockItems.map(({ item, maxAvailable, reason }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-rose-950/10 border border-rose-500/10 rounded-2xl flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, className: "w-10 h-12 object-cover rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white truncate", children: [
                item.name,
                " (",
                item.selectedSize,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-rose-400 font-medium mt-0.5", children: reason })
            ] })
          ] }, `${item.productId}-${item.selectedSize}`)) })
        ] }),
        stockCheckDialog.inStockItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs uppercase tracking-widest text-emerald-400 font-bold", children: "In Stock & Ready for Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: stockCheckDialog.inStockItems.map(({ item, maxAvailable }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.image, className: "w-10 h-12 object-cover rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white truncate", children: [
                item.name,
                " (",
                item.selectedSize,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-emerald-400 font-medium mt-0.5", children: [
                "Quantity: ",
                Math.min(item.qty, maxAvailable),
                " pieces fully available"
              ] })
            ] })
          ] }, `${item.productId}-${item.selectedSize}`)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStockCheckDialog(null),
            className: "flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all",
            children: "Cancel Order"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleConfirmStockAdjustment,
            className: "flex-1 bg-gradient-to-r from-accent to-accent-rose text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all",
            children: "Yes, Continue with Available Items"
          }
        )
      ] })
    ] }) })
  ] });
}
const $$splitComponentImporter$r = () => import("../_shop.account-FS-bpuwj.mjs");
const accountSearchSchema$1 = objectType({
  tab: enumType(["dashboard", "profile", "addresses", "coupons", "wishlist", "orders", "returns", "wallet", "settings", "ai-analytics"]).catch("profile")
});
const Route$s = createFileRoute("/_shop/account")({
  validateSearch: (search) => accountSearchSchema$1.parse(search),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./FashionBattle.register-CUCDivqq.mjs");
const Route$r = createFileRoute("/FashionBattle/register")({
  head: () => ({
    meta: [{
      title: "Register — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./FashionBattle.login-Dj2pt19f.mjs");
const Route$q = createFileRoute("/FashionBattle/login")({
  head: () => ({
    meta: [{
      title: "Sign In — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./FashionBattle.live-contest-BHPDOTsD.mjs");
const Route$p = createFileRoute("/FashionBattle/live-contest")({
  head: () => ({
    meta: [{
      title: "Live Contest — ReeVibes"
    }, {
      name: "description",
      content: "The runway is live. Cast your vote on tonight's editorial battles."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./FashionBattle.house-of-fashion-BDvM0rlh.mjs");
const Route$o = createFileRoute("/FashionBattle/house-of-fashion")({
  head: () => ({
    meta: [{
      title: "House of Fashion — ReeVibes"
    }, {
      name: "description",
      content: "Discover the curated maisons and editorial collections of the ReeVibes ecosystem."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./FashionBattle.cart-BcBkcSLQ.mjs");
const Route$n = createFileRoute("/FashionBattle/cart")({
  head: () => ({
    meta: [{
      title: "Cart — ReeVibes"
    }, {
      name: "description",
      content: "Your selected pieces from the House of Fashion."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./FashionBattle.best-photography-7e-96x07.mjs");
const Route$m = createFileRoute("/FashionBattle/best-photography")({
  head: () => ({
    meta: [{
      title: "Best Photography — ReeVibes"
    }, {
      name: "description",
      content: "A dynamic curated gallery of this season's most evocative frames."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./FashionBattle.apply-BFsOu0JM.mjs");
const Route$l = createFileRoute("/FashionBattle/apply")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./FashionBattle.angels-xqwXiEj0.mjs");
const Route$k = createFileRoute("/FashionBattle/angels")({
  head: () => ({
    meta: [{
      title: "Angels — ReeVibes"
    }, {
      name: "description",
      content: "The crowned winners of ReeVibes — official representatives of our editorial vision."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./FashionBattle.account-Cjua8f9r.mjs");
const Route$j = createFileRoute("/FashionBattle/account")({
  head: () => ({
    meta: [{
      title: "My Account — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./FashionBattle.about-BwH8z1Ru.mjs");
const Route$i = createFileRoute("/FashionBattle/about")({
  head: () => ({
    meta: [{
      title: "About — ReeVibes"
    }, {
      name: "description",
      content: "The ReeVibes maison — our mission, our manifesto, our cinema."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./FashionBattle.apply.index-DmcajKxC.mjs");
const Route$h = createFileRoute("/FashionBattle/apply/")({
  head: () => ({
    meta: [{
      title: "Apply — ReeVibes"
    }, {
      name: "description",
      content: "Apply to be considered for the next ReeVibes season."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./FashionBattle.account.index-CrZ3vCnU.mjs");
const accountSearchSchema = objectType({
  tab: enumType(["dashboard", "profile", "addresses", "coupons", "wishlist", "cart", "orders", "returns", "wallet", "notifications", "settings"]).catch("dashboard")
});
const Route$g = createFileRoute("/FashionBattle/account/")({
  validateSearch: (search) => accountSearchSchema.parse(search),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("../_shop.product._productId-zhLkCN2e.mjs");
const Route$f = createFileRoute("/_shop/product/$productId")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./FashionBattle.photography._photoId-BEFARQ3A.mjs");
const Route$e = createFileRoute("/FashionBattle/photography/$photoId")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Photography · ${params.photoId} — ReeVibes`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./FashionBattle.live-contest._contestId--leULDRt.mjs");
const $$splitNotFoundComponentImporter$2 = () => import("./FashionBattle.live-contest._contestId-BIE-ZwOh.mjs");
const Route$d = createFileRoute("/FashionBattle/live-contest/$contestId")({
  loader: ({
    params
  }) => {
    const battle = BATTLES.find((b) => b.id === params.contestId);
    if (!battle) throw notFound();
    return {
      battle
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.battle.a.name} vs ${loaderData.battle.b.name} — ReeVibes`
    }, {
      name: "description",
      content: `${loaderData.battle.round} — vote live.`
    }, {
      property: "og:image",
      content: loaderData.battle.a.image
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./FashionBattle.house-of-fashion._productId-vwbaO2Mn.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./FashionBattle.house-of-fashion._productId-B-s2hjaL.mjs");
const Route$c = createFileRoute("/FashionBattle/house-of-fashion/$productId")({
  loader: ({
    params
  }) => {
    const product = PRODUCTS.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return {
      product
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.product.name} — ${loaderData.product.house}`
    }, {
      name: "description",
      content: `${loaderData.product.name} by ${loaderData.product.house}.`
    }, {
      property: "og:image",
      content: loaderData.product.image
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./FashionBattle.contestants._slug-DZn94G7G.mjs");
const $$splitNotFoundComponentImporter = () => import("./FashionBattle.contestants._slug-CQzlYCaM.mjs");
const Route$b = createFileRoute("/FashionBattle/contestants/$slug")({
  loader: ({
    params
  }) => {
    const contestant = CONTESTANTS.find((c) => c.slug === params.slug);
    if (!contestant) throw notFound();
    return {
      contestant
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.contestant.name} — ReeVibes`
    }, {
      name: "description",
      content: `${loaderData.contestant.name}, ${loaderData.contestant.country}. ${loaderData.contestant.bio}`
    }, {
      property: "og:image",
      content: loaderData.contestant.image
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./FashionBattle.contestant._contestantId-prhBWw4E.mjs");
const Route$a = createFileRoute("/FashionBattle/contestant/$contestantId")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./FashionBattle.apply._contestId-RIVTM1E6.mjs");
const Route$9 = createFileRoute("/FashionBattle/apply/$contestId")({
  head: () => ({
    meta: [{
      title: "Apply — ReeVibes"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const Route$8 = createFileRoute("/FashionBattle/angels/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/FashionBattle/contestants/$slug", params: { slug: params.slug } });
  }
});
const $$splitComponentImporter$7 = () => import("./FashionBattle.account.role-ratings-UOjXzNKF.mjs");
const Route$7 = createFileRoute("/FashionBattle/account/role-ratings")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./FashionBattle.account.role-judgements-DsAD7Lck.mjs");
const Route$6 = createFileRoute("/FashionBattle/account/role-judgements")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./FashionBattle.account.role-casting-A0wo9Bk1.mjs");
const Route$5 = createFileRoute("/FashionBattle/account/role-casting")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./FashionBattle.account.role-applications-U5zpT7jk.mjs");
const Route$4 = createFileRoute("/FashionBattle/account/role-applications")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./FashionBattle.account.profile-CpABlktA.mjs");
const Route$3 = createFileRoute("/FashionBattle/account/profile")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./FashionBattle.account.notifications-uEl7z9fs.mjs");
const Route$2 = createFileRoute("/FashionBattle/account/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./FashionBattle.account.applications-Cb9_zWde.mjs");
const Route$1 = createFileRoute("/FashionBattle/account/applications")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./FashionBattle.live-contest._countryId._stage-F1wNI9ze.mjs");
const Route = createFileRoute("/FashionBattle/live-contest/$countryId/$stage")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.countryId} · ${params.stage} — Live Contest`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SitemapDotxmlRoute = Route$R.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$S
});
const ShopRoute = Route$Q.update({
  id: "/_shop",
  getParentRoute: () => Route$S
});
const AdminIndexRoute = Route$P.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$S
});
const ShopIndexRoute = Route$O.update({
  id: "/",
  path: "/",
  getParentRoute: () => ShopRoute
});
const FashionBattleIndexRoute = Route$N.update({
  id: "/FashionBattle/",
  path: "/FashionBattle/",
  getParentRoute: () => Route$S
});
const ApiSponsorsRoute = Route$M.update({
  id: "/api/sponsors",
  path: "/api/sponsors",
  getParentRoute: () => Route$S
});
const ApiFlagsRoute = Route$L.update({
  id: "/api/flags",
  path: "/api/flags",
  getParentRoute: () => Route$S
});
const ApiCountriesLogosRoute = Route$K.update({
  id: "/api/countries-logos",
  path: "/api/countries-logos",
  getParentRoute: () => Route$S
});
const ApiAngelsRoute = Route$J.update({
  id: "/api/angels",
  path: "/api/angels",
  getParentRoute: () => Route$S
});
const AdminVoteControlRoute = Route$I.update({
  id: "/admin/vote-control",
  path: "/admin/vote-control",
  getParentRoute: () => Route$S
});
const AdminUsersRoute = Route$H.update({
  id: "/admin/users",
  path: "/admin/users",
  getParentRoute: () => Route$S
});
const AdminTop16Route = Route$G.update({
  id: "/admin/top-16",
  path: "/admin/top-16",
  getParentRoute: () => Route$S
});
const AdminSponsorsRoute = Route$F.update({
  id: "/admin/sponsors",
  path: "/admin/sponsors",
  getParentRoute: () => Route$S
});
const AdminReportsRoute = Route$E.update({
  id: "/admin/reports",
  path: "/admin/reports",
  getParentRoute: () => Route$S
});
const AdminPhotographersRoute = Route$D.update({
  id: "/admin/photographers",
  path: "/admin/photographers",
  getParentRoute: () => Route$S
});
const AdminOpenContestRoute = Route$C.update({
  id: "/admin/open-contest",
  path: "/admin/open-contest",
  getParentRoute: () => Route$S
});
const AdminLiveContestRoute = Route$B.update({
  id: "/admin/live-contest",
  path: "/admin/live-contest",
  getParentRoute: () => Route$S
});
const AdminContestantsRoute = Route$A.update({
  id: "/admin/contestants",
  path: "/admin/contestants",
  getParentRoute: () => Route$S
});
const AdminAbuseReportsRoute = Route$z.update({
  id: "/admin/abuse-reports",
  path: "/admin/abuse-reports",
  getParentRoute: () => Route$S
});
const ShopSearchRoute = Route$y.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => ShopRoute
});
const ShopRegisterRoute = Route$x.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => ShopRoute
});
const ShopLoginRoute = Route$w.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => ShopRoute
});
const ShopForgotPasswordRoute = Route$v.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => ShopRoute
});
const ShopCategoriesRoute = Route$u.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => ShopRoute
});
const ShopCartRoute = Route$t.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => ShopRoute
});
const ShopAccountRoute = Route$s.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => ShopRoute
});
const FashionBattleRegisterRoute = Route$r.update({
  id: "/FashionBattle/register",
  path: "/FashionBattle/register",
  getParentRoute: () => Route$S
});
const FashionBattleLoginRoute = Route$q.update({
  id: "/FashionBattle/login",
  path: "/FashionBattle/login",
  getParentRoute: () => Route$S
});
const FashionBattleLiveContestRoute = Route$p.update({
  id: "/FashionBattle/live-contest",
  path: "/FashionBattle/live-contest",
  getParentRoute: () => Route$S
});
const FashionBattleHouseOfFashionRoute = Route$o.update({
  id: "/FashionBattle/house-of-fashion",
  path: "/FashionBattle/house-of-fashion",
  getParentRoute: () => Route$S
});
const FashionBattleCartRoute = Route$n.update({
  id: "/FashionBattle/cart",
  path: "/FashionBattle/cart",
  getParentRoute: () => Route$S
});
const FashionBattleBestPhotographyRoute = Route$m.update({
  id: "/FashionBattle/best-photography",
  path: "/FashionBattle/best-photography",
  getParentRoute: () => Route$S
});
const FashionBattleApplyRoute = Route$l.update({
  id: "/FashionBattle/apply",
  path: "/FashionBattle/apply",
  getParentRoute: () => Route$S
});
const FashionBattleAngelsRoute = Route$k.update({
  id: "/FashionBattle/angels",
  path: "/FashionBattle/angels",
  getParentRoute: () => Route$S
});
const FashionBattleAccountRoute = Route$j.update({
  id: "/FashionBattle/account",
  path: "/FashionBattle/account",
  getParentRoute: () => Route$S
});
const FashionBattleAboutRoute = Route$i.update({
  id: "/FashionBattle/about",
  path: "/FashionBattle/about",
  getParentRoute: () => Route$S
});
const FashionBattleApplyIndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => FashionBattleApplyRoute
});
const FashionBattleAccountIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => FashionBattleAccountRoute
});
const ShopProductProductIdRoute = Route$f.update({
  id: "/product/$productId",
  path: "/product/$productId",
  getParentRoute: () => ShopRoute
});
const FashionBattlePhotographyPhotoIdRoute = Route$e.update({
  id: "/FashionBattle/photography/$photoId",
  path: "/FashionBattle/photography/$photoId",
  getParentRoute: () => Route$S
});
const FashionBattleLiveContestContestIdRoute = Route$d.update({
  id: "/$contestId",
  path: "/$contestId",
  getParentRoute: () => FashionBattleLiveContestRoute
});
const FashionBattleHouseOfFashionProductIdRoute = Route$c.update({
  id: "/$productId",
  path: "/$productId",
  getParentRoute: () => FashionBattleHouseOfFashionRoute
});
const FashionBattleContestantsSlugRoute = Route$b.update({
  id: "/FashionBattle/contestants/$slug",
  path: "/FashionBattle/contestants/$slug",
  getParentRoute: () => Route$S
});
const FashionBattleContestantContestantIdRoute = Route$a.update({
  id: "/FashionBattle/contestant/$contestantId",
  path: "/FashionBattle/contestant/$contestantId",
  getParentRoute: () => Route$S
});
const FashionBattleApplyContestIdRoute = Route$9.update({
  id: "/$contestId",
  path: "/$contestId",
  getParentRoute: () => FashionBattleApplyRoute
});
const FashionBattleAngelsSlugRoute = Route$8.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => FashionBattleAngelsRoute
});
const FashionBattleAccountRoleRatingsRoute = Route$7.update({
  id: "/role-ratings",
  path: "/role-ratings",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountRoleJudgementsRoute = Route$6.update({
  id: "/role-judgements",
  path: "/role-judgements",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountRoleCastingRoute = Route$5.update({
  id: "/role-casting",
  path: "/role-casting",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountRoleApplicationsRoute = Route$4.update({
  id: "/role-applications",
  path: "/role-applications",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountProfileRoute = Route$3.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountNotificationsRoute = Route$2.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleAccountApplicationsRoute = Route$1.update({
  id: "/applications",
  path: "/applications",
  getParentRoute: () => FashionBattleAccountRoute
});
const FashionBattleLiveContestCountryIdStageRoute = Route.update({
  id: "/$countryId/$stage",
  path: "/$countryId/$stage",
  getParentRoute: () => FashionBattleLiveContestRoute
});
const ShopRouteChildren = {
  ShopAccountRoute,
  ShopCartRoute,
  ShopCategoriesRoute,
  ShopForgotPasswordRoute,
  ShopLoginRoute,
  ShopRegisterRoute,
  ShopSearchRoute,
  ShopIndexRoute,
  ShopProductProductIdRoute
};
const ShopRouteWithChildren = ShopRoute._addFileChildren(ShopRouteChildren);
const FashionBattleAccountRouteChildren = {
  FashionBattleAccountApplicationsRoute,
  FashionBattleAccountNotificationsRoute,
  FashionBattleAccountProfileRoute,
  FashionBattleAccountRoleApplicationsRoute,
  FashionBattleAccountRoleCastingRoute,
  FashionBattleAccountRoleJudgementsRoute,
  FashionBattleAccountRoleRatingsRoute,
  FashionBattleAccountIndexRoute
};
const FashionBattleAccountRouteWithChildren = FashionBattleAccountRoute._addFileChildren(FashionBattleAccountRouteChildren);
const FashionBattleAngelsRouteChildren = {
  FashionBattleAngelsSlugRoute
};
const FashionBattleAngelsRouteWithChildren = FashionBattleAngelsRoute._addFileChildren(FashionBattleAngelsRouteChildren);
const FashionBattleApplyRouteChildren = {
  FashionBattleApplyContestIdRoute,
  FashionBattleApplyIndexRoute
};
const FashionBattleApplyRouteWithChildren = FashionBattleApplyRoute._addFileChildren(FashionBattleApplyRouteChildren);
const FashionBattleHouseOfFashionRouteChildren = {
  FashionBattleHouseOfFashionProductIdRoute
};
const FashionBattleHouseOfFashionRouteWithChildren = FashionBattleHouseOfFashionRoute._addFileChildren(
  FashionBattleHouseOfFashionRouteChildren
);
const FashionBattleLiveContestRouteChildren = {
  FashionBattleLiveContestContestIdRoute,
  FashionBattleLiveContestCountryIdStageRoute
};
const FashionBattleLiveContestRouteWithChildren = FashionBattleLiveContestRoute._addFileChildren(
  FashionBattleLiveContestRouteChildren
);
const rootRouteChildren = {
  ShopRoute: ShopRouteWithChildren,
  SitemapDotxmlRoute,
  FashionBattleAboutRoute,
  FashionBattleAccountRoute: FashionBattleAccountRouteWithChildren,
  FashionBattleAngelsRoute: FashionBattleAngelsRouteWithChildren,
  FashionBattleApplyRoute: FashionBattleApplyRouteWithChildren,
  FashionBattleBestPhotographyRoute,
  FashionBattleCartRoute,
  FashionBattleHouseOfFashionRoute: FashionBattleHouseOfFashionRouteWithChildren,
  FashionBattleLiveContestRoute: FashionBattleLiveContestRouteWithChildren,
  FashionBattleLoginRoute,
  FashionBattleRegisterRoute,
  AdminAbuseReportsRoute,
  AdminContestantsRoute,
  AdminLiveContestRoute,
  AdminOpenContestRoute,
  AdminPhotographersRoute,
  AdminReportsRoute,
  AdminSponsorsRoute,
  AdminTop16Route,
  AdminUsersRoute,
  AdminVoteControlRoute,
  ApiAngelsRoute,
  ApiCountriesLogosRoute,
  ApiFlagsRoute,
  ApiSponsorsRoute,
  FashionBattleIndexRoute,
  AdminIndexRoute,
  FashionBattleContestantContestantIdRoute,
  FashionBattleContestantsSlugRoute,
  FashionBattlePhotographyPhotoIdRoute
};
const routeTree = Route$S._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminLayout as A,
  BACKEND_URL as B,
  CONTESTANTS as C,
  Dialog as D,
  Route$g as E,
  Route$f as F,
  Route$d as G,
  HERO_IMAGES as H,
  SEED_COMMENTS as I,
  Route$c as J,
  Route$b as K,
  router as L,
  Map as M,
  PRODUCTS as P,
  QuickAddContext as Q,
  Route$y as R,
  ShopNotificationContext as S,
  ThemeToggle as T,
  useCartTotal as a,
  useTheme as b,
  cn as c,
  STATS as d,
  AdminCard as e,
  BATTLES as f,
  StatusChip as g,
  ABUSE_REPORTS as h,
  AdminButton as i,
  isDesktopPointer as j,
  useShopNotification as k,
  useAppStore as l,
  DialogContent as m,
  DialogHeader as n,
  DialogTitle as o,
  prefersReducedMotion as p,
  DialogFooter as q,
  ALL_ROLES as r,
  DialogDescription as s,
  BrandLogo as t,
  usePortal as u,
  Route$u as v,
  Route$s as w,
  MapMarker as x,
  MarkerContent as y,
  CAMPAIGNS as z
};
