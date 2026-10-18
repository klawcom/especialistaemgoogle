import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── OAuth Config ───
// Replace these with real credentials from Google Cloud Console and Azure AD
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback/google` : "",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
  },
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "YOUR_MICROSOFT_CLIENT_ID",
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback/microsoft` : "",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "openid email profile User.Read",
  },
};

export const ADMIN_EMAIL = "klaw.com@gmail.com";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "email" | "google" | "microsoft";
  role: "client" | "admin";
  createdAt: string;
  phone?: string;
  company?: string;
  notes?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => void;
  loginWithMicrosoft: () => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash for password storage in localStorage (NOT for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getStoredUsers(): Array<{ user: User; passwordHash: string }> {
  try {
    const data = localStorage.getItem("registered_users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function storeUser(user: User, passwordHash: string) {
  const users = getStoredUsers();
  users.push({ user, passwordHash });
  localStorage.setItem("registered_users", JSON.stringify(users));
}

// Seed admin user if not present
function ensureAdminExists() {
  const users = getStoredUsers();
  const adminExists = users.some((u) => u.user.email === ADMIN_EMAIL);
  if (!adminExists) {
    const admin: User = {
      id: "admin-1",
      name: "Administrador",
      email: ADMIN_EMAIL,
      provider: "email",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    storeUser(admin, simpleHash("admin123"));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ensureAdminExists();
    // Restore session
    try {
      const saved = localStorage.getItem("current_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.user.email.toLowerCase() === email.toLowerCase() && u.passwordHash === simpleHash(password)
    );
    if (found) {
      setUser(found.user);
      localStorage.setItem("current_user", JSON.stringify(found.user));
      return { success: true };
    }
    return { success: false, error: "E-mail ou senha incorretos." };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    const exists = users.some((u) => u.user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      provider: "email",
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "client",
      createdAt: new Date().toISOString(),
    };
    storeUser(newUser, simpleHash(password));
    setUser(newUser);
    localStorage.setItem("current_user", JSON.stringify(newUser));
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(() => {
    const { clientId, redirectUri, authUrl, scope } = OAUTH_CONFIG.google;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `${authUrl}?${params.toString()}`;
  }, []);

  const loginWithMicrosoft = useCallback(() => {
    const { clientId, redirectUri, authUrl, scope } = OAUTH_CONFIG.microsoft;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      response_mode: "query",
    });
    window.location.href = `${authUrl}?${params.toString()}`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("current_user");
  }, []);

  const isAdmin = user?.role === "admin" || user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, loginWithGoogle, loginWithMicrosoft, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
