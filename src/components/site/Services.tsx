import { Settings2, MapPinned, Search, UserCog, Star, Zap, LineChart, LifeBuoy } from "lucide-react";

const services = [
  { icon: Settings2, title: "Criação e otimização do Google Meu Negócio", text: "Perfil completo, profissional e pronto para ranquear." },
  { icon: MapPinned, title: "Posicionamento no Google Maps", text: "Estratégias para aparecer entre os 3 primeiros da sua região." },
  { icon: Search, title: "SEO Local", text: "Palavras-chave certas para quem busca perto de você." },
  { icon: UserCog, title: "Configuração profissional do perfil", text: "Categorias, serviços, fotos e descrições otimizadas." },
  { icon: Star, title: "Estratégias para avaliações", text: "Mais avaliações reais, mais confiança e mais conversão." },
  { icon: Zap, title: "Otimização para buscas locais", text: "Apareça quando o cliente está pronto para comprar." },
  { icon: LineChart, title: "Gestão de presença local", text: "Monitoramento contínuo de performance e concorrência." },
  { icon: LifeBuoy, title: "Suporte especializado", text: "Atendimento direto com quem entende do assunto." },
];

export function Services() {
  return (
    <section id="servicos" className="relative bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            O que você recebe
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Um sistema completo para sua empresa{" "}
            <span className="text-gradient-primary">dominar o Google.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="group flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-soft md:p-8"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-110">
                <s.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold md:text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
