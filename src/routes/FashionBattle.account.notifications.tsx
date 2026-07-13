import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { FadeUp } from "@/components/motion/Reveal";
import { usePortal } from "@/lib/portal-state";

export const Route = createFileRoute("/FashionBattle/account/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { state, markNotificationsRead } = usePortal();
  useEffect(() => { markNotificationsRead(); }, [markNotificationsRead]);

  return (
    <FadeUp>
      <div className="border border-border-subtle">
        <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between">
          <div>
            <p className="editorial-eyebrow text-accent">Inbox</p>
            <h2 className="mt-2 font-serif text-3xl">Notifications</h2>
          </div>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </div>
        <ul className="divide-y divide-border-subtle">
          {state.notifications.map(n => (
            <li key={n.id} className="px-8 py-5 flex gap-4 items-start hover:bg-surface-2 transition-colors">
              <span className="w-9 h-9 rounded-full bg-surface flex items-center justify-center"><Check className="w-4 h-4 text-accent" /></span>
              <div className="flex-1">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{n.body}</div>
              </div>
              <span className="editorial-label text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  );
}
