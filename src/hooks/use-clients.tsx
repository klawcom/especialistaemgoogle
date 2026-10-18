import { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "ativo" | "inativo" | "prospecto";
  plan: string;
  notes: string;
  monthlyValue?: number;
  category?: string;
  rankingPosition?: number;
  rating?: number;
  reviewsCount?: number;
  viewsMonth?: number;
  actionsMonth?: number;
  callsCount?: number;
  directionsCount?: number;
  websiteClicks?: number;
  profileHealthScore?: number;
  createdAt: string;
  updatedAt: string;
}

interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  clearAllClients: () => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function normalizeClient(c: any): Client {
  return {
    id: c?.id || generateId(),
    name: c?.name || "Cliente",
    email: c?.email || "",
    phone: c?.phone || "",
    company: c?.company || "Empresa",
    category: c?.category || "Serviços",
    status: c?.status === "ativo" || c?.status === "inativo" || c?.status === "prospecto" ? c.status : "ativo",
    plan: c?.plan || "Gestão Mensal",
    notes: c?.notes || "",
    monthlyValue: typeof c?.monthlyValue === "number" ? c.monthlyValue : 0,
    rankingPosition: typeof c?.rankingPosition === "number" ? c.rankingPosition : 1,
    rating: typeof c?.rating === "number" ? c.rating : 5.0,
    reviewsCount: typeof c?.reviewsCount === "number" ? c.reviewsCount : 0,
    viewsMonth: typeof c?.viewsMonth === "number" ? c.viewsMonth : 0,
    actionsMonth: typeof c?.actionsMonth === "number" ? c.actionsMonth : 0,
    callsCount: typeof c?.callsCount === "number" ? c.callsCount : 0,
    directionsCount: typeof c?.directionsCount === "number" ? c.directionsCount : 0,
    websiteClicks: typeof c?.websiteClicks === "number" ? c.websiteClicks : 0,
    profileHealthScore: typeof c?.profileHealthScore === "number" ? c.profileHealthScore : 100,
    createdAt: c?.createdAt || new Date().toISOString(),
    updatedAt: c?.updatedAt || new Date().toISOString(),
  };
}

const STORAGE_KEY = "especialista_google_clients_real";

function getStoredClients(): Client[] {
  try {
    if (typeof window === "undefined") return [];

    // Clear old fake demo keys if present
    localStorage.removeItem("clients_data");
    localStorage.removeItem("clients_data_v2");

    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeClient);
      }
    }
    return [];
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    }
  } catch {}
}

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const clearAllClients = useCallback(() => {
    saveClients([]);
    setClients([]);
  }, []);

  const addClient = useCallback((data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const newClient: Client = {
      ...data,
      id: generateId(),
      monthlyValue: Number(data.monthlyValue) || 0,
      rankingPosition: Number(data.rankingPosition) || 1,
      rating: Number(data.rating) || 5.0,
      reviewsCount: Number(data.reviewsCount) || 0,
      viewsMonth: Number(data.viewsMonth) || 0,
      actionsMonth: Number(data.actionsMonth) || 0,
      callsCount: Number(data.callsCount) || 0,
      directionsCount: Number(data.directionsCount) || 0,
      websiteClicks: Number(data.websiteClicks) || 0,
      profileHealthScore: Number(data.profileHealthScore) || 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients((prev) => {
      const updated = [newClient, ...prev];
      saveClients(updated);
      return updated;
    });
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      );
      saveClients(updated);
      return updated;
    });
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveClients(updated);
      return updated;
    });
  }, []);

  const getClient = useCallback(
    (id: string) => clients.find((c) => c.id === id),
    [clients]
  );

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClient, clearAllClients }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within ClientsProvider");
  return context;
}
