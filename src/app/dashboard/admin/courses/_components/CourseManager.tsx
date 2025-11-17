"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCourses } from "@/data/mockCourses";
import { adminCreateCourse, adminUpdateCourse, adminDeleteCourse } from '@/services/courseService';
import { useQueryClient } from '@tanstack/react-query';
import { courseKeys } from '@/hooks/useCourseQueries';
import { Course } from "@/types/course";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { CourseFormDialog } from "./CourseFormDialog";
import { CourseImportDialog } from "./CourseImportDialog";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export function CourseManager() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const queryClient = useQueryClient(); // Added queryClient initialization
  const { t } = useTranslation();
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setIsCreating(false);
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleDelete = (courseId: string) => {
    if (
      confirm(
        t("admin.courses.confirmDelete") ||
          "Are you sure you want to delete this course?"
      )
    ) {
      setCourses(courses.filter((c) => c.id !== courseId));
    }
        adminDeleteCourse(courseId).then(() => queryClient.invalidateQueries({ queryKey: courseKeys.list() })); // Ensure cache invalidation
  };

  const handleToggleActive = (courseId: string) => {
    setCourses(
      courses.map((c) =>
        c.id === courseId ? { ...c, isActive: !c.isActive } : c
      )
    );
    // Persist the change to the mock service
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      adminUpdateCourse(courseId, { isActive: !course.isActive }).then(() => queryClient.invalidateQueries({ queryKey: courseKeys.list() }));
    }
  };

  const handleSave = (course: Course) => {
    if (isCreating) {
      // Create on mock service and update state with returned id
      adminCreateCourse(course).then((created) => {
        setCourses([...courses, created]);
        queryClient.invalidateQueries({ queryKey: courseKeys.list() });
      });
    } else {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
      adminUpdateCourse(course.id, course).then(() => queryClient.invalidateQueries({ queryKey: courseKeys.list() }));
    }
    setIsFormOpen(false);
  };

  const handleImport = async (url: string) => {
    // Mock import - in real implementation, call POST /api/courses/import
    console.log("Importing from URL:", url);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // For now, just show success - backend will handle actual import
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">
              All Courses ({filteredCourses.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <CourseImportDialog onImport={handleImport} />
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                {t("admin.courses.header.addCourse")}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.course")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.provider")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.difficulty")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.enrollments")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin.courses.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <motion.tr key={course.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {course.duration} weeks
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.provider}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : course.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(course.id)}
                        className="flex items-center gap-1"
                      >
                        {course.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            course.isActive ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {course.isActive
                            ? t("admin.courses.status.active")
                            : t("admin.courses.status.inactive")}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {course.enrollmentCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Course Form Dialog */}
      <CourseFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        course={selectedCourse}
        isCreating={isCreating}
      />
    </div>
  );
}
