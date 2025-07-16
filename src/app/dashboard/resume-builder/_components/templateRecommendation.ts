import { UserProfile, TemplateRecommendation } from "@/store/useGlobalStore";
import { resumeTemplates } from "./resumeData";

/**
 * Calculate template suitability score based on user profile
 */
export function calculateTemplateSuitability(
  userProfile: UserProfile,
  template: (typeof resumeTemplates)[0]
): number {
  let score = 0;

  // Career level matching (40% weight)
  if (template.suitableFor.careerLevels.includes(userProfile.careerLevel)) {
    score += 40;
  } else {
    // Partial credit for adjacent career levels
    const careerLevelOrder = [
      "entry-level",
      "mid-career",
      "senior",
      "executive",
    ];
    const userIndex = careerLevelOrder.indexOf(userProfile.careerLevel);
    const templateLevels = template.suitableFor.careerLevels.map((level) =>
      careerLevelOrder.indexOf(level)
    );

    const minDistance = Math.min(
      ...templateLevels.map((index) => Math.abs(userIndex - index))
    );

    if (minDistance === 1) {
      score += 20; // Adjacent level gets half credit
    } else if (minDistance === 2) {
      score += 10; // Two levels away gets quarter credit
    }
  }

  // Industry matching (30% weight)
  if (template.suitableFor.industries.includes(userProfile.industry)) {
    score += 30;
  } else {
    // Partial credit for related industries
    const industryRelations: Record<string, string[]> = {
      Technology: ["Startups", "Research"],
      Finance: ["Consulting", "Legal"],
      Healthcare: ["Research", "Education"],
      Marketing: ["Media", "Advertising", "Design"],
      Design: ["Arts", "Media", "Creative"],
      Education: ["Research", "Non-profit"],
      Legal: ["Government", "Finance"],
      Consulting: ["Finance", "Technology"],
    };

    const relatedIndustries = industryRelations[userProfile.industry] || [];
    const hasRelatedIndustry = template.suitableFor.industries.some(
      (industry) => relatedIndustries.includes(industry)
    );

    if (hasRelatedIndustry) {
      score += 15; // Half credit for related industries
    }
  }

  // Employment status matching (20% weight)
  if (
    template.suitableFor.employmentStatuses.includes(
      userProfile.employmentStatus
    )
  ) {
    score += 20;
  } else {
    // Partial credit for compatible employment statuses
    const statusCompatibility: Record<string, string[]> = {
      student: ["unemployed"],
      unemployed: ["student", "career-change"],
      employed: ["career-change"],
      "career-change": ["unemployed", "employed"],
    };

    const compatibleStatuses =
      statusCompatibility[userProfile.employmentStatus] || [];
    const hasCompatibleStatus = template.suitableFor.employmentStatuses.some(
      (status) => compatibleStatuses.includes(status)
    );

    if (hasCompatibleStatus) {
      score += 10; // Half credit for compatible statuses
    }
  }

  // Experience level bonus (10% weight)
  if (userProfile.hasWorkExperience && template.features.atsOptimized) {
    score += 5; // ATS optimization bonus for experienced candidates
  }

  if (!userProfile.hasWorkExperience && template.category === "creative") {
    score += 5; // Creative templates bonus for entry-level/students
  }

  if (userProfile.yearsOfExperience >= 10 && template.features.layoutFlexible) {
    score += 3; // Layout flexibility bonus for senior professionals
  }

  if (
    userProfile.yearsOfExperience <= 2 &&
    template.features.singlePageOptimized
  ) {
    score += 2; // Single page optimization bonus for entry-level
  }

  return Math.min(score, 100);
}

/**
 * Generate reasoning for template recommendation
 */
