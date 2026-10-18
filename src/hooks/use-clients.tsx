import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User } from "@/hooks/use-auth";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "ativo" | "inativo" | "prospecto";
  plan: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getStoredClients(): Client[] {
  try {
    const data = localStorage.getItem("clients_data");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem("clients_data", JSON.stringify(clients));
}

// Seed some demo clients if empty
function seedDemoClients(): Client[] {
  const demo: Client[] = [
    {
      id: generateId(),
      name: "Marcelo Rodrigues",
      email: "marcelo@restaurantesabor.com.br",
      phone: "(11) 98765-4321",
      company: "Restaurante Sabor & Arte",
      status: "ativo",
      plan: "Otimização Completa",
      notes: "Perfil otimizado, posição top 3 no Maps. Renovação em março.",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: "Patrícia Lima",
      email: "patricia@clinicasorrir.com.br",
      phone: "(11) 99876-5432",
      company: "Clínica Odontológica Sorrir",
      status: "ativo",
      plan: "Gestão Mensal",
      notes: "Agenda lotada desde a otimização. Cliente muito satisfeita.",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: "Eduardo Mendes",
      email: "eduardo@tecfix.com.br",
      phone: "(11) 97654-3210",
      company: "TecFix Assistência Técnica",
      status: "ativo",
      plan: "SEO Local Premium",
      notes: "Triplicou ligações em 60 dias. Expandindo para 2ª unidade.",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: "Fernanda Costa",
      email: "fernanda@belezapura.com.br",
      phone: "(11) 96543-2109",
      company: "Beleza Pura Salão",
      status: "prospecto",
      plan: "",
      notes: "Interessada no pacote de otimização. Aguardando retorno.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: "Carlos Henrique",
      email: "carlos@autoelite.com.br",
      phone: "(11) 95432-1098",
      company: "Auto Elite Mecânica",
      status: "inativo",
      plan: "Otimização Inicial",
      notes: "Contrato encerrado. Possibilidade de renovação.",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  saveClients(demo);
  return demo;
}

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const stored = getStoredClients();
    if (stored.length === 0) {
      setClients(seedDemoClients());
    } else {
      setClients(stored);
    }
  }, []);

  const addClient = useCallback((data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const newClient: Client = {
      ...data,
      id: generateId(),
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
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClient }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within ClientsProvider");
  return context;
}
