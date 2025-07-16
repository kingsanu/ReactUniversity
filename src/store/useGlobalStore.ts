import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: "modern" | "classic" | "creative" | "minimal";
}

// Enhanced Multi-Step Resume Builder Types
export interface UserProfile {
  careerLevel: "entry-level" | "mid-career" | "senior" | "executive";
  employmentStatus: "student" | "employed" | "unemployed" | "career-change";
  industry: string;
  targetRole?: string;
  yearsOfExperience: number;
  hasWorkExperience: boolean;
  profileScore: number; // 0-100 for template matching
}

export interface TemplateRecommendation {
  templateId: string;
  suitabilityScore: number; // 0-100
  reasoning: string[];
  isCurrentDesign: boolean;
  isRecommended?: boolean; // Added to fix template recommendation display
  preview: {
    thumbnailUrl: string;
    sampleContent: Partial<ResumeData>;
  };
}

export interface OptimizationSuggestion {
  type: "condense" | "expand" | "prioritize" | "remove";
  section: string;
  description: string;
  impact: "low" | "medium" | "high";
  autoApplicable: boolean;
}

export interface ContentOptimizationState {
  currentPageCount: number;
  contentDensity: "sparse" | "optimal" | "dense" | "overflow";
  suggestions: OptimizationSuggestion[];
  autoAppliedOptimizations: string[];
}

export interface LayoutSettings {
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  spacing: {
    section: number;
    paragraph: number;
    line: number;
  };
  fontSize: {
    heading: number;
    body: number;
    small: number;
  };
}

export interface DesignCustomizationState {
  selectedTemplate: string;
  colorScheme?: string;
  fontFamily?: string;
  layoutSettings?: LayoutSettings;
  customizations: Record<string, any>;
}

interface ResumeBuilderError {
  type: "validation" | "template" | "optimization" | "save" | "network";
  severity: "error" | "warning" | "info";
  message: string;
  field?: string;
  step?: number;
  recoverable: boolean;
  autoRetry?: boolean;
}

// Enhanced Template Interface
interface EnhancedTemplate {
  id: string;
  name: string;
  description: string;
  category: "traditional" | "modern" | "creative" | "minimal";
  suitableFor: {
    careerLevels: UserProfile["careerLevel"][];
    industries: string[];
    employmentStatuses: UserProfile["employmentStatus"][];
  };
  features: {
    atsOptimized: boolean;
    colorCustomizable: boolean;
    layoutFlexible: boolean;
    singlePageOptimized: boolean;
  };
  preview: {
    thumbnailUrl: string;
    fullPreviewUrl: string;
  };
  color: string;
}

// Extended Resume Data Interface
export interface EnhancedResumeData extends ResumeData {
  userProfile: UserProfile;
  selectedTemplate: string;
  customizations: {
    colorScheme?: string;
    fontFamily?: string;
    layoutSettings?: LayoutSettings;
  };
  optimizationSettings: {
    prioritizedSections: string[];
    condensationLevel: "minimal" | "moderate" | "aggressive";
    autoOptimizationsEnabled: boolean;
  };
  metadata: {
    createdAt: Date;
    lastModified: Date;
    version: number;
    isCompleted: boolean;
  };
}

