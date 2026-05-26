import { MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold">
            Rank<span className="text-primary">Local</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent">
            <MessageCircle className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent">
            <Facebook className="h-4 w-4" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} RankLocal. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
