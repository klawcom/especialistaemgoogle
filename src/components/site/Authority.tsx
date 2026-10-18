import { Award, Sparkles, Headset, MapPin } from "lucide-react";

const stats = [
  { icon: Award, value: "+10", label: "anos de mercado" },
  { icon: Sparkles, value: "100%", label: "estratégias atualizadas" },
  { icon: MapPin, value: "Top 3", label: "foco em posicionamento" },
  { icon: Headset, value: "1:1", label: "atendimento exclusivo" },
];

export function Authority() {
  return (
    <section id="autoridade" className="relative overflow-hidden bg-gradient-dark py-20 md:py-28">
      <div className="absolute inset-0 bg-radial-glow opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur">
            Autoridade comprovada
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
            Mais de 10 anos ajudando empresas a{" "}
            <span className="text-gradient-primary">crescerem através do Google.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Resultado real, estratégia atualizada e atendimento próximo do começo ao fim.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur transition-colors hover:bg-card/80"
            >
              <s.icon className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 font-display text-4xl font-extrabold text-foreground md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
