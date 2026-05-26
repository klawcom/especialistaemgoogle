import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Benefits } from "@/components/site/Benefits";
import { Authority } from "@/components/site/Authority";
import { Services } from "@/components/site/Services";
import { Testimonials } from "@/components/site/Testimonials";
import { Portfolio } from "@/components/site/Portfolio";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Especialista em Google Meu Negócio | Apareça no Google Maps" },
      {
        name: "description",
        content:
          "Otimização profissional de Google Meu Negócio. Mais de 10 anos posicionando empresas no Google Maps e atraindo clientes todos os dias. Fale no WhatsApp.",
      },
      { property: "og:title", content: "Especialista em Google Meu Negócio | Apareça no Google Maps" },
      { property: "og:description", content: "Domine o Google Maps e atraia clientes diariamente com um especialista há +10 anos." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Authority />
        <Services />
        <Portfolio />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
