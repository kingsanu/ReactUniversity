"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { getSampleDataForCareerField } from './careerFieldSampleData';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  FileText,
  Lightbulb,
  Star,
  Wand2,
} from "lucide-react";

export function PersonalInfoStep() {
  const { resumeBuilder, updatePersonalInfo, populateWithSampleData } = useGlobalStore();
  const { personalInfo } = resumeBuilder.data;
  const { userProfile } = resumeBuilder;

  const handleInputChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handlePopulateSampleData = () => {
    // Map industry to career field for sample data
    const industryToCareerField: Record<string, string> = {
      'Technology': 'software-engineering',
      'Finance': 'finance',
      'Marketing': 'marketing',
      'Design': 'marketing',
      'Media': 'marketing',
      'Arts': 'marketing',
      'Advertising': 'marketing',
      'Healthcare': 'entry-level',
      'Education': 'entry-level',
      'Legal': 'finance',
      'Consulting': 'finance',
    };

    const careerField = userProfile?.industry
      ? industryToCareerField[userProfile.industry] || 'entry-level'
      : 'entry-level';

    const sampleData = getSampleDataForCareerField(careerField);
    populateWithSampleData(sampleData);
  };

  // Profile-aware guidance
  const getProfileGuidance = () => {
    if (!userProfile) return null;

    const guidance = {
      title: "",
      description: "",
      summaryPlaceholder: "",
      summaryTips: [] as string[],
      priorityFields: [] as string[],
    };

    switch (userProfile.careerLevel) {
      case "entry-level":
        guidance.title = "Building Your Professional Foundation";
        guidance.description =
          "Focus on your potential and educational achievements";
        guidance.summaryPlaceholder = `Recent ${
          userProfile.industry
        } graduate with strong foundation in [key skills]. Passionate about [specific area] and eager to contribute to [type of role]. Seeking opportunities to apply academic knowledge and grow professionally in ${userProfile.industry.toLowerCase()}.`;
        guidance.summaryTips = [
          "Highlight your degree and relevant coursework",
          "Mention any internships, projects, or volunteer work",
          "Show enthusiasm and willingness to learn",
          "Include specific skills relevant to your target role",
        ];
        guidance.priorityFields = ["fullName", "email", "phone", "linkedin"];
        break;

      case "mid-career":
        guidance.title = "Showcasing Your Growing Expertise";
        guidance.description =
          "Highlight your proven track record and expanding skills";
        guidance.summaryPlaceholder = `Experienced ${
          userProfile.industry
        } professional with ${
          userProfile.yearsOfExperience
        }+ years of proven success in [specific areas]. Track record of [key achievements] and expertise in [core skills]. Looking to leverage experience in ${
          userProfile.targetRole || "advanced role"
        }.`;
        guidance.summaryTips = [
          "Lead with your years of experience",
          "Mention specific achievements and metrics",
          "Highlight leadership or mentoring experience",
          "Show career progression and growth",
        ];
        guidance.priorityFields = [
          "fullName",
          "email",
          "phone",
          "linkedin",
          "website",
        ];
        break;

      case "senior":
        guidance.title = "Demonstrating Senior Leadership";
        guidance.description =
          "Emphasize your strategic impact and leadership experience";
        guidance.summaryPlaceholder = `Senior ${userProfile.industry} leader with ${userProfile.yearsOfExperience}+ years of strategic experience. Proven ability to [key leadership areas] and drive organizational success. Expert in [specialized skills] with history of [major achievements].`;
        guidance.summaryTips = [
          "Focus on strategic contributions and leadership",
          "Quantify your impact on business outcomes",
          "Highlight team management and mentoring",
          "Show industry expertise and thought leadership",
        ];
        guidance.priorityFields = [
          "fullName",
          "email",
          "phone",
          "linkedin",
          "website",
        ];
        break;

      case "executive":
        guidance.title = "Executive Leadership Profile";
        guidance.description =
          "Showcase your executive presence and organizational impact";
        guidance.summaryPlaceholder = `Executive leader with ${userProfile.yearsOfExperience}+ years of transformational experience in ${userProfile.industry}. Proven track record of [major business outcomes] and strategic vision. Expert in [executive competencies] with history of driving organizational growth and innovation.`;
        guidance.summaryTips = [
          "Lead with transformational achievements",
          "Highlight P&L responsibility and business impact",
          "Show board-level and stakeholder management",
          "Demonstrate industry thought leadership",
        ];
        guidance.priorityFields = [
          "fullName",
          "email",
          "phone",
          "linkedin",
          "website",
        ];
        break;
    }

    return guidance;
  };

  const guidance = getProfileGuidance();

  // Industry-specific field priorities
  const getIndustryFieldGuidance = () => {
    if (!userProfile) return {};

    const industryGuidance: Record<
      string,
      { website: string; linkedin: string }
    > = {
      Design: {
        website: "Portfolio website is crucial for design roles",
        linkedin: "Showcase your creative work and design process",
      },
      Technology: {
        website: "GitHub or personal website to showcase projects",
        linkedin: "Connect with tech professionals and showcase skills",
      },
      Marketing: {
        website: "Personal brand website or marketing portfolio",
        linkedin: "Essential for networking and showcasing campaigns",
      },
      Arts: {
        website: "Portfolio website to display your artistic work",
        linkedin: "Network with galleries, collectors, and other artists",
      },
    };

    return industryGuidance[userProfile.industry] || {};
  };

  const industryGuidance = getIndustryFieldGuidance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile-aware header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {guidance?.title || "Personal Information"}
        </h2>
        <p className="text-sm text-gray-600">
          {guidance?.description ||
            "Start with your basic contact information and a professional summary."}
        </p>
        {userProfile && (
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {userProfile.careerLevel.replace("-", " ")} •{" "}
              {userProfile.industry}
            </Badge>
            {userProfile.targetRole && (
              <Badge variant="secondary" className="text-xs">
                Target: {userProfile.targetRole}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Sample Data Button */}
      <div className="flex justify-center">
        <Button
          onClick={handlePopulateSampleData}
          variant="outline"
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
        >
          <Wand2 className="h-4 w-4" />
          <span>Fill with Sample Data</span>
        </Button>
      </div>

      {/* Priority fields guidance */}
      {guidance && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Star className="h-4 w-4 mr-2 text-blue-600" />
              Priority Fields for Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {guidance.priorityFields.map((field) => (
                <Badge key={field} variant="outline" className="text-xs">
                  {field === "fullName"
                    ? "Full Name"
                    : field === "email"
                    ? "Email"
                    : field === "phone"
                    ? "Phone"
                    : field === "linkedin"
                    ? "LinkedIn"
                    : field === "website"
                    ? "Website"
                    : field}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Full Name *
            {guidance?.priorityFields.includes("fullName") && (
              <Star className="h-3 w-3 ml-1 text-blue-500" />
            )}
          </Label>
          <Input
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address *
            {guidance?.priorityFields.includes("email") && (
              <Star className="h-3 w-3 ml-1 text-blue-500" />
            )}
          </Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john.doe@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Phone Number
            {guidance?.priorityFields.includes("phone") && (
              <Star className="h-3 w-3 ml-1 text-blue-500" />
            )}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, State"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn Profile
            {guidance?.priorityFields.includes("linkedin") && (
              <Star className="h-3 w-3 ml-1 text-blue-500" />
            )}
          </Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
          {industryGuidance.linkedin && (
            <p className="text-xs text-blue-600">{industryGuidance.linkedin}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Website/Portfolio
            {guidance?.priorityFields.includes("website") && (
              <Star className="h-3 w-3 ml-1 text-blue-500" />
            )}
          </Label>
          <Input
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            placeholder="www.johndoe.com"
          />
          {industryGuidance.website && (
            <p className="text-xs text-blue-600">{industryGuidance.website}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Professional Summary (Optional)
        </Label>
        <textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => handleInputChange("summary", e.target.value)}
          placeholder={
            guidance?.summaryPlaceholder ||
            "A brief 2-3 sentence overview highlighting your key skills, education, and career goals..."
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Profile-aware tips */}
        {guidance && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center text-yellow-800">
                <Lightbulb className="h-4 w-4 mr-2" />
                Summary Tips for {userProfile?.careerLevel.replace(
                  "-",
                  " "
                )}{" "}
                Professionals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-yellow-700 space-y-1">
                {guidance.summaryTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
