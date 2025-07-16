import {
  calculateTemplateSuitability,
  generateTemplateReasoning,
  getTemplateRecommendations,
  validateRecommendations,
} from "../templateRecommendation";
import { UserProfile } from "@/store/useGlobalStore";
import { resumeTemplates } from "../resumeData";

// Mock user profiles for testing
const mockProfiles: Record<string, UserProfile> = {
  entryLevelTech: {
    careerLevel: "entry-level",
    employmentStatus: "student",
    industry: "Technology",
    targetRole: "Software Engineer",
    yearsOfExperience: 1,
    hasWorkExperience: true,
    profileScore: 85,
  },
  midCareerFinance: {
    careerLevel: "mid-career",
    employmentStatus: "employed",
    industry: "Finance",
    targetRole: "Financial Analyst",
    yearsOfExperience: 5,
    hasWorkExperience: true,
    profileScore: 90,
  },
  seniorCreative: {
    careerLevel: "senior",
    employmentStatus: "career-change",
    industry: "Design",
    targetRole: "Creative Director",
    yearsOfExperience: 12,
    hasWorkExperience: true,
    profileScore: 95,
  },
  executiveLegal: {
    careerLevel: "executive",
    employmentStatus: "employed",
    industry: "Legal",
    targetRole: "General Counsel",
    yearsOfExperience: 20,
    hasWorkExperience: true,
    profileScore: 100,
  },
  freshGraduate: {
    careerLevel: "entry-level",
    employmentStatus: "unemployed",
    industry: "Marketing",
    targetRole: "",
    yearsOfExperience: 0,
    hasWorkExperience: false,
    profileScore: 70,
  },
};