export function generateTemplateReasoning(
  userProfile: UserProfile,
  template: (typeof resumeTemplates)[0],
  score: number
): string[] {
  const reasons: string[] = [];

  // Career level reasoning
  if (template.suitableFor.careerLevels.includes(userProfile.careerLevel)) {
    reasons.push(
      `Perfect match for ${userProfile.careerLevel.replace(
        "-",
        " "
      )} professionals`
    );
  }

  // Industry reasoning
  if (template.suitableFor.industries.includes(userProfile.industry)) {
    reasons.push(`Highly suitable for ${userProfile.industry} industry`);
  }

  // Employment status reasoning
  if (
    template.suitableFor.employmentStatuses.includes(
      userProfile.employmentStatus
    )
  ) {
    const statusLabels = {
      student: "students",
      employed: "working professionals",
      unemployed: "job seekers",
      "career-change": "career changers",
    };
    reasons.push(`Designed for ${statusLabels[userProfile.employmentStatus]}`);
  }

  // Feature-based reasoning
  if (userProfile.hasWorkExperience && template.features.atsOptimized) {
    reasons.push(
      "ATS-optimized for better applicant tracking system compatibility"
    );
  }

  if (template.features.singlePageOptimized) {
    reasons.push("Optimized for single-page format preferred by recruiters");
  }

  if (
    template.features.colorCustomizable &&
    userProfile.industry === "Design"
  ) {
    reasons.push("Customizable colors to showcase your design sensibility");
  }

  if (
    template.category === "traditional" &&
    ["Finance", "Legal", "Government"].includes(userProfile.industry)
  ) {
    reasons.push("Conservative design preferred in traditional industries");
  }

  if (template.category === "modern" && userProfile.yearsOfExperience >= 5) {
    reasons.push("Modern design that reflects your professional growth");
  }

  if (template.category === "creative" && !userProfile.hasWorkExperience) {
    reasons.push(
      "Creative layout helps you stand out as an entry-level candidate"
    );
  }

  // Score-based reasoning
  if (score >= 90) {
    reasons.unshift("Excellent match for your profile");
  } else if (score >= 70) {
    reasons.unshift("Very good match for your background");
  } else if (score >= 50) {
    reasons.unshift("Good option that could work well");
  } else {
    reasons.unshift("Alternative option with some compatibility");
  }

  return reasons.slice(0, 4); // Limit to 4 reasons for readability
}

/**
 * Get template recommendations for a user profile
 */
export function getTemplateRecommendations(
  userProfile: UserProfile,
  currentTemplateId?: string
): TemplateRecommendation[] {
  const recommendations: TemplateRecommendation[] = [];

  for (const template of resumeTemplates) {
    const suitabilityScore = calculateTemplateSuitability(
      userProfile,
      template
    );
    const reasoning = generateTemplateReasoning(
      userProfile,
      template,
      suitabilityScore
    );

    recommendations.push({
      templateId: template.id,
      suitabilityScore,
      reasoning,
      isCurrentDesign: template.id === currentTemplateId,
      isRecommended: false, // Will be set to true for the top recommendation
      preview: {
        thumbnailUrl: template.preview,
        sampleContent: generateSampleContent(userProfile, template),
      },
    });
  }

  // Sort by suitability score (highest first)
  recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  // Mark the top recommendation as recommended
  if (recommendations.length > 0) {
    recommendations[0].isRecommended = true;
  }

  // Ensure current design is included if specified
  if (currentTemplateId) {
    const currentTemplateIndex = recommendations.findIndex(
      (r) => r.isCurrentDesign
    );
    if (currentTemplateIndex > 4) {
      // Move current template to top 5 if it's not already there
      const currentTemplate = recommendations.splice(
        currentTemplateIndex,
        1
      )[0];
      recommendations.splice(4, 0, currentTemplate);
    }
  }

  // Return top 5 recommendations
  return recommendations.slice(0, 5);
}

/**
 * Generate sample content for template preview
 */
function generateSampleContent(
  userProfile: UserProfile,
  template: (typeof resumeTemplates)[0]
): Partial<any> {
  const sampleContent = {
    personalInfo: {
      fullName: "Your Name",
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "Your City, State",
      linkedin: "linkedin.com/in/yourname",
      website: "yourwebsite.com",
      summary: generateSampleSummary(userProfile),
    },
    experience: generateSampleExperience(userProfile),
    education: generateSampleEducation(userProfile),
    skills: generateSampleSkills(userProfile),
  };

  return sampleContent;
}

/**
 * Generate sample summary based on user profile
 */
function generateSampleSummary(userProfile: UserProfile): string {
  const careerLevelDescriptions = {
    "entry-level": "Motivated recent graduate",
    "mid-career": "Experienced professional",
    senior: "Senior-level expert",
    executive: "Executive leader",
  };

  const industryDescriptions = {
    Technology: "in software development and technology solutions",
    Finance: "in financial services and analysis",
    Healthcare: "in healthcare and patient care",
    Marketing: "in marketing and brand management",
    Design: "in creative design and user experience",
    Education: "in education and training",
    Legal: "in legal services and compliance",
    Consulting: "in business consulting and strategy",
  };

  const baseDescription =
    careerLevelDescriptions[userProfile.careerLevel] || "Professional";
  const industryDescription =
    industryDescriptions[
      userProfile.industry as keyof typeof industryDescriptions
    ] || `in ${userProfile.industry}`;

  return `${baseDescription} with ${userProfile.yearsOfExperience}+ years of experience ${industryDescription}. Proven track record of delivering results and driving innovation.`;
}

/**
 * Generate sample experience based on user profile
 */
