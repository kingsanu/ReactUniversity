
export interface BenchmarkData {
  year: number;
  value: number;
}

export interface SalaryData {
  role: string;
  min: number;
  avg: number;
  max: number;
}

export interface SkillData {
  skill: string;
  popularity: number; // 0-100
}

export interface InsightData {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  description: string;
}

export interface PieData {
  name: string;
  value: number;
}

export interface IndexData {
  costOfLiving: number; // 0-100
  rentIndex: number;
  purchasingPower: number;
}

export interface CertData {
  name: string;
  provider: string;
  duration: string;
}

export const COUNTRIES = ["USA", "UK", "Canada", "Germany", "India", "Australia"];
export const CAREERS = ["Software Engineer", "Data Scientist", "Product Manager", "Designer", "Marketing Manager"];

export const getEmployabilityTrends = async (country: string, career: string): Promise<BenchmarkData[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock data generation based on inputs to make it feel dynamic
  const baseValue = country.length * 10 + career.length * 2;
  return Array.from({ length: 5 }, (_, i) => ({
    year: 2020 + i,
    value: Math.min(100, Math.max(0, baseValue + i * 5 + Math.random() * 10 - 5)),
  }));
};

export const getYouthEmploymentTrends = async (country: string): Promise<BenchmarkData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const baseValue = country === "India" ? 60 : 85;
  return Array.from({ length: 5 }, (_, i) => ({
    year: 2020 + i,
    value: Math.min(100, Math.max(0, baseValue + (Math.random() * 5 - 2))),
  }));
};

export const getSalaryTrends = async (country: string, career: string): Promise<SalaryData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const currencyMultiplier = country === "India" ? 10 : 1; // Simplify currency for mock
  const baseSalary = (career.length * 10000) / (country === "India" ? 80 : 1); 

  return [
    {
      role: "Junior",
      min: baseSalary * 0.8,
      avg: baseSalary,
      max: baseSalary * 1.2,
    },
    {
      role: "Mid-Level",
      min: baseSalary * 1.2,
      avg: baseSalary * 1.5,
      max: baseSalary * 1.8,
    },
    {
      role: "Senior",
      min: baseSalary * 1.8,
      avg: baseSalary * 2.2,
      max: baseSalary * 2.6,
    },
  ];
};

export const getTopSkills = async (career: string): Promise<SkillData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const commonSkills = ["Communication", "Problem Solving", "Leadership"];
  const techSkills = career.includes("Engineer") || career.includes("Developer") 
    ? ["React", "Node.js", "TypeScript", "AWS", "Python"] 
    : ["Project Management", "Data Analysis", "SEO", "Content Marketing", "UX Design"];

  const skills = [...techSkills, ...commonSkills].slice(0, 7);
  
  return skills.map(skill => ({
    skill,
    popularity: Math.floor(Math.random() * 40) + 60,
  })).sort((a, b) => b.popularity - a.popularity);
};

export const getMarketInsights = async (country: string, career: string): Promise<InsightData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      label: "Demand Growth",
      value: "+12%",
      trend: "up",
      description: "Year-over-year job posting growth."
    },
    {
      label: "Talent Supply",
      value: "Moderate",
      trend: "neutral",
      description: "Ratio of applicants to open positions."
    },
    {
      label: "Remote Opportunity",
      value: "High",
      trend: "up",
      description: "Percentage of roles offering remote work."
    },
    {
      label: "Avg. Fill Time",
      value: "45 Days",
      trend: "down",
      description: "Time to fill an open position."
    }
  ];
};

export const getWorkModeDistribution = async (career: string): Promise<PieData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { name: "Remote", value: 35 },
    { name: "Hybrid", value: 45 },
    { name: "Onsite", value: 20 },
  ];
};

export const getDiversityData = async (career: string): Promise<PieData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { name: "Male", value: 62 },
    { name: "Female", value: 35 },
    { name: "Non-Binary/Other", value: 3 },
  ];
};

export const getCostOfLiving = async (country: string): Promise<IndexData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const base = country === "India" ? 30 : 75;
  return {
    costOfLiving: base,
    rentIndex: base * 0.8,
    purchasingPower: 100 - base,
  };
};

export const getRecommendedCertifications = async (career: string): Promise<CertData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { name: "Advanced Professional Certificate", provider: "Coursera", duration: "6 months" },
    { name: "Certified Expert", provider: "Udacity", duration: "3 months" },
    { name: "Master Class in Leadership", provider: "LinkedIn Learning", duration: "4 weeks" },
  ];
};