describe("Template Recommendation Algorithm", () => {
  describe("calculateTemplateSuitability", () => {
    test("should return high score for perfect match", () => {
      const profile = mockProfiles.midCareerFinance;
      const classicTemplate = resumeTemplates.find((t) => t.id === "classic")!;

      const score = calculateTemplateSuitability(profile, classicTemplate);

      expect(score).toBeGreaterThan(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    test("should return lower score for poor match", () => {
      const profile = mockProfiles.executiveLegal;
      const creativeTemplate = resumeTemplates.find(
        (t) => t.id === "creative"
      )!;

      const score = calculateTemplateSuitability(profile, creativeTemplate);

      expect(score).toBeLessThan(60);
    });

    test("should give bonus for ATS optimization with work experience", () => {
      const profile = mockProfiles.midCareerFinance;
      const modernTemplate = resumeTemplates.find((t) => t.id === "modern")!;

      const score = calculateTemplateSuitability(profile, modernTemplate);

      // Should get bonus points for ATS optimization
      expect(score).toBeGreaterThan(50);
    });

    test("should handle entry-level candidates appropriately", () => {
      const profile = mockProfiles.freshGraduate;
      const minimalTemplate = resumeTemplates.find((t) => t.id === "minimal")!;

      const score = calculateTemplateSuitability(profile, minimalTemplate);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test("should never return score above 100", () => {
      const profile = mockProfiles.seniorCreative;

      resumeTemplates.forEach((template) => {
        const score = calculateTemplateSuitability(profile, template);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    test("should never return negative score", () => {
      const profile = mockProfiles.executiveLegal;

      resumeTemplates.forEach((template) => {
        const score = calculateTemplateSuitability(profile, template);
        expect(score).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("generateTemplateReasoning", () => {
    test("should generate meaningful reasons for high-scoring match", () => {
      const profile = mockProfiles.midCareerFinance;
      const classicTemplate = resumeTemplates.find((t) => t.id === "classic")!;
      const score = 85;

      const reasons = generateTemplateReasoning(
        profile,
        classicTemplate,
        score
      );

      expect(reasons).toHaveLength(4);
      expect(reasons[0]).toContain("match");
      expect(
        reasons.some((r) => r.includes("Finance") || r.includes("mid-career"))
      ).toBe(true);
    });

    test("should include ATS reasoning for experienced candidates", () => {
      const profile = mockProfiles.seniorCreative;
      const modernTemplate = resumeTemplates.find((t) => t.id === "modern")!;
      const score = 75;

      const reasons = generateTemplateReasoning(profile, modernTemplate, score);

      expect(reasons.some((r) => r.includes("ATS"))).toBe(true);
    });

    test("should limit reasons to 4 items", () => {
      const profile = mockProfiles.executiveLegal;
      const classicTemplate = resumeTemplates.find((t) => t.id === "classic")!;
      const score = 90;

      const reasons = generateTemplateReasoning(
        profile,
        classicTemplate,
        score
      );

      expect(reasons.length).toBeLessThanOrEqual(4);
    });

    test("should provide different reasoning for different score ranges", () => {
      const profile = mockProfiles.entryLevelTech;
      const template = resumeTemplates[0];

      const highScoreReasons = generateTemplateReasoning(profile, template, 95);
      const lowScoreReasons = generateTemplateReasoning(profile, template, 45);

      expect(highScoreReasons[0]).not.toBe(lowScoreReasons[0]);
    });
  });

  describe("getTemplateRecommendations", () => {
    test("should return exactly 5 recommendations", () => {
      const profile = mockProfiles.midCareerFinance;

      const recommendations = getTemplateRecommendations(profile);

      expect(recommendations).toHaveLength(5);
    });

    test("should sort recommendations by suitability score", () => {
      const profile = mockProfiles.seniorCreative;

      const recommendations = getTemplateRecommendations(profile);

      for (let i = 1; i < recommendations.length; i++) {
        expect(recommendations[i - 1].suitabilityScore).toBeGreaterThanOrEqual(
          recommendations[i].suitabilityScore
        );
      }
    });

    test("should mark current design when specified", () => {
      const profile = mockProfiles.entryLevelTech;
      const currentTemplateId = "modern";

      const recommendations = getTemplateRecommendations(
        profile,
        currentTemplateId
      );

      const currentTemplate = recommendations.find((r) => r.isCurrentDesign);
      expect(currentTemplate).toBeDefined();
      expect(currentTemplate!.templateId).toBe(currentTemplateId);
    });

    test("should include current design in top 5 even if low scoring", () => {
      const profile = mockProfiles.executiveLegal; // Should score low on creative template
      const currentTemplateId = "creative";

      const recommendations = getTemplateRecommendations(
        profile,
        currentTemplateId
      );

      const currentTemplate = recommendations.find((r) => r.isCurrentDesign);
      expect(currentTemplate).toBeDefined();
      expect(recommendations).toHaveLength(5);
    });

    test("should generate sample content for each recommendation", () => {
      const profile = mockProfiles.midCareerFinance;

      const recommendations = getTemplateRecommendations(profile);

      recommendations.forEach((rec) => {
        expect(rec.preview.sampleContent).toBeDefined();
        expect(rec.preview.sampleContent.personalInfo).toBeDefined();
        expect(rec.preview.sampleContent.personalInfo.summary).toContain(
          profile.yearsOfExperience.toString()
        );
      });
    });

    test("should handle fresh graduates with no work experience", () => {
      const profile = mockProfiles.freshGraduate;

      const recommendations = getTemplateRecommendations(profile);

      expect(recommendations).toHaveLength(5);
      recommendations.forEach((rec) => {
        expect(rec.preview.sampleContent.experience).toEqual([]);
      });
    });
  });

  describe("validateRecommendations", () => {
    test("should validate correct recommendations", () => {
      const profile = mockProfiles.midCareerFinance;
      const recommendations = getTemplateRecommendations(profile);

      const isValid = validateRecommendations(recommendations);

      expect(isValid).toBe(true);
    });

    test("should reject empty recommendations", () => {
      const isValid = validateRecommendations([]);

      expect(isValid).toBe(false);
    });

    test("should reject recommendations with invalid scores", () => {
      const profile = mockProfiles.entryLevelTech;
      const recommendations = getTemplateRecommendations(profile);

      // Corrupt a score
      recommendations[0].suitabilityScore = 150;

      const isValid = validateRecommendations(recommendations);

      expect(isValid).toBe(false);
    });

    test("should reject unsorted recommendations", () => {
      const profile = mockProfiles.seniorCreative;
      const recommendations = getTemplateRecommendations(profile);

      // Mess up the sorting
      [recommendations[0], recommendations[1]] = [
        recommendations[1],
        recommendations[0],
      ];

      const isValid = validateRecommendations(recommendations);

      expect(isValid).toBe(false);
    });

    test("should reject recommendations without reasoning", () => {
      const profile = mockProfiles.executiveLegal;
      const recommendations = getTemplateRecommendations(profile);

      // Remove reasoning
      recommendations[0].reasoning = [];

      const isValid = validateRecommendations(recommendations);

      expect(isValid).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle unknown industry gracefully", () => {
      const profile: UserProfile = {
        ...mockProfiles.midCareerFinance,
        industry: "Unknown Industry",
      };

      const recommendations = getTemplateRecommendations(profile);

      expect(recommendations).toHaveLength(5);
      expect(validateRecommendations(recommendations)).toBe(true);
    });

    test("should handle extreme years of experience", () => {
      const profile: UserProfile = {
        ...mockProfiles.executiveLegal,
        yearsOfExperience: 50,
      };

      const recommendations = getTemplateRecommendations(profile);

      expect(recommendations).toHaveLength(5);
      recommendations.forEach((rec) => {
        expect(rec.suitabilityScore).toBeGreaterThanOrEqual(0);
        expect(rec.suitabilityScore).toBeLessThanOrEqual(100);
      });
    });

    test("should handle missing target role", () => {
      const profile: UserProfile = {
        ...mockProfiles.midCareerFinance,
        targetRole: undefined,
      };

      const recommendations = getTemplateRecommendations(profile);

      expect(recommendations).toHaveLength(5);
      expect(validateRecommendations(recommendations)).toBe(true);
    });
  });
});
