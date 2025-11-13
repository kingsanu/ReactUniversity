"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course, CourseEnrollment } from "@/types/course";
import { useTranslation } from "react-i18next";
import {
  Star,
  Clock,
  Users,
  Award,
  Globe,
  BookOpen,
  Target,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCourse: (course: Course) => void | Promise<void>;
  enrollment?: CourseEnrollment;
  onMarkCompleted?: (course: Course) => void | Promise<void>;
}

export function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  onStartCourse,
  enrollment,
  onMarkCompleted,
}: CourseDetailsModalProps) {
  const { t } = useTranslation();

  if (!course) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="border-b pb-4 px-6 pt-6 flex-shrink-0">
          <DialogTitle className="text-3xl font-bold text-gray-900 leading-tight">
            {course.title}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-8 pt-6 pb-6">
            {/* Course Image and Basic Info */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/5">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    width={560}
                    height={315}
                    className="w-full h-64 object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>

              <div className="md:w-3/5 space-y-5">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.provider}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {t("courses.by")} {course.instructor}
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed text-base">
                  {course.fullDescription}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      course.difficulty
                    )}`}
                  >
                    {t(`courses.difficulty.${course.difficulty.toLowerCase()}`)}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  {course.certificate && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {t("courses.certificate")}
                    </span>
                  )}
                  {enrollment && enrollment.status !== "completed" && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {t("courses.inProgress")}
                    </span>
                  )}
                  {enrollment?.status === "completed" && (
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t("courses.completed")}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {formatRating(course.rating)} ({course.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{course.language}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Objectives */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t("courses.learningObjectives")}
                </h4>
                <ul className="space-y-2">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {t("courses.prerequisites")}
                </h4>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {prerequisite}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Syllabus Preview */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t("courses.syllabus")}
              </h4>
              <div className="space-y-3">
                {course.syllabus.slice(0, 4).map((module) => (
                  <div
                    key={module.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {module.week}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {module.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {module.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {module.estimatedHours} {t("courses.hours")}
                      </p>
                    </div>
                  </div>
                ))}
                {course.syllabus.length > 4 && (
                  <p className="text-sm text-gray-600 text-center">
                    {t("courses.andMoreModules", {
                      count: course.syllabus.length - 4,
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Skills You'll Gain */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t("courses.skills")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t px-6 py-4 flex gap-4 flex-shrink-0 bg-white">
          <Button
            onClick={() => {
              void onStartCourse(course);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            {enrollment?.status === "completed"
              ? t("courses.reviewOnCoursera")
              : t("courses.startCourse")}
          </Button>
          {enrollment &&
            enrollment.status !== "completed" &&
            onMarkCompleted && (
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2"
                onClick={() => {
                  void onMarkCompleted(course);
                }}
              >
                <CheckCircle className="w-4 h-4" />
                {t("courses.markCompleted")}
              </Button>
            )}
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
