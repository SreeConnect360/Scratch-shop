import { type ReactNode } from "react";

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
