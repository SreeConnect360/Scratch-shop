// Centralized client-only store for ReeVibes.
// Persists to localStorage and powers BOTH the public portal and admin portal.
// Admin writes propagate instantly to public reads (and vice versa) because
// every page reads from the same single React context.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { NOTIFICATIONS_SEED, SEED_COMMENTS, type CommentItem } from "./portal-data";
import {
  PLATFORM_USERS, CONTESTANT_APPLICATIONS, ABUSE_REPORTS, PRODUCTS,
  type PlatformUser, type ContestantApplication, type AbuseReport, type Role, type Product,
} from "./data";

const KEY = "reevibes:portal:v3";

/* ───────── Public-portal user (lightweight session) ───────── */
export type PortalUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  dob?: string;
  avatar?: string;
  gender?: string;
  roles: Role[];
};

export type CartItem = { productId: string; name: string; house: string; price: string; image: string; qty: number; selectedSize?: string };
export type Notif = { id: string; icon: string; title: string; body: string; time: string; unread: boolean };
export type DraftApp = Record<string, unknown> & { id: string; updatedAt: string; step: number };

/* ───────── Admin-side domain slices ───────── */
export type Position = "Top16" | "Top8" | "Top4" | "Top2" | "Winner";

export type PublishedContest = {
  id: string;
  country: string;
  year: number;
  stage: string;
  published: boolean;
  logo?: string;
  logoWhite?: string;
  logoBlack?: string;
};

export type WorkflowStatus = "Applied" | "Approved" | "Hold" | "Thank You" | "Block" | "Selected";
export type JudgeCriteria = "catwalk" | "personality" | "communication" | "q1" | "q2" | "appearance" | "friendliness" | "interaction" | "q3" | "q4";

export type ReturnRequest = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  reason: string;
  comment: string;
  images: string[];
  videos: string[];
  status: "Pending" | "Approved" | "Rejected";
  refundAmount: number;
  refundTransactionId?: string;
  refundDate?: string;
};

export type Vendor = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  products: string[]; // product IDs
  revenue: number;
};

export type ProductReview = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  videos?: string[];
  date: string;
  status: "Approved" | "Hidden";
};

export type ShopCoupon = {
  code: string;
  discount: number;
  type: "fixed" | "percentage" | "wallet";
  expiryDate: string;
  usageLimit: number;
  userEligibility: string;
  active: boolean;
};

export type PortalState = {
  user: PortalUser | null;
  votesByDay: Record<string, string>;
  ratings: Record<string, number>;
  favorites: string[];
  comments: Record<string, CommentItem[]>;
  cart: CartItem[];
  notifications: Notif[];
  drafts: DraftApp[];
  submitted: DraftApp[];
  users: PlatformUser[];
  applications: ContestantApplication[];
  reports: AbuseReport[];
  contests: PublishedContest[];
  positions: Record<string, Position>;
  bestPhotos: string[];
  voting: { open: boolean; rating: boolean };
  sponsorAssignments: Record<string, string>;
  applicationsWorkflow: Record<string, WorkflowStatus>;
  castingWorkflow: Record<string, WorkflowStatus>;
  judgeRatings: Record<string, Record<string, Partial<Record<JudgeCriteria, number>>>>;
  rateScores: Record<string, Record<string, number>>;
  addresses: Record<string, string[]>;
  wishlist: Record<string, string[]>; // Main portal wishlist
  shopWishlist: Record<string, string[]>; // Isolated shop portal wishlist
  shopCart: CartItem[]; // Isolated shop portal cart
  orders: Record<string, Array<{
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: string;
    address: string;
    paymentStatus: "Paid" | "Refunded" | "Pending";
    refundDetails?: { status: string; amount: number; transactionId: string; date: string };
  }>>;
  coupons: ShopCoupon[];
  products: Product[];
  returns: ReturnRequest[];
  wallets: Record<string, number>; // userId -> balance (INR)
  vendors: Vendor[];
  productReviews: Record<string, ProductReview[]>; // productId -> reviews
  adminMode: "Contest" | "Shop";
  productViews: Record<string, number>; // Keep track of product views for trending logic
  productCartAdditions: Record<string, number>; // Keep track of cart additions for trending logic
  productPurchases: Record<string, number>; // Keep track of purchases for trending logic
  homepageLayout: {
    heroBanners: Array<{ id: string; image: string; title: string; subtitle: string; link: string }>;
    promoBanners: Array<{ id: string; image: string; title: string; subtitle: string; discount: string }>;
    trendingProducts: string[];
    featuredProducts: string[];
    flashSale: { active: boolean; discount: number; endsAt: string; products: string[] };
  };
};

