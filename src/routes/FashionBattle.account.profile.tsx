import { createFileRoute } from "@tanstack/react-router";
import { FadeUp } from "@/components/motion/Reveal";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/FashionBattle/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { state } = usePortal();
  const u = state.user!;
  const rows = [
    ["First Name", u.firstName],
    ["Last Name", u.lastName],
    ["Email", u.email],
    ["Phone", u.phone ?? "—"],
    ["Country", u.country ?? "—"],
    ["Date of Birth", u.dob ?? "—"],
    ["Roles", u.roles.join(", ")],
  ];

  return (
    <FadeUp>
      <div className="border border-border-subtle">
        <div className="px-8 py-6 border-b border-border-subtle">
          <p className="editorial-eyebrow text-accent">Account Information</p>
          <h2 className="mt-2 font-serif text-3xl">Your details</h2>
        </div>
        <dl className="divide-y divide-border-subtle">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 px-8 py-4 text-sm">
              <dt className="editorial-label text-muted-foreground">{k}</dt>
              <dd className="col-span-2 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </FadeUp>
  );
}
