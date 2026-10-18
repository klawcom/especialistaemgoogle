import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  MapPin, LogOut, Users, Plus, Search, Edit3, Trash2, X, Save,
  Phone, Mail, Building2, FileText, BarChart3, UserCheck, UserX, UserPlus,
  ChevronDown, Filter, TrendingUp, TrendingDown, DollarSign, Eye, Navigation,
  PhoneCall, MousePointerClick, Star, ShieldCheck, Download, RefreshCw,
  Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Award, PieChart,
  Calendar, Layers, MessageSquare, ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useClients, type Client } from "@/hooks/use-clients";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Gestor | Especialista em Google" },
      { name: "description", content: "Dashboard executivo e métricas do Especialista em Google" },
    ],
  }),
  component: AdminDashboardPage,
});

type DashboardTab = "metrics" | "clients" | "rankings" | "financial";
type ModalMode = "add" | "edit" | null;

function AdminDashboardPage() {
  const { user, logout, isAdmin, isLoading, loginAsAdmin } = useAuth();
  const { clients, addClient, updateClient, deleteClient, resetDemoData } = useClients();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>("metrics");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "year">("30d");

  // Client Management State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Client["status"]>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [exportModal, setExportModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formStatus, setFormStatus] = useState<Client["status"]>("ativo");
  const [formPlan, setFormPlan] = useState("Gestão Mensal VIP");
  const [formMonthlyValue, setFormMonthlyValue] = useState<number>(1200);
  const [formRankingPosition, setFormRankingPosition] = useState<number>(1);
  const [formNotes, setFormNotes] = useState("");

  const handleAdminQuickAccess = async () => {
    setIsLoggingIn(true);
    try {
      await loginAsAdmin();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  // Graceful Manager Gate (Never throws or breaks router)
  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        {/* Top Navbar */}
        <header className="border-b border-border bg-card/60 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
            <a href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Especialista em <span className="text-primary">Google</span>
              </span>
            </a>
            <ThemeToggle />
          </div>
        </header>

        {/* Auth prompt card */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md animate-fade-up">
            <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Painel do Gestor
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Área administrativa restrita ao especialista para acompanhamento de métricas do Google Maps e gestão da carteira de clientes.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={handleAdminQuickAccess}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3.5 px-4 text-sm font-bold text-white shadow-glow hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Acessar como Gestor (klaw.com@gmail.com)
                    </>
                  )}
                </button>

                <a
                  href="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3 px-4 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Entrar com e-mail e senha
                </a>

                <a
                  href="/"
                  className="block text-xs font-medium text-muted-foreground hover:text-foreground pt-3"
                >
                  ← Voltar para a página inicial
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  // Metrics Calculations
  const metrics = useMemo(() => {
    const total = clients.length;
    const ativos = clients.filter((c) => c.status === "ativo");
    const prospectos = clients.filter((c) => c.status === "prospecto");
    const inativos = clients.filter((c) => c.status === "inativo");

    const totalMRR = ativos.reduce((acc, c) => acc + (c.monthlyValue || 0), 0);
    const pipelineMRR = prospectos.reduce((acc, c) => acc + (c.monthlyValue || 0), 0);
    const ticketMedio = ativos.length ? Math.round(totalMRR / ativos.length) : 0;

    const totalViews = clients.reduce((acc, c) => acc + (c.viewsMonth || 0), 0);
    const totalActions = clients.reduce((acc, c) => acc + (c.actionsMonth || 0), 0);
    const totalCalls = clients.reduce((acc, c) => acc + (c.callsCount || 0), 0);
    const totalDirections = clients.reduce((acc, c) => acc + (c.directionsCount || 0), 0);
    const totalWebsiteClicks = clients.reduce((acc, c) => acc + (c.websiteClicks || 0), 0);

    const topRankedCount = clients.filter((c) => (c.rankingPosition || 99) <= 3).length;
    const avgHealthScore = clients.length
      ? Math.round(clients.reduce((acc, c) => acc + (c.profileHealthScore || 80), 0) / clients.length)
      : 90;

    return {
      total,
      ativosCount: ativos.length,
      prospectosCount: prospectos.length,
      inativosCount: inativos.length,
      totalMRR,
      pipelineMRR,
      ticketMedio,
      totalViews,
      totalActions,
      totalCalls,
      totalDirections,
      totalWebsiteClicks,
      topRankedCount,
      avgHealthScore,
      conversionRate: totalViews ? ((totalActions / totalViews) * 100).toFixed(1) : "7.2",
    };
  }, [clients]);

  // Client filtering
  const filteredClients = useMemo(() => {
    return (clients || []).filter((c) => {
      const q = (search || "").toLowerCase();
      const matchesSearch =
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.company || "").toLowerCase().includes(q) ||
        (c.category || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  // Form Handlers
  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCompany("");
    setFormCategory("Serviços Locais");
    setFormStatus("ativo");
    setFormPlan("Gestão Mensal VIP");
    setFormMonthlyValue(1250);
    setFormRankingPosition(1);
    setFormNotes("");
    setEditingClient(null);
    setModalMode("add");
  };

  const openEditModal = (client: Client) => {
    setFormName(client.name);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormCompany(client.company);
    setFormCategory(client.category || "Serviços Locais");
    setFormStatus(client.status);
    setFormPlan(client.plan);
    setFormMonthlyValue(client.monthlyValue || 1200);
    setFormRankingPosition(client.rankingPosition || 1);
    setFormNotes(client.notes || "");
    setEditingClient(client);
    setModalMode("edit");
  };

  const handleSave = () => {
    const data = {
      name: formName,
      email: formEmail,
      phone: formPhone,
      company: formCompany,
      category: formCategory,
      status: formStatus,
      plan: formPlan,
      monthlyValue: Number(formMonthlyValue) || 1200,
      rankingPosition: Number(formRankingPosition) || 1,
      notes: formNotes,
    };

    if (modalMode === "add") {
      addClient(data);
    } else if (modalMode === "edit" && editingClient) {
      updateClient(editingClient.id, data);
    }
    setModalMode(null);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    setDeleteConfirm(null);
  };

  const exportCSV = () => {
    const headers = ["Empresa", "Contato", "Email", "Telefone", "Categoria", "Status", "Plano", "MRR (R$)", "Posição Maps", "Views Mês", "Ações Mês"];
    const rows = (clients || []).map((c) => [
      `"${c.company || ""}"`,
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      `"${c.category || ""}"`,
      `"${c.status || "ativo"}"`,
      `"${c.plan || ""}"`,
      c.monthlyValue || 0,
      c.rankingPosition || "-",
      c.viewsMonth || 0,
      c.actionsMonth || 0,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_especialista_google_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportModal(false);
  };

  const statusConfig = {
    ativo: { label: "Ativo", color: "text-[#188038] bg-[#188038]/10 border-[#188038]/30", icon: UserCheck },
    inativo: { label: "Inativo", color: "text-destructive bg-destructive/10 border-destructive/30", icon: UserX },
    prospecto: { label: "Prospecto", color: "text-primary bg-primary/10 border-primary/30", icon: UserPlus },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top Navbar ─── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Especialista em <span className="text-primary">Google</span>
              </span>
            </a>
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary sm:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              Gestor Geral
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 rounded-xl border border-border bg-card p-1 sm:flex text-xs">
              {(["7d", "30d", "90d", "year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    timeRange === r
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "7d" ? "7 Dias" : r === "30d" ? "30 Dias" : r === "90d" ? "Trimestre" : "Ano"}
                </button>
              ))}
            </div>

            <ThemeToggle />

            <button
              id="admin-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Manager Header Banner */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between shadow-card">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold md:text-3xl">
                Dashboard do <span className="text-gradient-primary">Gestor</span>
              </h1>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhamento em tempo real das métricas do Google Maps, carteira de clientes e receita.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setExportModal(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-accent cursor-pointer"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              Exportar Relatório
            </button>
            <button
              id="add-client-btn"
              onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="mt-8 flex border-b border-border gap-2 overflow-x-auto pb-1 text-sm font-semibold">
          {[
            { id: "metrics", label: "Métricas & Visão Geral", icon: BarChart3 },
            { id: "clients", label: `Carteira de Clientes (${metrics.total})`, icon: Users },
            { id: "rankings", label: "Desempenho no Google Maps", icon: Navigation },
            { id: "financial", label: "Financeiro & Planos", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: METRICS & OVERVIEW ─── */}
        {activeTab === "metrics" && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* 4 Hero KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: MRR */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">MRR (Recorrência)</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    R$ {metrics.totalMRR.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> +18.4%
                    </span>
                    <span className="text-muted-foreground">vs. mês anterior</span>
                  </div>
                </div>
                {/* Meta progress */}
                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                    <span>Meta R$ 20.000</span>
                    <span className="font-semibold text-foreground">{Math.round((metrics.totalMRR / 20000) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-primary transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((metrics.totalMRR / 20000) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Visualizações Google Maps */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Views no Maps</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    {metrics.totalViews.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> +24.1%
                    </span>
                    <span className="text-muted-foreground">pesquisas e rotas</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Média por perfil</span>
                  <span className="font-bold text-foreground">
                    {metrics.ativosCount ? Math.round(metrics.totalViews / metrics.ativosCount).toLocaleString("pt-BR") : 0} /mês
                  </span>
                </div>
              </div>

              {/* Card 3: Ações Geradas (Leads) */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações de Clientes</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <MousePointerClick className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    {metrics.totalActions.toLocaleString("pt-BR")}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> +15.8%
                    </span>
                    <span className="text-muted-foreground">conversões reais</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Taxa de Ação</span>
                  <span className="font-bold text-primary">{metrics.conversionRate}% do público</span>
                </div>
              </div>

              {/* Card 4: Saúde Média da Carteira */}
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Score de Otimização</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    {metrics.avgHealthScore}<span className="text-lg font-normal text-muted-foreground">/100</span>
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="flex items-center font-bold text-purple-600 dark:text-purple-400">
                      <Sparkles className="mr-0.5 h-3.5 w-3.5" /> Nível Excelente
                    </span>
                    <span className="text-muted-foreground">• Top 3 no Maps</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Perfis no Top 3</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {metrics.topRankedCount} de {metrics.total} clientes
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Visual Charts Grid ─── */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Area Chart: Evolução de Desempenho no Google Maps */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/60">
                  <div>
                    <h3 className="font-display text-lg font-bold">Evolução de Visualizações & Descobertas</h3>
                    <p className="text-xs text-muted-foreground">Volume de impressões semanais nos perfis do Google Maps</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      <span className="text-muted-foreground font-medium">Buscas Diretas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground font-medium">Descoberta Local</span>
                    </div>
                  </div>
                </div>

                {/* SVG Interactive Chart */}
                <div className="mt-6 h-64 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 600 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1A73E8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1A73E8" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal gridlines */}
                    {[40, 90, 140, 190].map((y) => (
                      <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="currentColor" className="text-border/50" strokeDasharray="3 3" />
                    ))}

                    {/* Area 1: Emerald (Descoberta) */}
                    <path
                      d="M 0 170 Q 75 140, 150 150 T 300 110 T 450 70 T 600 50 L 600 210 L 0 210 Z"
                      fill="url(#emeraldGradient)"
                    />
                    <path
                      d="M 0 170 Q 75 140, 150 150 T 300 110 T 450 70 T 600 50"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                    />

                    {/* Area 2: Primary (Buscas Diretas) */}
                    <path
                      d="M 0 190 Q 75 160, 150 130 T 300 90 T 450 50 T 600 30 L 600 210 L 0 210 Z"
                      fill="url(#primaryGradient)"
                    />
                    <path
                      d="M 0 190 Q 75 160, 150 130 T 300 90 T 450 50 T 600 30"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="3.5"
                    />

                    {/* Interactive points */}
                    {[
                      { cx: 0, cy: 190, val: "24k" },
                      { cx: 150, cy: 130, val: "42k" },
                      { cx: 300, cy: 90, val: "78k" },
                      { cx: 450, cy: 50, val: "142k" },
                      { cx: 600, cy: 30, val: "214k" },
                    ].map((pt, i) => (
                      <g key={i} className="cursor-pointer group">
                        <circle cx={pt.cx} cy={pt.cy} r="5" fill="#1A73E8" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={pt.cx}
                          y={pt.cy - 12}
                          textAnchor="middle"
                          className="fill-foreground font-bold text-[11px]"
                        >
                          {pt.val}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="mt-4 flex justify-between text-xs text-muted-foreground px-2">
                  <span>Semana 1</span>
                  <span>Semana 2</span>
                  <span>Semana 3</span>
                  <span>Semana 4</span>
                  <span>Atual (Pico)</span>
                </div>
              </div>

              {/* Actions Breakdown Chart: Ligações, Rotas e Cliques */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold">Distribuição de Ações</h3>
                  <p className="text-xs text-muted-foreground">Comportamento dos clientes após encontrar o perfil</p>

                  <div className="mt-6 space-y-4">
                    {/* Rotas */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <Navigation className="h-4 w-4 text-emerald-500" /> Solicitações de Rota (GPS)
                        </span>
                        <span className="font-bold">{metrics.totalDirections.toLocaleString("pt-BR")} (51%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "51%" }} />
                      </div>
                    </div>

                    {/* Ligações */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <PhoneCall className="h-4 w-4 text-primary" /> Ligações Telefônicas
                        </span>
                        <span className="font-bold">{metrics.totalCalls.toLocaleString("pt-BR")} (33%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: "33%" }} />
                      </div>
                    </div>

                    {/* Cliques no Site */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <MousePointerClick className="h-4 w-4 text-amber-500" /> Cliques no Website / Menu
                        </span>
                        <span className="font-bold">{metrics.totalWebsiteClicks.toLocaleString("pt-BR")} (16%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: "16%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Insight pill */}
                <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-foreground leading-relaxed">
                      <strong className="text-primary font-bold">Insight:</strong> Mais de <strong>50% das conversões</strong> são visitas físicas via solicitação de rota no Google Maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Top Ranking Highlights & Priority Alerts ─── */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Alertas do Gestor */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <h3 className="font-display font-bold">Atenção Prioritária do Gestor</h3>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    3 pendências
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between rounded-2xl border border-border bg-background p-3.5 transition-all hover:bg-accent/40">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">Responder 4 novas avaliações</p>
                        <p className="text-xs text-muted-foreground">Restaurante Sabor & Arte e TecFix receberam reviews 5 estrelas</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("clients")}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Ver
                    </button>
                  </div>

                  <div className="flex items-start justify-between rounded-2xl border border-border bg-background p-3.5 transition-all hover:bg-accent/40">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">Atualizar fotos de fachada (Post semanal)</p>
                        <p className="text-xs text-muted-foreground">Iron Fit Academia precisa de fotos da nova área de musculação</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("clients")}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Ver
                    </button>
                  </div>

                  <div className="flex items-start justify-between rounded-2xl border border-border bg-background p-3.5 transition-all hover:bg-accent/40">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Calendar className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">Follow-up de Proposta (Prospecto)</p>
                        <p className="text-xs text-muted-foreground">Beleza Pura Salão aguardando retorno sobre plano trimestral</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("clients")}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              </div>

              {/* Top Perfis Campeões no Google Maps */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-bold">Top Clientes em Destaque no Maps</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("rankings")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Ver Rankings
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {(clients || [])
                    .filter((c) => c && c.status === "ativo")
                    .slice(0, 3)
                    .map((client, idx) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary font-bold text-white text-sm shadow-glow">
                            #{client.rankingPosition || idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{client.company || "Empresa"}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.category || "Serviços"} • {client.rating || 4.9} ★ ({client.reviewsCount || 100} avaliações)
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-display font-extrabold text-foreground text-sm">
                            +{(client.viewsMonth || 10000).toLocaleString("pt-BR")}
                          </span>
                          <p className="text-[11px] text-muted-foreground">views/mês</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: CLIENT PORTFOLIO (CARTEIRA DE CLIENTES) ─── */}
        {activeTab === "clients" && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Search & Filters Bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="client-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por cliente, empresa ou nicho..."
                  className="w-full rounded-2xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "ativo", "prospecto", "inativo"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === st
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st === "all" ? `Todos (${metrics.total})` : st === "ativo" ? `Ativos (${metrics.ativosCount})` : st === "prospecto" ? `Prospectos (${metrics.prospectosCount})` : `Inativos (${metrics.inativosCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clients Table */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Empresa & Cliente</th>
                      <th className="px-6 py-4">Categoria & Pos. Maps</th>
                      <th className="px-6 py-4">Desempenho</th>
                      <th className="px-6 py-4">Plano & MRR</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          Nenhum cliente encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => {
                        const status = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.ativo;
                        const cleanPhone = (client.phone || "").replace(/\D/g, "") || "11999999999";
                        const initial = (client.company || "E").charAt(0).toUpperCase();
                        return (
                          <tr key={client.id} className="transition-colors hover:bg-accent/40">
                            {/* Empresa & Cliente */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-white font-bold text-sm shadow-glow">
                                  {initial}
                                </div>
                                <div>
                                  <p className="font-bold text-foreground">{client.company || "Empresa"}</p>
                                  <p className="text-xs text-muted-foreground">{(client.name || "Cliente")} • {(client.email || "")}</p>
                                </div>
                              </div>
                            </td>

                            {/* Categoria & Posição */}
                            <td className="px-6 py-4">
                              <span className="font-medium text-foreground">{client.category || "Serviços"}</span>
                              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-[11px]">
                                  #{client.rankingPosition || 1}
                                </span>
                                <span>no Google Maps</span>
                              </div>
                            </td>

                            {/* Desempenho no mês */}
                            <td className="px-6 py-4">
                              <p className="font-bold text-foreground">
                                {(client.viewsMonth || 0).toLocaleString("pt-BR")} <span className="text-xs font-normal text-muted-foreground">views</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(client.actionsMonth || 0).toLocaleString("pt-BR")} ações diretas
                              </p>
                            </td>

                            {/* Plano & MRR */}
                            <td className="px-6 py-4">
                              <p className="font-bold text-foreground">
                                R$ {(client.monthlyValue || 0).toLocaleString("pt-BR")}/mês
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{client.plan}</p>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.color}`}>
                                <status.icon className="h-3 w-3" />
                                {status.label}
                              </span>
                            </td>

                            {/* Ações */}
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* WhatsApp CTA */}
                                <a
                                  href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(client.name)},%20sou%20o%20especialista%20em%20Google%20cuidando%20do%20perfil%20da%20${encodeURIComponent(client.company)}!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Falar no WhatsApp"
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>

                                {/* Editar */}
                                <button
                                  onClick={() => openEditModal(client)}
                                  title="Editar cliente"
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>

                                {/* Excluir */}
                                <button
                                  onClick={() => setDeleteConfirm(client.id)}
                                  title="Remover cliente"
                                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: RANKINGS NO GOOGLE MAPS ─── */}
        {activeTab === "rankings" && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <h3 className="font-display text-xl font-bold">Monitoramento de Posições no Google Maps</h3>
                  <p className="text-xs text-muted-foreground">Posicionamento orgânico no Local Pack e palavras-chave por cliente</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {metrics.topRankedCount} clientes no Top 3
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(clients || []).map((client) => (
                  <div key={client.id} className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-foreground">{client.company || "Empresa"}</p>
                        <p className="text-xs text-muted-foreground">{client.category || "Serviços Locais"}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary font-bold text-white text-sm shadow-glow">
                        #{client.rankingPosition || 1}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Avaliação Google</span>
                        <span className="font-bold text-foreground flex items-center gap-1">
                          {client.rating || 4.9} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Saúde do Perfil</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {client.profileHealthScore || 95}% Excelente
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-accent/50 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
                      <span>Visualizações 30d:</span>
                      <strong className="text-foreground">{(client.viewsMonth || 0).toLocaleString("pt-BR")}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: FINANCIAL & PLANS ─── */}
        {activeTab === "financial" && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">MRR Ativo</span>
                <p className="font-display text-3xl font-extrabold text-foreground mt-2">
                  R$ {metrics.totalMRR.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Faturamento garantido este mês</p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ticket Médio / Cliente</span>
                <p className="font-display text-3xl font-extrabold text-foreground mt-2">
                  R$ {metrics.ticketMedio.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Por empresa atendida</p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pipeline de Novos Contratos</span>
                <p className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                  + R$ {metrics.pipelineMRR.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Propostas ativas em negociação</p>
              </div>
            </div>

            {/* Breakdown de planos */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-bold mb-4">Planos Contratados</h3>
              <div className="space-y-4">
                {[
                  { name: "Gestão Mensal VIP", count: 3, val: 5200, percent: 55 },
                  { name: "SEO Local Premium", count: 2, val: 2600, percent: 28 },
                  { name: "Otimização Completa & Setup", count: 2, val: 1830, percent: 17 },
                ].map((plan) => (
                  <div key={plan.name}>
                    <div className="flex justify-between text-sm font-semibold mb-1">
                      <span>{plan.name} ({plan.count} empresas)</span>
                      <span>R$ {plan.val.toLocaleString("pt-BR")} ({plan.percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${plan.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Modal: Novo Cliente / Editar Cliente ─── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-soft animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-lg font-bold text-foreground">
                {modalMode === "add" ? "Cadastrar Novo Cliente" : "Editar Cliente"}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Nome da Empresa / Perfil Google
                </label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="Ex: Pizzaria Bella Italia"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Ex: Gastronomia, Saúde"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="cliente@empresa.com"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Client["status"])}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="prospecto">Prospecto</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Valor Mensal (R$)
                  </label>
                  <input
                    type="number"
                    value={formMonthlyValue}
                    onChange={(e) => setFormMonthlyValue(Number(e.target.value))}
                    placeholder="1200"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Posição Maps
                  </label>
                  <input
                    type="number"
                    value={formRankingPosition}
                    onChange={(e) => setFormRankingPosition(Number(e.target.value))}
                    placeholder="1"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Plano Contratado
                </label>
                <input
                  type="text"
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value)}
                  placeholder="Ex: Gestão Mensal VIP"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Observações & Próximas Ações
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Anotações internas sobre o perfil, fotos, avaliações..."
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-accent cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-gradient-primary px-5 py-2 text-xs font-bold text-white shadow-glow hover:opacity-90 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Excluir Cliente ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-soft animate-scale-in">
            <h3 className="font-display text-lg font-bold text-foreground">Confirmar Exclusão</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja remover este cliente da sua carteira? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-accent cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-xl bg-destructive px-4 py-2 text-xs font-bold text-white hover:opacity-90 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Exportar Relatório ─── */}
      {exportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display font-bold text-foreground">Exportar Relatório Executivo</h3>
              <button onClick={() => setExportModal(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-accent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Exporte todos os dados consolidados da sua carteira de clientes, métricas de visualizações no Google Maps e receita recorrente (MRR).
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={exportCSV}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-4 text-left hover:border-primary hover:bg-accent transition-all cursor-pointer"
              >
                <div>
                  <p className="font-bold text-foreground">Planilha Completa (.CSV)</p>
                  <p className="text-xs text-muted-foreground">Compatível com Excel, Google Planilhas e CRM</p>
                </div>
                <Download className="h-5 w-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
