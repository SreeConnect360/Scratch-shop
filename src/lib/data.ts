// Dummy data for the ReeVibes platform.
// All imagery uses Unsplash editorial photography (women, fashion, runway).

const U = (id: string, w = 1200, h = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const HERO_IMAGES = [
  U("photo-1539109136881-3be0616acf4b"),
  U("photo-1496360166961-10a51d5f367a"),
  U("photo-1485518882345-15568b007407"),
  U("photo-1583001931096-959e9a1a6223"),
];

export type Contestant = {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string;
  age: number;
  height: string;
  measurements: string;
  status: "Applied" | "Approved" | "Hold" | "Blocked" | "Casting" | "Judgement" | "Top16" | "Top10";
  rank?: number;
  votes: number;
  image: string;
  gallery: string[];
  bio: string;
  campaigns: string[];
  social: { instagram?: string; tiktok?: string };
  hairColour?: string;
  eyeColour?: string;
  dob?: string;
  bust?: string;
  waist?: string;
  hips?: string;
};

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
  "photo-1564415637254-92c66292cd64",
];

const NAMES = [
  ["Aaliyah Khan", "Mumbai"], ["Priya Sharma", "Bangalore"], ["Deepika Patel", "Ahmedabad"],
  ["Ananya Sen", "Kolkata"], ["Meera Reddy", "Hyderabad"], ["Neha Gupta", "Delhi"],
  ["Kavita Nair", "Kochi"], ["Aditi Rao", "Chennai"], ["Riya Kapoor", "Jaipur"],
  ["Shreya Ghoshal", "Pune"], ["Tanvi Shah", "Surat"], ["Pooja Hegde", "Lucknow"],
  ["Jyoti Singh", "Patna"], ["Kirti Kulhari", "Chandigarh"], ["Rashmi Desai", "Guwahati"],
  ["Sneha Reddy", "Bhubaneswar"],
];

const COUNTRIES = [
  "Maharashtra", "Karnataka", "Gujarat", "West Bengal", "Telangana", "Delhi", "Kerala", "Tamil Nadu",
  "Rajasthan", "Maharashtra", "Gujarat", "Uttar Pradesh", "Bihar", "Punjab", "Assam", "Odisha"
];

export const CONTESTANTS: Contestant[] = NAMES.map(([name, city], i) => ({
  id: `c-${i + 1}`,
  slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name,
  country: COUNTRIES[i],
  city,
  age: 22 + (i % 9),
  height: `${170 + (i % 12)} cm`,
  measurements: `${88 + (i % 10)}-${66 + (i % 8)}-${94 + (i % 10)}`,
  status: (["Applied","Approved","Hold","Casting","Judgement","Top16","Top10"] as const)[i % 7],
  rank: i < 10 ? i + 1 : undefined,
  votes: Math.floor(20000 - i * 873 + Math.random() * 1000),
  image: U(FACES[i], 900, 1200),
  gallery: [0,1,2,3,4].map((k) => U(FACES[(i + k) % FACES.length], 1200, 1600)),
  bio: "A vision of modern femininity — sculpted by light, defined by presence. Her work moves between editorial campaigns, runway moments and intimate portraiture.",
  campaigns: ["Resort 25", "Atelier Noir", "Maison Lumière"],
  social: { instagram: `@${name.split(" ")[0].toLowerCase()}`, tiktok: `@${name.split(" ")[0].toLowerCase()}.official` },
}));

export const TOP_10 = CONTESTANTS.slice(0, 10);

export type Battle = {
  id: string;
  round: string;
  a: Contestant;
  b: Contestant;
  votesA: number;
  votesB: number;
  endsAt: string;
  status: "live" | "upcoming" | "closed";
};

