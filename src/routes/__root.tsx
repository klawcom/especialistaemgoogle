import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "../hooks/use-theme";
import { AuthProvider } from "../hooks/use-auth";
import { ClientsProvider } from "../hooks/use-clients";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root route error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um imprevisto ao carregar este módulo. Você pode tentar recarregar ou reiniciar a sessão.
        </p>

        {error?.message && (
          <div className="mt-4 rounded-xl bg-destructive/5 p-3 text-left border border-destructive/10">
            <p className="text-xs font-mono text-destructive break-words">{error.message}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 cursor-pointer"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => {
              try {
                localStorage.removeItem("clients_data");
                localStorage.removeItem("clients_data_v2");
                localStorage.removeItem("current_user");
              } catch {}
              window.location.href = "/login";
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent cursor-pointer"
          >
            Limpar Sessão & Entrar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Especialista em Google" },
      { name: "description", content: "Especialista em Google — Google Meu Negócio, SEO Local e Google Maps" },
      { name: "author", content: "Especialista em Google" },
      { property: "og:title", content: "Especialista em Google" },
      { property: "og:description", content: "Especialista em Google — Google Meu Negócio, SEO Local e Google Maps" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@especialistaemgoogle" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ClientsProvider>
            <Outlet />
          </ClientsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
