import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, FileText, User, Bell, ClipboardList, Star, Users as UsersIcon, Gavel, LogOut, Plus } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { FadeUp } from "@/components/motion/Reveal";
import { usePortal } from "@/lib/portal-state";
import { type Role } from "@/lib/data";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — ReeVibes" }] }),
  component: AccountShell,
});

const BASE_NAV = [
  { to: "/account", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/account/profile", label: "Account Information", icon: User, exact: false },
  { to: "/account/applications", label: "My Application Folder", icon: FileText, exact: false },
  { to: "/account/notifications", label: "Notifications", icon: Bell, exact: false },
] as const;

const ROLE_NAV = [
  { role: "Applications", to: "/account/role-applications", label: "Applications", icon: ClipboardList },
  { role: "Ratings", to: "/account/role-ratings", label: "Ratings", icon: Star },
  { role: "Casting Call", to: "/account/role-casting", label: "Casting Call", icon: UsersIcon },
  { role: "Judgements", to: "/account/role-judgements", label: "Judgements", icon: Gavel },
] as const;

function AccountShell() {
  const { state, signOut } = usePortal();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Determine active role dashboard for default accordion state
  const [openSection, setOpenSection] = useState<string | null>(() => {
    if (path.startsWith("/account/role-applications")) return "Applications";
    if (path.startsWith("/account/role-ratings")) return "Ratings";
    if (path.startsWith("/account/role-casting")) return "Casting Call";
    if (path.startsWith("/account/role-judgements")) return "Judgements";
    return null;
  });

  if (!state.user) {
    return (
      <PublicLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
          <div>
            <p className="editorial-eyebrow text-accent">Members Only</p>
            <h1 className="mt-4 font-serif text-5xl">Sign in to continue.</h1>
            <p className="mt-4 text-muted-foreground">Your account is reserved for registered members of the maison.</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link to="/login" className="bg-foreground text-background px-8 py-3.5 editorial-label hover:bg-accent hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="border border-foreground px-8 py-3.5 editorial-label hover:bg-foreground hover:text-background transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const handleLogout = () => {
    signOut();
    navigate({ to: "/" });
  };

  return (
    <PublicLayout>
      <header className="px-6 lg:px-16 pt-24 pb-10 border-b border-border-subtle">
        <FadeUp><p className="editorial-eyebrow text-accent">Maison Membership</p></FadeUp>
        <FadeUp delay={0.1}><h1 className="mt-4 font-serif text-5xl lg:text-7xl">Welcome, {state.user.firstName}.</h1></FadeUp>
        <FadeUp delay={0.2}><p className="mt-4 text-muted-foreground">{state.user.roles.join(" · ")}</p></FadeUp>
      </header>


      <div className="grid lg:grid-cols-12 gap-10 px-6 lg:px-16 py-12">
        <aside className="lg:col-span-3 space-y-6">
          {/* Title Header with Pink Block */}
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <h2 className="font-serif text-xl uppercase tracking-wider text-foreground">My Account</h2>
            <span className="w-2.5 h-6 bg-accent" />
          </div>

          {/* Base Navigation Menu Links */}
          <div className="space-y-4 pt-2">
            <Link
              to="/account"
              search={{ tab: "dashboard" }}
              className={`flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors ${
                path === "/account" ? "text-accent" : "text-foreground hover:text-accent"
              }`}
            >
              <span>My Dashboard</span>
              {path === "/account" && <span className="w-2 h-2 bg-accent rotate-45" />}
            </Link>
             <Link
              to="/shop/categories"
              className={`flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors text-foreground/80 hover:text-accent`}
            >
              <span>Categories</span>
            </Link>

            <Link
              to="/account"
              search={{ tab: "orders" }}
              className={`flex items-center justify-between text-xs uppercase tracking-widest font-semibold transition-colors text-foreground/80 hover:text-accent`}
            >
              <span>My Orders</span>
            </Link>            <div className="h-2" />

            <Link
              to="/apply"
              className={`block text-xs uppercase tracking-widest font-bold text-foreground hover:text-accent transition-colors`}
            >
              Apply To Contest
            </Link>
          </div>

          {/* Redbox Associates Section (Conditional on assigned roles) */}
          {(() => {
            const assignedRoles: { role: Role; label: string; to: string }[] = [
              { role: "Applications" as Role, label: "Applications", to: "/account/role-applications" },
              { role: "Ratings" as Role, label: "Ratings", to: "/account/role-ratings" },
              { role: "Casting Call" as Role, label: "Casting Call", to: "/account/role-casting" },
              { role: "Judgements" as Role, label: "Judgement", to: "/account/role-judgements" },
            ].filter(r => state.user?.roles.includes(r.role));

            if (assignedRoles.length === 0) return null;

            return (
              <>
                {/* Redbox Associates Invite-only Card */}
                <div className="border border-accent/30 bg-black p-3.5 text-center rounded-sm">
                  <a href="#" className="text-accent text-[11px] font-bold tracking-wider hover:underline block">
                    My Redbox Associates<br/>
                    <span className="text-[9px] text-accent/80 font-normal">(By Invite Only) -?-</span>
                  </a>
                </div>

                {/* Accordion Role-based Sections */}
                <div className="space-y-2.5 pt-2">
                  {assignedRoles.map((r) => {
                    const isOpen = openSection === r.role;
                    return (
                      <div key={r.role} className="flex flex-col">
                        <button
                          onClick={() => setOpenSection(isOpen ? null : r.role)}
                          className="w-full bg-white text-black border border-black/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-between hover:bg-neutral-100 transition-colors"
                        >
                          <span>{r.label}</span>
                          <span className="font-mono text-sm leading-none">{isOpen ? "x" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className="bg-surface-2 p-3 border-x border-b border-border-subtle space-y-2">
                            <Link to={r.to} className="block text-xs text-foreground/95 hover:text-accent transition-colors">
                              → Open {r.label}
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Bottom Switch Link and Log Out Button */}
          <div className="pt-6 space-y-4">
            <div className="text-center">
              <Link to="/shop" className="text-[9px] tracking-widest text-foreground/60 hover:text-foreground uppercase block">
                <span className="italic text-[8px] opacity-75">SWITCH to ReeVibes</span><br/>
                <span className="font-semibold text-xs text-foreground">Luxury Shop</span>
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-[#C05621] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#A04618] transition-colors rounded-sm"
            >
              Log Out
            </button>
          </div>
        </aside>
        <div className="lg:col-span-9"><Outlet /></div>
      </div>
    </PublicLayout>
  );
}
