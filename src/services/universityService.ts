import {
  University,
  UniversityFilters,
  UniversityListResponse,
  UniversityRecommendationsResponse,
  UniversityRecommendation,
  UniversityRecommendationStats,
  UniversityFavorite,
  UniversityComparison,
  UniversityFilterOptions,
  DegreeLevel,
  FieldOfStudy,
} from "@/types/university";
import {
  getMockUniversities,
  getMockUniversityById,
} from "@/data/mockUniversities";

// --- Helper functions ---

function normalizeScore(score: number, min = 0, max = 100): number {
  if (Number.isNaN(score)) return 0;
  return Math.min(max, Math.max(min, score));
}

function filterUniversities(
  universities: University[],
  filters: UniversityFilters
): University[] {
  return universities.filter((uni) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${uni.name} ${uni.city} ${
        uni.country
      } ${uni.majors.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (
      filters.countries &&
      filters.countries.length > 0 &&
      !filters.countries.includes(uni.country)
    ) {
      return false;
    }
    if (
      filters.types &&
      filters.types.length > 0 &&
      !filters.types.includes(uni.type)
    ) {
      return false;
    }
    if (filters.degrees && filters.degrees.length > 0) {
      const uniDegrees = new Set(uni.programs.map((p) => p.degree));
      if (!filters.degrees.some((d) => uniDegrees.has(d))) return false;
    }
    if (filters.fields && filters.fields.length > 0) {
      const uniFields = new Set(uni.programs.map((p) => p.field));
      if (!filters.fields.some((f) => uniFields.has(f as FieldOfStudy)))
        return false;
    }
    if (filters.tuitionMin != null || filters.tuitionMax != null) {
      const tuition =
        uni.tuition.international ??
        uni.tuition.outOfState ??
        uni.tuition.inState ??
        0;
      if (filters.tuitionMin != null && tuition < filters.tuitionMin)
        return false;
      if (filters.tuitionMax != null && tuition > filters.tuitionMax)
        return false;
    }
    if (
      filters.rankingMax != null &&
      uni.ranking.global &&
      uni.ranking.global > filters.rankingMax
    ) {
      return false;
    }
    if (
      filters.acceptanceRateMin != null &&
      uni.acceptanceRate &&
      uni.acceptanceRate < filters.acceptanceRateMin
    ) {
      return false;
    }
    if (
      filters.campusSizes &&
      filters.campusSizes.length > 0 &&
      uni.campusSize &&
      !filters.campusSizes.includes(uni.campusSize)
    ) {
      return false;
    }
    if (
      filters.settings &&
      filters.settings.length > 0 &&
      uni.setting &&
      !filters.settings.includes(uni.setting)
    ) {
      return false;
    }
    if (filters.hasFinancialAid && !uni.financialAid?.scholarshipsAvailable) {
      return false;
    }
    if (filters.hasHousing && !uni.housing) {
      return false;
    }
    return true;
  });
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  return {
    items: items.slice(start, end),
    page: currentPage,
    limit,
    total,
    totalPages,
  };
}

// --- Public service functions (mocked for now) ---

export async function fetchUniversities(
  filters: UniversityFilters,
  page = 1,
  limit = 20
): Promise<UniversityListResponse> {
  const all = getMockUniversities().filter((u) => u.isActive);
  const filtered = filterUniversities(all, filters);
  const { items, total, totalPages } = paginate(filtered, page, limit);

  const allCountries = new Map<string, number>();
  const allFields = new Set<string>();
  let minTuition = Infinity;
  let maxTuition = 0;

  all.forEach((u) => {
    allCountries.set(u.country, (allCountries.get(u.country) ?? 0) + 1);
    u.programs.forEach((p) => allFields.add(p.field));
    const t =
      u.tuition.international ?? u.tuition.outOfState ?? u.tuition.inState ?? 0;
    if (t > 0) {
      minTuition = Math.min(minTuition, t);
      maxTuition = Math.max(maxTuition, t);
    }
  });

  return {
    universities: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    filters: {
      availableCountries: Array.from(allCountries.entries()).map(
        ([code, count]) => ({ code, name: code, count })
      ),
      availableFields: Array.from(allFields),
      tuitionRange: {
        min: Number.isFinite(minTuition) ? minTuition : 0,
        max: maxTuition,
      },
    },
  };
}

export async function fetchUniversityById(
  id: string
): Promise<University | null> {
  return getMockUniversityById(id) ?? null;
}