export const BATTLES: Battle[] = [
  { id: "b1", round: "Round of 16 · Battle 01", a: CONTESTANTS[0], b: CONTESTANTS[1], votesA: 12400, votesB: 11820, endsAt: "02:14:33", status: "live" },
  { id: "b2", round: "Round of 16 · Battle 02", a: CONTESTANTS[2], b: CONTESTANTS[3], votesA: 9200, votesB: 14210, endsAt: "02:14:33", status: "live" },
  { id: "b3", round: "Round of 16 · Battle 03", a: CONTESTANTS[4], b: CONTESTANTS[5], votesA: 7820, votesB: 8104, endsAt: "05:00:00", status: "upcoming" },
  { id: "b4", round: "Round of 16 · Battle 04", a: CONTESTANTS[6], b: CONTESTANTS[7], votesA: 15330, votesB: 12109, endsAt: "—", status: "closed" },
];

export type Campaign = {
  id: string; title: string; house: string; season: string; image: string; tag: string;
};
export const CAMPAIGNS: Campaign[] = [
  { id: "k1", title: "Atelier Noir", house: "Maison Lumière", season: "Resort 25", image: U("photo-1469334031218-e382a71b716b", 1600, 1100), tag: "Editorial" },
  { id: "k2", title: "Études en Rose", house: "Curvy Couture", season: "Spring 25", image: U("photo-1483985988355-763728e1935b", 1600, 1100), tag: "Campaign" },
  { id: "k3", title: "La Femme Moderne", house: "Atelier Reine", season: "Fall 24", image: U("photo-1490481651871-ab68de25d43d", 1600, 1100), tag: "Runway" },
  { id: "k4", title: "Silhouettes", house: "Studio Onyx", season: "Pre-Fall 25", image: U("photo-1496747611176-843222e1e57c", 1600, 1100), tag: "Look Book" },
];

export type Photographer = {
  id: string; name: string; country: string; portrait: string; works: string[]; credits: number;
};
export const PHOTOGRAPHERS: Photographer[] = [
  { id: "p1", name: "Élise Moreau", country: "Maharashtra", portrait: U("photo-1544005313-94ddf0286df2", 600, 800), works: [U("photo-1469334031218-e382a71b716b", 900, 1100), U("photo-1483985988355-763728e1935b", 900, 1100), U("photo-1490481651871-ab68de25d43d", 900, 1100)], credits: 48 },
  { id: "p2", name: "Kenji Watanabe", country: "Karnataka", portrait: U("photo-1607746882042-944635dfe10e", 600, 800), works: [U("photo-1496747611176-843222e1e57c", 900, 1100), U("photo-1485518882345-15568b007407", 900, 1100), U("photo-1539109136881-3be0616acf4b", 900, 1100)], credits: 64 },
  { id: "p3", name: "Adaeze Nwosu", country: "Delhi", portrait: U("photo-1573497019940-1c28c88b4f3e", 600, 800), works: [U("photo-1502823403499-6ccfcf4fb453", 900, 1100), U("photo-1524504388940-b1c1722653e1", 900, 1100), U("photo-1494790108377-be9c29b29330", 900, 1100)], credits: 32 },
  { id: "p4", name: "Marco Bellucci", country: "Tamil Nadu", portrait: U("photo-1500648767791-00dcc994a43e", 600, 800), works: [U("photo-1542596594-649edbc13630", 900, 1100), U("photo-1488426862026-3ee34a7d66df", 900, 1100), U("photo-1531123897727-8f129e1688ce", 900, 1100)], credits: 51 },
];

export type Sponsor = { id: string; name: string; tier: "House" | "Atelier" | "Partner"; logo: string; };
export const SPONSORS: Sponsor[] = [
  { id: "s1", name: "Maison Lumière", tier: "House", logo: "M·L" },
  { id: "s2", name: "Atelier Reine", tier: "House", logo: "A·R" },
  { id: "s3", name: "Studio Onyx", tier: "Atelier", logo: "ONYX" },
  { id: "s4", name: "Curvy Couture", tier: "Atelier", logo: "C·C" },
  { id: "s5", name: "Rose Éternelle", tier: "Partner", logo: "RE" },
  { id: "s6", name: "Velvet & Co.", tier: "Partner", logo: "V&Co" },
];

