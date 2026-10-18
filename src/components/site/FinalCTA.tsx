import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
        <h2 className="font-display text-3xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
          Quantos clientes sua empresa está{" "}
          <span className="underline decoration-white/40 decoration-4 underline-offset-8">perdendo</span> neste momento?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
          Enquanto seus concorrentes aparecem no Google, sua empresa pode estar sendo
          ignorada todos os dias. Isso muda hoje.
        </p>

        <div className="mt-10">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#128C7E] px-10 text-lg font-bold text-white shadow-glow transition-transform hover:scale-105 hover:bg-[#0e6e63]"
          >
            <MessageCircle className="h-6 w-6" fill="currentColor" />
            Falar Agora no WhatsApp
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-5 text-sm text-white/80">Resposta rápida · Diagnóstico gratuito</p>
        </div>
      </div>
    </section>
  );
}
