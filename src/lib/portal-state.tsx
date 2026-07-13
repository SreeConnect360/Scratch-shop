// Centralized client-only store for ReeVibes.
// Persists to localStorage and powers BOTH the public portal and admin portal.
// Admin writes propagate instantly to public reads (and vice versa) because
// every page reads from the same single React context.

import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { NOTIFICATIONS_SEED, SEED_COMMENTS, type CommentItem } from "./portal-data";
import { BACKEND_URL } from "./config";
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
export type Notif = { id: string; icon: string; title: string; body: string; time: string; unread: boolean; createdAt?: number };
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
  status: string;
  refundAmount: number;
  refundTransactionId?: string;
  refundDate?: string;
  selectedSize?: string;
  qty?: number;
  refundMethod?: string;
  rejectionReason?: string;
  expectedCreditDate?: string;
  pickupDate?: string;
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

export type Bucket = {
  id: string;
  name: string;
  productIds: string[];
  starProductId?: string;
  hidden?: boolean;
};

export type ShopCoupon = {
  code: string;
  discount: number;
  type: "fixed" | "percentage" | "wallet";
  expiryDate: string;
  usageLimit: number;
  userEligibility: string;
  active: boolean;
  usedCount?: number;
};

export type PortalState = {
  buckets: Bucket[];
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
  majorAddresses: Record<string, string>; // userId -> major address string
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
  homepageLayout: any;
  homepageLayoutDraft: any;
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

const DEFAULT_BUCKETS: Bucket[] = [
  { id: "bkt1", name: "Summer Essentials", productIds: ["pr1", "pr3"], starProductId: "pr1" },
  { id: "bkt2", name: "Luxury Black Curation", productIds: ["pr2", "pr5"], starProductId: "pr2" }
];

const DEFAULT_VENDORS: Vendor[] = [
  { id: "blankapparel", companyName: "Blank Apparel India", contactPerson: "Prakash Kumar", email: "wholesale@blankapparel.in", phone: "+91 9999911111", products: [], revenue: 0 }
];

const DEFAULT_WALLETS: Record<string, number> = {
  "USR-1000": 25000,
  "usr-1000": 25000
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

const DEFAULT: PortalState = {
  buckets: DEFAULT_BUCKETS,
  user: null,
  votesByDay: {},
  ratings: {},
  favorites: [],
  comments: {},
  cart: [],
  shopCart: [],
  notifications: NOTIFICATIONS_SEED.map(n => {
    let offset = 0;
    if (n.time.includes("2h")) offset = 2 * 3600 * 1000;
    else if (n.time.includes("1d")) offset = 24 * 3600 * 1000;
    else if (n.time.includes("3d")) offset = 3 * 24 * 3600 * 1000;
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
        total: 150000,
        status: "Shipped",
        address: "123, Luxury Lane, Indiranagar, Bangalore - 560038",
        paymentStatus: "Paid"
      },
      {
        id: "ORD-9500",
        date: "2026-07-09T18:45:00Z",
        items: [{ productId: "pr1", name: "Silk Slip — Noir", house: "Maison Lumière", price: "₹85,000", image: "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=1200&h=1600&q=80", qty: 1, selectedSize: "S" }],
        total: 85000,
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
  homepageLayout: DEFAULT_HOMEPAGE_LAYOUT,
  homepageLayoutDraft: DEFAULT_HOMEPAGE_LAYOUT
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
  dismissNotification: (id: string) => void;

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
  updateAddress: (userId: string, index: number, address: string) => void;
  setMajorAddress: (userId: string, address: string) => void;
  toggleWishlist: (userId: string, productId: string) => void;
  createOrder: (userId: string, order: { items: CartItem[]; total: number; address: string; appliedCoupon?: string }) => void;
  updateOrderStatus: (userId: string, orderId: string, status: string) => void;
  addCoupon: (coupon: { code: string; discount: number; type?: "fixed" | "percentage" | "wallet"; expiryDate?: string; usageLimit?: number; userEligibility?: string }) => void;
  removeCoupon: (code: string) => void;

  // Shopping Platform Actions
  setAdminMode: (mode: "Contest" | "Shop") => void;
  createProduct: (p: Omit<Product, "id"> & { sizes?: string[]; stockPerSize?: Record<string, number>; sku?: string; images?: string[]; videos?: string[] }) => void;
  updateProduct: (id: string, patch: Partial<Product> & { sizes?: string[]; stockPerSize?: Record<string, number>; sku?: string; images?: string[]; videos?: string[] }) => void;
  deleteProduct: (id: string) => void;
  requestReturn: (req: { orderId: string; productId: string; productName: string; customerId: string; customerName: string; reason: string; comment: string; images: string[]; videos: string[]; refundAmount: number; selectedSize?: string; qty?: number; refundMethod?: string }) => void;
  approveReturn: (returnId: string) => void;
  rejectReturn: (returnId: string, rejectionReason?: string) => void;
  updateReturnDetails: (returnId: string, patch: Partial<ReturnRequest>) => void;
  suspendCustomer: (id: string) => void;
  reactivateCustomer: (id: string) => void;
  addWalletCredit: (userId: string, amount: number) => void;
  moderateReview: (productId: string, reviewId: string, action: "approve" | "hide") => void;
  addReview: (productId: string, r: Omit<ProductReview, "id" | "status" | "date">) => void;
  updateHomepageLayout: (layout: Partial<PortalState["homepageLayout"]>) => void;
  updateHomepageLayoutDraft: (layout: Partial<PortalState["homepageLayoutDraft"]>) => void;
  publishHomepageLayout: () => void;
  revertHomepageLayout: () => void;
  createBucket: (name: string, productIds: string[], starProductId?: string) => void;
  updateBucket: (id: string, patch: Partial<Bucket>) => void;
  deleteBucket: (id: string) => void;
  reorderBuckets: (buckets: Bucket[]) => void;
  createVendor: (v: Omit<Vendor, "id" | "revenue" | "products">) => void;
  deleteVendor: (id: string) => void;
  
  // Isolated Shop Specific Carts & Wishlists
  addToShopCart: (item: Omit<CartItem, "qty"> & { qty?: number; selectedSize?: string }) => void;
  removeFromShopCart: (productId: string, selectedSize?: string) => void;
  clearShopCart: () => void;
  toggleShopWishlist: (userId: string, productId: string) => void;
  recordProductView: (productId: string) => void;
  updateShopCartQty: (productId: string, selectedSize: string, qty: number) => void;
  restoreToShopCart: (item: CartItem) => void;
  reloadProducts: () => Promise<void>;
};

const PortalContext = createContext<Ctx | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  // Fetch dynamic database vendors, products, buckets, and customers from PostgreSQL backend
  const fetchBackendState = useCallback(async () => {
    try {
      // 1. Fetch Vendors
      const vendorsRes = await fetch(`${BACKEND_URL}/api/vendors`);
      let mappedVendors = DEFAULT_VENDORS;
      if (vendorsRes.ok) {
        const dbVendors = await vendorsRes.json();
        if (dbVendors && dbVendors.length > 0) {
          mappedVendors = dbVendors.map((v: any) => ({
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

      // 2. Fetch Products
      const res = await fetch(`${BACKEND_URL}/api/vendors/products`);
      let mappedProducts = PRODUCTS;
      if (res.ok) {
        const dbProducts = await res.json();
        mappedProducts = dbProducts.map((p: any) => ({
          ...p,
          id: String(p.id),
          house: p.house || p.brand || "Maison Curation",
          price: typeof p.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : (p.price?.toString().startsWith("₹") ? p.price : `₹${p.price}`),
        }));
      }

      // 3. Fetch Buckets
      const bucketsRes = await fetch(`${BACKEND_URL}/api/buckets`);
      let mappedBuckets = DEFAULT_BUCKETS;
      if (bucketsRes.ok) {
        const dbBuckets = await bucketsRes.json();
        if (dbBuckets && dbBuckets.length > 0) {
          mappedBuckets = dbBuckets.map((b: any) => ({
            id: b.id,
            name: b.name,
            productIds: b.productIds ? b.productIds.split(",") : [],
            starProductId: b.starProductId || undefined,
            hidden: b.hidden ?? false
          }));
        }
      }

      // 4. Fetch Customers
      const customersRes = await fetch(`${BACKEND_URL}/api/customers`);
      let mappedCustomers = PLATFORM_USERS;
      if (customersRes.ok) {
        const dbCustomers = await customersRes.json();
        if (dbCustomers && dbCustomers.length > 0) {
          mappedCustomers = dbCustomers.map((u: any) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone || undefined,
            country: u.country || undefined,
            dob: u.dob || undefined,
            gender: u.gender || undefined,
            status: u.status || "Active",
            roles: u.roles ? u.roles.split(",") : ["General"]
          }));
        }
      }

      // 5. Fetch Homepage Layout
      const layoutsRes = await fetch(`${BACKEND_URL}/api/homepage-layout`);
      let mappedPubLayout = DEFAULT_HOMEPAGE_LAYOUT;
      let mappedDraftLayout = DEFAULT_HOMEPAGE_LAYOUT;
      if (layoutsRes.ok) {
        const dbLayouts = await layoutsRes.json();
        const pub = dbLayouts.find((l: any) => l.id === "published");
        const draft = dbLayouts.find((l: any) => l.id === "draft");
        if (pub) {
          try { mappedPubLayout = JSON.parse(pub.layoutJson); } catch(e) {}
        }
        if (draft) {
          try { mappedDraftLayout = JSON.parse(draft.layoutJson); } catch(e) {}
        }
      }

      // 6. Fetch Orders
      const ordersRes = await fetch(`${BACKEND_URL}/api/orders`);
      let mappedOrders: Record<string, any[]> = {};
      if (ordersRes.ok) {
        const dbOrders = await ordersRes.json();
        dbOrders.forEach((o: any) => {
          let items = [];
          try { items = JSON.parse(o.itemsJson); } catch(e) {}
          let refundDetails = undefined;
          if (o.refundDetailsJson) {
            try { refundDetails = JSON.parse(o.refundDetailsJson); } catch(e) {}
          }
          if (!mappedOrders[o.userId]) mappedOrders[o.userId] = [];
          mappedOrders[o.userId].push({
            id: o.id,
            date: o.orderDate,
            items,
            total: Number(o.total),
            status: o.status,
            address: o.address,
            paymentStatus: o.paymentStatus,
            refundDetails
          });
        });
      }

      // 7. Fetch Returns
      const returnsRes = await fetch(`${BACKEND_URL}/api/returns`);
      let mappedReturns = [];
      if (returnsRes.ok) {
        const dbReturns = await returnsRes.json();
        mappedReturns = dbReturns.map((r: any) => ({
          ...r,
          refundAmount: Number(r.refundAmount),
          images: r.images ? r.images.split(",") : [],
          videos: r.videos ? r.videos.split(",") : []
        }));
      }

      // 8. Fetch Coupons
      const couponsRes = await fetch(`${BACKEND_URL}/api/coupons`);
      let mappedCoupons = [];
      if (couponsRes.ok) {
        const dbCoupons = await couponsRes.json();
        mappedCoupons = dbCoupons.map((c: any) => ({
          ...c,
          discount: Number(c.discount),
          usedCount: c.usedCount || 0
        }));
      }

      // 9. Fetch Reviews
      const reviewsRes = await fetch(`${BACKEND_URL}/api/reviews`);
      let mappedReviews: Record<string, any[]> = {};
      if (reviewsRes.ok) {
        const dbReviews = await reviewsRes.json();
        dbReviews.forEach((r: any) => {
          if (!mappedReviews[r.productId]) mappedReviews[r.productId] = [];
          mappedReviews[r.productId].push({
            id: r.id,
            userName: r.userName,
            rating: r.rating,
            comment: r.comment,
            date: r.reviewDate,
            status: r.status,
            images: r.images ? r.images.split(",") : [],
            videos: r.videos ? r.videos.split(",") : []
          });
        });
      }

      setState(s => {
        return {
          ...s,
          vendors: mappedVendors,
          products: mappedProducts,
          buckets: mappedBuckets,
          users: mappedCustomers,
          homepageLayout: mappedPubLayout,
          homepageLayoutDraft: mappedDraftLayout,
          orders: mappedOrders,
          returns: mappedReturns,
          coupons: mappedCoupons,
          productReviews: mappedReviews
        };
      });
    } catch (err) {
      console.warn("Backend offline. Fallback to offline store data.", err);
    }
  }, []);

  useEffect(() => {
    const loadedState = load();
    
    // Merge URL products
    const checkedProducts = (loadedState.products || []).map((p: any) => {
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

    fetchBackendState();

    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("reevibes:")) {
        setState(load());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchBackendState]);

  useEffect(() => { if (hydrated) save(state); }, [state, hydrated]);

  const api = useMemo<Ctx>(() => ({
    state,
    reloadProducts: fetchBackendState,

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
    dismissNotification: (id) => setState(s => ({ ...s, notifications: s.notifications.filter(n => n.id !== id) })),

    /* ───── public → admin sync ───── */
    registerUser: (u) => {
      const id = `USR-${String(2000 + Date.now()).slice(-6)}`;
      const year = u.dob ? Number(u.dob.slice(0, 4)) : 1998;
      const newUser: PlatformUser = {
        id,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: (u.gender as PlatformUser["gender"]) ?? "",
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
      const nextMajorAddresses = { ...s.majorAddresses };
      // Auto set first address as major
      if (list.length === 0) {
        nextMajorAddresses[userId] = address;
      }
      return {
        ...s,
        addresses: { ...s.addresses, [userId]: [...list, address] },
        majorAddresses: nextMajorAddresses
      };
    }),
    removeAddress: (userId, index) => setState(s => {
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
    updateAddress: (userId, index, address) => setState(s => {
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
    setMajorAddress: (userId, address) => setState(s => {
      const next = { ...s.majorAddresses, [userId]: address };
      return { ...s, majorAddresses: next };
    }),
    toggleWishlist: (userId, productId) => setState(s => {
      const list = s.wishlist[userId] ?? [];
      const next = list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId];
      return { ...s, wishlist: { ...s.wishlist, [userId]: next } };
    }),
    createOrder: (userId, order) => {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: order.items,
        total: order.total,
        status: "Processing",
        address: order.address,
        paymentStatus: "Paid" as const
      };

      fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          userId,
          itemsJson: JSON.stringify(order.items),
          total: order.total,
          status: "Processing",
          address: order.address,
          paymentStatus: "Paid"
        })
      }).catch(err => console.error("Failed to sync new order to backend:", err));

      setState(s => {
        const list = s.orders[userId] ?? [];
        const nextCoupons = order.appliedCoupon
          ? (s.coupons || []).map(c =>
              c.code === order.appliedCoupon?.toUpperCase()
                ? { ...c, usedCount: (c.usedCount || 0) + 1 }
                : c
            )
          : s.coupons;

        const orderItemKeys = new Set((order.items || []).map(item => `${item.productId}-${item.selectedSize || "M"}`));
        const nextShopCart = (s.shopCart || []).filter(item => !orderItemKeys.has(`${item.productId}-${item.selectedSize || "M"}`));

        const nextProducts = (s.products || []).map(p => {
          const orderItem = order.items.find(item => String(item.productId) === String(p.id));
          if (orderItem) {
            const size = orderItem.selectedSize || "M";
            const updatedStock = { ...(p.stockPerSize || {}) };
            if (updatedStock[size] !== undefined) {
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
              updatedLimit = undefined;
              updatedExpiry = undefined;
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
          shopCart: nextShopCart,
          notifications: [
            { id: `n-${Date.now()}`, icon: "order", title: "Order Placed Successfully", body: `Your order ${orderId} for ₹${order.total.toLocaleString()} has been placed.`, time: "now", unread: true },
            ...s.notifications
          ]
        };
      });
    },
    updateOrderStatus: (userId, orderId, status) => {
      setState(s => {
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
      });

      fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }).catch(err => console.error("Failed to sync order status update to backend:", err));
    },
    addCoupon: (coupon) => {
      const upperCode = coupon.code.toUpperCase();
      const newCoupon = {
        code: upperCode,
        discount: coupon.discount,
        type: coupon.type ?? "percentage",
        expiryDate: coupon.expiryDate ?? "2026-12-31",
        usageLimit: coupon.usageLimit ?? 100,
        userEligibility: coupon.userEligibility ?? "All",
        active: true
      };

      setState(s => {
        if (s.coupons.some(c => c.code === upperCode)) return s;
        return {
          ...s,
          coupons: [...s.coupons, newCoupon]
        };
      });

      fetch(`${BACKEND_URL}/api/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon)
      }).catch(err => console.error("Failed to sync new coupon to backend:", err));
    },
    removeCoupon: (code) => {
      const upperCode = code.toUpperCase();
      setState(s => ({ ...s, coupons: s.coupons.filter(c => c.code !== upperCode) }));

      fetch(`${BACKEND_URL}/api/coupons/${upperCode}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to sync coupon deletion to backend:", err));
    },

    setAdminMode: (mode) => setState(s => ({ ...s, adminMode: mode })),
    createProduct: (p) => {
      const id = `vnd-${Date.now()}-catalog`;
      const newProduct: Product = {
        id,
        ...p
      };
      setState(s => ({ ...s, products: [newProduct, ...s.products] }));
      
      const cleaned = { ...p, id };
      if (cleaned.price !== undefined) {
        cleaned.price = cleaned.price.toString().replace(/[^0-9.]/g, "") as any;
      }
      if (cleaned.originalPrice !== undefined) {
        cleaned.originalPrice = cleaned.originalPrice.toString().replace(/[^0-9.]/g, "") as any;
      }
      
      fetch(`${BACKEND_URL}/api/vendors/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleaned)
      }).catch(err => console.error("Failed to sync new product to backend:", err));
    },
    updateProduct: (id, patch) => {
      setState(s => ({
        ...s,
        products: s.products.map(p => p.id === id ? { ...p, ...patch } : p)
      }));
      if (id.startsWith("vp-") || id.startsWith("vnd-") || id.includes("-catalog")) {
        // Clean price strings to numbers if present
        const cleanedPatch = { ...patch };
        if (cleanedPatch.price !== undefined) {
          cleanedPatch.price = cleanedPatch.price.toString().replace(/[^0-9.]/g, "") as any;
        }
        if (cleanedPatch.originalPrice !== undefined) {
          cleanedPatch.originalPrice = cleanedPatch.originalPrice.toString().replace(/[^0-9.]/g, "") as any;
        }
        fetch(`${BACKEND_URL}/api/vendors/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanedPatch)
        }).catch(err => console.error("Failed to sync product update to backend:", err));
      }
    },
    deleteProduct: (id) => {
      setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
      if (id.startsWith("vp-") || id.startsWith("vnd-") || id.includes("-catalog")) {
        fetch(`${BACKEND_URL}/api/vendors/products/${id}`, {
          method: "DELETE"
        }).catch(err => console.error("Failed to sync product deletion to backend:", err));
      }
    },
    requestReturn: (req) => {
      const returnId = `RET-${Math.floor(100 + Math.random() * 900)}`;
      const newReturn = {
        id: returnId,
        ...req,
        status: "Return Requested"
      };

      setState(s => ({
        ...s,
        returns: [newReturn, ...s.returns],
        notifications: [
          { id: `n-${Date.now()}`, icon: "refund", title: "Return Request Created", body: `Return request ${returnId} for order ${req.orderId} submitted.`, time: "now", unread: true },
          ...s.notifications
        ]
      }));

      fetch(`${BACKEND_URL}/api/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: returnId,
          orderId: req.orderId,
          productId: req.productId,
          productName: req.productName,
          customerId: req.customerId,
          customerName: req.customerName,
          reason: req.reason,
          comment: req.comment,
          images: req.images ? req.images.join(",") : "",
          videos: req.videos ? req.videos.join(",") : "",
          status: "Return Requested",
          refundAmount: req.refundAmount,
          selectedSize: req.selectedSize,
          qty: req.qty,
          refundMethod: req.refundMethod
        })
      }).catch(err => console.error("Failed to sync new return request to backend:", err));
    },
    approveReturn: (returnId) => {
      let req: any;
      let nextRefundTxId = `pay_razor_${Math.random().toString(36).substring(2, 11)}`;
      let nextRefundDate = new Date().toISOString().slice(0, 10);
      let nextExpectedCreditDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      setState(s => {
        req = s.returns.find(r => r.id === returnId);
        if (!req) return s;

        const updatedReturns = s.returns.map(r => r.id === returnId ? {
          ...r,
          status: "Refund Completed",
          refundTransactionId: nextRefundTxId,
          refundDate: nextRefundDate,
          expectedCreditDate: nextExpectedCreditDate
        } : r);

        let updatedWallets = s.wallets;
        if (req.refundMethod === "ReeVibes Wallet" || req.refundMethod === "Store Credit") {
          const userWallet = s.wallets[req.customerId] ?? 0;
          updatedWallets = { ...s.wallets, [req.customerId]: userWallet + req.refundAmount };
        }

        const userOrders = s.orders[req.customerId] ?? [];
        const updatedOrders = userOrders.map(o => {
          if (o.id === req.orderId) {
            return {
              ...o,
              status: "Returned",
              paymentStatus: "Refunded" as const,
              refundDetails: {
                status: "Refund Completed",
                amount: req.refundAmount,
                transactionId: nextRefundTxId,
                date: nextRefundDate
              }
            };
          }
          return o;
        });

        fetch(`${BACKEND_URL}/api/returns/${returnId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Refund Completed",
            refundTransactionId: nextRefundTxId,
            refundDate: nextRefundDate,
            expectedCreditDate: nextExpectedCreditDate
          })
        }).catch(err => console.error("Failed to sync approved return status:", err));

        fetch(`${BACKEND_URL}/api/orders/${req.orderId}/refund`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Returned",
            paymentStatus: "Refunded",
            refundDetailsJson: JSON.stringify({
              status: "Refund Completed",
              amount: req.refundAmount,
              transactionId: nextRefundTxId,
              date: nextRefundDate
            })
          })
        }).catch(err => console.error("Failed to sync order refund status:", err));

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
      });
    },
    rejectReturn: (returnId, rejectionReason) => {
      let req: any;
      setState(s => {
        req = s.returns.find(r => r.id === returnId);
        if (!req) return s;

        const updatedReturns = s.returns.map(r => r.id === returnId ? {
          ...r,
          status: "Rejected",
          rejectionReason: rejectionReason || "Insufficient evidence"
        } : r);

        fetch(`${BACKEND_URL}/api/returns/${returnId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Rejected",
            rejectionReason: rejectionReason || "Insufficient evidence"
          })
        }).catch(err => console.error("Failed to sync rejected return status:", err));

        return {
          ...s,
          returns: updatedReturns,
          notifications: [
            { id: `n-${Date.now()}`, icon: "refund", title: "Return Request Rejected", body: `Return request ${returnId} for order ${req.orderId} was rejected. Reason: ${rejectionReason || "Insufficient evidence"}.`, time: "now", unread: true },
            ...s.notifications
          ]
        };
      });
    },
    updateReturnDetails: (returnId, patch) => {
      setState(s => {
        const nextList = s.returns.map(r => r.id === returnId ? { ...r, ...patch } : r);
        return { ...s, returns: nextList };
      });

      fetch(`${BACKEND_URL}/api/returns/${returnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      }).catch(err => console.error("Failed to sync return details patch:", err));
    },
    moderateReview: (productId, reviewId, action) => {
      const nextStatus = action === "approve" ? "Approved" : "Hidden";
      setState(s => {
        const productRevs = s.productReviews[productId] ?? [];
        const updated = productRevs.map(r => r.id === reviewId ? { ...r, status: nextStatus as any } : r);
        return { ...s, productReviews: { ...s.productReviews, [productId]: updated } };
      });

      fetch(`${BACKEND_URL}/api/reviews/${reviewId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      }).catch(err => console.error("Failed to sync review moderation to backend:", err));
    },
    addReview: (productId, r) => {
      const reviewId = `rev-${Date.now()}`;
      const reviewDate = new Date().toISOString().slice(0, 10);
      const newReview: any = {
        id: reviewId,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        videos: r.videos,
        date: reviewDate,
        status: "Approved"
      };

      setState(s => {
        const productRevs = s.productReviews[productId] ?? [];
        return {
          ...s,
          productReviews: { ...s.productReviews, [productId]: [newReview, ...productRevs] }
        };
      });

      fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reviewId,
          productId,
          userName: r.userName,
          rating: r.rating,
          comment: r.comment,
          images: r.images ? r.images.join(",") : "",
          videos: r.videos ? r.videos.join(",") : "",
          reviewDate,
          status: "Approved"
        })
      }).catch(err => console.error("Failed to sync review to backend:", err));
    },
    updateHomepageLayout: (layout) => {
      let nextLayout: any;
      setState(s => {
        nextLayout = { ...s.homepageLayout, ...layout };
        const next = { ...s, homepageLayout: nextLayout };
        save(next);
        return next;
      });
      fetch(`${BACKEND_URL}/api/homepage-layout/published`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutJson: JSON.stringify(nextLayout) })
      }).catch(err => console.error("Failed to sync published homepage layout:", err));
    },
    updateHomepageLayoutDraft: (layout) => {
      let nextLayout: any;
      setState(s => {
        nextLayout = { ...s.homepageLayoutDraft, ...layout };
        const next = { ...s, homepageLayoutDraft: nextLayout };
        save(next);
        return next;
      });
      fetch(`${BACKEND_URL}/api/homepage-layout/draft`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutJson: JSON.stringify(nextLayout) })
      }).catch(err => console.error("Failed to sync draft homepage layout:", err));
    },
    publishHomepageLayout: () => {
      setState(s => {
        const next = { ...s, homepageLayout: { ...s.homepageLayoutDraft } };
        save(next);
        fetch(`${BACKEND_URL}/api/homepage-layout/published`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layoutJson: JSON.stringify(s.homepageLayoutDraft) })
        }).catch(err => console.error("Failed to publish homepage layout:", err));
        return next;
      });
    },
    revertHomepageLayout: () => {
      setState(s => {
        const next = { ...s, homepageLayoutDraft: { ...s.homepageLayout } };
        save(next);
        fetch(`${BACKEND_URL}/api/homepage-layout/draft`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layoutJson: JSON.stringify(s.homepageLayout) })
        }).catch(err => console.error("Failed to revert homepage layout:", err));
        return next;
      });
    },
    createBucket: (name, productIds, starProductId) => {
      const id = `bkt-${Date.now()}`;
      const newBucket: Bucket = { id, name, productIds, starProductId, hidden: false };
      setState(s => ({ ...s, buckets: [...(s.buckets || []), newBucket] }));

      fetch(`${BACKEND_URL}/api/buckets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          productIds: productIds.join(","),
          starProductId,
          hidden: false
        })
      }).catch(err => console.error("Failed to sync new bucket to backend:", err));
    },
    updateBucket: (id, patch) => {
      setState(s => {
        const next = (s.buckets || []).map(b => b.id === id ? { ...b, ...patch } : b);
        return { ...s, buckets: next };
      });

      const bodyPatch: any = {};
      if (patch.name !== undefined) bodyPatch.name = patch.name;
      if (patch.productIds !== undefined) bodyPatch.productIds = patch.productIds.join(",");
      if (patch.starProductId !== undefined) bodyPatch.starProductId = patch.starProductId;
      if (patch.hidden !== undefined) bodyPatch.hidden = patch.hidden;

      fetch(`${BACKEND_URL}/api/buckets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPatch)
      }).catch(err => console.error("Failed to sync bucket update to backend:", err));
    },
    deleteBucket: (id) => {
      setState(s => ({
        ...s,
        buckets: (s.buckets || []).filter(b => b.id !== id)
      }));

      fetch(`${BACKEND_URL}/api/buckets/${id}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to sync bucket deletion to backend:", err));
    },
    reorderBuckets: (buckets) => setState(s => ({
      ...s,
      buckets
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
      const cartList = s.shopCart || [];
      const existing = cartList.find(c => c.productId === item.productId && c.selectedSize === item.selectedSize);
      const qty = item.qty ?? 1;
      let shopCart;
      if (existing) {
        shopCart = cartList.map(c => (c.productId === item.productId && c.selectedSize === item.selectedSize) ? { ...c, qty: c.qty + qty } : c);
      } else {
        shopCart = [...cartList, { ...item, qty }];
      }
      // Increment shop cart additions trending log
      const currentAdditions = s.productCartAdditions[item.productId] ?? 0;
      return {
        ...s,
        shopCart,
        productCartAdditions: { ...s.productCartAdditions, [item.productId]: currentAdditions + qty }
      };
    }),
    removeFromShopCart: (id, size) => setState(s => ({
      ...s,
      shopCart: (s.shopCart || []).filter(c => size ? !(c.productId === id && c.selectedSize === size) : c.productId !== id)
    })),
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
    }),
    updateShopCartQty: (productId, selectedSize, qty) => setState(s => {
      const shopCart = (s.shopCart || []).map(c =>
        (c.productId === productId && c.selectedSize === selectedSize) ? { ...c, qty } : c
      );
      return { ...s, shopCart };
    }),
    restoreToShopCart: (item) => setState(s => {
      const exists = (s.shopCart || []).some(c => c.productId === item.productId && c.selectedSize === item.selectedSize);
      const shopCart = exists ? (s.shopCart || []) : [...(s.shopCart || []), item];
      return { ...s, shopCart };
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
  const count = (state.cart || []).reduce((n, c) => n + c.qty, 0);
  const total = (state.cart || []).reduce((n, c) => n + Number(String(c.price).replace(/[^0-9.]/g, "")) * c.qty, 0);
  
  const shopCount = (state.shopCart || []).reduce((n, c) => n + c.qty, 0);
  const shopTotal = (state.shopCart || []).reduce((n, c) => n + Number(String(c.price).replace(/[^0-9.]/g, "")) * c.qty, 0);

  return { count, total, shopCount, shopTotal };
}
