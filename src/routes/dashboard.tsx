import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapPin, LogOut, User, FileText, Clock, Star, BarChart3, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useClients } from "@/hooks/use-clients";
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
  const { clients } = useClients();
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

  // Find real client data if exists in manager portfolio
  const clientData = clients.find(
    (c) => c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase()
  );

  const views = clientData?.viewsMonth || 0;
  const actions = clientData?.actionsMonth || 0;
  const rating = clientData?.rating || 0;
  const plan = clientData?.plan || "Plano sob consulta";
  const statusLabel = clientData ? (clientData.status === "ativo" ? "Ativo" : clientData.status === "prospecto" ? "Em Análise" : "Inativo") : "Em Configuração";

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
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent cursor-pointer"
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
            Olá, <span className="text-gradient-primary">{(user.name || "Cliente").split(" ")[0]}</span>! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acompanhe o status e as métricas da sua presença no Google.
          </p>
        </div>

        {/* Real Stats Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BarChart3,
              label: "Visualizações no Maps",
              value: views > 0 ? views.toLocaleString("pt-BR") : "0",
              info: views > 0 ? "Últimos 30 dias" : "Iniciando monitoramento",
            },
            {
              icon: User,
              label: "Ações de Clientes",
              value: actions > 0 ? actions.toLocaleString("pt-BR") : "0",
              info: actions > 0 ? "Ligações e rotas" : "Iniciando monitoramento",
            },
            {
              icon: Star,
              label: "Avaliação Google",
              value: rating > 0 ? `${rating.toFixed(1)} ★` : "-",
              info: rating > 0 ? "Média de avaliações" : "Aguardando sincronização",
            },
            {
              icon: Clock,
              label: "Status do Contrato",
              value: statusLabel,
              info: plan,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold">{stat.value}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.info}</p>
            </div>
          ))}
        </div>

        {/* Profile + Services */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-1">
            <h2 className="font-display text-lg font-bold">Meu Perfil</h2>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary font-display text-3xl font-bold text-white shadow-glow">
                {(user.name || "C").charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{user.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {user.provider === "google" ? "Conta Google" : user.provider === "microsoft" ? "Conta Microsoft" : "E-mail Direto"}
              </span>
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cadastrado em</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-semibold text-primary">{plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Situação</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions & Support */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Status dos Serviços</h2>
              <div className="mt-4 space-y-3">
                {[
                  {
                    name: "Diagnóstico Inicial de SEO Local",
                    status: clientData ? "Concluído" : "Em análise inicial",
                    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                  },
                  {
                    name: "Otimização Estratégica no Google Maps",
                    status: clientData?.status === "ativo" ? "Ativo & Monitorando" : "Configuração pendente",
                    color: "text-primary bg-primary/10",
                  },
                  {
                    name: "Suporte Direto com o Especialista",
                    status: "Disponível via WhatsApp",
                    color: "text-primary bg-primary/10",
                  },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${service.color}`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="overflow-hidden rounded-3xl bg-gradient-primary p-6 shadow-glow md:p-8 text-white">
              <h3 className="font-display text-xl font-bold">Precisa de atendimento ou suporte?</h3>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">
                Fale diretamente com seu Especialista em Google pelo WhatsApp para alinhar novas fotos, novidades ou tirar dúvidas.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-soft transition-all hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
                Conversar no WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
