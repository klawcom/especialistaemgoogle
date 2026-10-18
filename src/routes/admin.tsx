import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin, LogOut, Users, Plus, Search, Edit3, Trash2, X, Save,
  Phone, Mail, Building2, FileText, BarChart3, UserCheck, UserX, UserPlus,
  ChevronDown, Filter
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useClients, type Client } from "@/hooks/use-clients";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Admin | Especialista em Google" },
      { name: "description", content: "Painel administrativo — Gestão de clientes" },
    ],
  }),
  component: AdminPage,
});

type ModalMode = "add" | "edit" | null;

function AdminPage() {
  const { user, logout, isAdmin, isLoading } = useAuth();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Client["status"]>("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formStatus, setFormStatus] = useState<Client["status"]>("prospecto");
  const [formPlan, setFormPlan] = useState("");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (!isAdmin) {
      navigate({ to: "/dashboard" });
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCompany("");
    setFormStatus("prospecto");
    setFormPlan("");
    setFormNotes("");
    setEditingClient(null);
    setModalMode("add");
  };

  const openEditModal = (client: Client) => {
    setFormName(client.name);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormCompany(client.company);
    setFormStatus(client.status);
    setFormPlan(client.plan);
    setFormNotes(client.notes);
    setEditingClient(client);
    setModalMode("edit");
  };

  const handleSave = () => {
    const data = {
      name: formName,
      email: formEmail,
      phone: formPhone,
      company: formCompany,
      status: formStatus,
      plan: formPlan,
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

  const stats = {
    total: clients.length,
    ativos: clients.filter((c) => c.status === "ativo").length,
    inativos: clients.filter((c) => c.status === "inativo").length,
    prospectos: clients.filter((c) => c.status === "prospecto").length,
  };

  const statusConfig = {
    ativo: { label: "Ativo", color: "text-[#188038] bg-[#188038]/10", icon: UserCheck },
    inativo: { label: "Inativo", color: "text-destructive bg-destructive/10", icon: UserX },
    prospecto: { label: "Prospecto", color: "text-primary bg-primary/10", icon: UserPlus },
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
            <a
              href="/dashboard"
              className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent md:inline-flex"
            >
              Meu Painel
            </a>
            <ThemeToggle />
            <button
              id="admin-logout"
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
        {/* Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="animate-fade-up">
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              Carteira de <span className="text-gradient-primary">Clientes</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie todos os seus clientes em um só lugar.
            </p>
          </div>
          <button
            id="add-client-btn"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "text-foreground" },
            { label: "Ativos", value: stats.ativos, icon: UserCheck, color: "text-[#188038]" },
            { label: "Prospectos", value: stats.prospectos, icon: UserPlus, color: "text-primary" },
            { label: "Inativos", value: stats.inativos, icon: UserX, color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`font-display text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="client-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou empresa..."
              className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="appearance-none rounded-xl border border-input bg-card py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos</option>
              <option value="ativo">Ativos</option>
              <option value="prospecto">Prospectos</option>
              <option value="inativo">Inativos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Clients list */}
        <div className="mt-6 space-y-3">
          {filteredClients.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 font-display text-lg font-bold">Nenhum cliente encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Tente uma busca diferente." : "Adicione seu primeiro cliente!"}
              </p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const sc = statusConfig[client.status];
              return (
                <div
                  key={client.id}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-soft md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-display text-lg font-bold text-white">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold truncate">{client.name}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> {client.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" /> {client.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" /> {client.phone}
                          </span>
                        </div>
                        {client.plan && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">Plano:</span> {client.plan}
                          </p>
                        )}
                        {client.notes && (
                          <p className="mt-1 text-xs text-muted-foreground italic truncate max-w-lg">
                            {client.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditModal(client)}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Editar
                      </button>
                      {deleteConfirm === client.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="rounded-lg bg-destructive px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-destructive/90"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(client.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Excluir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border bg-gradient-primary px-6 py-4">
              <h2 className="font-display text-lg font-bold text-white">
                {modalMode === "add" ? "Novo Cliente" : "Editar Cliente"}
              </h2>
              <button
                onClick={() => setModalMode(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Nome *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nome do cliente"
                    required
                    className="w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                    className="w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Telefone</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Empresa</label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="Nome da empresa"
                      className="w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as Client["status"])}
                      className="w-full appearance-none rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="prospecto">Prospecto</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Plano</label>
                    <input
                      type="text"
                      value={formPlan}
                      onChange={(e) => setFormPlan(e.target.value)}
                      placeholder="Ex: Otimização Completa"
                      className="w-full rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Observações</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Notas sobre o cliente..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-input bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border bg-background/50 px-6 py-4">
              <button
                onClick={() => setModalMode(null)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formName || !formEmail}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:scale-105 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {modalMode === "add" ? "Adicionar" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
