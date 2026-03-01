"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Sparkles, Lightbulb, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyCoursePlan,
  useMyCourseRecommendations,
  useSubmitChangeRequest,
  useCancelChangeRequest,
  useMyChangeRequests,
} from "@/hooks/useCoursePlanQueries";
import { SequenceBuilder } from "@/components/course-plan/SequenceBuilder";
import { cn } from "@/lib/utils";
import type { CourseChangeRequestPayload } from "@/types/coursePlan";

export default function CoursePlanPage() {
  const { t } = useTranslation();
  const { data: planData, isLoading } = useMyCoursePlan();
  const { data: recommendations, isLoading: loadingRecs } = useMyCourseRecommendations();
  const submitRequest = useSubmitChangeRequest();
  const cancelRequest = useCancelChangeRequest();
  const { data: changeRequestsData } = useMyChangeRequests();

  const [showRecommendations, setShowRecommendations] = useState(false);

  const pendingRequests = changeRequestsData?.data ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("coursePlan.title", "My Course Sequence")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "coursePlan.subtitle",
              "View your 4-year course plan. Request changes — your counselor will review and approve them."
            )}
          </p>
        </div>
        <Button
          variant={showRecommendations ? "default" : "outline"}
          onClick={() => setShowRecommendations(!showRecommendations)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {t("coursePlan.aiRecommendations", "AI Recommendations")}
        </Button>
      </motion.div>

      {/* AI Recommendations Panel */}
      {showRecommendations && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Card className="border-indigo-200 bg-indigo-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-indigo-900">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
                {t("coursePlan.recommendedCourses", "AI-Recommended Courses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRecs ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.courseId}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{rec.courseName}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              rec.priority === "high"
                                ? "border-red-300 text-red-700"
                                : rec.priority === "medium"
                                ? "border-amber-300 text-amber-700"
                                : "border-gray-300 text-gray-700"
                            )}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{rec.reason}</p>
                        <p className="text-xs text-gray-400">{rec.credits} credits</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          submitRequest.mutate({
                            courseId: rec.courseId,
                            courseCode: rec.courseCode,
                            courseName: rec.courseName,
                            credits: rec.credits,
                            gradeLevel: planData?.plan?.gradeLevel ?? 9,
                            semester: rec.semester ?? "Fall",
                            action: "add",
                          } satisfies CourseChangeRequestPayload)
                        }
                        disabled={submitRequest.isPending}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {t("coursePlan.request", "Request")}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {t(
                    "coursePlan.noRecommendations",
                    "No recommendations available yet. Complete your assessments first."
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sequence Builder */}
      <SequenceBuilder
        planData={planData}
        isLoading={isLoading}
        mode="student"
        onSubmitRequest={(payload) =>
          submitRequest.mutate(payload satisfies CourseChangeRequestPayload)
        }
        isSubmitPending={submitRequest.isPending}
        onCancelRequest={(requestId) => cancelRequest.mutate(requestId)}
        pendingRequests={pendingRequests}
      />
    </div>
  );
}
