// Mock data that will be replaced with API calls later
export const dashboardData = {
  user: {
    name: "John Doe",
    avatar: "/api/placeholder/32/32"
  },
  
  competencyPlan: {
    title: "Competency Profit & Development Plan",
    date: "Tue, 14 Nov, 2022, 11:30 AM",
    categories: [
      { name: "Leadership", percentage: 54, color: "#3B82F6", trend: "up" },
      { name: "PCA/LIA/Interest", percentage: 20, color: "#10B981", trend: "up" },
      { name: "Thinking", percentage: 26, color: "#EF4444", trend: "down" },
      { name: "Technical Analytics", percentage: 28, color: "#8B5CF6", trend: "down" },
      { name: "Thinking", percentage: 26, color: "#F59E0B", trend: "down" }
    ]
  },

  actionCards: [
    {
      id: 1,
      title: "Start Course",
      subtitle: "Go to catalog",
      icon: "📚",
      action: "Browse Courses",
      link: "/dashboard/learning/courses",
      variant: "primary"
    },
    {
      id: 2,
      title: "Build Resume", 
      subtitle: "Create with AI assistance",
      icon: "📄",
      action: "Start Building",
      link: "/dashboard/resume-builder",
      variant: "secondary",
      badge: "WITH AI"
    },
    {
      id: 3,
      title: "Link Profile",
      subtitle: "Connect your accounts", 
      icon: "🔗",
      action: "Connect Now",
      link: "/dashboard/profile/connect",
      variant: "secondary"
    },
    {
      id: 4,
      title: "Schedule Coaching",
      subtitle: "Book a session", 
      icon: "👥",
      action: "Book Session",
      link: "/dashboard/coaching/schedule", 
      variant: "secondary"
    }
  ],

  opportunities: [
    {
      id: "01",
      catNo: "6465",
      driver: {
        name: "Sr. software developer",
        avatar: "/api/placeholder/32/32"
      },
      status: "Completed",
      statusColor: "green",
      rating: 5
    },
    {
      id: "02", 
      catNo: "5665",
      driver: {
        name: "Database Engineer",
        avatar: "/api/placeholder/32/32"
      },
      status: "Pending",
      statusColor: "blue",
      rating: 4
    },
    {
      id: "03",
      catNo: "1755", 
      driver: {
        name: "Network Engineer",
        avatar: "/api/placeholder/32/32"
      },
      status: "In route",
      statusColor: "red", 
      rating: 5
    }
  ],

  careerMatches: [
    {
      id: 1,
      title: "Sr. Software developer",
      company: "Creative Design Labs",
      progress: 85,
      icon: "💻"
    },
    {
      id: 2,
      title: "Python Text to speech", 
      company: "Microsoft",
      progress: 70,
      icon: "🐍"
    },
    {
      id: 3,
      title: "Database Engineer",
      company: "Softwire Inc.",
      progress: 65,
      icon: "🗄️"
    }
  ],

  benchmarks: {
    currentValue: 9460.00,
    change: -1.5,
    comparison: 9940,
    lastWeekIncome: 25658.00
  },

  milestones: {
    current: 9,
    total: 20,
    progress: 45, // percentage
    skills: [
      { name: "AI", color: "#3B82F6" },
      { name: "CurriDRAW", color: "#10B981" },
      { name: "InDesign", color: "#8B5CF6" },
      { name: "Canva", color: "#F59E0B" }
    ]
  },

  activity: {
    timeRange: "Mar 2022 - Oct 2022",
    data: [
      { month: "May", value: 240 },
      { month: "Jun", value: 180 },
      { month: "Jul", value: 280 },
      { month: "Aug", value: 220 },
      { month: "Sep", value: 260 },
      { month: "Oct", value: 200 }
    ],
    maxValue: 300
  }
};

export const sidebarData = {
  logo: {
    icon: "V",
    text: "UNIV.365"
  },
  
  navigation: [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "dashboard",
      path: "/dashboard"
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: "analytics", 
      path: "/dashboard/analytics",
      expanded: true,
      submenu: [
        { name: "Overview", path: "/dashboard/analytics/overview" },
        { name: "Subscription Metrics", path: "/dashboard/analytics/metrics" },
        { name: "Feedback & Results", path: "/dashboard/analytics/feedback" }
      ]
    },
    {
      id: "career-planning", 
      name: "Career Planning",
      icon: "career",
      path: "/dashboard/career-planning",
      expanded: false,
      submenu: [
        { name: "Career Paths Explorer", path: "/dashboard/career-planning/paths" },
        { name: "University Suggestions", path: "/dashboard/career-planning/university" },
        { name: "Assessments", path: "/dashboard/career-planning/assessments" },
        { name: "Progress Milestones", path: "/dashboard/career-planning/progress" },
        { name: "Benchmark", path: "/dashboard/career-planning/benchmark" }
      ]
    },
    {
      id: "opportunities",
      name: "Opportunities", 
      icon: "opportunities",
      path: "/dashboard/opportunities",
      submenu: [
        { name: "Job Openings", path: "/dashboard/opportunities/jobs" },
        { name: "Internship Opportunities", path: "/dashboard/opportunities/internships" },
        { name: "Mentorship Matches", path: "/dashboard/opportunities/mentorship" },
        { name: "Coaching Sessions", path: "/dashboard/opportunities/coaching" }
      ]
    },
    {
      id: "learning",
      name: "Learning & Tools",
      icon: "learning",
      path: "/dashboard/learning",
      submenu: [
        { name: "Course Catalog", path: "/dashboard/learning/courses" },
        { name: "Resume Builder", path: "/dashboard/learning/resume" },
        { name: "Resource Library", path: "/dashboard/learning/library" }
      ]
    },
    {
      id: "subscriptions",
      name: "Subscriptions",
      icon: "subscriptions",
      path: "/dashboard/subscriptions"
    }
  ]
};