export type Product = {
  id: string;
  name: string;
  house: string;
  price: string;
  image: string;
  tag?: string;
  gender: "Men" | "Women" | "Unisex";
  category: "Shirts" | "T-Shirts" | "Tops" | "Bottoms" | "Accessories" | "Couture";
  sku?: string;
  sizes?: string[];
  stockPerSize?: Record<string, number>;
  originalPrice?: string;
  status?: string;
  discount?: number;
  discountLimitBuyers?: number;
  discountExpiryDate?: string;
  discountBuyersCount?: number;
  productInfo?: string;
  visibility?: string;
};

export const PRODUCTS: Product[] = [
  { id: "pr1", name: "Silk Slip — Noir", house: "Maison Lumière", price: "₹85,000", image: U("photo-1485518882345-15568b007407", 900, 1200), tag: "New", gender: "Women", category: "Tops" },
  { id: "pr2", name: "Cashmere Cape", house: "Atelier Reine", price: "₹1,50,000", image: U("photo-1496747611176-843222e1e57c", 900, 1200), gender: "Women", category: "Tops" },
  { id: "pr3", name: "Pearl Corset", house: "Studio Onyx", price: "₹1,25,000", image: U("photo-1539109136881-3be0616acf4b", 900, 1200), tag: "Limited", gender: "Women", category: "Tops" },
  { id: "pr4", name: "Crepe Gown", house: "Curvy Couture", price: "₹2,40,000", image: U("photo-1490481651871-ab68de25d43d", 900, 1200), gender: "Women", category: "Couture" },
  { id: "pr5", name: "Velvet Trench", house: "Velvet & Co.", price: "₹1,80,000", image: U("photo-1483985988355-763728e1935b", 900, 1200), gender: "Women", category: "Bottoms" },
  { id: "pr6", name: "Sculpted Heel", house: "Rose Éternelle", price: "₹65,000", image: U("photo-1469334031218-e382a71b716b", 900, 1200), gender: "Women", category: "Accessories" },
  
  // Men's Products
  { id: "prm1", name: "Tailored Linen Shirt", house: "Atelier Reine", price: "₹12,500", image: U("photo-1596755094514-f87e34085b2c", 900, 1200), tag: "Classic", gender: "Men", category: "Shirts" },
  { id: "prm2", name: "Premium Slim T-Shirt", house: "Studio Onyx", price: "₹6,800", image: U("photo-1521572267360-ee0c2909d518", 900, 1200), gender: "Men", category: "T-Shirts" },
  { id: "prm3", name: "Editorial Oversized Shirt", house: "Maison Lumière", price: "₹18,000", image: U("photo-1489987707025-afc232f7ea0f", 900, 1200), gender: "Men", category: "Shirts" },
  { id: "prm4", name: "Premium Pleated Bottoms", house: "Curvy Couture", price: "₹22,000", image: U("photo-1624378439575-d8705ad7ae80", 900, 1200), gender: "Men", category: "Bottoms" },
  
  // Women's extra items
  { id: "prw7", name: "Satin Crop Top", house: "Maison Lumière", price: "₹9,500", image: U("photo-1515886657613-9f3515b0c78f", 900, 1200), gender: "Women", category: "Tops" },
  { id: "prw8", name: "High-Waist Trousers", house: "Velvet & Co.", price: "₹18,500", image: U("photo-1594633312681-425c7b97ccd1", 900, 1200), gender: "Women", category: "Bottoms" },
  { id: "prw9", name: "Classic Cotton T-Shirt", house: "Studio Onyx", price: "₹5,200", image: U("photo-1554568218-0f1715e72254", 900, 1200), gender: "Women", category: "T-Shirts" }
];

