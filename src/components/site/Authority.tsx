import { Award, Users, Sparkles, Headset } from "lucide-react";

const stats = [
  { icon: Award, value: "+10", label: "anos de experiência" },
  { icon: Users, value: "+500", label: "empresas atendidas" },
  { icon: Sparkles, value: "100%", label: "estratégias atualizadas" },
  { icon: Headset, value: "1:1", label: "atendimento personalizado" },
];

export function Authority() {
  return (
    <section id="autoridade" className="relative overflow-hidden bg-surface-dark py-20 text-surface-dark-foreground md:py-28">
      <div className="absolute inset-0 bg-radial-glow opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-glow">
            Autoridade comprovada
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Mais de 10 anos ajudando empresas a{" "}
            <span className="text-gradient-primary">crescerem através do Google.</span>
          </h2>
          <p className="mt-5 text-white/70">
            Resultado real, estratégia atualizada e atendimento próximo do começo ao fim.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur transition-colors hover:bg-white/[0.07]"
            >
              <s.icon className="mx-auto h-8 w-8 text-primary-glow" />
              <p className="mt-4 font-display text-4xl font-extrabold text-white md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
