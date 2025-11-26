"use client";
import { useCallback, useMemo, useState } from "react";
import { CourseCard } from "./CourseCard";
import { CourseFilters } from "./CourseFilters";
import { CourseDetailsModal } from "./CourseDetailsModal";
import { SkeletonCourseCard } from "./SkeletonCourseCard";
import {
  Course,
  CourseFilter,
  CourseSortOption,
  CourseEnrollment,
} from "@/types/course";
import {
  mockCourses,
  mockCategories,
  mockLanguages,
  mockCountries,
  mockDifficulties,
  mockRegions,
} from "@/data/mockCourses";
import { useCourseList } from "@/hooks/useCourseQueries";
import { useTranslation } from "react-i18next";
import {
  enrollInCourse,
  trackCourseProgress,
  markCourseCompleted,
} from "../../../services/courseService";
import { Star, BookOpen, Search } from "lucide-react";
import { motion } from "motion/react";

export function CoursesCatalog() {
  const { t } = useTranslation();
  const { data, isLoading } = useCourseList();
  const courses = data?.courses || [];
  const [filters, setFilters] = useState<CourseFilter>({});
  const [sortBy, setSortBy] = useState<CourseSortOption>("recommended");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollments, setEnrollments] = useState<
    Record<string, CourseEnrollment>
  >({});

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm) ||
          course.shortDescription.toLowerCase().includes(searchTerm) ||
          course.provider.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(course.category)) return false;
      }

      // Language filter
      if (filters.language && filters.language.length > 0) {
        if (!filters.language.includes(course.language)) return false;
      }

      // Difficulty filter
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(course.difficulty)) return false;
      }

      // Country filter
      if (filters.country && filters.country.length > 0) {
        if (!filters.country.includes(course.country)) return false;
      }

      // Region filter
      if (filters.region && filters.region.length > 0) {
        if (!course.region || !filters.region.includes(course.region))
          return false;
      }

      return true;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recommended":
          return b.recommendedScore - a.recommendedScore;
        case "rating":
          return b.rating - a.rating;
        case "enrollment":
          return b.enrollmentCount - a.enrollmentCount;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "duration":
          return a.duration - b.duration;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, filters, sortBy]);

  // Get recommended courses (top 3 by score)
  const recommendedCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => b.recommendedScore - a.recommendedScore)
      .slice(0, 3);
  }, [courses]);

  const handleViewDetails = useCallback((course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  }, []);

  const handleStartCourse = useCallback(
    async (course: Course) => {
      try {
        const enrollment = await enrollInCourse({
          course,
          enrollmentSource: recommendedCourses.some((c) => c.id === course.id)
            ? "recommended"
            : "catalog",
        });

        setEnrollments((prev) => ({ ...prev, [course.id]: enrollment }));

        const progress = await trackCourseProgress({
          enrollmentId: enrollment.enrollmentId,
          completedModules: 0,
          totalModules: course.syllabus.length,
          percentage: 0,
          status: "in_progress",
          lastAccessedAt: new Date().toISOString(),
        });

        if (progress) {
          setEnrollments((prev) => ({ ...prev, [course.id]: progress }));
        }

        window.open(course.courseraUrl, "_blank");
      } catch (error) {
        console.error("Failed to start course", error);
      }
    },
    [recommendedCourses]
  );

  const handleMarkCompleted = useCallback(
    async (course: Course) => {
      const enrollment = enrollments[course.id];
      if (!enrollment) return;

      try {
        const updated = await markCourseCompleted({
          enrollmentId: enrollment.enrollmentId,
          completedAt: new Date().toISOString(),
        });
        if (updated) {
          setEnrollments((prev) => ({
            ...prev,
            [course.id]: updated,
          }));
        }
      } catch (error) {
        console.error("Failed to mark course completed", error);
      }
    },
    [enrollments]
  );

  const handleClearFilters = () => {
    setFilters({});
  };

  const availableFilters = {
    categories: mockCategories,
    languages: mockLanguages,
    difficulties: [...mockDifficulties],
    countries: mockCountries,
    regions: mockRegions,
  };

  return (
    <div className="">
      {/* Search & Filter Section */}
      <div className="bg-white rounded-2xl py-0  ">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {t("courses.searchAndFilter")}
              </h2>
              <p className="text-sm text-gray-600">
                Find courses that match your interests
              </p>
            </div>
          </div>
        </div>

        <CourseFilters
          filters={filters}
          sortBy={sortBy}
          onFiltersChange={setFilters}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          availableFilters={availableFilters}
          searchCandidates={courses}
        />
      </div>

      {/* Recommended Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {t("courses.recommendedForYou")}
            </h2>
            <p className="text-sm text-gray-600">
              Personalized courses based on your profile and interests
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06 * index }}
            >
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewDetails}
                onStartCourse={handleStartCourse}
                isRecommended={true}
                isEnrolled={Boolean(enrollments[course.id])}
                enrollmentStatus={enrollments[course.id]?.status}
                onMarkCompleted={handleMarkCompleted}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Courses Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {t("courses.allCourses")}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredAndSortedCourses.length} courses available
              </p>
            </div>
          </div>
        </div>

        {filteredAndSortedCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg mt-6">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              {t("courses.noCoursesFound")}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {t("courses.tryAdjustingFilters")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredAndSortedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.06 * index }}
              >
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={handleViewDetails}
                  onStartCourse={handleStartCourse}
                  isRecommended={recommendedCourses.some(
                    (rc) => rc.id === course.id
                  )}
                  isEnrolled={Boolean(enrollments[course.id])}
                  enrollmentStatus={enrollments[course.id]?.status}
                  onMarkCompleted={handleMarkCompleted}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredAndSortedCourses.length > 0 && (
          <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 font-medium">
              {t("courses.showingResults", {
                count: filteredAndSortedCourses.length,
                total: courses.length,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartCourse={handleStartCourse}
        enrollment={selectedCourse ? enrollments[selectedCourse.id] : undefined}
        onMarkCompleted={handleMarkCompleted}
      />
    </div>
  );
}
