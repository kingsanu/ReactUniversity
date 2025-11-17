export type LocalizedText = { en?: string; es?: string };

export interface Skill {
  skillId: string;
  name: LocalizedText;
  levelRequired?: "beginner" | "intermediate" | "advanced";
}

export interface SalaryRange {
  min?: number;
  median?: number;
  max?: number;
  currency?: string;
}

export interface DemandStats {
  jobCount?: number;
  postedLast30Days?: number;
  growthPercent?: number;
}

export interface CareerRole {
  id: string;
  familyId?: string;
  slug?: string;
  title: LocalizedText;
  shortDescription?: LocalizedText;
  longDescription?: LocalizedText;
  responsibilities?: LocalizedText[];
  skills?: Skill[];
  educationLevel?: "HighSchool" | "Associate" | "Bachelors" | "Masters" | "PhD";
  salaryRange?: SalaryRange;
  demandStats?: DemandStats;
  industries?: string[];
  locationSupport?: string[]; // array of country/state
  iconUrl?: string;
  remoteEligible?: boolean;
  matchScore?: number;
  published?: boolean;
}
