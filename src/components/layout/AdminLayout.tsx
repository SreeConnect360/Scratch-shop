import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid, Crown, Radio, Lock, Sparkles, Camera, Users, UserCheck,
  Flag, BarChart3, Menu, X, Search, Bell, ChevronDown, ShoppingBag, Truck,
  RefreshCw, Ticket, Star, Store
} from "lucide-react";
import { BrandLogo, ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePortal } from "@/lib/portal-state";
import { ShopAdminPortal } from "./ShopAdminPortal";

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
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
] as const;

const SHOP_NAV = [
  { to: "/admin", search: { tab: "overview" }, label: "Overview", icon: LayoutGrid },
  { to: "/admin", search: { tab: "homepage" }, label: "Homepage Layout", icon: Sparkles },
  { to: "/admin", search: { tab: "products" }, label: "Products Catalog", icon: ShoppingBag },
  { to: "/admin", search: { tab: "orders" }, label: "Orders Tracker", icon: Truck },
  { to: "/admin", search: { tab: "returns" }, label: "Returns & Refunds", icon: RefreshCw },
  { to: "/admin", search: { tab: "customers" }, label: "Customers Directory", icon: Users },
  { to: "/admin", search: { tab: "coupons" }, label: "Coupons Manager", icon: Ticket },
  { to: "/admin", search: { tab: "reviews" }, label: "Reviews Moderator", icon: Star },
  { to: "/admin", search: { tab: "vendors" }, label: "Vendors & Partners", icon: Store },
] as const;

