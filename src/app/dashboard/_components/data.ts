// Mock data that will be replaced with API calls later
export const dashboardData = {
  user: {
    name: "John Doe",
    avatar: "/api/placeholder/32/32",
  },

  competencyPlan: {
    title: "Competency Profit & Development Plan",
    date: "Tue, 14 Nov, 2022, 11:30 AM",
    categories: [
      { name: "Leadership", percentage: 54, color: "#3B82F6", trend: "up" },
      {
        name: "PCA/LIA/Interest",
        percentage: 20,
        color: "#10B981",
        trend: "up",
      },
      { name: "Thinking", percentage: 26, color: "#EF4444", trend: "down" },
      {
        name: "Technical Analytics",
        percentage: 28,
        color: "#8B5CF6",
        trend: "down",
      },
      { name: "Thinking", percentage: 26, color: "#F59E0B", trend: "down" },
    ],
  },

  actionCards: [
    {
      id: 1,
      title: "dashboard.startAssessment",
      subtitle: "dashboard.completeEvaluations",
      icon: "🧠",
      action: "dashboard.beginAssessment",
      link: "/dashboard/assessments",
      variant: "primary",
      badge: "dashboard.recommended",
    },
    {
      id: 2,
      title: "dashboard.startCourse",
      subtitle: "dashboard.goToCatalog",
      icon: "📚",
      action: "dashboard.browseCourses",
      link: "/dashboard/learning/courses",
      variant: "secondary",
    },
    {
      id: 3,
      title: "dashboard.buildResume",
      subtitle: "dashboard.createWithAI",
      icon: "📄",
      action: "dashboard.startBuilding",
      link: "/dashboard/resume-builder/new",
      variant: "secondary",
      badge: "dashboard.withAI",
    },
    {
      id: 4,
      title: "dashboard.scheduleCoaching",
      subtitle: "dashboard.bookSession",
      icon: "👥",
      action: "dashboard.bookSession",
      link: "/dashboard/coaching/schedule",
      variant: "secondary",
    },
  ],

  opportunities: [
    {
      id: "01",
      catNo: "6465",
      driver: {
        name: "Sr. software developer",
        avatar: "/api/placeholder/32/32",
      },
      status: "Completed",
      statusColor: "green",
      rating: 5,
    },
    {
      id: "02",
      catNo: "5665",
      driver: {
        name: "Database Engineer",
        avatar: "/api/placeholder/32/32",
      },
      status: "Pending",
      statusColor: "blue",
      rating: 4,
    },
    {
      id: "03",
      catNo: "1755",
      driver: {
        name: "Network Engineer",
        avatar: "/api/placeholder/32/32",
      },
      status: "In route",
      statusColor: "red",
      rating: 5,
    },
  ],

  careerMatches: [
    {
      id: 1,
      title: "Sr. Software developer",
      company: "Creative Design Labs",
      progress: 85,
      icon: "💻",
    },
    {
      id: 2,
      title: "Python Text to speech",
      company: "Microsoft",
      progress: 70,
      icon: "🐍",
    },
    {
      id: 3,
      title: "Database Engineer",
      company: "Softwire Inc.",
      progress: 65,
      icon: "🗄️",
    },
  ],

  benchmarks: {
    currentValue: 9460.0,
    change: -1.5,
    comparison: 9940,
    lastWeekIncome: 25658.0,
  },

  milestones: {
    current: 9,
    total: 20,
    progress: 45, // percentage
    skills: [
      { name: "AI", color: "#3B82F6" },
      { name: "CurriDRAW", color: "#10B981" },
      { name: "InDesign", color: "#8B5CF6" },
      { name: "Canva", color: "#F59E0B" },
    ],
  },

  activity: {
    timeRange: "Mar 2022 - Oct 2022",
    data: [
      { month: "May", value: 240 },
      { month: "Jun", value: 180 },
      { month: "Jul", value: 280 },
      { month: "Aug", value: 220 },
      { month: "Sep", value: 260 },
      { month: "Oct", value: 200 },
    ],
    maxValue: 300,
  },
};

export const sidebarData = {
  logo: {
    icon: "V",
    text: "UNIV.365",
  },

  navigation: [
    {
      id: "dashboard",
      name: "nav.dashboard",
      icon: "dashboard",
      path: "/dashboard",
    },
    {
      id: "analytics",
      name: "nav.analytics",
      icon: "analytics",
      path: "/dashboard/analytics",
      expanded: true,
      submenu: [
        { name: "common.overview", path: "/dashboard/analytics/overview" },
        {
          name: "dashboard.subscriptionMetrics",
          path: "/dashboard/analytics/metrics",
        },
        {
          name: "dashboard.feedbackResults",
          path: "/dashboard/analytics/feedback",
        },
      ],
    },
    {
      id: "career-planning",
      name: "nav.careerPaths",
      icon: "career",
      path: "/dashboard/career-planning",
      expanded: false,
      submenu: [
        {
          name: "dashboard.careerPathsExplorer",
          path: "/dashboard/career-planning/paths",
        },
        {
          name: "dashboard.universitySuggestions",
          path: "/dashboard/career-planning/university",
        },
        {
          name: "dashboard.assessmentProgress",
          path: "/dashboard/career-planning/assessments",
        },
        {
          name: "dashboard.progressMilestones",
          path: "/dashboard/career-planning/progress",
        },
        {
          name: "dashboard.benchmarks",
          path: "/dashboard/career-planning/benchmark",
        },
      ],
    },
    {
      id: "opportunities",
      name: "dashboard.opportunities",
      icon: "opportunities",
      path: "/dashboard/opportunities",
      submenu: [
        {
          name: "dashboard.jobOpenings",
          path: "/dashboard/opportunities/jobs",
        },
        {
          name: "dashboard.internshipOpportunities",
          path: "/dashboard/opportunities/internships",
        },
        {
          name: "dashboard.mentorshipMatches",
          path: "/dashboard/opportunities/mentorship",
        },
        {
          name: "dashboard.coachingSessions",
          path: "/dashboard/opportunities/coaching",
        },
      ],
    },
    {
      id: "learning",
      name: "nav.community",
      icon: "learning",
      path: "/dashboard/learning",
      submenu: [
        {
          name: "dashboard.courseCatalog",
          path: "/dashboard/learning/courses",
        },
        { name: "dashboard.resumeBuilder", path: "/dashboard/resumes" },
        {
          name: "dashboard.resourceLibrary",
          path: "/dashboard/learning/library",
        },
      ],
    },
    {
      id: "assessments",
      name: "dashboard.assessmentProgress",
      icon: "assessments",
      path: "/dashboard/assessments",
    },
    {
      id: "subscriptions",
      name: "nav.community",
      icon: "subscriptions",
      path: "/dashboard/subscriptions",
    },
  ],
};