function generateSampleExperience(userProfile: UserProfile): any[] {
  if (!userProfile.hasWorkExperience) {
    return [];
  }

  const sampleJobs = {
    Technology: ["Software Engineer", "Product Manager", "Data Analyst"],
    Finance: ["Financial Analyst", "Investment Advisor", "Risk Manager"],
    Healthcare: [
      "Healthcare Coordinator",
      "Medical Assistant",
      "Clinical Researcher",
    ],
    Marketing: ["Marketing Specialist", "Brand Manager", "Digital Marketer"],
    Design: ["UX Designer", "Graphic Designer", "Creative Director"],
    Education: ["Teacher", "Curriculum Developer", "Education Coordinator"],
    Legal: ["Legal Assistant", "Paralegal", "Compliance Officer"],
    Consulting: ["Business Consultant", "Strategy Analyst", "Project Manager"],
  };

  const jobs = sampleJobs[userProfile.industry as keyof typeof sampleJobs] || [
    "Professional",
    "Specialist",
    "Coordinator",
  ];
  const jobTitle =
    userProfile.targetRole ||
    jobs[
      Math.min(Math.floor(userProfile.yearsOfExperience / 3), jobs.length - 1)
    ];

  return [
    {
      id: "1",
      jobTitle,
      company: "Your Company",
      location: "City, State",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      description: [
        "Led key initiatives that improved efficiency by 25%",
        "Collaborated with cross-functional teams to deliver projects on time",
        "Developed and implemented strategic solutions for complex challenges",
      ],
    },
  ];
}

/**
 * Generate sample education based on user profile
 */
function generateSampleEducation(userProfile: UserProfile): any[] {
  const degreeTypes = {
    "entry-level": "Bachelor of Science",
    "mid-career": "Bachelor of Science",
    senior: "Master of Science",
    executive: "Master of Business Administration",
  };

  const fieldOfStudy = {
    Technology: "Computer Science",
    Finance: "Finance",
    Healthcare: "Health Sciences",
    Marketing: "Marketing",
    Design: "Design",
    Education: "Education",
    Legal: "Legal Studies",
    Consulting: "Business Administration",
  };

  const degree = degreeTypes[userProfile.careerLevel];
  const field =
    fieldOfStudy[userProfile.industry as keyof typeof fieldOfStudy] ||
    "Business";

  return [
    {
      id: "1",
      degree: `${degree} in ${field}`,
      institution: "Your University",
      location: "City, State",
      graduationDate: "2020",
      gpa: userProfile.careerLevel === "entry-level" ? "3.8" : undefined,
    },
  ];
}

/**
 * Generate sample skills based on user profile
 */
function generateSampleSkills(userProfile: UserProfile): any[] {
  const skillsByIndustry = {
    Technology: ["JavaScript", "Python", "React", "Node.js", "SQL"],
    Finance: [
      "Financial Analysis",
      "Excel",
      "Bloomberg",
      "Risk Management",
      "Accounting",
    ],
    Healthcare: [
      "Patient Care",
      "Medical Records",
      "HIPAA Compliance",
      "Clinical Research",
    ],
    Marketing: [
      "Digital Marketing",
      "SEO",
      "Google Analytics",
      "Social Media",
      "Content Creation",
    ],
    Design: [
      "Adobe Creative Suite",
      "Figma",
      "UI/UX Design",
      "Prototyping",
      "User Research",
    ],
    Education: [
      "Curriculum Development",
      "Classroom Management",
      "Educational Technology",
    ],
    Legal: ["Legal Research", "Contract Review", "Compliance", "Documentation"],
    Consulting: [
      "Strategic Planning",
      "Data Analysis",
      "Client Management",
      "Presentation Skills",
    ],
  };

  const industrySkills = skillsByIndustry[
    userProfile.industry as keyof typeof skillsByIndustry
  ] || ["Communication", "Problem Solving", "Leadership"];

  return industrySkills.slice(0, 5).map((skill, index) => ({
    id: (index + 1).toString(),
    name: skill,
    category: "technical" as const,
    level:
      userProfile.yearsOfExperience >= 5
        ? ("advanced" as const)
        : ("intermediate" as const),
  }));
}

/**
 * Validate template recommendation results
 */
export function validateRecommendations(
  recommendations: TemplateRecommendation[]
): boolean {
  // Check that we have recommendations
  if (recommendations.length === 0) {
    return false;
  }

  // Check that scores are valid
  const hasValidScores = recommendations.every(
    (r) => r.suitabilityScore >= 0 && r.suitabilityScore <= 100
  );

  // Check that recommendations are sorted by score
  const isSorted = recommendations.every(
    (r, i) =>
      i === 0 || recommendations[i - 1].suitabilityScore >= r.suitabilityScore
  );

  // Check that each recommendation has reasoning
  const hasReasoning = recommendations.every(
    (r) => r.reasoning && r.reasoning.length > 0
  );

  return hasValidScores && isSorted && hasReasoning;
}
