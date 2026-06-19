import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import logoDark from "@/assets/logo-dark-theme.png";
import logoLight from "@/assets/logo-light-theme.png";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-border-subtle bg-surface-2 text-foreground/80 hover:text-accent hover:border-accent/50 transition-colors ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <>
      <img src={logoLight} alt="ReeVibes" className={`${className} dark:hidden`} suppressHydrationWarning />
      <img src={logoDark} alt="ReeVibes" className={`${className} hidden dark:block`} suppressHydrationWarning />
    </>
  );
}
