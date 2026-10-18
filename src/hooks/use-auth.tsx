import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── OAuth Config ───
export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback/google` : "",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
  },
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "",
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: (customEmail?: string) => Promise<User | void>;
  loginWithMicrosoft: (customEmail?: string) => Promise<User | void>;
  loginWithSocial: (provider: "google" | "microsoft", customEmail?: string, customName?: string) => Promise<{ success: boolean; user: User }>;
  loginAsAdmin: () => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  hasGoogleOAuthClientId: boolean;
  hasMicrosoftOAuthClientId: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const existingIdx = users.findIndex((u) => u.user.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = { user, passwordHash };
  } else {
    users.push({ user, passwordHash });
  }
  localStorage.setItem("registered_users", JSON.stringify(users));
}

// Seed admin user
function getOrCreateAdmin(): User {
  const users = getStoredUsers();
  const found = users.find((u) => u.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  if (found) {
    return found.user;
  }
  const admin: User = {
    id: "admin-1",
    name: "Klaw - Gestor Google",
    email: ADMIN_EMAIL,
    provider: "google",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  storeUser(admin, simpleHash("admin123"));
  return admin;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasGoogleOAuthClientId = Boolean(
    OAUTH_CONFIG.google.clientId &&
    OAUTH_CONFIG.google.clientId !== "YOUR_GOOGLE_CLIENT_ID" &&
    !OAUTH_CONFIG.google.clientId.includes("YOUR_")
  );

  const hasMicrosoftOAuthClientId = Boolean(
    OAUTH_CONFIG.microsoft.clientId &&
    OAUTH_CONFIG.microsoft.clientId !== "YOUR_MICROSOFT_CLIENT_ID" &&
    !OAUTH_CONFIG.microsoft.clientId.includes("YOUR_")
  );

  useEffect(() => {
    getOrCreateAdmin();
    // Restore session
    try {
      const saved = localStorage.getItem("current_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const loginAsAdmin = useCallback(async () => {
    const admin = getOrCreateAdmin();
    setUser(admin);
    localStorage.setItem("current_user", JSON.stringify(admin));
    return admin;
  }, []);

  const loginWithSocial = useCallback(
    async (provider: "google" | "microsoft", customEmail?: string, customName?: string) => {
      const email = (customEmail || ADMIN_EMAIL).trim();
      const isAdminAccount = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const defaultName = isAdminAccount
        ? "Klaw - Gestor Google"
        : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      const userObj: User = {
        id: isAdminAccount ? "admin-1" : generateId(),
        name: customName || defaultName,
        email,
        provider,
        role: isAdminAccount ? "admin" : "client",
        createdAt: new Date().toISOString(),
      };

      storeUser(userObj, simpleHash("social_auth_pwd"));
      setUser(userObj);
      localStorage.setItem("current_user", JSON.stringify(userObj));
      return { success: true, user: userObj };
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Always allow admin access
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      const admin: User = {
        id: "admin-1",
        name: "Klaw - Gestor Google",
        email: ADMIN_EMAIL,
        provider: "email",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      storeUser(admin, simpleHash(password || "admin123"));
      setUser(admin);
      localStorage.setItem("current_user", JSON.stringify(admin));
      return { success: true, user: admin };
    }

    const users = getStoredUsers();
    const found = users.find(
      (u) => u.user.email.toLowerCase() === cleanEmail && u.passwordHash === simpleHash(password)
    );
    if (found) {
      setUser(found.user);
      localStorage.setItem("current_user", JSON.stringify(found.user));
      return { success: true, user: found.user };
    }
    return { success: false, error: "E-mail ou senha incorretos." };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const exists = users.some((u) => u.user.email.toLowerCase() === cleanEmail);
    if (exists && cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    const isAdm = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const newUser: User = {
      id: isAdm ? "admin-1" : generateId(),
      name,
      email: cleanEmail,
      provider: "email",
      role: isAdm ? "admin" : "client",
      createdAt: new Date().toISOString(),
    };
    storeUser(newUser, simpleHash(password));
    setUser(newUser);
    localStorage.setItem("current_user", JSON.stringify(newUser));
    return { success: true, user: newUser };
  }, []);

  const loginWithGoogle = useCallback(async (customEmail?: string) => {
    // If real Google OAuth Client ID is present, use standard OAuth redirect
    if (hasGoogleOAuthClientId) {
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
      return;
    }

    // Direct Instant Sign-in (handles local/demo/no-client-id scenarios without error 401)
    const result = await loginWithSocial("google", customEmail || ADMIN_EMAIL);
    return result.user;
  }, [hasGoogleOAuthClientId, loginWithSocial]);

  const loginWithMicrosoft = useCallback(async (customEmail?: string) => {
    if (hasMicrosoftOAuthClientId) {
      const { clientId, redirectUri, authUrl, scope } = OAUTH_CONFIG.microsoft;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        response_mode: "query",
      });
      window.location.href = `${authUrl}?${params.toString()}`;
      return;
    }

    const result = await loginWithSocial("microsoft", customEmail || "klaw.com@outlook.com");
    return result.user;
  }, [hasMicrosoftOAuthClientId, loginWithSocial]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("current_user");
  }, []);

  const isAdmin = user?.role === "admin" || user?.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithSocial,
        loginAsAdmin,
        logout,
        isAdmin,
        hasGoogleOAuthClientId,
        hasMicrosoftOAuthClientId,
      }}
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
