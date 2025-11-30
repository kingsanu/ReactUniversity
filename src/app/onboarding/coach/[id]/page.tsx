"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep";
import { PricingStep } from "@/components/onboarding/PricingStep";
import { AvailabilityStep } from "@/components/onboarding/AvailabilityStep";
import { CalendarSyncStep } from "@/components/onboarding/CalendarSyncStep";
import { PasswordStep } from "@/components/onboarding/PasswordStep";
import { CoachOnboardingData, INITIAL_ONBOARDING_DATA } from "@/components/onboarding/types";
import { toast } from "sonner";

const STEPS = [
  {
    title: "Personal Information",
    description: "Tell us about yourself and your coaching expertise.",
  },
  {
    title: "Pricing",
    description: "Set your hourly rate and currency.",
  },
  {
    title: "Availability",
    description: "Set your weekly schedule and timezone.",
  },
  {
    title: "Calendar Sync",
    description: "Connect your calendar to avoid double bookings.",
  },
  {
    title: "Set Password",
    description: "Secure your account with a password.",
  },
];

export default function CoachOnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CoachOnboardingData>(INITIAL_ONBOARDING_DATA);
  const [coachId, setCoachId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { getOnboardingStatus } = await import("@/services/coachService");
        const status = await getOnboardingStatus(id);
        setCoachId(status.userId);
        
        // Pre-fill data if available
        setData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            name: status.name || prev.personalInfo.name,
          },
        }));
      } catch (error) {
        console.error("Failed to fetch onboarding status:", error);
        // toast.error("Failed to verify invitation.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [id, router]);

  const handleNext = async (stepData: Partial<CoachOnboardingData>) => {
    const newData = { ...data, ...stepData };
    setData(newData);

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit data
      await handleSubmit(newData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalData: CoachOnboardingData) => {
    try {
      setIsLoading(true);
      const { submitOnboardingData } = await import("@/services/coachService");
      
      // Transform data to match API expectation
      const apiData = {
        ...finalData,
        calendarIntegrations: {
          google: { connected: finalData.calendarIntegrations.google },
          outlook: { connected: finalData.calendarIntegrations.outlook }
        }
      };



      if (!coachId) {
        throw new Error("Coach ID not found");
      }

      const response = await submitOnboardingData(coachId, apiData);
      
      console.log("Onboarding submitted:", response);
      toast.success("Onboarding completed successfully!");
      
      // Redirect to dashboard
      router.push(response.redirectUrl || `/dashboard/coaching/dashboard`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit onboarding data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const stepInfo = STEPS[currentStep - 1];

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={STEPS.length}
      title={stepInfo.title}
      description={stepInfo.description}
    >
      {currentStep === 1 && (
        <PersonalInfoStep
          data={data.personalInfo}
          onNext={(personalInfo) => handleNext({ personalInfo })}
        />
      )}
      {currentStep === 2 && (
        <PricingStep
          data={data.pricing}
          onNext={(pricing) => handleNext({ pricing })}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <AvailabilityStep
          data={data.availability}
          onNext={(availability) => handleNext({ availability })}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <CalendarSyncStep
          data={data.calendarIntegrations}
          onNext={(calendarIntegrations) => handleNext({ calendarIntegrations })}
          onBack={handleBack}
        />
      )}
      {currentStep === 5 && (
        <PasswordStep
          value={data.password || ""}
          onNext={(password) => handleNext({ password })}
          onBack={handleBack}
        />
      )}
    </OnboardingLayout>
  );
}
