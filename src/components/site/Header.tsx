import { MapPin, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Rank<span className="text-primary">Local</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#beneficios" className="transition-colors hover:text-foreground">Por que estar no Google</a>
          <a href="#servicos" className="transition-colors hover:text-foreground">Serviços</a>
          <a href="#autoridade" className="transition-colors hover:text-foreground">Autoridade</a>
          <a href="#depoimentos" className="transition-colors hover:text-foreground">Resultados</a>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#128C7E] px-5 text-sm font-semibold text-white shadow-card transition-transform hover:scale-105 hover:bg-[#0e6e63]"
        >
          <MessageCircle className="h-4 w-4" fill="currentColor" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