export type AdminUser = { id: string; name: string; role: string; email: string; status: "Active" | "Invited" | "Suspended"; lastSeen: string };
export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Léa Dubois", role: "Main Admin", email: "lea@reevibes.com", status: "Active", lastSeen: "2 min ago" },
  { id: "u2", name: "Hiro Nakamura", role: "Contest Manager", email: "hiro@reevibes.com", status: "Active", lastSeen: "12 min ago" },
  { id: "u3", name: "Ada Eze", role: "Live Producer", email: "ada@reevibes.com", status: "Active", lastSeen: "1 hr ago" },
  { id: "u4", name: "Carlos Mendes", role: "Moderator", email: "carlos@reevibes.com", status: "Invited", lastSeen: "—" },
  { id: "u5", name: "Sara Cohen", role: "Staff", email: "sara@reevibes.com", status: "Suspended", lastSeen: "3 d ago" },
];

export const ALL_ROLES = [
  "General", "Contestant", "Photographer", "Admin",
  "Applications", "Ratings", "Casting Call", "Judgements",
] as const;
export type Role = typeof ALL_ROLES[number];

export type PlatformUser = {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Female" | "Male" | "Other" | "";
  dob: string;
  age: number;
  country: string;
  email: string;
  phone: string;
  avatar: string;
  registeredAt: string;
  roles: Role[];
  status: "Active" | "Invited" | "Suspended";
};

const FIRST = ["Anaïs","Sofia","Amara","Yuna","Camila","Zara","Isabela","Naomi","Aaliyah","Lucia","Mei","Olivia","Inés","Chiamaka","Lara","Valentina","Élise","Kenji","Adaeze","Marco","Léa","Hiro","Ada","Carlos","Sara"];
const LAST  = ["Laurent","Marchetti","Okafor","Park","Reyes","Hadid","Costa","Bergström","Khan","Romano","Tanaka","Bennett","Vidal","Eze","Petrov","Cruz","Moreau","Watanabe","Nwosu","Bellucci","Dubois","Nakamura","Eze","Mendes","Cohen"];
const PLATFORM_COUNTRIES = ["Maharashtra","Karnataka","Gujarat","West Bengal","Telangana","Delhi","Kerala","Tamil Nadu","Rajasthan","Maharashtra","Gujarat","Uttar Pradesh","Bihar","Punjab","Assam","Odisha","Maharashtra","Karnataka","Delhi","Tamil Nadu","Maharashtra","Karnataka","Delhi","Tamil Nadu","Maharashtra"];

export const PLATFORM_USERS: PlatformUser[] = FIRST.map((fn, i) => {
  const ln = LAST[i];
  const isContestant = i < 16;
  const roles: Role[] = ["General"];
  if (isContestant) roles.push("Contestant");
  if (i === 16 || i === 17 || i === 18 || i === 19) roles.push("Photographer");
  if (i === 20) roles.push("Admin");
  if (i === 21) roles.push("Applications", "Ratings");
  if (i === 22) roles.push("Casting Call", "Judgements");
  const year = 1995 + (i % 12);
  return {
    id: `USR-${String(1000 + i)}`,
    firstName: fn,
    lastName: ln,
    gender: "Female",
    dob: `${year}-${String((i % 9) + 1).padStart(2, "0")}-${String(10 + (i % 18)).padStart(2, "0")}`,
    age: 2026 - year,
    country: PLATFORM_COUNTRIES[i] ?? "Global",
    email: `${fn.toLowerCase().replace(/[^a-z]/g, "")}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@reevibes.com`,
    phone: `+${30 + (i % 60)} ${100 + i} ${1000 + i * 7}`,
    avatar: U(FACES[i % FACES.length], 200, 200),
    registeredAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    roles,
    status: i % 11 === 0 ? "Invited" : i % 17 === 0 ? "Suspended" : "Active",
  };
});

