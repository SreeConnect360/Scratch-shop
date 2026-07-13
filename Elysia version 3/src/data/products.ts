export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  rating: number;
}

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const products: Product[] = [
  { id: 1, name: "Cashmere Wrap Coat", price: 890, image: img("photo-1539533018447-63fcce2678e3"), tag: "New", rating: 4.9 },
  { id: 2, name: "Silk Slip Dress", price: 420, image: img("photo-1515372039744-b8f02a3ae446"), tag: "Editor's Pick", rating: 4.8 },
  { id: 3, name: "Tailored Wool Blazer", price: 640, image: img("photo-1591047139829-d91aecb6caea"), rating: 4.7 },
  { id: 4, name: "Aurelle Leather Tote", price: 780, image: img("photo-1584917865442-de89df76afd3"), tag: "Best Seller", rating: 4.9 },
  { id: 5, name: "Gold Vermeil Necklace", price: 260, image: img("photo-1515562141207-7a88fb7ce338"), rating: 4.8 },
  { id: 6, name: "Suede Ankle Boots", price: 540, originalPrice: 720, image: img("photo-1543163521-1bf539c55dd2"), tag: "-25%", rating: 4.6 },
  { id: 7, name: "Aurum Eau de Parfum", price: 190, originalPrice: 240, image: img("photo-1541643600914-78b084683601"), tag: "-20%", rating: 4.9 },
  { id: 8, name: "Meridian Chronograph", price: 1150, originalPrice: 1450, image: img("photo-1523275335684-37898b6baf30"), tag: "-20%", rating: 5.0 },
  { id: 9, name: "Atelier Sneakers", price: 320, image: img("photo-1595950653106-6c9ebd614d3a"), tag: "Trending", rating: 4.7 },
  { id: 10, name: "Linen Resort Shirt", price: 180, image: img("photo-1521572163474-6864f9cf17ab"), rating: 4.5 },
  { id: 11, name: "Ivory Evening Gown", price: 980, image: img("photo-1496747611176-843222e1e57c"), tag: "Couture", rating: 4.9 },
  { id: 12, name: "Riviera Sunglasses", price: 240, originalPrice: 310, image: img("photo-1511499767150-a48a237f0083"), tag: "-22%", rating: 4.6 },
];

export const flashSaleProducts = products.filter((p) => p.originalPrice);
export const trendingProducts = [products[8], products[1], products[4], products[10]];
export const bestSellers = [products[3], products[0], products[7], products[2], products[6], products[9]];

export const categories = [
  { name: "Women", count: 248, image: img("photo-1483985988355-763728e1935b", 600) },
  { name: "Men", count: 186, image: img("photo-1507003211169-0a1dd7228f2d", 600) },
  { name: "Accessories", count: 122, image: img("photo-1553062407-98eeb64c6a62", 600) },
  { name: "Footwear", count: 94, image: img("photo-1542291026-7eec264c27ff", 600) },
  { name: "Jewelry", count: 78, image: img("photo-1515562141207-7a88fb7ce338", 600) },
  { name: "Fragrance", count: 56, image: img("photo-1541643600914-78b084683601", 600) },
];

export const collections = [
  {
    name: "The Atelier Edit",
    caption: "Hand-finished tailoring for the modern wardrobe",
    image: img("photo-1445205170230-053b83016050", 1000),
  },
  {
    name: "Nocturne",
    caption: "Evening silhouettes in obsidian and gold",
    image: img("photo-1469334031218-e382a71b716b", 700),
  },
  {
    name: "Golden Hour",
    caption: "Warm neutrals, soft light, quiet luxury",
    image: img("photo-1524504388940-b1c1722653e1", 700),
  },
];

export const testimonials = [
  {
    name: "Isabelle Laurent",
    role: "Creative Director, Paris",
    quote:
      "ÉLYSIA feels less like shopping and more like walking through a private gallery. The craft in every piece is unmistakable.",
    avatar: img("photo-1494790108377-be9c29b29330", 200),
  },
  {
    name: "Marcus Chen",
    role: "Architect, Singapore",
    quote:
      "The tailoring is impeccable and the experience is seamless from browse to doorstep. Quiet luxury, done properly.",
    avatar: img("photo-1500648767791-00dcc994a43e", 200),
  },
  {
    name: "Amara Okafor",
    role: "Editor, London",
    quote:
      "Every collection reads like an editorial. I've never seen e-commerce feel this considered — it's my first stop each season.",
    avatar: img("photo-1438761681033-6461ffad8d80", 200),
  },
];