const DEFAULT_CONTESTS: PublishedContest[] = [
  { id: "ct-mh-26", country: "Maharashtra", year: 2026, stage: "Application", published: true },
  { id: "ct-ka-26", country: "Karnataka", year: 2026, stage: "Application", published: true },
  { id: "ct-dl-26", country: "Delhi", year: 2026, stage: "Casting", published: true },
  { id: "ct-tn-26", country: "Tamil Nadu", year: 2026, stage: "Application", published: true },
  { id: "ct-ts-26", country: "Telangana", year: 2026, stage: "Judgement", published: false },
];

const DEFAULT_REVIEWS: Record<string, ProductReview[]> = {
  "pr1": [
    { id: "rev1", userName: "Aditi Rao", rating: 5, comment: "Absolutely stunning dress! Fits perfectly and the silk material feels incredibly premium.", date: "2026-06-14", status: "Approved" },
    { id: "rev2", userName: "Priya Sharma", rating: 4, comment: "Beautiful design, though it was slightly loose around the waist. High quality styling.", date: "2026-06-12", status: "Approved" }
  ],
  "pr2": [
    { id: "rev3", userName: "Deepika Patel", rating: 5, comment: "Warm, luxurious, and elegant. Exceeded all my expectations.", date: "2026-06-15", status: "Approved" }
  ]
};

const DEFAULT_VENDORS: Vendor[] = [
  { id: "vn1", companyName: "Maison Lumière", contactPerson: "Léa Dubois", email: "contact@maisonlumiere.com", phone: "+91 9876543210", products: ["pr1", "pr3", "prm3"], revenue: 450000 },
  { id: "vn2", companyName: "Atelier Reine", contactPerson: "Léa Dubois", email: "contact@atelierreine.com", phone: "+91 9876543211", products: ["pr2", "prm1"], revenue: 300000 }
];

const DEFAULT_WALLETS: Record<string, number> = {
  "USR-1000": 25000,
  "usr-1000": 25000
};

