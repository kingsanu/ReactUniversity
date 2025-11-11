import { apiRequest } from "@/lib/api/apiClient";

export interface ResumePersonal {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
}

export interface ResumeSkillGroups {
  [category: string]: string[];
}

export interface ResumeSkills {
  skills: ResumeSkillGroups;
}

export interface ResumeExperience {
  company: string;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  descriptions: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Resume {
  _id: string;
  personal: ResumePersonal;
  summary?: string;
  skills: ResumeSkills;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  name: string;
  template: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResumePayload {
  personal: ResumePersonal;
  summary?: string;
  skills: ResumeSkills;
  experience: ResumeExperience[];
  education: ResumeEducation[];
}

export type UpdateResumePayload = Partial<CreateResumePayload>;

export async function createResume(
  payload: CreateResumePayload
): Promise<Resume> {
  return apiRequest("/api/resume", {
    method: "POST",
    data: payload,
  });
}

export async function updateResume(
  resumeId: string,
  payload: UpdateResumePayload
): Promise<Resume> {
  return apiRequest(`/api/resume/${resumeId}`, {
    method: "PUT",
    data: payload,
  });
}

export async function getAllResumes(): Promise<Resume[]> {
  const response = await apiRequest("/api/resume", { method: "GET" });
  return response.data?.data || [];
}

export async function getResumeById(resumeId: string): Promise<Resume> {
  const response = await apiRequest(`/api/resume/${resumeId}`, {
    method: "GET",
  });
  return response.data || response;
}

export async function deleteResume(resumeId: string): Promise<void> {
  return apiRequest(`/api/resume/${resumeId}`, { method: "DELETE" });
}

// AI Generation Functions
export interface AIGenerationContext {
  jobTitle?: string;
  company?: string;
  responsibilities?: string;
  technologies?: string;
  currentRole?: string;
  keySkills?: string;
  yearsExperience?: number;
  industry?: string;
  targetRole?: string;
  achievements?: string[];
}

export interface AIGenerationResponse {
  success: boolean;
  data: {
    generated_content: string | string[];
    atsScore?: number;
    wordCount?: number;
    keywordsIncluded?: string[];
  };
  message?: string;
}

export async function generateProfessionalSummary(
  context: AIGenerationContext
): Promise<AIGenerationResponse> {
  return apiRequest("/api/resume/generate/professional-summary", {
    method: "POST",
    data: context,
  });
}

export async function generateJobBullets(
  context: AIGenerationContext
): Promise<AIGenerationResponse> {
  return apiRequest("/api/resume/generate/job-bullets", {
    method: "POST",
    data: context,
  });
}

export async function generateCareerObjective(
  context: AIGenerationContext
): Promise<AIGenerationResponse> {
  return apiRequest("/api/resume/generate/career-objective", {
    method: "POST",
    data: context,
  });
}

export async function generateProjectDescription(
  context: AIGenerationContext
): Promise<AIGenerationResponse> {
  return apiRequest("/api/resume/generate/project-description", {
    method: "POST",
    data: context,
  });
}

/**
 * Generic AI content generation using the /api/resume/ask endpoint
 * This function constructs a detailed prompt and sends it to the AI
 */
export async function generateAIContent(
  prompt: string
): Promise<AIGenerationResponse> {
  try {
    const response = await apiRequest("/api/resume/ask", {
      method: "POST",
      data: {
        Prompt: prompt,
      },
    });

    // The API returns the generated content directly
    // We need to format it to match our AIGenerationResponse interface
    return {
      success: true,
      data: {
        generated_content: response,
      },
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate content",
      data: {
        generated_content: "",
      },
    };
  }
}

export async function getDefaultResume(): Promise<Resume> {
  const response = await apiRequest("/api/resume/default", { method: "GET" });
  return response.data || response;
}