export async function fetchUniversityRecommendations(
  userId: string
): Promise<UniversityRecommendationsResponse> {
  const all = getMockUniversities().filter((u) => u.isActive);

  const recommendations: UniversityRecommendation[] = all.map((uni, index) => {
    const personalityMatch = 80 - index * 2;
    const academicMatch = 85 - index * 1.5;
    const careerAlignment = 78 - index * 1.2;
    const preferencesMatch = 82 - index * 1.3;

    const breakdown = {
      personalityMatch: normalizeScore(personalityMatch),
      academicMatch: normalizeScore(academicMatch),
      careerAlignment: normalizeScore(careerAlignment),
      preferencesMatch: normalizeScore(preferencesMatch),
    };

    const matchScore = normalizeScore(
      breakdown.personalityMatch * 0.3 +
        breakdown.academicMatch * 0.25 +
        breakdown.careerAlignment * 0.25 +
        breakdown.preferencesMatch * 0.2
    );

    const reasonsEn: string[] = [
      "Strong alignment with your target field of study.",
      "Academic rigor matches your current assessment profile.",
      "Location and campus setting match your preferences.",
    ];

    const reasonsEs: string[] = [
      "Fuerte alineación con tu campo de estudio objetivo.",
      "El rigor académico coincide con tu perfil de evaluaciones.",
      "La ubicación y el entorno del campus coinciden con tus preferencias.",
    ];

    return {
      university: uni,
      matchScore,
      matchBreakdown: breakdown,
      matchReasons: {
        en: reasonsEn.join(" "),
        es: reasonsEs.join(" "),
      },
      matchReasonsArray: {
        en: reasonsEn,
        es: reasonsEs,
      },
      recommendedPrograms: uni.programs
        .slice(0, 2)
        .map((p) => ({ ...p, matchScore: matchScore - 5 })),
      rank: index + 1,
    };
  });

  return {
    recommendations,
    meta: {
      totalMatches: recommendations.length,
      generatedAt: new Date().toISOString(),
      basedOn: {
        pcaCompleted: true,
        milCompleted: true,
        careerPreferences: ["Technology", "Engineering"],
        targetDegree: "Bachelor",
      },
    },
  };
}

