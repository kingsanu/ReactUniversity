import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { generateDummyContent } from "@/app/dashboard/resume-builder/_components/dummyContentGenerator";

// Resume Builder Types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft" | "language";
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ResumeData {
  careerField: string;
  // Optional legacy field for compatibility
  userProfile?: any;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template:
    | "modern"
    | "classic"
    | "creative"
    | "minimal"
    | "executive"
    | "tech";
}

// Global State Interface
interface GlobalState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Language
  language: "english" | "spanish";
  setLanguage: (language: "english" | "spanish") => void;

  // User Authentication
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    role: string | null;
    isAuthenticated: boolean;
  };
  setUser: (user: Partial<GlobalState["user"]>) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;

  // Resume Builder State
  resumeBuilder: {
    currentStep: number;
    data: ResumeData;
    isLoading: boolean;
    isDirty: boolean;
  };
  setResumeStep: (step: number) => void;
  setCareerField: (careerField: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  removeSkill: (id: string) => void;
  setResumeTemplate: (template: ResumeData["template"]) => void;
  setResumeLoading: (loading: boolean) => void;
  resetResumeBuilder: () => void;
  populateWithDummyContent: (careerField: string) => void;

  // Navigation
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// Initial Resume Data
const initialResumeData: ResumeData = {
  careerField: "",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  template: "modern",
};

// Create the store
export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        // Theme
        theme: "light",
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
          })),

        // Language
        language: "english",
        setLanguage: (language: "english" | "spanish") => set({ language }),

        // User
        user: {
          id: null,
          email: null,
          name: null,
          role: null,
          isAuthenticated: false,
        },
        setUser: (userData) =>
          set((state) => ({
            user: { ...state.user, ...userData, isAuthenticated: true },
          })),
        logout: () => {
          // Clear localStorage token
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }
          // Reset user state
          set({
            user: {
              id: null,
              email: null,
              name: null,
              role: null,
              isAuthenticated: false,
            },
          });
        },

        // Initialize authentication state from localStorage
        initializeAuth: async () => {
          if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const currentUser = get().user;

            if (token && currentUser.email) {
              // We have both token and persisted user data, restore authenticated state
              set((state) => ({
                user: { ...state.user, isAuthenticated: true },
              }));
            } else {
              // No token or no user data, ensure we're in unauthenticated state
              if (token && !currentUser.email) {
                // Token exists but no user data, clear the token
                localStorage.removeItem("token");
              }
              set({
                user: {
                  id: null,
                  email: null,
                  name: null,
                  role: null,
                  isAuthenticated: false,
                },
              });
            }
          }
        },

        // Resume Builder
        resumeBuilder: {
          currentStep: 1,
          data: initialResumeData,
          isLoading: false,
          isDirty: false,
        },

        setResumeStep: (step) =>
          set((state) => ({
            resumeBuilder: { ...state.resumeBuilder, currentStep: step },
          })),

        setCareerField: (careerField) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: { ...state.resumeBuilder.data, careerField },
              isDirty: true,
            },
          })),

        updatePersonalInfo: (info) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                personalInfo: {
                  ...state.resumeBuilder.data.personalInfo,
                  ...info,
                },
              },
              isDirty: true,
            },
          })),

        addExperience: (experience) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                experience: [
                  ...state.resumeBuilder.data.experience,
                  { ...experience, id: crypto.randomUUID() },
                ],
              },
              isDirty: true,
            },
          })),

        updateExperience: (id, experience) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                experience: state.resumeBuilder.data.experience.map((exp) =>
                  exp.id === id ? { ...exp, ...experience } : exp
                ),
              },
              isDirty: true,
            },
          })),

        removeExperience: (id) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                experience: state.resumeBuilder.data.experience.filter(
                  (exp) => exp.id !== id
                ),
              },
              isDirty: true,
            },
          })),

        addEducation: (education) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                education: [
                  ...state.resumeBuilder.data.education,
                  { ...education, id: crypto.randomUUID() },
                ],
              },
              isDirty: true,
            },
          })),

        updateEducation: (id, education) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                education: state.resumeBuilder.data.education.map((edu) =>
                  edu.id === id ? { ...edu, ...education } : edu
                ),
              },
              isDirty: true,
            },
          })),

        removeEducation: (id) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                education: state.resumeBuilder.data.education.filter(
                  (edu) => edu.id !== id
                ),
              },
              isDirty: true,
            },
          })),

        addSkill: (skill) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                skills: [
                  ...state.resumeBuilder.data.skills,
                  { ...skill, id: crypto.randomUUID() },
                ],
              },
              isDirty: true,
            },
          })),

        removeSkill: (id) =>
          set((state) => {
            const currentSkills = state.resumeBuilder.data.skills || [];
            const filteredSkills = currentSkills.filter(
              (skill) => skill && skill.id !== id
            );

            return {
              resumeBuilder: {
                ...state.resumeBuilder,
                data: {
                  ...state.resumeBuilder.data,
                  skills: filteredSkills,
                },
                isDirty: true,
              },
            };
          }),

        setResumeTemplate: (template) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: { ...state.resumeBuilder.data, template },
              isDirty: true,
            },
          })),

        setResumeLoading: (loading) =>
          set((state) => ({
            resumeBuilder: { ...state.resumeBuilder, isLoading: loading },
          })),

        resetResumeBuilder: () =>
          set(() => ({
            resumeBuilder: {
              currentStep: 1,
              data: initialResumeData,
              isLoading: false,
              isDirty: false,
            },
          })),

        populateWithDummyContent: (careerField) =>
          set((state) => {
            // Determine experience level based on existing data or default to 'mid'
            const experienceLevel =
              state.resumeBuilder.data.experience.length === 0
                ? "fresher"
                : "mid";

            // Generate dummy content
            const dummyContent = generateDummyContent(
              careerField,
              experienceLevel
            );

            return {
              resumeBuilder: {
                ...state.resumeBuilder,
                data: {
                  careerField,
                  personalInfo: dummyContent.personalInfo,
                  experience: dummyContent.experience.map((exp, index) => ({
                    ...exp,
                    id: `exp-${Date.now()}-${index}`,
                  })),
                  education: dummyContent.education.map((edu, index) => ({
                    ...edu,
                    id: `edu-${Date.now()}-${index}`,
                  })),
                  skills: dummyContent.skills.map((skill, index) => ({
                    ...skill,
                    id: `skill-${Date.now()}-${index}`,
                  })),
                  template: state.resumeBuilder.data.template,
                },
                isDirty: true,
              },
            };
          }),

        // Navigation
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      }),
      {
        name: "timcare-global-store",
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          user: state.user,
          resumeBuilder: {
            data: state.resumeBuilder.data,
            currentStep: state.resumeBuilder.currentStep,
          },
        }),
      }
    ),
    { name: "TimCareGlobalStore" }
  )
);
