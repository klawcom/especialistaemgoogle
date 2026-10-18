import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, LogOut, User, FileText, Clock, Star, BarChart3, ArrowRight, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { WHATSAPP_URL } from "@/lib/site-config";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu Painel | Especialista em Google" },
      { name: "description", content: "Painel do cliente — Especialista em Google" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, logout, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Especialista em <span className="text-primary">Google</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <a
                href="/admin"
                className="hidden rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/80 md:inline-flex"
              >
                Painel Admin
              </a>
            )}
            <ThemeToggle />
            <button
              id="dashboard-logout"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Welcome section */}
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Olá, <span className="text-gradient-primary">{user.name.split(" ")[0]}</span>! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe o progresso da sua presença no Google.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, label: "Visualizações", value: "2.847", change: "+18%" },
            { icon: User, label: "Interações", value: "456", change: "+24%" },
            { icon: Star, label: "Avaliações", value: "4.9", change: "+3" },
            { icon: Clock, label: "Dias ativo", value: "127", change: "" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                {stat.change && (
                  <span className="rounded-full bg-[#188038]/10 px-2.5 py-1 text-xs font-bold text-[#188038]">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile + Actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-1">
            <h2 className="font-display text-lg font-bold">Meu Perfil</h2>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary font-display text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{user.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {user.provider === "google" ? "Google" : user.provider === "microsoft" ? "Microsoft" : "E-mail"}
              </span>
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membro desde</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 font-medium text-[#188038]">
                  <span className="h-2 w-2 rounded-full bg-[#188038]" /> Ativo
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Seus Serviços</h2>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Otimização do Perfil", status: "Concluído", color: "text-[#188038] bg-[#188038]/10" },
                  { name: "SEO Local", status: "Em andamento", color: "text-primary bg-primary/10" },
                  { name: "Gestão de Avaliações", status: "Em andamento", color: "text-primary bg-primary/10" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent/30"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${service.color}`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="overflow-hidden rounded-2xl bg-gradient-primary p-6 shadow-glow md:p-8">
              <h3 className="font-display text-xl font-bold text-white">Precisa de ajuda?</h3>
              <p className="mt-2 text-sm text-white/80">
                Fale diretamente com nosso especialista para tirar dúvidas ou solicitar novos serviços.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-[#128C7E] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-[#0e6e63]"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Falar no WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