export type ContestantApplication = {
  userId: string;
  contestantId: string;
  contestYear: number;
  contestCountry: string;
  fullName: string;
  country: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hips: string;
  eyeColour: string;
  hairColour: string;
  shoeSize: string;
  biography: string;
  education: string;
  profession: string;
  social: { instagram?: string; tiktok?: string; youtube?: string };
  socialLinks?: { platform: string; url: string }[];
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  zipCode?: string;
  experience?: string;
  photos: { portrait: string; fullBody: string; sideProfile: string; candid: string; additional: string[] };
  videos: { intro: string; additional: string[] };
  numPhotos: number;
  numVideos: number;
  applicationDate: string;
  currentStage: "Applied" | "Approved" | "Casting" | "Judgement" | "Top16" | "Top10";
  status: "Pending" | "Approved" | "Hold" | "Rejected";
};

export const CONTESTANT_APPLICATIONS: ContestantApplication[] = PLATFORM_USERS
  .filter(u => u.roles.includes("Contestant"))
  .map((u, i) => {
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
      height: `${170 + (i % 12)} cm`,
      weight: `${58 + (i % 14)} kg`,
      bust: `${88 + (i % 10)} cm`,
      waist: `${66 + (i % 8)} cm`,
      hips: `${94 + (i % 10)} cm`,
      eyeColour: ["Brown","Hazel","Green","Blue","Amber"][i % 5],
      hairColour: ["Black","Brunette","Auburn","Blonde","Chestnut"][i % 5],
      shoeSize: `EU ${37 + (i % 6)}`,
      biography: c?.bio ?? "A vision of modern femininity, defined by presence and grace.",
      education: ["BA Fashion — Central Saint Martins","MA Communications — Sciences Po","BFA Performing Arts — NYU","Business Admin — Bocconi"][i % 4],
      profession: ["Model & Creative","Architect","Brand Consultant","Editor","Performer","Curator"][i % 6],
      social: { instagram: `@${u.firstName.toLowerCase()}.official`, tiktok: `@${u.firstName.toLowerCase()}` },
      agency: ["IMG Models","Elite Paris","Next Milan","The Society","Independent"][i % 5],
      photos: {
        portrait: c?.image ?? U(FACES[i % FACES.length], 900, 1200),
        fullBody: U(FACES[(i + 1) % FACES.length], 900, 1400),
        sideProfile: U(FACES[(i + 2) % FACES.length], 900, 1200),
        candid: U(FACES[(i + 3) % FACES.length], 900, 1200),
        additional: [U(FACES[(i + 4) % FACES.length], 900, 1200), U(FACES[(i + 5) % FACES.length], 900, 1200)],
      },
      videos: { intro: "", additional: [] },
      numPhotos: 6,
      numVideos: 2,
      applicationDate: `2026-${String((i % 9) + 1).padStart(2, "0")}-${String(10 + (i % 18)).padStart(2, "0")}`,
      currentStage: (["Applied","Approved","Casting","Judgement","Top16","Top10"] as const)[i % 6],
      status: (["Pending","Approved","Hold","Approved"] as const)[i % 4],
    };
  });

export type AbuseReport = { id: string; target: string; reason: string; reporter: string; severity: "Low" | "Medium" | "High"; status: "Open" | "Reviewing" | "Resolved" };
export const ABUSE_REPORTS: AbuseReport[] = [
  { id: "r1", target: "Sofia Marchetti", reason: "Image not original", reporter: "@user.4421", severity: "Medium", status: "Reviewing" },
  { id: "r2", target: "Aaliyah Khan", reason: "Harassment in comments", reporter: "@user.0991", severity: "High", status: "Open" },
  { id: "r3", target: "Lucia Romano", reason: "Spam voting suspected", reporter: "system", severity: "Low", status: "Open" },
  { id: "r4", target: "Olivia Bennett", reason: "Misleading bio", reporter: "@user.7720", severity: "Low", status: "Resolved" },
];

export const STATS = {
  totalVotes: 1248302,
  activeContestants: 128,
  liveViewers: 14820,
  countries: 64,
  campaigns: 24,
  revenue: "$284,120",
};
