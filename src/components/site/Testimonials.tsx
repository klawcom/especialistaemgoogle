import { ShieldCheck, Target, MessageSquare, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Diagnóstico Estratégico",
    description: "Análise detalhada do seu perfil atual e dos concorrentes da sua região para identificar as palavras-chave com maior volume de buscas.",
  },
  {
    icon: ShieldCheck,
    title: "Otimização Completa do Perfil",
    description: "Configuração profissional de categorias primárias, secundárias, atributos locais, fotos de alta qualidade e catálogo de produtos e serviços.",
  },
  {
    icon: MessageSquare,
    title: "Atendimento & Suporte Direto",
    description: "Comunicação transparente e suporte direto com o especialista via WhatsApp para orientações contínuas e envio de relatórios de desempenho.",
  },
];

export function Testimonials() {
  return (
    <section id="metodologia" className="relative bg-gradient-subtle py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Metodologia transparente
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Como garantimos o{" "}
            <span className="text-gradient-primary">resultado real</span> para o seu negócio.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Trabalho estruturado com base nas diretrizes oficiais do Google e nas melhores práticas de SEO Local.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="relative rounded-3xl border border-border bg-card p-8 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow mb-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Prática recomendada Google</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
