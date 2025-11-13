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
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 overflow-hidden group">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={400}
              height={225}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
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
            <span
              className={`absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full font-semibold shadow-md z-20 ${getDifficultyColor(
                course.difficulty
              )}`}
            >
              {t(`courses.difficulty.${course.difficulty.toLowerCase()}`)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-5 flex flex-col">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 leading-tight">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {course.provider}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1 leading-relaxed">
            {course.shortDescription}
          </p>

          <div className="space-y-3 mb-5 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {formatRating(course.rating)}
                </span>
                <span className="text-gray-500">
                  ({course.reviewCount.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium">
                  {course.enrollmentCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">
                  {formatDuration(course.duration)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="font-medium">
                  {course.estimatedHours}h/week
                </span>
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
              variant={
                enrollmentStatus === "completed" ? "secondary" : "default"
              }
            >
              {enrollmentStatus === "completed"
                ? t("courses.reviewOnCoursera")
                : t("courses.startCourse")}
            </Button>
          </div>

          {isEnrolled &&
            enrollmentStatus !== "completed" &&
            onMarkCompleted && (
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
