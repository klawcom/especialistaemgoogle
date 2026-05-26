import { Star, MapPin, Phone, Globe, Navigation, Clock, Camera } from "lucide-react";
import img1 from "@/assets/portfolio-moto-1.jpg";
import img2 from "@/assets/portfolio-moto-2.jpg";
import img3 from "@/assets/portfolio-moto-3.jpg";
import img4 from "@/assets/portfolio-moto-4.jpg";
import img5 from "@/assets/portfolio-moto-5.jpg";
import img6 from "@/assets/portfolio-moto-6.jpg";

const gallery = [
  { src: img3, label: "Fachada" },
  { src: img1, label: "Oficina" },
  { src: img6, label: "Motos" },
  { src: img2, label: "Reparo de motor" },
  { src: img4, label: "Manutenção" },
  { src: img5, label: "Atendimento" },
];

const reviews = [
  {
    name: "Rafael Andrade",
    initial: "R",
    when: "há 2 semanas",
    text: "Encontrei a oficina pelo Google e fiquei impressionado. Atendimento de primeira, preço justo e minha moto ficou pronta no mesmo dia. Recomendo de olhos fechados!",
    color: "bg-[#1a73e8]",
  },
  {
    name: "Juliana Mendes",
    initial: "J",
    when: "há 1 mês",
    text: "Melhor mecânica de motos da região! Profissionais extremamente capacitados, ambiente limpo e organizado. Saí com a moto andando como nova.",
    color: "bg-[#e8710a]",
  },
  {
    name: "Carlos Henrique",
    initial: "C",
    when: "há 3 semanas",
    text: "Atendimento impecável, explicaram tudo que precisava ser feito antes de iniciar o serviço. Honestidade e qualidade técnica. Virei cliente fiel!",
    color: "bg-[#188038]",
  },
  {
    name: "Patrícia Lima",
    initial: "P",
    when: "há 5 dias",
    text: "Procurei revisão completa e fui muito bem atendida. Pontuais, organizados e com ótimo preço. A moto ficou impecável. Nota 10!",
    color: "bg-[#d93025]",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Veja na prática
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Assim sua empresa vai{" "}
            <span className="text-gradient-primary">aparecer no Google</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Veja um exemplo real de como otimizamos o perfil de uma mecânica de motos —
            fotos profissionais, avaliações 5 estrelas e destaque máximo no Google Maps.
          </p>
        </div>

        {/* Google Business Profile mock card */}
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-br from-background to-secondary/40 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-display text-2xl font-extrabold md:text-3xl">
                  Moto Pro Mecânica Especializada
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold text-foreground">5,0</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#fbbc04] text-[#fbbc04]" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">(287 avaliações)</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">Mecânica de motos</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 font-medium text-[#188038]">
                    <span className="h-2 w-2 rounded-full bg-[#188038]" /> Aberto agora
                  </span>
                  <span className="text-muted-foreground">· Fecha às 18:00</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1666c1]">
                  <Navigation className="h-4 w-4" /> Rotas
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary">
                  <Phone className="h-4 w-4" /> Ligar
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary">
                  <Globe className="h-4 w-4" /> Site
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Av. das Motos, 1500 — Centro</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Seg a Sáb · 08h às 18h</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>(11) 99999-0000</span>
              </div>
            </div>
          </div>

          {/* Photo gallery */}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-lg font-bold">
                <Camera className="mr-2 inline h-5 w-5 text-primary" />
                Fotos do estabelecimento
              </h4>
              <span className="text-sm text-muted-foreground">+ 124 fotos</span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((g, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-secondary"
                >
                  <img
                    src={g.src}
                    alt={`${g.label} — exemplo de foto otimizada para Google Meu Negócio`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {g.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-border bg-gradient-to-b from-secondary/30 to-background p-6 md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <h4 className="font-display text-lg font-bold">Avaliações dos clientes</h4>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-extrabold">5,0</span>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#fbbc04] text-[#fbbc04]" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Baseado em 287 avaliações</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <div
                  key={r.name}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${r.color} font-display font-bold text-white`}
                    >
                      {r.initial}
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Local Guide · {r.when}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#fbbc04] text-[#fbbc04]" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
          <span className="font-semibold text-foreground">Esse pode ser o seu negócio.</span>{" "}
          Transformamos perfis comuns em verdadeiros ímãs de clientes no Google Maps.
        </p>
      </div>
    </section>
  );
}
