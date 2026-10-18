import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/site-config";
import heroGrowth from "@/assets/hero-growth.png";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-subtle">
      <div className="absolute inset-0 bg-radial-glow opacity-80" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-glow/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:py-32">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Especialista há +10 anos
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Seu negócio aparece no Google ou está{" "}
            <span className="text-gradient-primary">perdendo clientes</span> todos os dias?
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
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
              className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-card/60 px-7 text-base font-semibold text-foreground backdrop-blur transition-colors hover:bg-accent"
            >
              Quero aparecer no Google
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
              ))}
              <span className="ml-2">5.0 de avaliação</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>Foco no Top 3 do Google Maps</span>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative animate-float-slow overflow-hidden rounded-3xl border border-border bg-card/60 p-2 shadow-glow backdrop-blur">
            <img
              src={heroGrowth}
              alt="Crescimento de clientes com Google Meu Negócio"
              className="h-full w-full rounded-2xl object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-border bg-card/90 p-4 shadow-card backdrop-blur md:block">
            <p className="text-xs text-muted-foreground">Clientes este mês</p>
            <p className="font-display text-2xl font-bold text-primary">+312%</p>
          </div>
          <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-border bg-card/90 p-4 shadow-card backdrop-blur md:block">
            <p className="text-xs text-muted-foreground">Posição no Maps</p>
            <p className="font-display text-2xl font-bold text-foreground">Top 3</p>
          </div>
        </div>
      </div>
    </section>
  );
}
