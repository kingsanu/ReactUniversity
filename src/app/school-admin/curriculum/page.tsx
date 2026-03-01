"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen, Search, Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import {
  useFrameworks,
  useUpdateFrameworks,
  useFrameworkCourses,
} from "@/hooks/useCurriculumQueries";
import type { CurriculumFramework, FrameworkType } from "@/types/curriculum";

export default function CurriculumPage() {
  const { t } = useTranslation();
  const { data: frameworks, isLoading } = useFrameworks();
  const updateFrameworks = useUpdateFrameworks();
  const [selectedType, setSelectedType] = useState<FrameworkType | "">("");
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePage, setCoursePage] = useState(1);

  const { data: courses, isLoading: coursesLoading } = useFrameworkCourses(
    selectedType as string,
    { page: coursePage, limit: 20, search: courseSearch || undefined }
  );

  const handleToggle = (framework: CurriculumFramework) => {
    if (!frameworks) return;
    const updated = frameworks.map((f) =>
      f.type === framework.type ? { type: f.type, enabled: !f.enabled } : { type: f.type, enabled: f.enabled }
    );
    updateFrameworks.mutate(
      { frameworks: updated },
      {
        onSuccess: () => toast.success(t("schoolAdmin.curriculum.updated", "Frameworks updated")),
        onError: () => toast.error(t("schoolAdmin.curriculum.error", "Failed to update")),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.curriculum.title", "Curriculum Frameworks")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.curriculum.subtitle", "Enable and configure AP, IB, National, and custom curriculum frameworks.")}
        </p>
      </motion.div>

      {/* Framework Toggles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-teal-600" />
              {t("schoolAdmin.curriculum.frameworksTitle", "Active Frameworks")}
            </CardTitle>
            <CardDescription>
              {t("schoolAdmin.curriculum.frameworksDesc", "Toggle which curriculum frameworks are available for your school.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {frameworks?.map((fw) => (
                <div
                  key={fw.type}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    fw.enabled ? "border-teal-300 bg-teal-50" : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => setSelectedType(fw.type)}
                >
                  <div>
                    <p className="font-semibold text-sm">{fw.label}</p>
                    <p className="text-xs text-gray-500">{fw.courseCount} courses</p>
                  </div>
                  <Switch
                    checked={fw.enabled}
                    onCheckedChange={() => handleToggle(fw)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Framework Courses */}
      {selectedType && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                {selectedType} {t("schoolAdmin.curriculum.courses", "Courses")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("schoolAdmin.curriculum.searchCourses", "Search courses...")}
                  value={courseSearch}
                  onChange={(e) => { setCourseSearch(e.target.value); setCoursePage(1); }}
                  className="pl-10"
                />
              </div>
              {coursesLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("schoolAdmin.curriculum.code", "Code")}</TableHead>
                      <TableHead>{t("schoolAdmin.curriculum.courseName", "Name")}</TableHead>
                      <TableHead>{t("schoolAdmin.curriculum.department", "Department")}</TableHead>
                      <TableHead>{t("schoolAdmin.curriculum.credits", "Credits")}</TableHead>
                      <TableHead>{t("schoolAdmin.curriculum.grades", "Grades")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses?.data?.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-sm">{c.code}</TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.department}</TableCell>
                        <TableCell>{c.credits}</TableCell>
                        <TableCell>
                          {c.gradeLevel.map((g) => (
                            <Badge key={g} variant="secondary" className="mr-1">{g}</Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!courses?.data || courses.data.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                          {t("schoolAdmin.curriculum.noCourses", "No courses found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              {courses && courses.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={coursePage <= 1} onClick={() => setCoursePage((p) => p - 1)}>
                    {t("common.previous", "Previous")}
                  </Button>
                  <span className="text-sm text-gray-500 self-center">{coursePage} / {courses.totalPages}</span>
                  <Button variant="outline" size="sm" disabled={coursePage >= courses.totalPages} onClick={() => setCoursePage((p) => p + 1)}>
                    {t("common.next", "Next")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
