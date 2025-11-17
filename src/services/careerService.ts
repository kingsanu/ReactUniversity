import { CareerRole } from "@/types/career";

const careers: CareerRole[] = [
  {
    id: "career_data_analyst",
    familyId: "family_data",
    slug: "data-analyst",
    title: { en: "Data Analyst", es: "Analista de Datos" },
    shortDescription: {
      en: "Analyze and interpret data",
      es: "Analiza e interpreta datos",
    },
    longDescription: {
      en: "Work with datasets to extract insights and build reports.",
      es: "Trabaja con conjuntos de datos para extraer ideas y crear informes.",
    },
    skills: [
      {
        skillId: "sql",
        name: { en: "SQL", es: "SQL" },
        levelRequired: "intermediate",
      },
      {
        skillId: "python",
        name: { en: "Python", es: "Python" },
        levelRequired: "intermediate",
      },
    ],
    educationLevel: "Bachelors",
    salaryRange: { min: 40000, median: 60000, max: 90000, currency: "USD" },
    demandStats: {
      jobCount: 12000,
      postedLast30Days: 220,
      growthPercent: 0.07,
    },
    industries: ["Technology", "Finance"],
    locationSupport: ["USA", "Spain"],
    iconUrl: "/icons/data-analyst.svg",
    matchScore: 92,
    published: true,
  },
  {
    id: "career_ux_designer",
    familyId: "family_design",
    slug: "ux-designer",
    title: { en: "UX Designer", es: "Diseñador UX" },
    shortDescription: {
      en: "Design user experiences and interfaces",
      es: "Diseña experiencias e interfaces de usuario",
    },
    longDescription: {
      en: "Create prototypes, collaborate with product and engineering teams.",
      es: "Crea prototipos y colabora con equipos de producto e ingeniería.",
    },
    skills: [
      {
        skillId: "ux",
        name: { en: "UX Design", es: "Diseño UX" },
        levelRequired: "intermediate",
      },
      {
        skillId: "ui",
        name: { en: "UI Design", es: "Diseño UI" },
        levelRequired: "beginner",
      },
    ],
    educationLevel: "Bachelors",
    salaryRange: { min: 35000, median: 55000, max: 85000, currency: "USD" },
    demandStats: { jobCount: 6000, postedLast30Days: 100, growthPercent: 0.05 },
    industries: ["Technology", "Retail"],
    locationSupport: ["USA"],
    iconUrl: "/icons/ux-designer.svg",
    matchScore: 85,
    published: true,
  },
];

const simulateNetworkDelay = async <T>(value: T, delay = 200): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
};

// Simple local store for favorites (when backend not ready)
const userFavoritesKey = (userId: string) => `careers:favorites:${userId}`;

function readFavorites(userId: string) {
  if (typeof window === "undefined") return [] as string[];
  const raw = localStorage.getItem(userFavoritesKey(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function writeFavorites(userId: string, list: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(userFavoritesKey(userId), JSON.stringify(list));
}

function dispatchFavoritesUpdated(userId: string) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("favorites_updated", { detail: { userId } })
    );
  } catch (e) {
    // ignore
  }
}

export async function listCareers(query?: {
  search?: string;
  industry?: string;
}) {
  // trivial server-side filtering mock
  let filtered = careers;
  if (query?.search) {
    const s = query.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        (c.title.en || "").toLowerCase().includes(s) ||
        (c.shortDescription?.en || "").toLowerCase().includes(s)
    );
  }
  if (query?.industry) {
    filtered = filtered.filter((c) =>
      c.industries?.includes(query.industry as string)
    );
  }
  return simulateNetworkDelay({
    careers: filtered,
    meta: { total: filtered.length, page: 1, pageSize: 20 },
  });
}

export async function getCareerById(id: string) {
  const found = careers.find((c) => c.id === id);
  return simulateNetworkDelay(found ?? null);
}

export async function getCareerFamilies() {
  // Basic family list
  return simulateNetworkDelay([
    {
      id: "family_data",
      title: { en: "Data & Analytics", es: "Datos y Análisis" },
      iconUrl: "/icons/family-data.svg",
    },
    {
      id: "family_design",
      title: { en: "Design & UX", es: "Diseño y UX" },
      iconUrl: "/icons/family-design.svg",
    },
  ]);
}

// Admin operations (mock)
export async function adminListCareers() {
  return simulateNetworkDelay(careers);
}

export async function adminCreateCareer(payload: CareerRole) {
  const id = `career_${Date.now()}`;
  const newCareer = { ...payload, id } as CareerRole;
  careers.push(newCareer);
  return simulateNetworkDelay(newCareer);
}

export async function adminUpdateCareer(
  id: string,
  payload: Partial<CareerRole>
) {
  const idx = careers.findIndex((c) => c.id === id);
  if (idx === -1) return simulateNetworkDelay(null);
  careers[idx] = { ...careers[idx], ...payload } as CareerRole;
  return simulateNetworkDelay(careers[idx]);
}

export async function adminDeleteCareer(id: string) {
  const idx = careers.findIndex((c) => c.id === id);
  if (idx === -1) return simulateNetworkDelay(false);
  careers.splice(idx, 1);
  return simulateNetworkDelay(true);
}

export async function recommendCareers(payload: {
  userId: string;
  context?: any;
}) {
  // For demo, return careers sorted by matchScore
  const ranked = [...careers].sort(
    (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
  );
  return simulateNetworkDelay({
    recommendations: ranked.map((c) => ({
      careerId: c.id,
      matchScore: c.matchScore,
      explanation: {
        en: "Matches your analytical skills",
        es: "Coincide con tus habilidades analíticas",
      },
    })),
  });
}

export async function getFavoritesForUser(userId: string) {
  const favorites = readFavorites(userId);
  return simulateNetworkDelay({ favorites });
}

export async function addFavorite(userId: string, careerId: string) {
  const favs = readFavorites(userId);
  if (!favs.includes(careerId)) favs.push(careerId);
  writeFavorites(userId, favs);
  dispatchFavoritesUpdated(userId);
  return simulateNetworkDelay({ success: true, favorites: favs });
}

export async function removeFavorite(userId: string, careerId: string) {
  const favs = readFavorites(userId).filter((f) => f !== careerId);
  writeFavorites(userId, favs);
  dispatchFavoritesUpdated(userId);
  return simulateNetworkDelay({ success: true, favorites: favs });
}
