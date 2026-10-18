import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-accent hover:scale-105"
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        } absolute`}
      />
      <Moon
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        } absolute`}
      />
    </button>
  );
}
