import {
  ResumeData,
  OptimizationSuggestion,
  ContentOptimizationState,
} from "@/store/useGlobalStore";

/**
 * Content Optimization Engine
 * Analyzes resume content and provides suggestions to fit single-page format
 */
export class ContentOptimizer {
  private maxPageHeight = 792; // PDF points for letter size (11 inches * 72 points/inch)
  private targetDensity = 0.85; // 85% page utilization for optimal readability
  private minDensity = 0.6; // Minimum content density
  private maxDensity = 0.95; // Maximum content density before overflow

  /**
   * Analyze resume content and generate optimization state
   */
  analyzeContent(
    data: ResumeData,
    template: string = "modern"
  ): ContentOptimizationState {
    const contentMetrics = this.calculateContentMetrics(data, template);
    const suggestions = this.generateOptimizationSuggestions(
      data,
      contentMetrics
    );

    return {
      currentPageCount: contentMetrics.estimatedPages,
      contentDensity: this.getContentDensityCategory(contentMetrics.density),
      suggestions,
      autoAppliedOptimizations: [],
    };
  }

  /**
   * Calculate content metrics for the resume
   */
  private calculateContentMetrics(data: ResumeData, template: string) {
    const metrics = {
      personalInfoHeight: this.estimatePersonalInfoHeight(data.personalInfo),
      summaryHeight: this.estimateSummaryHeight(data.personalInfo.summary),
      experienceHeight: this.estimateExperienceHeight(data.experience),
      educationHeight: this.estimateEducationHeight(data.education),
      skillsHeight: this.estimateSkillsHeight(data.skills),
      templateOverhead: this.getTemplateOverhead(template),
    };

    const totalHeight = Object.values(metrics).reduce(
      (sum, height) => sum + height,
      0
    );
    const estimatedPages = Math.ceil(totalHeight / this.maxPageHeight);
    const density = totalHeight / this.maxPageHeight;

    return {
      ...metrics,
      totalHeight,
      estimatedPages,
      density,
    };
  }

  /**
   * Estimate height for personal information section
   */
  private estimatePersonalInfoHeight(personalInfo: any): number {
    let height = 60; // Base height for name and contact info

    // Add height for each contact field
    const contactFields = ["email", "phone", "location", "linkedin", "website"];
    const filledFields = contactFields.filter((field) =>
      personalInfo[field]?.trim()
    );
    height += filledFields.length * 8; // 8 points per contact line

    return height;
  }

  /**
   * Estimate height for summary section
   */
  private estimateSummaryHeight(summary: string): number {
    if (!summary?.trim()) return 0;

    const wordCount = summary.trim().split(/\s+/).length;
    const avgWordsPerLine = 12; // Average words per line in resume format
    const lineHeight = 14; // Points per line
    const lines = Math.ceil(wordCount / avgWordsPerLine);

    return 20 + lines * lineHeight; // 20 points for section header + content
  }

  /**
   * Estimate height for experience section
   */
  private estimateExperienceHeight(experience: any[]): number {
    if (!experience?.length) return 0;

    let totalHeight = 25; // Section header

    experience.forEach((exp) => {
      totalHeight += 18; // Job title and company line
      totalHeight += 12; // Date and location line

      // Calculate description height
      if (exp.description?.length) {
        const totalDescriptionWords = exp.description.reduce(
          (sum: number, desc: string) =>
            sum + (desc?.trim().split(/\s+/).length || 0),
          0
        );
        const descriptionLines = Math.ceil(totalDescriptionWords / 10); // 10 words per line for bullet points
        totalHeight += descriptionLines * 12; // 12 points per line
      }

      totalHeight += 8; // Spacing between experiences
    });

    return totalHeight;
  }

  /**
   * Estimate height for education section
   */
  private estimateEducationHeight(education: any[]): number {
    if (!education?.length) return 0;

    let totalHeight = 25; // Section header

    education.forEach((edu) => {
      totalHeight += 14; // Degree line
      totalHeight += 12; // Institution and date line
      totalHeight += 6; // Spacing between entries
    });

    return totalHeight;
  }

