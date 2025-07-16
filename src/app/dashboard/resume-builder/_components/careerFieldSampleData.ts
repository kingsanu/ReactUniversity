import { ResumeData } from '@/store/useGlobalStore';

export const careerFieldSampleData: Record<string, ResumeData> = {
  'software-engineering': {
    personalInfo: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson',
      website: 'alexjohnson.dev',
      summary: 'Full-stack software engineer with 3+ years building scalable web applications using React, Node.js, and cloud technologies. Passionate about clean code and user experience.'
    },
    experience: [
      {
        id: '1',
        jobTitle: 'Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        description: [
          'Developed React-based web applications serving 100K+ users',
          'Built RESTful APIs using Node.js, improving response times by 40%',
          'Implemented automated testing achieving 90% code coverage'
        ]
      },
      {
        id: '2',
        jobTitle: 'Junior Developer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        startDate: 'Jun 2021',
        endDate: 'Dec 2021',
        current: false,
        description: [
          'Built responsive web interfaces using HTML, CSS, and JavaScript',
          'Integrated third-party APIs and payment systems'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationDate: 'May 2021',
        gpa: '3.7'
      }
    ],
    skills: [
      { id: '1', name: 'JavaScript', category: 'technical', level: 'expert' },
      { id: '2', name: 'React', category: 'technical', level: 'expert' },
      { id: '3', name: 'Node.js', category: 'technical', level: 'advanced' },
      { id: '4', name: 'Python', category: 'technical', level: 'intermediate' },
      { id: '5', name: 'AWS', category: 'technical', level: 'intermediate' },
      { id: '6', name: 'Git', category: 'technical', level: 'expert' }
    ],
    template: 'modern'
  },

  'marketing': {
    personalInfo: {
      fullName: 'Sarah Martinez',
      email: 'sarah.martinez@email.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/sarahmartinez',
      website: '',
      summary: 'Creative marketing professional with 4+ years in digital marketing and brand management. Proven track record of increasing brand awareness and driving customer engagement through data-driven strategies.'
    },
    experience: [
      {
        id: '1',
        jobTitle: 'Digital Marketing Manager',
        company: 'BrandCo Agency',
        location: 'New York, NY',
        startDate: 'Mar 2022',
        endDate: 'Present',
        current: true,
        description: [
          'Managed multi-channel marketing campaigns with budgets up to $500K',
          'Increased social media engagement by 150% through strategic content planning',
          'Led A/B testing initiatives that improved conversion rates by 25%'
        ]
      },
      {
        id: '2',
        jobTitle: 'Marketing Coordinator',
        company: 'Growth Dynamics',
        location: 'New York, NY',
        startDate: 'Jan 2020',
        endDate: 'Feb 2022',
        current: false,
        description: [
          'Executed email marketing campaigns with 35% open rates',
          'Managed social media accounts across multiple platforms'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Arts in Marketing',
        institution: 'New York University',
        location: 'New York, NY',
        graduationDate: 'Dec 2019',
        gpa: '3.8'
      }
    ],
    skills: [
      { id: '1', name: 'Digital Marketing', category: 'technical', level: 'expert' },
      { id: '2', name: 'Google Analytics', category: 'technical', level: 'advanced' },
      { id: '3', name: 'Social Media Marketing', category: 'technical', level: 'expert' },
      { id: '4', name: 'Content Strategy', category: 'soft', level: 'advanced' },
      { id: '5', name: 'Adobe Creative Suite', category: 'technical', level: 'intermediate' },
      { id: '6', name: 'Project Management', category: 'soft', level: 'advanced' }
    ],
    template: 'creative'
  },

  'finance': {
    personalInfo: {
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      linkedin: 'linkedin.com/in/michaelchen',
      website: '',
      summary: 'Detail-oriented financial analyst with 5+ years in investment analysis, financial modeling, and risk assessment. Strong background in corporate finance with a track record of delivering actionable insights.'
    },
    experience: [
      {
        id: '1',
        jobTitle: 'Senior Financial Analyst',
        company: 'Goldman Sachs',
        location: 'Chicago, IL',
        startDate: 'Aug 2021',
        endDate: 'Present',
        current: true,
        description: [
          'Conducted financial analysis and valuation for M&A transactions worth $2B+',
          'Built complex financial models to support investment decisions',
          'Prepared detailed reports and presentations for senior management'
        ]
      },
      {
        id: '2',
        jobTitle: 'Financial Analyst',
        company: 'JPMorgan Chase',
        location: 'Chicago, IL',
        startDate: 'Jun 2019',
        endDate: 'Jul 2021',
        current: false,
        description: [
          'Analyzed financial statements and market data for equity research',
          'Supported portfolio managers with investment recommendations',
          'Maintained financial databases and reporting systems'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Business Administration (MBA)',
        institution: 'University of Chicago Booth School',
        location: 'Chicago, IL',
        graduationDate: 'Jun 2019',
        gpa: '3.9'
      },
      {
        id: '2',
        degree: 'Bachelor of Science in Finance',
        institution: 'Northwestern University',
        location: 'Evanston, IL',
        graduationDate: 'May 2017',
        gpa: '3.7'
      }
    ],
    skills: [
      { id: '1', name: 'Financial Modeling', category: 'technical', level: 'expert' },
      { id: '2', name: 'Excel', category: 'technical', level: 'expert' },
      { id: '3', name: 'Bloomberg Terminal', category: 'technical', level: 'advanced' },
      { id: '4', name: 'Risk Analysis', category: 'technical', level: 'advanced' },
      { id: '5', name: 'SQL', category: 'technical', level: 'intermediate' },
      { id: '6', name: 'Presentation Skills', category: 'soft', level: 'advanced' }
    ],
    template: 'classic'
  },

  'entry-level': {
    personalInfo: {
      fullName: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '+1 (555) 321-9876',
      location: 'Austin, TX',
      linkedin: 'linkedin.com/in/emmarodriguez',
      website: '',
      summary: 'Recent Business Administration graduate with strong analytical skills and internship experience. Eager to apply academic knowledge and contribute to a dynamic team.'
    },
    experience: [
      {
        id: '1',
        jobTitle: 'Marketing Intern',
        company: 'Local Business Solutions',
        location: 'Austin, TX',
        startDate: 'Jun 2023',
        endDate: 'Aug 2023',
        current: false,
        description: [
          'Assisted with social media content creation and scheduling',
          'Conducted market research and competitor analysis',
          'Created presentations and reports for marketing campaigns'
        ]
      },
      {
        id: '2',
        jobTitle: 'Customer Service Representative',
        company: 'RetailCorp (Part-time)',
        location: 'Austin, TX',
        startDate: 'Sep 2022',
        endDate: 'May 2023',
        current: false,
        description: [
          'Provided excellent customer service in fast-paced retail environment',
          'Handled cash transactions and inventory management',
          'Trained new team members on company policies and procedures'
        ]
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Business Administration',
        institution: 'University of Texas at Austin',
        location: 'Austin, TX',
        graduationDate: 'May 2023',
        gpa: '3.6'
      }
    ],
    skills: [
      { id: '1', name: 'Microsoft Office', category: 'technical', level: 'advanced' },
      { id: '2', name: 'Communication', category: 'soft', level: 'advanced' },
      { id: '3', name: 'Problem Solving', category: 'soft', level: 'intermediate' },
      { id: '4', name: 'Teamwork', category: 'soft', level: 'advanced' },
      { id: '5', name: 'Time Management', category: 'soft', level: 'intermediate' },
      { id: '6', name: 'Social Media', category: 'technical', level: 'intermediate' }
    ],
    template: 'minimal'
  },

  'fresh-graduate': {
    personalInfo: {
      fullName: 'Jordan Smith',
      email: 'jordan.smith@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Denver, CO',
      linkedin: 'linkedin.com/in/jordansmith',
      website: '',
      summary: 'Recent Computer Science graduate with strong problem-solving skills and passion for technology. Completed relevant coursework and projects in software development.'
    },
    experience: [], // No work experience for fresh graduates
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Colorado',
        location: 'Boulder, CO',
        graduationDate: 'May 2024',
        gpa: '3.5'
      }
    ],
    skills: [
      { id: '1', name: 'Programming', category: 'technical', level: 'intermediate' },
      { id: '2', name: 'Problem Solving', category: 'soft', level: 'advanced' },
      { id: '3', name: 'Communication', category: 'soft', level: 'intermediate' },
      { id: '4', name: 'Teamwork', category: 'soft', level: 'advanced' }
    ],
    template: 'minimal'
  }
};

export function getSampleDataForCareerField(careerField: string): ResumeData {
  // Use fresh-graduate template for students or entry-level without experience
  if (careerField === 'student' || careerField === 'fresh-graduate') {
    return careerFieldSampleData['fresh-graduate'];
  }
  return careerFieldSampleData[careerField] || careerFieldSampleData['entry-level'];
}
