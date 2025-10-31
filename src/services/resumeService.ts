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
  return apiRequest(`/api/resume/${resumeId}`, { method: "GET" });
}

export async function deleteResume(resumeId: string): Promise<void> {
  return apiRequest(`/api/resume/${resumeId}`, { method: "DELETE" });
}