export async function fetchUniversityRecommendationStats(
  userId: string
): Promise<UniversityRecommendationStats> {
  const { recommendations } = await fetchUniversityRecommendations(userId);

  const scores = recommendations.map((r) => r.matchScore);
  const averageMatchScore =
    scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const topMatchScore = Math.max(...scores, 0);
  const excellentMatches = recommendations.filter(
    (r) => r.matchScore >= 85
  ).length;
  const goodMatches = recommendations.filter(
    (r) => r.matchScore >= 70 && r.matchScore < 85
  ).length;

  const byDegree: UniversityRecommendationStats["byDegree"] = {
    Associate: { count: 0, avgScore: 0 },
    Bachelor: { count: 0, avgScore: 0 },
    Master: { count: 0, avgScore: 0 },
    Doctorate: { count: 0, avgScore: 0 },
    Certificate: { count: 0, avgScore: 0 },
  };

  const byField: Record<
    string,
    { count: number; avgScore: number; totalScore: number }
  > = {};
  const byCountry: Record<
    string,
    { count: number; avgScore: number; totalScore: number }
  > = {};

  recommendations.forEach((rec) => {
    const uni = rec.university;
    const degrees = new Set(rec.university.programs.map((p) => p.degree));
    degrees.forEach((deg) => {
      if (!byDegree[deg]) {
        byDegree[deg] = { count: 0, avgScore: 0 } as any;
      }
      byDegree[deg].count += 1;
      byDegree[deg].avgScore += rec.matchScore;
    });

    rec.university.programs.forEach((p) => {
      if (!byField[p.field]) {
        byField[p.field] = { count: 0, avgScore: 0, totalScore: 0 };
      }
      byField[p.field].count += 1;
      byField[p.field].totalScore += rec.matchScore;
    });

    if (!byCountry[uni.country]) {
      byCountry[uni.country] = { count: 0, avgScore: 0, totalScore: 0 };
    }
    byCountry[uni.country].count += 1;
    byCountry[uni.country].totalScore += rec.matchScore;
  });

  (Object.keys(byField) as string[]).forEach((field) => {
    const entry = byField[field];
    entry.avgScore = entry.totalScore / entry.count;
  });

  (Object.keys(byCountry) as string[]).forEach((country) => {
    const entry = byCountry[country];
    entry.avgScore = entry.totalScore / entry.count;
  });

  (Object.keys(byDegree) as DegreeLevel[]).forEach((deg) => {
    if (byDegree[deg].count > 0) {
      byDegree[deg].avgScore = byDegree[deg].avgScore / byDegree[deg].count;
    }
  });

  const topRecommendedFields = (Object.keys(byField) as string[])
    .map((field) => ({ field, matchScore: byField[field].avgScore }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return {
    overview: {
      totalMatches: recommendations.length,
      excellentMatches,
      goodMatches,
      averageMatchScore: Math.round(averageMatchScore),
      topMatchScore,
    },
    byDegree,
    byField: Object.fromEntries(
      (Object.keys(byField) as string[]).map((field) => [
        field,
        { count: byField[field].count, avgScore: byField[field].avgScore },
      ])
    ),
    byCountry: Object.fromEntries(
      (Object.keys(byCountry) as string[]).map((country) => [
        country,
        {
          count: byCountry[country].count,
          avgScore: byCountry[country].avgScore,
        },
      ])
    ),
    topRecommendedFields,
    assessmentInsights: {
      strengthsApplied: [
        "High analytical ability matches STEM-oriented universities.",
        "Strong conscientiousness aligns with research-intensive programs.",
      ],
      suggestedImprovements: [
        "Consider universities with strong internship support.",
        "Explore programs that develop leadership and communication skills.",
      ],
    },
  };
}

export async function fetchUniversityFavorites(
  userId: string
): Promise<UniversityFavorite[]> {
  // Mock: return top 2 recommendations as favorites
  const { recommendations } = await fetchUniversityRecommendations(userId);
  return recommendations.slice(0, 2).map((rec) => ({
    universityId: rec.university.id,
    university: rec.university,
    favoritedAt: new Date().toISOString(),
    matchScore: rec.matchScore,
    notes: "Mock favorite",
  }));
}

export async function compareUniversities(
  ids: string[]
): Promise<UniversityComparison> {
  const all = getMockUniversities();
  const selected = ids
    .map((id) => all.find((u) => u.id === id))
    .filter((u): u is University => Boolean(u));

  // Simple mock scoring for comparison
  const withScores = selected.map((u) => ({ ...u, matchScore: 80 }));

  return {
    universities: withScores,
    comparisonFields: [
      "ranking",
      "acceptanceRate",
      "tuition",
      "graduationRate",
      "studentCount",
      "setting",
      "financialAid",
    ],
    recommendation: {
      bestOverall: selected[0]?.id ?? "",
      bestValue: selected[selected.length - 1]?.id ?? "",
      bestAcademics: selected[0]?.id ?? "",
    },
  };
}

export async function fetchUniversityFilterOptions(): Promise<UniversityFilterOptions> {
  const all = getMockUniversities().filter((u) => u.isActive);

  const countriesMap = new Map<string, number>();
  const typesMap = new Map<string, number>();
  const degreesMap = new Map<DegreeLevel, number>();
  const fieldsMap = new Map<FieldOfStudy, number>();
  const campusSizesMap = new Map<string, number>();
  const settingsMap = new Map<string, number>();
  let minTuition = Infinity;
  let maxTuition = 0;
  let minRank = Infinity;
  let maxRank = 0;

  all.forEach((u) => {
    countriesMap.set(u.country, (countriesMap.get(u.country) ?? 0) + 1);
    typesMap.set(u.type, (typesMap.get(u.type) ?? 0) + 1);
    if (u.campusSize)
      campusSizesMap.set(
        u.campusSize,
        (campusSizesMap.get(u.campusSize) ?? 0) + 1
      );
    if (u.setting)
      settingsMap.set(u.setting, (settingsMap.get(u.setting) ?? 0) + 1);
    if (u.ranking.global) {
      minRank = Math.min(minRank, u.ranking.global);
      maxRank = Math.max(maxRank, u.ranking.global);
    }

    const tuition =
      u.tuition.international ?? u.tuition.outOfState ?? u.tuition.inState ?? 0;
    if (tuition > 0) {
      minTuition = Math.min(minTuition, tuition);
      maxTuition = Math.max(maxTuition, tuition);
    }

    u.programs.forEach((p) => {
      degreesMap.set(p.degree, (degreesMap.get(p.degree) ?? 0) + 1);
      fieldsMap.set(p.field, (fieldsMap.get(p.field) ?? 0) + 1);
    });
  });

  return {
    countries: Array.from(countriesMap.entries()).map(([code, count]) => ({
      code,
      name: code,
      nameEs: code,
      count,
    })),
    types: Array.from(typesMap.entries()).map(([value, count]) => ({
      value: value as any,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      labelEs: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    })),
    degrees: Array.from(degreesMap.entries()).map(([value, count]) => ({
      value,
      label: value,
      labelEs: value,
      count,
    })),
    fields: Array.from(fieldsMap.entries()).map(([value, count]) => ({
      value,
      label: value,
      labelEs: value,
      count,
    })),
    campusSizes: Array.from(campusSizesMap.entries()).map(([value, count]) => ({
      value: value as any,
      label: value,
      labelEs: value,
      count,
    })),
    settings: Array.from(settingsMap.entries()).map(([value, count]) => ({
      value: value as any,
      label: value,
      labelEs: value,
      count,
    })),
    tuitionRange: {
      min: Number.isFinite(minTuition) ? minTuition : 0,
      max: maxTuition,
      currency: "USD",
    },
    rankingRange: {
      min: Number.isFinite(minRank) ? minRank : 1,
      max: maxRank || 1000,
    },
  };
}
