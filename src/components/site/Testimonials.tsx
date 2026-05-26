import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Marcelo R.", role: "Restaurante", text: "Depois da otimização começamos a receber contatos diariamente pelo Google. Mudou o jogo da empresa." },
  { name: "Patrícia L.", role: "Clínica Odontológica", text: "Hoje nossa empresa aparece entre as primeiras posições no Maps. A agenda lota toda semana." },
  { name: "Eduardo M.", role: "Assistência Técnica", text: "O investimento se pagou rapidamente. Triplicou a quantidade de ligações em menos de 60 dias." },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="relative bg-gradient-subtle py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Resultados reais
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Empresas que pararam de{" "}
            <span className="text-gradient-primary">perder clientes</span> para a concorrência.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-card transition-transform hover:-translate-y-1"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/20" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-5 text-base leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-display font-bold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
