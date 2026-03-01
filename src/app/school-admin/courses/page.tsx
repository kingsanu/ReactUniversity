"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, Search, Upload, Loader2, Trash2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  useSchoolCourses,
  useCreateSchoolCourse,
  useDeleteSchoolCourse,
  useImportSchoolCourses,
  useRecognizeAllUnmapped,
  useApplyAIMapping,
} from "@/hooks/useCurriculumQueries";
import type { SchoolCoursePayload, AIMappingAction, FrameworkType } from "@/types/curriculum";
import ImportJobStatusPanel from "@/components/school-admin/ImportJobStatusPanel";

export default function CoursesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [importCourseJobId, setImportCourseJobId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useSchoolCourses({
    search: search || undefined,
    department: department || undefined,
    page,
    limit: 20,
  });
  const createCourse = useCreateSchoolCourse();
  const deleteCourse = useDeleteSchoolCourse();
  const importCourses = useImportSchoolCourses();
  const recognizeAll = useRecognizeAllUnmapped();
  const applyMapping = useApplyAIMapping();

  // Course form
  const [form, setForm] = useState<SchoolCoursePayload>({
    code: "", name: "", department: "", credits: 1, gradeLevels: [9],
  });

  const handleCreate = () => {
    if (!form.code || !form.name) {
      toast.error("Code and name are required");
      return;
    }
    createCourse.mutate(form, {
      onSuccess: () => { toast.success("Course created"); setAddOpen(false); setForm({ code: "", name: "", department: "", credits: 1, gradeLevels: [9] }); },
      onError: () => toast.error("Failed to create course"),
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importCourses.mutate(file, {
      onSuccess: (result: any) => {
        const jobId = result?.jobId;
        if (jobId) {
          setImportCourseJobId(jobId);
          toast.success("Import started — tracking progress below");
        } else {
          toast.success(`Imported: ${result?.validRows ?? 0} valid, ${result?.invalidRows ?? 0} invalid`);
        }
      },
      onError: () => toast.error("Import failed"),
    });
  };

  const handleAIRecognize = () => {
    recognizeAll.mutate(undefined, {
      onSuccess: (result) => toast.success(`AI recognized ${result.results.length} courses`),
      onError: () => toast.error("AI recognition failed"),
    });
  };

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[500px] w-full" /></div>);
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.courses.title", "Course Catalog")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.courses.subtitle", "Manage your school courses, import from CSV, and use AI recognition.")}
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search courses..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Input placeholder="Filter by department" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} className="w-[180px]" />

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white"><Plus className="h-4 w-4 mr-1" />Add Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Course</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="MATH-101" /></div>
                <div className="space-y-2"><Label>Credits</Label><Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} /></div>
              </div>
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createCourse.isPending} className="bg-teal-600 text-white">
                {createCourse.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} hidden />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={importCourses.isPending}>
            {importCourses.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
            CSV Import
          </Button>
        </div>

        <Button variant="outline" onClick={handleAIRecognize} disabled={recognizeAll.isPending}>
          {recognizeAll.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
          AI Recognize
        </Button>
      </motion.div>

      {/* Import Job Polling Panel */}
      {importCourseJobId && (
        <ImportJobStatusPanel
          type="courses"
          jobId={importCourseJobId}
          onDone={() => setImportCourseJobId(null)}
        />
      )}
      {/* Courses Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-600" />
              Courses {data && <Badge variant="secondary">{data.total}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.department}</TableCell>
                    <TableCell>{c.credits}</TableCell>
                    <TableCell>
                      {c.frameworkType ? (
                        <Badge className="bg-blue-100 text-blue-700">{c.frameworkType}</Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCourse.mutate(c.id, { onSuccess: () => toast.success("Deleted") })}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.data || data.data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-12">No courses found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-gray-500 self-center">{page} / {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