  /**
   * Estimate height for skills section
   */
  private estimateSkillsHeight(skills: any[]): number {
    if (!skills?.length) return 0;

    const skillsPerLine = 4; // Average skills per line
    const lines = Math.ceil(skills.length / skillsPerLine);

    return 25 + lines * 16; // Section header + skill lines
  }

  /**
   * Get template-specific overhead (margins, spacing, etc.)
   */
  private getTemplateOverhead(template: string): number {
    const templateOverheads = {
      modern: 80,
      classic: 60,
      creative: 100,
      minimal: 50,
    };

    return templateOverheads[template as keyof typeof templateOverheads] || 70;
  }

  /**
   * Categorize content density
   */
  private getContentDensityCategory(
    density: number
  ): ContentOptimizationState["contentDensity"] {
    if (density < this.minDensity) return "sparse";
    if (density <= this.targetDensity) return "optimal";
    if (density <= this.maxDensity) return "dense";
    return "overflow";
  }

  /**
   * Generate optimization suggestions based on content analysis
   */
  private generateOptimizationSuggestions(
    data: ResumeData,
    metrics: any
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Check if content exceeds single page
    if (metrics.estimatedPages > 1) {
      suggestions.push(...this.getOverflowSuggestions(data, metrics));
    }

    // Check if content is too sparse
    if (metrics.density < this.minDensity) {
      suggestions.push(...this.getSparseSuggestions(data, metrics));
    }

    // General optimization suggestions
    suggestions.push(...this.getGeneralOptimizations(data, metrics));

    // Sort by impact (high impact first)
    return suggestions.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  /**
   * Generate suggestions for content overflow
   */
  private getOverflowSuggestions(
    data: ResumeData,
    metrics: any
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Summary optimization
    if (
      data.personalInfo.summary &&
      data.personalInfo.summary.split(/\s+/).length > 50
    ) {
      suggestions.push({
        type: "condense",
        section: "summary",
        description:
          "Shorten professional summary to 2-3 concise sentences (30-40 words)",
        impact: "medium",
        autoApplicable: false,
      });
    }

    // Experience optimization
    if (data.experience.length > 3) {
      suggestions.push({
        type: "prioritize",
        section: "experience",
        description:
          "Focus on most recent 3-4 positions, combine or remove older roles",
        impact: "high",
        autoApplicable: false,
      });
    }

    // Experience descriptions
    const verboseExperiences = data.experience.filter((exp) =>
      exp.description.some((desc) => desc.split(/\s+/).length > 20)
    );

    if (verboseExperiences.length > 0) {
      suggestions.push({
        type: "condense",
        section: "experience",
        description:
          "Shorten bullet points to 15-20 words each, focus on quantifiable achievements",
        impact: "high",
        autoApplicable: true,
      });
    }

    // Skills optimization
    if (data.skills.length > 15) {
      suggestions.push({
        type: "prioritize",
        section: "skills",
        description: "Limit to 10-12 most relevant skills for your target role",
        impact: "medium",
        autoApplicable: false,
      });
    }

    // Education optimization
    if (data.education.length > 2) {
      suggestions.push({
        type: "prioritize",
        section: "education",
        description:
          "Keep only highest degree and most relevant certifications",
        impact: "low",
        autoApplicable: false,
      });
    }

    return suggestions;
  }

  /**
   * Generate suggestions for sparse content
   */
  private getSparseSuggestions(
    data: ResumeData,
    metrics: any
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Expand summary if too short
    if (
      !data.personalInfo.summary ||
      data.personalInfo.summary.split(/\s+/).length < 20
    ) {
      suggestions.push({
        type: "expand",
        section: "summary",
        description:
          "Add a professional summary highlighting your key skills and career objectives",
        impact: "medium",
        autoApplicable: false,
      });
    }

    // Add more experience details
    const briefExperiences = data.experience.filter(
      (exp) =>
        exp.description.length < 3 ||
        exp.description.some((desc) => desc.split(/\s+/).length < 10)
    );

    if (briefExperiences.length > 0) {
      suggestions.push({
        type: "expand",
        section: "experience",
        description:
          "Add more detailed bullet points with quantifiable achievements and impact",
        impact: "high",
        autoApplicable: false,
      });
    }

    // Add more skills if too few
    if (data.skills.length < 8) {
      suggestions.push({
        type: "expand",
        section: "skills",
        description:
          "Add more relevant technical and soft skills to showcase your capabilities",
        impact: "medium",
        autoApplicable: false,
      });
    }

    return suggestions;
  }

  /**
   * Generate general optimization suggestions
   */
  private getGeneralOptimizations(
    data: ResumeData,
    metrics: any
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    // Check for missing contact information
    const missingContacts = [];
    if (!data.personalInfo.linkedin) missingContacts.push("LinkedIn");
    if (!data.personalInfo.phone) missingContacts.push("Phone");
    if (!data.personalInfo.location) missingContacts.push("Location");

    if (missingContacts.length > 0) {
      suggestions.push({
        type: "expand",
        section: "personal",
        description: `Add missing contact information: ${missingContacts.join(
          ", "
        )}`,
        impact: "low",
        autoApplicable: false,
      });
    }

    // Check for quantifiable achievements
    const experiencesWithoutNumbers = data.experience.filter((exp) =>
      exp.description.every((desc) => !/\d/.test(desc))
    );

    if (experiencesWithoutNumbers.length > 0) {
      suggestions.push({
        type: "expand",
        section: "experience",
        description:
          "Add quantifiable metrics (percentages, dollar amounts, team sizes) to demonstrate impact",
        impact: "high",
        autoApplicable: false,
      });
    }

    return suggestions;
  }

  /**
   * Apply automatic optimizations to resume data
   */
  applyOptimizations(
    data: ResumeData,
    optimizations: OptimizationSuggestion[]
  ): ResumeData {
    const optimizedData = JSON.parse(JSON.stringify(data)); // Deep clone

    optimizations.forEach((optimization) => {
      if (optimization.autoApplicable) {
        switch (optimization.type) {
          case "condense":
            if (optimization.section === "experience") {
              optimizedData.experience = this.condenseExperienceDescriptions(
                optimizedData.experience
              );
            }
            break;
          // Add more auto-applicable optimizations as needed
        }
      }
    });

    return optimizedData;
  }

  /**
   * Automatically condense experience descriptions
   */
  private condenseExperienceDescriptions(experience: any[]): any[] {
    return experience.map((exp) => ({
      ...exp,
      description: exp.description.map((desc: string) => {
        const words = desc.trim().split(/\s+/);
        if (words.length > 20) {
          // Keep first 18 words and add ellipsis if needed
          return words.slice(0, 18).join(" ") + "...";
        }
        return desc;
      }),
    }));
  }

  /**
   * Validate that optimized content fits on single page
   */
  validateSinglePage(data: ResumeData, template: string = "modern"): boolean {
    const metrics = this.calculateContentMetrics(data, template);
    return metrics.estimatedPages <= 1;
  }

  /**
   * Get content statistics for display
   */
  getContentStats(data: ResumeData): {
    wordCount: number;
    sectionCounts: Record<string, number>;
    estimatedReadTime: number;
  } {
    const wordCount = this.calculateTotalWordCount(data);

    return {
      wordCount,
      sectionCounts: {
        experience: data.experience.length,
        education: data.education.length,
        skills: data.skills.length,
      },
      estimatedReadTime: Math.ceil(wordCount / 200), // 200 words per minute reading speed
    };
  }

  /**
   * Calculate total word count across all sections
   */
  private calculateTotalWordCount(data: ResumeData): number {
    let totalWords = 0;

    // Personal info
    totalWords += data.personalInfo.summary?.split(/\s+/).length || 0;

    // Experience
    data.experience.forEach((exp) => {
      totalWords += exp.jobTitle.split(/\s+/).length;
      totalWords += exp.company.split(/\s+/).length;
      exp.description.forEach((desc) => {
        totalWords += desc.split(/\s+/).length;
      });
    });

    // Education
    data.education.forEach((edu) => {
      totalWords += edu.degree.split(/\s+/).length;
      totalWords += edu.institution.split(/\s+/).length;
    });

    // Skills
    data.skills.forEach((skill) => {
      totalWords += skill.name.split(/\s+/).length;
    });

    return totalWords;
  }
}
