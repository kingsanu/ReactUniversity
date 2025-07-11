import { User, Briefcase, GraduationCap, Zap, ClipboardCheck } from 'lucide-react';

// Resume builder step configuration
export const resumeSteps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Add your contact details and professional summary",
    icon: User,
    fields: ["fullName", "email", "phone", "location", "linkedin", "website", "summary"]
  },
  {
    id: 2,
    title: "Work Experience",
    description: "Add your professional experience and achievements (optional for freshers)",
    icon: Briefcase,
    fields: ["experience"]
  },
  {
    id: 3,
    title: "Education",
    description: "Add your educational background",
    icon: GraduationCap,
    fields: ["education"]
  },
  {
    id: 4,
    title: "Skills",
    description: "Highlight your technical and soft skills",
    icon: Zap,
    fields: ["skills"]
  },
  {
    id: 5,
    title: "Summary",
    description: "Review and finalize your resume",
    icon: ClipboardCheck,
    fields: ["summary"]
  }
];

// Template options
export const resumeTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, professional design with modern typography",
    preview: "/templates/modern-preview.jpg",
    color: "#3b82f6"
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format preferred by recruiters",
    preview: "/templates/classic-preview.jpg", 
    color: "#374151"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with a unique, creative layout",
    preview: "/templates/creative-preview.jpg",
    color: "#8b5cf6"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, clean design that focuses on content",
    preview: "/templates/minimal-preview.jpg",
    color: "#10b981"
  }
];

// Sample resume data for the screenshot
export const sampleResumeData = {
  personalInfo: {
    fullName: "Maithili Pathak",
    email: "mapathak1391@gmail.com",
    phone: "+1 (914) 727 6370",
    location: "Texas",
    linkedin: "",
    website: "",
    summary: "Project Manager with over 4 years of experience leading cross-functional teams and driving successful delivery of projects within scope, time, and budget across Agile, Waterfall, and hybrid environments."
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
        "Managed multi-million-dollar projects using Microsoft Project, Smartsheet, and Jira, enabling real-time tracking of schedules, milestones, and deliverables while improving on-time delivery rates by 30%.",
        "Created comprehensive project documentation, including RACI matrices, detailed project plans, and weekly status reports, improving stakeholder communication and visibility across management chain of phases.",
        "Led risk assessments and implemented mitigation strategies, resulting in a 40% reduction in project delays and issue escalations.",
        "Coordinated cross-functional collaboration with 5+ teams including Slack, Zoom, enhanced team engagement and accelerated issue resolution timelines by 25%.",
        "Maintained QA/QC and QC processes, ensuring smooth transition from testing to deployment while maintaining regulatory and quality standards.",
        "Twisted process flows and technical diagrams with MS Visio and Lucidchart, streamlining communication between business analysts, developers, and QA teams."
      ]
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
        "Planned and monitored complex project schedules using Gantt Charts and Critical Path Method (CPM), ensuring efficient resource allocation and on-time delivery of key milestones.",
        "Managed cross-functional initiatives across platforms like Asana, Trello, Basecamp, ClickUp, and Confluence to streamline task assignment, progress tracking, and documentation.",
        "Maintained RAID logs, meeting minutes, statements of work, and change requests, improving audit readiness and strengthening project governance.",
        "Conducted detailed cost-benefit analysis and implemented earned value management (EVM) techniques to control project budgets and track financial performance.",
        "Developed visually compelling presentations in PowerPoint and delivered executive-level reports and insights using Tableau to enhance decision-making.",
        "Drove stakeholder engagement and buy-in through structured communication plans and training coordination, increasing adoption rates of new tools and processes by 40%.",
        "Supported technical deployments and infrastructure-related projects on AWS, aligning cloud strategies with business goals to enhance scalability and operational efficiency."
      ]
    }
  ],
  education: [
    {
      id: "1",
      degree: "Master of Science in Project Management",
      institution: "University of Maryland",
      location: "Maryland",
      graduationDate: "2020",
      gpa: ""
    }
  ],
  skills: [
    {
      id: "1",
      name: "SDLC, Agile, Waterfall, Lean, Six Sigma Basics",
      category: "technical",
      level: "expert"
    },
    {
      id: "2", 
      name: "Project Charter, Work Breakdown Structure, Gantt Charts, Critical Path Method",
      category: "technical",
      level: "expert"
    },
    {
      id: "3",
      name: "Microsoft Project, Smartsheet, Asana, Trello, Basecamp, ClickUp, Confluence",
      category: "technical", 
      level: "advanced"
    }
  ]
};
