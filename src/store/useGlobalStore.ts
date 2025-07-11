import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
  category: 'technical' | 'soft' | 'language';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: 'modern' | 'classic' | 'creative' | 'minimal';
}

// Global State Interface
interface GlobalState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // User Authentication
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    isAuthenticated: boolean;
  };
  setUser: (user: Partial<GlobalState['user']>) => void;
  logout: () => void;

  // Resume Builder State
  resumeBuilder: {
    currentStep: number;
    data: ResumeData;
    isLoading: boolean;
    isDirty: boolean;
  };
  setResumeStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  setResumeTemplate: (template: ResumeData['template']) => void;
  setResumeLoading: (loading: boolean) => void;
  resetResumeBuilder: () => void;

  // Navigation
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// Initial Resume Data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Maithili Pathak',
    email: 'maithili391@gmail.com',
    phone: '+1 (914) 727 6370',
    location: 'Texas',
    linkedin: '',
    website: '',
    summary: `A seasoned Project Manager with over 4 years of experience leading cross-functional teams and driving successful delivery of projects within scope, time, and budget across Agile, Waterfall, and hybrid environments.
Skilled in developing comprehensive project charters, Gantt charts, WBS, and critical path schedules using tools like Microsoft Project, Jira, and Smartsheet to ensure smooth planning and execution.
Expertise includes managing RAID logs, RACI matrices, status reports, and change requests to support informed decision-making and risk mitigation.
Proficiency in using Power BI, Tableau, and advanced Excel for data-driven reporting and executive presentations.
Familiarity with cloud platforms, MS Visio, Lucidchart, and basic SQL enhances technical understanding and facilitates seamless coordination with development teams.`,
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Project Manager',
      company: 'Freddie Mac',
      location: 'USA',
      startDate: 'Jan 2024',
      endDate: 'Present',
      current: true,
      description: [
        'Managed multi-million-dollar projects using Microsoft Project, Smartsheet, and Jira, enabling real-time tracking of schedules, milestones, and deliverables while improving on-time delivery rates by 30%.',
        'Created comprehensive project documentation, including RACI matrices, detailed project plans, and weekly status reports, improving stakeholder communication and visibility across teams and project phases.',
        'Led risk assessments and implemented mitigation strategies, resulting in a 40% reduction in project delays and issue escalations.',
        'Coordinated cross-functional collaboration with MS Teams, Slack, and Zoom, enhancing team engagement and accelerating resolution timelines by 25%.',
        'Maintained QA/QC processes, ensuring smooth transition from testing to deployment while maintaining regulatory and quality standards.',
        'Twisted process flows and technical diagrams with MS Visio and Lucidchart, streamlining communication between business analysts, developers, and QA teams.'
      ]
    },
    {
      id: '2',
      jobTitle: 'Project Manager',
      company: 'Qualcomm',
      location: 'USA',
      startDate: 'Jan 2021',
      endDate: 'Dec 2023',
      current: false,
      description: [
        'Planned and monitored complex project schedules using Gantt Charts and Critical Path Method (CPM), ensuring efficient resource allocation and on-time delivery of key milestones.',
        'Managed cross-functional initiatives across platforms like Asana, Trello, Basecamp, ClickUp, and Confluence to streamline task assignment, progress tracking, and documentation.',
        'Maintained RAID logs, meeting minutes, statements of work, and change requests, improving audit readiness and strengthening project governance.',
        'Conducted detailed cost-benefit analysis and implemented earned value management (EVM) techniques to control project budgets and track financial performance.',
        'Developed visually compelling presentations in PowerPoint and delivered executive-level reports and insights using Tableau to enhance decision-making.',
        'Drove stakeholder engagement and buy-in through structured communication plans and training coordination, increasing adoption rates of new work processes by 40%.',
        'Supported technical deployments and infrastructure-related projects on AWS, aligning cloud strategies with business goals to enhance scalability and operational efficiency.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Project Management',
      institution: 'University of Texas',
      location: 'Texas',
      graduationDate: 'May 2020',
      gpa: '3.8'
    }
  ],
  skills: [
    { id: '1', name: 'SDLC', category: 'technical', level: 'advanced' },
    { id: '2', name: 'Agile', category: 'technical', level: 'expert' },
    { id: '3', name: 'Waterfall', category: 'technical', level: 'advanced' },
    { id: '4', name: 'Lean', category: 'technical', level: 'intermediate' },
    { id: '5', name: 'Six Sigma Basics', category: 'technical', level: 'intermediate' },
    { id: '6', name: 'Project Charter', category: 'technical', level: 'expert' },
    { id: '7', name: 'Work Breakdown Structure', category: 'technical', level: 'expert' },
    { id: '8', name: 'Gantt Charts', category: 'technical', level: 'expert' },
    { id: '9', name: 'Critical Path Method', category: 'technical', level: 'advanced' },
    { id: '10', name: 'Microsoft Project', category: 'technical', level: 'expert' },
    { id: '11', name: 'Smartsheet', category: 'technical', level: 'advanced' },
    { id: '12', name: 'Jira', category: 'technical', level: 'advanced' },
    { id: '13', name: 'Asana', category: 'technical', level: 'intermediate' },
    { id: '14', name: 'Trello', category: 'technical', level: 'intermediate' },
    { id: '15', name: 'Basecamp', category: 'technical', level: 'intermediate' },
    { id: '16', name: 'ClickUp', category: 'technical', level: 'intermediate' },
    { id: '17', name: 'Confluence', category: 'technical', level: 'intermediate' },
    { id: '18', name: 'Project Plans', category: 'technical', level: 'expert' },
    { id: '19', name: 'RACI Matrix', category: 'technical', level: 'expert' },
    { id: '20', name: 'Status Reports', category: 'technical', level: 'expert' },
    { id: '21', name: 'RAID Logs', category: 'technical', level: 'expert' },
    { id: '22', name: 'Meeting Minutes', category: 'technical', level: 'advanced' },
    { id: '23', name: 'SOW', category: 'technical', level: 'advanced' },
    { id: '24', name: 'Change Requests', category: 'technical', level: 'advanced' },
    { id: '25', name: 'Collaboration', category: 'technical', level: 'expert' },
    { id: '26', name: 'MS Teams', category: 'technical', level: 'expert' },
    { id: '27', name: 'Slack', category: 'technical', level: 'advanced' },
    { id: '28', name: 'Zoom', category: 'technical', level: 'advanced' },
    { id: '29', name: 'Google Workspace', category: 'technical', level: 'advanced' },
    { id: '30', name: 'SharePoint', category: 'technical', level: 'intermediate' },
    { id: '31', name: 'Risk Analysis', category: 'technical', level: 'expert' },
    { id: '32', name: 'Mitigation Planning', category: 'technical', level: 'expert' },
    { id: '33', name: 'Issue Tracking', category: 'technical', level: 'expert' },
    { id: '34', name: 'Escalation Management', category: 'technical', level: 'advanced' },
    { id: '35', name: 'Budget Tracking', category: 'technical', level: 'advanced' },
    { id: '36', name: 'Forecasting', category: 'technical', level: 'advanced' },
    { id: '37', name: 'Cost-Benefit Analysis', category: 'technical', level: 'advanced' },
    { id: '38', name: 'Earned Value Management', category: 'technical', level: 'advanced' },
    { id: '39', name: 'Excel (Pivot Tables, VLOOKUP)', category: 'technical', level: 'expert' },
    { id: '40', name: 'PowerPoint', category: 'technical', level: 'expert' },
    { id: '41', name: 'Tableau', category: 'technical', level: 'advanced' },
    { id: '42', name: 'Power BI', category: 'technical', level: 'advanced' },
    { id: '43', name: 'OUAT Compliance Awareness', category: 'technical', level: 'intermediate' },
    { id: '44', name: 'Data Privacy Documentation', category: 'technical', level: 'intermediate' },
    { id: '45', name: 'Regulatory Compliance Awareness', category: 'technical', level: 'intermediate' },
    { id: '46', name: 'Change Control', category: 'technical', level: 'expert' },
    { id: '47', name: 'Impact Analysis', category: 'technical', level: 'advanced' },
    { id: '48', name: 'Stakeholder Buy-in', category: 'technical', level: 'expert' },
    { id: '49', name: 'Training Coordination', category: 'technical', level: 'advanced' },
    { id: '50', name: 'Basic SQL', category: 'technical', level: 'beginner' },
    { id: '51', name: 'MS Visio', category: 'technical', level: 'advanced' },
    { id: '52', name: 'Lucidchart', category: 'technical', level: 'advanced' },
    { id: '53', name: 'Risk Registers', category: 'technical', level: 'expert' },
    { id: '54', name: 'Cloud Environments (AWS/Azure)', category: 'technical', level: 'intermediate' },
    { id: '55', name: 'Windows', category: 'technical', level: 'expert' },
    { id: '56', name: 'Linux', category: 'technical', level: 'intermediate' },
    { id: '57', name: 'Mac', category: 'technical', level: 'intermediate' },
  ],
  template: 'modern',
};

// Create the store
export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        // Theme
        theme: 'light',
        toggleTheme: () =>
          set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

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
        logout: () =>
          set({
            user: {
              id: null,
              email: null,
              name: null,
              isAuthenticated: false,
            },
          }),

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

        updatePersonalInfo: (info) =>
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                personalInfo: { ...state.resumeBuilder.data.personalInfo, ...info },
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
          set((state) => ({
            resumeBuilder: {
              ...state.resumeBuilder,
              data: {
                ...state.resumeBuilder.data,
                skills: state.resumeBuilder.data.skills.filter((skill) => skill.id !== id),
              },
              isDirty: true,
            },
          })),

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
          set((state) => ({
            resumeBuilder: {
              currentStep: 1,
              data: initialResumeData,
              isLoading: false,
              isDirty: false,
            },
          })),

        // Navigation
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      }),
      {
        name: 'timcare-global-store',
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
    { name: 'TimCareGlobalStore' }
  )
);
