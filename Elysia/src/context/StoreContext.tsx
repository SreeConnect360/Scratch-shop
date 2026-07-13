import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

interface CartItem {
  product: Product;
  qty: number;
}

export interface ToastData {
  message: string;
  kind: "cart" | "wishlist";
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  wishlist: number[];
  addToCart: (p: Product) => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: (id: number) => boolean;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: ToastData | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    load<CartItem[]>("elysia-cart", [])
  );
  const [wishlist, setWishlist] = useState<number[]>(() =>
    load<number[]>("elysia-wishlist", [])
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("elysia-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("elysia-wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === p.id);
      if (existing)
        return prev.map((i) =>
          i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { product: p, qty: 1 }];
    });
    setToast({ message: `${p.name} added to bag`, kind: "cart" });
  }, []);

  const toggleWishlist = useCallback(
    (p: Product) => {
      // decide outside the updater — updaters must stay pure (StrictMode runs them twice)
      const adding = !wishlist.includes(p.id);
      setWishlist((prev) =>
        adding ? [...prev, p.id] : prev.filter((x) => x !== p.id)
      );
      setToast({
        message: adding
          ? `${p.name} added to wishlist`
          : `${p.name} removed from wishlist`,
        kind: "wishlist",
      });
    },
    [wishlist]
  );

  const isWishlisted = useCallback(
    (id: number) => wishlist.includes(id),
    [wishlist]
  );

  const cartCount = useMemo(
    () => cart.reduce((n, i) => n + i.qty, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        wishlist,
        addToCart,
        toggleWishlist,
        isWishlisted,
        searchOpen,
        setSearchOpen,
        toast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
