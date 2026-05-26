import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";
import heroGrowth from "@/assets/hero-growth.png";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-surface-dark text-surface-dark-foreground">
      <div className="absolute inset-0 bg-radial-glow opacity-80" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:py-32">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-glow backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Especialista há +10 anos
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Seu negócio aparece no Google ou está{" "}
            <span className="text-gradient-primary">perdendo clientes</span> todos os dias?
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Especialista em Google Meu Negócio há mais de 10 anos ajudando empresas a
            dominarem o Google Maps, aumentarem sua visibilidade e atraírem clientes
            todos os dias.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#128C7E] px-7 text-base font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] hover:bg-[#0e6e63]"
            >
              <MessageCircle className="h-5 w-5" fill="currentColor" />
              Falar no WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#servicos"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Quero aparecer no Google
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
              ))}
              <span className="ml-2">5.0 de avaliação</span>
            </div>
            <div className="h-4 w-px bg-white/15" />
            <span>Centenas de empresas posicionadas</span>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-primary opacity-30 blur-3xl" />
          <div className="relative animate-float-slow overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-glow backdrop-blur">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.471803417692!2d-46.65846692376162!3d-23.59468606493569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59d2b063f663%3A0xc5676ab64f437a0f!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1716800000000!5m2!1spt-BR!2sbr"
              title="Google Maps"
              className="h-full w-full min-h-[320px] rounded-2xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-white/10 bg-surface-dark/80 p-4 shadow-card backdrop-blur md:block">
            <p className="text-xs text-white/60">Clientes este mês</p>
            <p className="font-display text-2xl font-bold text-primary-glow">+312%</p>
          </div>
          <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-surface-dark/80 p-4 shadow-card backdrop-blur md:block">
            <p className="text-xs text-white/60">Posição no Maps</p>
            <p className="font-display text-2xl font-bold text-white">Top 3</p>
          </div>
        </div>
      </div>
    </section>
  );
}
