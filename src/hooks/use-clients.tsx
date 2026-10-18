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
  resetDemoData: () => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const DEMO_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "Marcelo Rodrigues",
    email: "marcelo@restaurantesabor.com.br",
    phone: "(11) 98765-4321",
    company: "Restaurante Sabor & Arte",
    category: "Gastronomia",
    status: "ativo",
    plan: "Gestão Mensal VIP",
    monthlyValue: 1450,
    rankingPosition: 1,
    rating: 4.9,
    reviewsCount: 384,
    viewsMonth: 38400,
    actionsMonth: 3120,
    callsCount: 890,
    directionsCount: 1620,
    websiteClicks: 610,
    profileHealthScore: 98,
    notes: "Perfil otimizado no Google Maps. 1º lugar nas buscas de massas e gastronomia da região.",
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-2",
    name: "Dra. Patrícia Lima",
    email: "patricia@clinicasorrir.com.br",
    phone: "(11) 99876-5432",
    company: "Clínica Odontológica Sorrir",
    category: "Saúde & Odontologia",
    status: "ativo",
    plan: "Otimização & Gestão Contínua",
    monthlyValue: 1800,
    rankingPosition: 2,
    rating: 5.0,
    reviewsCount: 220,
    viewsMonth: 29500,
    actionsMonth: 2150,
    callsCount: 940,
    directionsCount: 880,
    websiteClicks: 330,
    profileHealthScore: 96,
    notes: "Agenda cheia com pacientes vindos do Google Maps. Excelente engajamento com avaliações.",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-3",
    name: "Eduardo Mendes",
    email: "eduardo@tecfix.com.br",
    phone: "(11) 97654-3210",
    company: "TecFix Assistência Técnica",
    category: "Tecnologia & Serviços",
    status: "ativo",
    plan: "SEO Local Premium",
    monthlyValue: 1250,
    rankingPosition: 1,
    rating: 4.8,
    reviewsCount: 450,
    viewsMonth: 44200,
    actionsMonth: 3480,
    callsCount: 1420,
    directionsCount: 1530,
    websiteClicks: 530,
    profileHealthScore: 94,
    notes: "Mais de 1.400 ligações registradas pelo perfil do Maps este mês. Abrindo filial.",
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-4",
    name: "Dr. Roberto Albuquerque",
    email: "roberto@dermatovita.com.br",
    phone: "(11) 98112-3344",
    company: "DermatoVita Clínica",
    category: "Saúde & Estética",
    status: "ativo",
    plan: "Gestão Mensal VIP",
    monthlyValue: 1950,
    rankingPosition: 2,
    rating: 4.9,
    reviewsCount: 195,
    viewsMonth: 26800,
    actionsMonth: 1840,
    callsCount: 680,
    directionsCount: 810,
    websiteClicks: 350,
    profileHealthScore: 92,
    notes: "Alta conversão para procedimentos de alto valor através do Google Meu Negócio.",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-5",
    name: "Thiago Rocha",
    email: "thiago@ironfitness.com.br",
    phone: "(11) 97223-4455",
    company: "Iron Fit Academia",
    category: "Fitness & Bem-Estar",
    status: "ativo",
    plan: "SEO Local Premium",
    monthlyValue: 1350,
    rankingPosition: 1,
    rating: 4.8,
    reviewsCount: 520,
    viewsMonth: 58000,
    actionsMonth: 4950,
    callsCount: 1100,
    directionsCount: 3100,
    websiteClicks: 750,
    profileHealthScore: 97,
    notes: "Líder absoluto de rotas traçadas no Maps. Recorde de matrículas no trimestre.",
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-6",
    name: "Fernanda Costa",
    email: "fernanda@belezapura.com.br",
    phone: "(11) 96543-2109",
    company: "Beleza Pura Salão & Spa",
    category: "Beleza & Estética",
    status: "prospecto",
    plan: "Otimização Completa",
    monthlyValue: 980,
    rankingPosition: 7,
    rating: 4.5,
    reviewsCount: 42,
    viewsMonth: 5200,
    actionsMonth: 320,
    callsCount: 110,
    directionsCount: 140,
    websiteClicks: 70,
    profileHealthScore: 68,
    notes: "Reunião de proposta agendada para sexta-feira. Potencial para plano anual.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-7",
    name: "Rodrigo Sanches",
    email: "rodrigo@sanchesadv.com.br",
    phone: "(11) 98334-5566",
    company: "Sanches & Associados Advocacia",
    category: "Direito & Advocacia",
    status: "prospecto",
    plan: "Gestão Mensal VIP",
    monthlyValue: 1600,
    rankingPosition: 9,
    rating: 4.6,
    reviewsCount: 28,
    viewsMonth: 3800,
    actionsMonth: 210,
    callsCount: 95,
    directionsCount: 65,
    websiteClicks: 50,
    profileHealthScore: 62,
    notes: "Recebeu diagnóstico gratuito de SEO Local e solicitou orçamento para posicionamento.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "client-8",
    name: "Carlos Henrique",
    email: "carlos@autoelite.com.br",
    phone: "(11) 95432-1098",
    company: "Auto Elite Centro Automotivo",
    category: "Automotivo",
    status: "inativo",
    plan: "Otimização Inicial",
    monthlyValue: 850,
    rankingPosition: 5,
    rating: 4.4,
    reviewsCount: 88,
    viewsMonth: 8900,
    actionsMonth: 540,
    callsCount: 220,
    directionsCount: 240,
    websiteClicks: 80,
    profileHealthScore: 54,
    notes: "Contrato pausado por reestruturação interna. Entrar em contato no próximo mês.",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function getStoredClients(): Client[] {
  try {
    const data = localStorage.getItem("clients_data_v2");
    if (data) {
      return JSON.parse(data);
    }
    // Migrate or initialize
    localStorage.setItem("clients_data_v2", JSON.stringify(DEMO_CLIENTS));
    return DEMO_CLIENTS;
  } catch {
    return DEMO_CLIENTS;
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem("clients_data_v2", JSON.stringify(clients));
}

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const resetDemoData = useCallback(() => {
    saveClients(DEMO_CLIENTS);
    setClients(DEMO_CLIENTS);
  }, []);

  const addClient = useCallback((data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    const newClient: Client = {
      ...data,
      id: generateId(),
      monthlyValue: data.monthlyValue || 1200,
      rankingPosition: data.rankingPosition || 3,
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 10,
      viewsMonth: data.viewsMonth || 8500,
      actionsMonth: data.actionsMonth || 450,
      callsCount: data.callsCount || 180,
      directionsCount: data.directionsCount || 210,
      websiteClicks: data.websiteClicks || 60,
      profileHealthScore: data.profileHealthScore || 85,
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
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClient, resetDemoData }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within ClientsProvider");
  return context;
}