// Global State Interface
interface GlobalState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // User Authentication
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
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
    userProfile: UserProfile | null;
    recommendedTemplates: TemplateRecommendation[];
    contentOptimization: ContentOptimizationState | null;
    designCustomization: DesignCustomizationState | null;
    lastSaved: Date | null;
  };
  setResumeStep: (step: number) => void;
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
  populateWithSampleData: (sampleData: ResumeData) => void;
  setResumeLoading: (loading: boolean) => void;
  resetResumeBuilder: () => void;

  // New profile and optimization actions
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setRecommendedTemplates: (templates: TemplateRecommendation[]) => void;
  setContentOptimization: (optimization: ContentOptimizationState) => void;
  updateContentOptimization: (
    optimization: Partial<ContentOptimizationState>
  ) => void;
  setDesignCustomization: (customization: DesignCustomizationState) => void;
  updateDesignCustomization: (
    customization: Partial<DesignCustomizationState>
  ) => void;
  saveResumeProgress: () => void;

  // Navigation
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// Initial Resume Data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Maithili Pathak",
    email: "maithili391@gmail.com",
    phone: "+1 (914) 727 6370",
    location: "Texas",
    linkedin: "",
    website: "",
    summary: `Experienced Project Manager with 4+ years leading cross-functional teams and delivering projects on time and within budget. Skilled in Agile, Waterfall methodologies, and project management tools including Microsoft Project, Jira, and Smartsheet. Proven track record in risk management, stakeholder communication, and data-driven reporting.`,
  },
  experience: [
    {
      id: "1",
      jobTitle: "Project Manager",
      company: "Freddie Mac",
      location: "USA",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      description: [
        "Managed multi-million-dollar projects using Microsoft Project, Smartsheet, and Jira, improving on-time delivery rates by 30%",
        "Created comprehensive project documentation including RACI matrices and status reports, improving stakeholder communication",
        "Led risk assessments and mitigation strategies, reducing project delays by 40%",
        "Coordinated cross-functional teams using MS Teams and Slack, accelerating resolution timelines by 25%"
      ],
    },
    {
      id: "2",
      jobTitle: "Project Manager",
      company: "Qualcomm",
      location: "USA",
      startDate: "Jan 2021",
      endDate: "Dec 2023",
      current: false,
      description: [
        "Planned and monitored complex project schedules using Gantt Charts and Critical Path Method (CPM)",
        "Managed cross-functional initiatives across multiple platforms including Asana, Trello, and Confluence",
        "Maintained RAID logs and project documentation, improving audit readiness and governance",
        "Conducted cost-benefit analysis and implemented EVM techniques for budget control"
      ],
    },
  ],
  education: [
    {
      id: "1",
      degree: "Master of Science in Project Management",
      institution: "University of Texas",
      location: "Texas",
      graduationDate: "May 2020",
      gpa: "3.8",
    },
  ],
  skills: [
    { id: "1", name: "Agile & Waterfall Methodologies", category: "technical", level: "expert" },
    { id: "2", name: "Microsoft Project", category: "technical", level: "expert" },
    { id: "3", name: "Jira & Smartsheet", category: "technical", level: "advanced" },
    { id: "4", name: "Risk Management", category: "technical", level: "expert" },
    { id: "5", name: "Stakeholder Communication", category: "soft", level: "expert" },
    { id: "6", name: "Data Analysis & Reporting", category: "technical", level: "advanced" },
  ],
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

        // User
        user: {
          id: null,
          email: null,
          name: null,
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
          userProfile: null,
          recommendedTemplates: [],
          contentOptimization: null,
          designCustomization: null,
          lastSaved: null,
        },

        setResumeStep: (step) =>
          set((state) => ({
            resumeBuilder: { ...state.resumeBuilder, currentStep: step },
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

        // Populate resume with sample data based on career field
        populateWithSampleData: (sampleData) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...sampleData,
                template: state.resumeBuilder.data.template, // Keep current template
              },
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
              userProfile: null,
              recommendedTemplates: [],
              contentOptimization: null,
              designCustomization: null,
              lastSaved: null,
            },
          })),

        // New profile and optimization actions
        setUserProfile: (profile) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              userProfile: profile,
              isDirty: true,
            },
          })),

        updateUserProfile: (profile) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              userProfile: state.resumeBuilder.userProfile
                ? { ...state.resumeBuilder.userProfile, ...profile }
                : null,
              isDirty: true,
            },
          })),

        setRecommendedTemplates: (templates) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              recommendedTemplates: templates,
            },
          })),

        setContentOptimization: (optimization) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              contentOptimization: optimization,
            },
          })),

        updateContentOptimization: (optimization) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              contentOptimization: state.resumeBuilder.contentOptimization
                ? {
                    ...state.resumeBuilder.contentOptimization,
                    ...optimization,
                  }
                : null,
            },
          })),

        setDesignCustomization: (customization) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              designCustomization: customization,
            },
          })),

        updateDesignCustomization: (customization) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              designCustomization: state.resumeBuilder.designCustomization
                ? {
                    ...state.resumeBuilder.designCustomization,
                    ...customization,
                  }
                : null,
            },
          })),

        saveResumeProgress: () =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              lastSaved: new Date(),
              isDirty: false,
            },
          })),

        // Navigation
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      }),
      {
        name: "timcare-global-store",
        partialize: (state) => ({
          theme: state.theme,
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
