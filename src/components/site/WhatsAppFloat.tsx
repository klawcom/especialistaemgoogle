import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-glow animate-pulse-glow transition-transform hover:scale-110 hover:bg-[#0e6e63] md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" />
    </a>
  );
}