function ModuleToggle() {
  const { state, setAdminMode } = usePortal();
  return (
    <div className="mx-4 mb-6 p-1 bg-surface-2 border border-border-subtle rounded flex">
      <button
        onClick={() => setAdminMode("Contest")}
        className={`flex-1 text-center py-2 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 ${
          state.adminMode !== "Shop"
            ? "bg-foreground text-background shadow-md animate-in fade-in"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Contest
      </button>
      <button
        onClick={() => setAdminMode("Shop")}
        className={`flex-1 text-center py-2 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 ${
          state.adminMode === "Shop"
            ? "bg-foreground text-background shadow-md animate-in fade-in"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Shop
      </button>
    </div>
  );
}

function NavList({ onClick }: { onClick?: () => void }) {
  const { state } = usePortal();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search: any = useRouterState({ select: (s) => s.location.search });

  const navList = state.adminMode === "Shop" ? SHOP_NAV : CONTEST_NAV;

  return (
    <ul className="flex flex-col gap-0.5">
      {navList.map((item) => {
        let active = false;
        if (state.adminMode === "Shop") {
          const itemSearch: any = "search" in item ? item.search : {};
          active = search.tab === itemSearch.tab || (!search.tab && itemSearch.tab === "overview");
        } else {
          active = "exact" in item && item.exact ? path === item.to : path === item.to || (item.to !== "/admin" && path.startsWith(item.to));
        }
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <Link
              to={item.to}
              search={"search" in item ? (item.search as any) : undefined}
              onClick={onClick}
              className="group relative flex items-center gap-3 py-2.5 pl-6 pr-4 text-[13px] text-foreground/65 hover:text-foreground transition-colors"
            >
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-px transition-all ${active ? "bg-accent" : "bg-transparent"}`} />
              <Icon className={`w-3.5 h-3.5 ${active ? "text-accent" : "text-foreground/40"}`} />
              <span className={active ? "text-foreground" : ""} style={{ letterSpacing: "0.04em" }}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminLayout({ title, eyebrow, actions, children }: {
  title: string; eyebrow?: string; actions?: ReactNode; children: ReactNode;
}) {
  const { state } = usePortal();
  const [open, setOpen] = useState(false);
  const search: any = useRouterState({ select: (s) => s.location.search });
  const activeTab = search.tab || "overview";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-border-subtle liquid-glass rounded-none z-40">
        <Link to="/admin" className="px-6 pt-8 pb-4 block">
          <BrandLogo className="w-32 h-auto" />
          <div className="editorial-label text-muted-foreground mt-2">Operations Studio</div>
        </Link>

        <ModuleToggle />

        <div className="px-6 editorial-label text-muted-foreground/50 mb-3">Modules</div>
        <nav className="flex-1 overflow-y-auto"><NavList /></nav>
        <div className="px-6 py-5 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-xs">LD</div>
            <div>
              <div className="text-xs">Léa Dubois</div>
              <div className="text-[10px] text-muted-foreground">Main Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border-subtle bg-background/90 backdrop-blur px-5 py-3">
        <Link to="/admin" className="flex items-center gap-2"><BrandLogo className="h-6 w-auto" /><span className="editorial-label text-muted-foreground">Admin</span></Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(true)} className="p-2"><Menu className="w-5 h-5" /></button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle">
              <span className="font-serif">Admin</span>
              <button onClick={() => setOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4"><ModuleToggle /></div>
            <NavList onClick={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-60">
        {/* Top bar */}
        <div className="sticky top-0 z-30 hidden lg:flex items-center justify-between border-b border-border-subtle bg-background/85 backdrop-blur px-10 h-14">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="editorial-label text-foreground/80">Season 03 · Live</span>
            </div>
            <div className="hairline-v h-4" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Search className="w-3.5 h-3.5" />
              <input placeholder="Search contestants, sponsors, sessions…" className="bg-transparent outline-none w-72 placeholder:text-muted-foreground/50" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <button className="relative text-foreground/70 hover:text-foreground"><Bell className="w-4 h-4" /><span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent" /></button>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center text-[10px]">LD</div>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-10 pt-10 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-border-subtle">
          {state.adminMode === "Shop" ? (
            <div>
              <div className="editorial-label text-accent mb-3 font-semibold uppercase tracking-widest text-[10px]">Luxury E-Commerce</div>
              <h1 className="font-serif text-3xl lg:text-4xl capitalize">Shop - {activeTab}</h1>
            </div>
          ) : (
            <div>
              {eyebrow && <div className="editorial-label text-accent mb-3">{eyebrow}</div>}
              <h1 className="font-serif text-3xl lg:text-4xl">{title}</h1>
            </div>
          )}
          {state.adminMode === "Shop" ? (
            <div className="flex gap-3">
              <span className="text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded uppercase">Connected to shop.reevibes.com</span>
            </div>
          ) : (
            actions && <div className="flex gap-3">{actions}</div>
          )}
        </div>

        <div className="px-6 lg:px-10 py-10">
          {state.adminMode === "Shop" ? (
            <ShopAdminPortal tab={activeTab} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`liquid-glass p-6 ${className ?? ""}`}>{children}</div>;
}

export function AdminButton({ children, variant = "default", className, ...props }: {
  children: ReactNode; variant?: "default" | "outline" | "ghost" | "accent"; className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground/5",
    ghost: "text-foreground/70 hover:text-foreground hover:bg-surface-2",
    accent: "bg-accent text-white hover:bg-accent/90",
  }[variant];
  return <button {...props} className={`editorial-label px-5 py-2.5 transition-all duration-300 active:scale-95 hover:scale-[1.03] rounded-full ${styles} ${className ?? ""}`}>{children}</button>;
}

export function StatusChip({ status, tone = "neutral" }: { status: string; tone?: "neutral" | "accent" | "success" | "warn" | "danger" }) {
  const tones = {
    neutral: "bg-foreground/5 border-foreground/20 text-foreground/80",
    accent: "bg-accent/5 border-accent/20 text-accent",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warn: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    danger: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  }[tone];
  return <span className={`inline-flex items-center px-2.5 py-0.5 border ${tones} text-[10px] uppercase tracking-[0.18em] rounded-full`}>{status}</span>;
}
