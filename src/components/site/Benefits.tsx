import { Phone, TrendingUp, MessageSquare, MapPin, ShieldCheck, Trophy, Globe2, BarChart3 } from "lucide-react";

const benefits = [
  { icon: Phone, title: "Mais contatos diários", text: "Clientes ligando, mandando mensagem e visitando seu negócio." },
  { icon: ShieldCheck, title: "Autoridade reforçada", text: "Sua empresa transmite credibilidade desde a primeira busca." },
  { icon: MessageSquare, title: "Mais mensagens e chamadas", text: "Canais ativos no perfil convertem buscas em conversas." },
  { icon: MapPin, title: "Mais visitas físicas", text: "Quem busca perto compra perto — apareça primeiro no Maps." },
  { icon: TrendingUp, title: "Confiança imediata", text: "Avaliações e fotos profissionais convertem antes do clique." },
  { icon: Trophy, title: "Destaque entre concorrentes", text: "Posicione-se acima de quem ainda não otimizou o perfil." },
  { icon: Globe2, title: "Presença profissional online", text: "Um perfil completo é a sua nova vitrine digital 24/7." },
  { icon: BarChart3, title: "Crescimento constante", text: "Estratégia contínua de SEO local mantém o resultado." },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative bg-gradient-subtle py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Por que estar no Google
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Se sua empresa não aparece no Google,{" "}
            <span className="text-gradient-primary">ela praticamente não existe</span> para novos clientes.
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            Todos os dias pessoas procuram exatamente pelo serviço que você oferece.
            Quem aparece primeiro vende mais — o Google Maps virou a nova vitrine das empresas.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-primary opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <b.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="relative mt-5 font-display text-lg font-bold">{b.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
