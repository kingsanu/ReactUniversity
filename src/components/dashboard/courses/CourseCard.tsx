"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { useTranslation } from "react-i18next";
import { Star, Clock, Users, Award, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onStartCourse: (course: Course) => void | Promise<void>;
  isRecommended?: boolean;
  isEnrolled?: boolean;
  enrollmentStatus?: "enrolled" | "in_progress" | "completed" | "dropped";
  onMarkCompleted?: (course: Course) => void | Promise<void>;
}

export function CourseCard({
  course,
  onViewDetails,
  onStartCourse,
  isRecommended = false,
  isEnrolled = false,
  enrollmentStatus,
  onMarkCompleted,
}: CourseCardProps) {
  const { t } = useTranslation();

  const formatDuration = (weeks: number) => {
    return `${weeks} ${weeks === 1 ? t("courses.week") : t("courses.weeks")}`;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-0">
          <div className="relative">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {isRecommended && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                  {t("courses.recommended")}
                </span>
              )}
              {isEnrolled && enrollmentStatus !== "completed" && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                  {t("courses.inProgress")}
                </span>
              )}
              {enrollmentStatus === "completed" && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t("courses.completed")}
                </span>
              )}
            </div>
            <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(course.difficulty)}`}>
              {t(`courses.difficulty.${course.difficulty.toLowerCase()}`)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {course.provider}
            </p>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3 mb-4 flex-1">
            {course.shortDescription}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{formatRating(course.rating)}</span>
                <span>({course.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.enrollmentCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{course.estimatedHours}h/week</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(course)}
              className="flex-1"
            >
              {t("courses.viewDetails")}
            </Button>
            <Button
              size="sm"
              onClick={() => void onStartCourse(course)}
              className="flex-1"
              variant={enrollmentStatus === "completed" ? "secondary" : "default"}
            >
              {enrollmentStatus === "completed"
                ? t("courses.reviewOnCoursera")
                : t("courses.startCourse")}
            </Button>
          </div>

          {isEnrolled && enrollmentStatus !== "completed" && onMarkCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void onMarkCompleted(course)}
              className="mt-3 text-blue-600 hover:text-blue-700 justify-start"
            >
              {t("courses.markCompleted")}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}