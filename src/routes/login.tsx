import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, ShieldCheck, X, CheckCircle2, User as UserIcon } from "lucide-react";
import { useAuth, ADMIN_EMAIL } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | Especialista em Google" },
      { name: "description", content: "Faça login na plataforma Especialista em Google — Carteira de Clientes" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, loginWithSocial, loginAsAdmin, user, hasGoogleOAuthClientId, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Social account modal state
  const [socialModal, setSocialModal] = useState<"google" | "microsoft" | null>(null);
  const [customSocialEmail, setCustomSocialEmail] = useState("");

  // Redirect if already logged in
  if (user) {
    navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const isAdm = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || result.user?.role === "admin";
      navigate({ to: isAdm ? "/admin" : "/dashboard" });
    } else {
      setError(result.error || "Erro ao fazer login.");
    }
  };

  const handleAdminDirectLogin = async () => {
    setLoading(true);
    await loginAsAdmin();
    setLoading(false);
    navigate({ to: "/admin" });
  };

  const handleSocialSelect = async (provider: "google" | "microsoft", selectedEmail: string) => {
    setLoading(true);
    setSocialModal(null);
    const result = await loginWithSocial(provider, selectedEmail);
    setLoading(false);
    if (result.user.role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const triggerGoogle = () => {
    if (hasGoogleOAuthClientId) {
      loginWithGoogle();
    } else {
      setSocialModal("google");
    }
  };

  const triggerMicrosoft = () => {
    loginWithMicrosoft().then((loggedUser) => {
      if (loggedUser) {
        navigate({ to: loggedUser.role === "admin" ? "/admin" : "/dashboard" });
      } else {
        setSocialModal("microsoft");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
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

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            {/* Header */}
            <div className="bg-gradient-primary px-8 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h1 className="mt-4 font-display text-2xl font-bold text-white">Bem-vindo de volta</h1>
              <p className="mt-1 text-sm text-white/80">Acesse sua conta para continuar</p>
            </div>

            <div className="px-8 py-8">
              {/* Quick Admin Shortcut Badge */}
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Conta Gestor / Adm</p>
                      <p className="text-sm font-bold text-foreground">{ADMIN_EMAIL}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdminDirectLogin}
                    disabled={loading}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Entrar Direto
                  </button>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="space-y-3">
                <button
                  id="login-google"
                  type="button"
                  onClick={triggerGoogle}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-card cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Entrar com Google
                </button>

                <button
                  id="login-microsoft"
                  type="button"
                  onClick={triggerMicrosoft}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-card cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  Entrar com Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">ou entre com e-mail</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com (ou klaw.com@gmail.com)"
                      required
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-bold text-white shadow-glow transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <a href="/cadastro" className="font-semibold text-primary hover:underline">
                  Criar conta
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Provider Account Selector Modal */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                {socialModal === "google" ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                )}
                <h3 className="font-display font-bold text-foreground">
                  Escolha sua conta {socialModal === "google" ? "Google" : "Microsoft"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSocialModal(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Option 1: Admin account */}
              <button
                type="button"
                onClick={() => handleSocialSelect(socialModal, ADMIN_EMAIL)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-primary/40 bg-primary/5 p-4 text-left transition-all hover:border-primary hover:bg-primary/10 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white font-bold text-lg shadow-glow">
                    K
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-foreground">Klaw - Gestor Google</p>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">ADMIN</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{ADMIN_EMAIL}</p>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </button>

              {/* Option 2: Custom account */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ou entrar com outro e-mail {socialModal === "google" ? "Google" : "Microsoft"}:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customSocialEmail}
                    onChange={(e) => setCustomSocialEmail(e.target.value)}
                    placeholder={socialModal === "google" ? "outro@gmail.com" : "outro@outlook.com"}
                    className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={!customSocialEmail.includes("@")}
                    onClick={() => handleSocialSelect(socialModal, customSocialEmail)}
                    className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
                  >
                    Acessar
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Autenticação instantânea direta na plataforma Especialista em Google
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