const DEFAULT_HOMEPAGE_LAYOUT = {
  heroBanners: [
    { id: "h1", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&h=600&q=80", title: "Luxury Redefined", subtitle: "Season 03 Collection Out Now", link: "/shop" },
    { id: "h2", image: "https://images.unsplash.com/photo-1496360166961-10a51d5f367a?auto=format&fit=crop&w=1200&h=600&q=80", title: "The Art of Elegance", subtitle: "Premium Fabrics & Silhouettes", link: "/shop" }
  ],
  promoBanners: [
    { id: "p1", image: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=600&h=400&q=80", title: "Festive Season Specials", subtitle: "Save on curation", discount: "20% OFF" }
  ],
  trendingProducts: ["pr1", "pr2", "pr3"],
  featuredProducts: ["pr4", "pr5", "pr6"],
  flashSale: { active: true, discount: 15, endsAt: "2026-06-25T23:59:59", products: ["pr1", "prm2"] }
};

const DEFAULT: PortalState = {
  user: null,
  votesByDay: {},
  ratings: {},
  favorites: [],
  comments: {},
  cart: [],
  shopCart: [],
  notifications: NOTIFICATIONS_SEED,
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
  wishlist: {
    "USR-1000": ["pr1", "pr3"]
  },
  shopWishlist: {
    "USR-1000": ["pr1", "pr2"]
  },
  orders: {
    "USR-1000": [{
      id: "ORD-9481",
      date: "2026-06-15",
      items: [{ productId: "pr2", name: "Cashmere Cape", house: "Atelier Reine", price: "₹1,50,000", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&h=1600&q=80", qty: 1, selectedSize: "M" }],
      total: 150000,
      status: "Shipped",
      address: "123, Luxury Lane, Indiranagar, Bangalore - 560038",
      paymentStatus: "Paid"
    }]
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
      refundAmount: 150000
    }
  ],
  wallets: DEFAULT_WALLETS,
  vendors: DEFAULT_VENDORS,
  productReviews: DEFAULT_REVIEWS,
  adminMode: "Contest",
  productViews: {},
  productCartAdditions: {},
  productPurchases: {},
  homepageLayout: DEFAULT_HOMEPAGE_LAYOUT
};

function load(): PortalState {
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
function save(s: PortalState) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(s);
    if (window.localStorage.getItem(KEY) !== serialized) {
      window.localStorage.setItem(KEY, serialized);
    }
  } catch { /* ignore */ }
}

type Ctx = {
  state: PortalState;

  // session
  signIn: (email: string, name?: string) => boolean;
  signUp: (u: Partial<PortalUser> & { email: string; firstName: string; lastName: string }) => void;
  signOut: () => void;

  // public engagement
  voteFor: (contestantId: string) => { ok: boolean; reason?: string };
  rate: (contestantId: string, stars: number) => void;
  toggleFavorite: (contestantId: string) => void;
  comment: (contestantId: string, text: string) => void;
  likeComment: (contestantId: string, commentId: string) => void;
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number; selectedSize?: string }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  saveDraft: (d: DraftApp) => void;
  submitDraft: (d: DraftApp) => void;
  markNotificationsRead: () => void;

  // public -> admin
  registerUser: (u: { firstName: string; lastName: string; email: string; phone?: string; country?: string; dob?: string; gender?: string }) => PlatformUser;
  submitApplication: (a: Partial<ContestantApplication> & { fullName: string; country: string; email: string }) => void;
  reportAbuse: (r: { target: string; reason: string; reporter?: string; severity?: "Low" | "Medium" | "High" }) => void;

  // admin actions
  updateUser: (id: string, patch: Partial<PlatformUser>) => void;
  deleteUser: (id: string) => void;
  setUserRoles: (id: string, roles: Role[]) => void;

  publishContest: (id: string, published: boolean) => void;
  upsertContest: (c: PublishedContest) => void;
  removeContest: (id: string) => void;
  replaceContests: (list: PublishedContest[]) => void;

  setPosition: (contestantId: string, position: Position | null) => void;
  setMultiplePositions: (contestantIds: string[], position: Position | null) => void;
  updateApplication: (contestantId: string, patch: Partial<ContestantApplication>) => void;
  tagBestPhoto: (photoId: string, on: boolean) => void;
  assignSponsor: (contestantId: string, sponsorId: string | null) => void;

  toggleVoting: (open: boolean) => void;
  toggleRating: (open: boolean) => void;

  resolveReport: (id: string, status: AbuseReport["status"]) => void;

  // role workflow
  setApplicationStatus: (contestantId: string, status: WorkflowStatus) => void;
  setCastingStatus: (contestantId: string, status: WorkflowStatus) => void;
  setJudgeRating: (userId: string, contestantId: string, criteria: JudgeCriteria, score: number) => void;
  setRateScore: (userId: string, contestantId: string, score: number) => void;

  // Addresses, Wishlist, Coupons, Orders
  addAddress: (userId: string, address: string) => void;
  removeAddress: (userId: string, index: number) => void;
  toggleWishlist: (userId: string, productId: string) => void;
  createOrder: (userId: string, order: { items: CartItem[]; total: number; address: string }) => void;
  updateOrderStatus: (userId: string, orderId: string, status: string) => void;
  addCoupon: (coupon: { code: string; discount: number; type?: "fixed" | "percentage" | "wallet"; expiryDate?: string; usageLimit?: number; userEligibility?: string }) => void;
  removeCoupon: (code: string) => void;

  // Shopping Platform Actions
  setAdminMode: (mode: "Contest" | "Shop") => void;
  createProduct: (p: Omit<Product, "id"> & { sizes?: string[]; stockPerSize?: Record<string, number>; sku?: string; images?: string[]; videos?: string[] }) => void;
  updateProduct: (id: string, patch: Partial<Product> & { sizes?: string[]; stockPerSize?: Record<string, number>; sku?: string; images?: string[]; videos?: string[] }) => void;
  deleteProduct: (id: string) => void;
  requestReturn: (req: { orderId: string; productId: string; productName: string; customerId: string; customerName: string; reason: string; comment: string; images: string[]; videos: string[]; refundAmount: number }) => void;
  approveReturn: (returnId: string) => void;
  rejectReturn: (returnId: string) => void;
  suspendCustomer: (id: string) => void;
  reactivateCustomer: (id: string) => void;
  addWalletCredit: (userId: string, amount: number) => void;
  moderateReview: (productId: string, reviewId: string, action: "approve" | "hide") => void;
  addReview: (productId: string, r: Omit<ProductReview, "id" | "status" | "date">) => void;
  updateHomepageLayout: (layout: Partial<PortalState["homepageLayout"]>) => void;
  createVendor: (v: Omit<Vendor, "id" | "revenue" | "products">) => void;
  deleteVendor: (id: string) => void;
  
  // Isolated Shop Specific Carts & Wishlists
  addToShopCart: (item: Omit<CartItem, "qty"> & { qty?: number; selectedSize?: string }) => void;
  removeFromShopCart: (productId: string) => void;
  clearShopCart: () => void;
  toggleShopWishlist: (userId: string, productId: string) => void;
  recordProductView: (productId: string) => void;
};

const PortalContext = createContext<Ctx | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("reevibes:")) {
        setState(load());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => { if (hydrated) save(state); }, [state, hydrated]);

  const api = useMemo<Ctx>(() => ({
    state,

    signIn: (email, name) => {
      const match = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setState(s => {
          const next = {
            ...s,
            user: {
              id: match.id, firstName: match.firstName, lastName: match.lastName,
              email: match.email, phone: match.phone, country: match.country, dob: match.dob,
              roles: match.roles as PortalUser["roles"],
            },
          };
          save(next);
          return next;
        });
        return true;
      }
      return false;
    },
    signUp: (u) => setState(s => {
      const next = { ...s, user: { id: `usr-${Date.now()}`, roles: ["General"], ...u } as PortalUser };
      save(next);
      return next;
    }),
    signOut: () => setState(s => {
      const next = { ...s, user: null };
      save(next);
      return next;
    }),

    /* ───── engagement ───── */
    voteFor: (contestantId) => {
      if (!state.voting.open) return { ok: false, reason: "Voting closed by editor" };
      const today = new Date().toISOString().slice(0, 10);
      const last = state.votesByDay[contestantId];
      if (last === today) return { ok: false, reason: "Already voted today" };
      setState(s => ({ ...s, votesByDay: { ...s.votesByDay, [contestantId]: today } }));
      return { ok: true };
    },
    rate: (contestantId, stars) => {
      if (!state.voting.rating) return;
      setState(s => ({ ...s, ratings: { ...s.ratings, [contestantId]: stars } }));
    },
    toggleFavorite: (id) => setState(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id] })),
    comment: (contestantId, text) => setState(s => {
      const list = s.comments[contestantId] ?? SEED_COMMENTS;
      const next: CommentItem = { id: `cm-${Date.now()}`, user: s.user ? `@${s.user.firstName.toLowerCase()}` : "@guest", avatar: s.user?.avatar ?? "", time: "now", text, likes: 0 };
      return { ...s, comments: { ...s.comments, [contestantId]: [next, ...list] } };
    }),
    likeComment: (contestantId, commentId) => setState(s => {
      const list = (s.comments[contestantId] ?? SEED_COMMENTS).map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
      return { ...s, comments: { ...s.comments, [contestantId]: list } };
    }),
    addToCart: (item) => setState(s => {
      const existing = s.cart.find(c => c.productId === item.productId);
      const qty = item.qty ?? 1;
      const cart = existing
        ? s.cart.map(c => c.productId === item.productId ? { ...c, qty: c.qty + qty } : c)
        : [...s.cart, { ...item, qty }];
      return { ...s, cart };
    }),
    removeFromCart: (id) => setState(s => ({ ...s, cart: s.cart.filter(c => c.productId !== id) })),
    clearCart: () => setState(s => ({ ...s, cart: [] })),
    saveDraft: (d) => setState(s => {
      const exists = s.drafts.some(x => x.id === d.id);
      return { ...s, drafts: exists ? s.drafts.map(x => x.id === d.id ? d : x) : [...s.drafts, d] };
    }),
    submitDraft: (d) => setState(s => {
      const userId = s.user?.id;
      const nextUsers = userId
        ? s.users.map(u => u.id === userId ? { ...u, roles: Array.from(new Set([...u.roles, "Contestant"])) as Role[] } : u)
        : s.users;
      return {
        ...s,
        drafts: s.drafts.filter(x => x.id !== d.id),
        submitted: [...s.submitted, d],
        users: nextUsers,
        user: s.user ? { ...s.user, roles: Array.from(new Set([...s.user.roles, "Contestant"])) as PortalUser["roles"] } : s.user,
        notifications: [{ id: `n-${Date.now()}`, icon: "approved", title: "Application Submitted", body: "Our casting team will be in touch within 14 days.", time: "now", unread: true }, ...s.notifications],
      };
    }),
    markNotificationsRead: () => setState(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, unread: false })) })),

    /* ───── public → admin sync ───── */
    registerUser: (u) => {
      const id = `USR-${String(2000 + Date.now()).slice(-6)}`;
      const year = u.dob ? Number(u.dob.slice(0, 4)) : 1998;
      const newUser: PlatformUser = {
        id,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: (u.gender as PlatformUser["gender"]) ?? "Female",
        dob: u.dob ?? "",
        age: 2026 - year,
        country: u.country ?? "—",
        email: u.email,
        phone: u.phone ?? "",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.firstName + u.lastName)}`,
        registeredAt: new Date().toISOString().slice(0, 10),
        roles: ["General"],
        status: "Active",
      };
      setState(s => {
        const isAdmin = s.user?.roles?.includes("Admin");
        const next = {
          ...s,
          users: [newUser, ...s.users],
          user: isAdmin ? s.user : {
            id, firstName: u.firstName, lastName: u.lastName, email: u.email,
            phone: u.phone, country: u.country, dob: u.dob, gender: u.gender, roles: ["General"] as Role[],
          },
        };
        save(next);
        return next;
      });
      return newUser;
    },

    submitApplication: (a) => setState(s => {
      const userId = s.user?.id ?? `usr-${Date.now()}`;
      const cid = `MC-${new Date().getFullYear()}-${String(s.applications.length + 100).padStart(3, "0")}`;
      const full: ContestantApplication = {
        userId,
        contestantId: cid,
        contestYear: new Date().getFullYear(),
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
        applicationDate: new Date().toISOString().slice(0, 10),
        currentStage: "Applied",
        status: "Pending",
      };
      
      const nextUsers = s.users.map(u => u.id === userId ? { ...u, roles: Array.from(new Set([...u.roles, "Contestant"])) as Role[] } : u);
      const nextUser = s.user ? { ...s.user, roles: Array.from(new Set([...s.user.roles, "Contestant"])) as PortalUser["roles"] } : null;

      const next = {
        ...s,
        applications: [full, ...s.applications],
        users: nextUsers,
        user: nextUser,
        notifications: [{ id: `n-${Date.now()}`, icon: "approved", title: "Application Received", body: `Your ${a.country} application is now in review.`, time: "now", unread: true }, ...s.notifications],
      };
      save(next);
      return next;
    }),

    reportAbuse: (r) => setState(s => ({
      ...s,
      reports: [{
        id: `r-${Date.now()}`,
        target: r.target,
        reason: r.reason,
        reporter: r.reporter ?? (s.user ? `@${s.user.firstName.toLowerCase()}` : "@guest"),
        severity: r.severity ?? "Medium",
        status: "Open",
      }, ...s.reports],
    })),

    /* ───── admin actions ───── */
    updateUser: (id, patch) => setState(s => {
      const nextUsers = s.users.map(u => u.id === id ? { ...u, ...patch } : u);
      const isSelf = s.user?.id === id;
      const updatedMatch = nextUsers.find(u => u.id === id);
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
          roles: updatedMatch.roles,
        } : s.user,
      };
    }),
    deleteUser: (id) => setState(s => ({ ...s, users: s.users.filter(u => u.id !== id) })),
    setUserRoles: (id, roles) => setState(s => {
      const nextUsers = s.users.map(u => u.id === id ? { ...u, roles } : u);
      const isSelf = s.user?.id === id;
      return {
        ...s,
        users: nextUsers,
        user: isSelf && s.user ? { ...s.user, roles } : s.user,
      };
    }),

    publishContest: (id, published) => setState(s => ({ ...s, contests: s.contests.map(c => c.id === id ? { ...c, published } : c) })),
    upsertContest: (c) => setState(s => {
      const exists = s.contests.some(x => x.id === c.id);
      return { ...s, contests: exists ? s.contests.map(x => x.id === c.id ? c : x) : [c, ...s.contests] };
    }),
    removeContest: (id) => setState(s => ({ ...s, contests: s.contests.filter(c => c.id !== id) })),
    replaceContests: (list) => setState(s => ({ ...s, contests: list })),

    setPosition: (contestantId, position) => setState(s => {
      const next = { ...s.positions };
      if (position) next[contestantId] = position; else delete next[contestantId];
      return { ...s, positions: next };
    }),
    setMultiplePositions: (contestantIds, position) => setState(s => {
      const next = { ...s.positions };
      contestantIds.forEach(id => {
        if (position) next[id] = position; else delete next[id];
      });
      return { ...s, positions: next };
    }),
    updateApplication: (contestantId, patch) => setState(s => ({
      ...s,
      applications: s.applications.map(a => a.contestantId === contestantId ? { ...a, ...patch } : a)
    })),
    tagBestPhoto: (photoId, on) => setState(s => ({
      ...s,
      bestPhotos: on ? Array.from(new Set([...s.bestPhotos, photoId])) : s.bestPhotos.filter(p => p !== photoId),
    })),
    assignSponsor: (contestantId, sponsorId) => setState(s => {
      const next = { ...s.sponsorAssignments };
      if (sponsorId) next[contestantId] = sponsorId; else delete next[contestantId];
      return { ...s, sponsorAssignments: next };
    }),

    toggleVoting: (open) => setState(s => ({ ...s, voting: { ...s.voting, open } })),
    toggleRating: (open) => setState(s => ({ ...s, voting: { ...s.voting, rating: open } })),

    resolveReport: (id, status) => setState(s => ({ ...s, reports: s.reports.map(r => r.id === id ? { ...r, status } : r) })),

    setApplicationStatus: (contestantId, status) => setState(s => ({ ...s, applicationsWorkflow: { ...s.applicationsWorkflow, [contestantId]: status } })),
    setCastingStatus: (contestantId, status) => setState(s => ({ ...s, castingWorkflow: { ...s.castingWorkflow, [contestantId]: status } })),
    setJudgeRating: (userId, contestantId, criteria, score) => setState(s => {
      const userMap = s.judgeRatings[userId] ?? {};
      const cMap = userMap[contestantId] ?? {};
      return { ...s, judgeRatings: { ...s.judgeRatings, [userId]: { ...userMap, [contestantId]: { ...cMap, [criteria]: score } } } };
    }),
    setRateScore: (userId, contestantId, score) => setState(s => {
      const userMap = s.rateScores[userId] ?? {};
      return { ...s, rateScores: { ...s.rateScores, [userId]: { ...userMap, [contestantId]: score } } };
    }),

    addAddress: (userId, address) => setState(s => {
      const list = s.addresses[userId] ?? [];
      return { ...s, addresses: { ...s.addresses, [userId]: [...list, address] } };
    }),
    removeAddress: (userId, index) => setState(s => {
      const list = s.addresses[userId] ?? [];
      return { ...s, addresses: { ...s.addresses, [userId]: list.filter((_, i) => i !== index) } };
    }),
    toggleWishlist: (userId, productId) => setState(s => {
      const list = s.wishlist[userId] ?? [];
      const next = list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId];
      return { ...s, wishlist: { ...s.wishlist, [userId]: next } };
    }),
    createOrder: (userId, order) => setState(s => {
      const list = s.orders[userId] ?? [];
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        date: new Date().toISOString().slice(0, 10),
        items: order.items,
        total: order.total,
        status: "Processing",
        address: order.address,
        paymentStatus: "Paid" as const
      };
      return {
        ...s,
        orders: { ...s.orders, [userId]: [newOrder, ...list] },
        cart: [], // clear cart on successful order
        notifications: [
          { id: `n-${Date.now()}`, icon: "order", title: "Order Placed Successfully", body: `Your order ${orderId} for ₹${order.total.toLocaleString()} has been placed.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    updateOrderStatus: (userId, orderId, status) => setState(s => {
      const list = s.orders[userId] ?? [];
      const next = list.map(o => o.id === orderId ? { ...o, status } : o);
      return {
        ...s,
        orders: { ...s.orders, [userId]: next },
        notifications: [
          { id: `n-${Date.now()}`, icon: "order", title: "Order Status Updated", body: `Order ${orderId} status changed to ${status}.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    addCoupon: (coupon) => setState(s => {
      if (s.coupons.some(c => c.code === coupon.code.toUpperCase())) return s;
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
    removeCoupon: (code) => setState(s => ({ ...s, coupons: s.coupons.filter(c => c.code !== code) })),

    setAdminMode: (mode) => setState(s => ({ ...s, adminMode: mode })),
    createProduct: (p) => setState(s => {
      const id = `pr-${Date.now()}`;
      const newProduct: Product = {
        id,
        ...p
      };
      return { ...s, products: [newProduct, ...s.products] };
    }),
    updateProduct: (id, patch) => setState(s => ({
      ...s,
      products: s.products.map(p => p.id === id ? { ...p, ...patch } : p)
    })),
    deleteProduct: (id) => setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) })),
    requestReturn: (req) => setState(s => {
      const returnId = `RET-${Math.floor(100 + Math.random() * 900)}`;
      const newReturn: ReturnRequest = {
        id: returnId,
        ...req,
        status: "Pending"
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
    approveReturn: (returnId) => setState(s => {
      const req = s.returns.find(r => r.id === returnId);
      if (!req) return s;
      
      const updatedReturns = s.returns.map(r => r.id === returnId ? {
        ...r,
        status: "Approved" as const,
        refundTransactionId: `pay_razor_${Math.random().toString(36).substring(2, 11)}`,
        refundDate: new Date().toISOString().slice(0, 10)
      } : r);

      // Trigger wallet credit
      const userWallet = s.wallets[req.customerId] ?? 0;
      const updatedWallets = { ...s.wallets, [req.customerId]: userWallet + req.refundAmount };

      // Update Order Status and Payment Status
      const userOrders = s.orders[req.customerId] ?? [];
      const updatedOrders = userOrders.map(o => {
        if (o.id === req.orderId) {
          return {
            ...o,
            status: "Returned",
            paymentStatus: "Refunded" as const,
            refundDetails: {
              status: "Approved",
              amount: req.refundAmount,
              transactionId: `pay_razor_${Math.random().toString(36).substring(2, 11)}`,
              date: new Date().toISOString().slice(0, 10)
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
          { id: `n-${Date.now()}`, icon: "wallet", title: "Refund Issued", body: `Refund of ₹${req.refundAmount.toLocaleString()} credited to your wallet (Razorpay Payout complete).`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    rejectReturn: (returnId) => setState(s => {
      const req = s.returns.find(r => r.id === returnId);
      if (!req) return s;
      const updatedReturns = s.returns.map(r => r.id === returnId ? { ...r, status: "Rejected" as const } : r);
      return {
        ...s,
        returns: updatedReturns,
        notifications: [
          { id: `n-${Date.now()}`, icon: "refund", title: "Return Request Rejected", body: `Return request ${returnId} for order ${req.orderId} was not approved.`, time: "now", unread: true },
          ...s.notifications
        ]
      };
    }),
    suspendCustomer: (id) => setState(s => ({
      ...s,
      users: s.users.map(u => u.id === id ? { ...u, status: "Suspended" as const } : u)
    })),
    reactivateCustomer: (id) => setState(s => ({
      ...s,
      users: s.users.map(u => u.id === id ? { ...u, status: "Active" as const } : u)
    })),
    addWalletCredit: (userId, amount) => setState(s => {
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
    moderateReview: (productId, reviewId, action) => setState(s => {
      const productRevs = s.productReviews[productId] ?? [];
      const updated = productRevs.map(r => r.id === reviewId ? { ...r, status: action === "approve" ? ("Approved" as const) : ("Hidden" as const) } : r);
      return { ...s, productReviews: { ...s.productReviews, [productId]: updated } };
    }),
    addReview: (productId, r) => setState(s => {
      const productRevs = s.productReviews[productId] ?? [];
      const newReview: ProductReview = {
        id: `rev-${Date.now()}`,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        videos: r.videos,
        date: new Date().toISOString().slice(0, 10),
        status: "Approved"
      };
      return {
        ...s,
        productReviews: { ...s.productReviews, [productId]: [newReview, ...productRevs] }
      };
    }),
    updateHomepageLayout: (layout) => setState(s => ({
      ...s,
      homepageLayout: { ...s.homepageLayout, ...layout }
    })),
    createVendor: (v) => setState(s => {
      const newVendor: Vendor = {
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
    deleteVendor: (id) => setState(s => ({ ...s, vendors: s.vendors.filter(v => v.id !== id) })),

    // Isolated shop cart & wishlist implementations
    addToShopCart: (item) => setState(s => {
      const existing = s.shopCart.find(c => c.productId === item.productId && c.selectedSize === item.selectedSize);
      const qty = item.qty ?? 1;
      let shopCart;
      if (existing) {
        shopCart = s.shopCart.map(c => (c.productId === item.productId && c.selectedSize === item.selectedSize) ? { ...c, qty: c.qty + qty } : c);
      } else {
        shopCart = [...s.shopCart, { ...item, qty }];
      }
      // Increment shop cart additions trending log
      const currentAdditions = s.productCartAdditions[item.productId] ?? 0;
      return {
        ...s,
        shopCart,
        productCartAdditions: { ...s.productCartAdditions, [item.productId]: currentAdditions + qty }
      };
    }),
    removeFromShopCart: (id) => setState(s => ({ ...s, shopCart: s.shopCart.filter(c => c.productId !== id) })),
    clearShopCart: () => setState(s => ({ ...s, shopCart: [] })),
    toggleShopWishlist: (userId, productId) => setState(s => {
      const list = s.shopWishlist[userId] ?? [];
      const next = list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId];
      return { ...s, shopWishlist: { ...s.shopWishlist, [userId]: next } };
    }),
    recordProductView: (productId) => setState(s => {
      const currentViews = s.productViews[productId] ?? 0;
      return {
        ...s,
        productViews: { ...s.productViews, [productId]: currentViews + 1 }
      };
    })
  }), [state]);

  return <PortalContext.Provider value={api}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside <PortalProvider>");
  return ctx;
}

/** Convenience selector aliasing usePortal — encourages a "store" mental model in pages. */
export function useAppStore() {
  return usePortal();
}

export function useCartTotal() {
  const { state } = usePortal();
  const count = state.cart.reduce((n, c) => n + c.qty, 0);
  const total = state.cart.reduce((n, c) => n + Number(c.price.replace(/[^0-9.]/g, "")) * c.qty, 0);
  
  const shopCount = state.shopCart.reduce((n, c) => n + c.qty, 0);
  const shopTotal = state.shopCart.reduce((n, c) => n + Number(c.price.replace(/[^0-9.]/g, "")) * c.qty, 0);

  return { count, total, shopCount, shopTotal };
}
