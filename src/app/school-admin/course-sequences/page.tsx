"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Network, Plus, Loader2, Trash2, Users, PenSquare } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useCourseSequences,
  useCreateCourseSequence,
  useDeleteCourseSequence,
} from "@/hooks/useCourseSequenceQueries";

export default function CourseSequencesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading } = useCourseSequences({ page, limit: 20, search: search || undefined });
  const create = useCreateCourseSequence();
  const remove = useDeleteCourseSequence();

  const handleCreate = () => {
    if (!name) { toast.error("Name is required"); return; }
    create.mutate(
      { name, description, nodes: [], edges: [], columns: [] },
      {
        onSuccess: () => { toast.success("Sequence created"); setAddOpen(false); setName(""); setDescription(""); },
        onError: () => toast.error("Failed to create sequence"),
      }
    );
  };

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[400px] w-full" /></div>);
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.sequences.title", "Course Sequences")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.sequences.subtitle", "Build multi-year course plans and assign them to students.")}
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-4 items-center">
        <Input placeholder="Search sequences..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-sm" />
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white ml-auto">
              <Plus className="h-4 w-4 mr-1" />New Sequence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Course Sequence</DialogTitle>
              <DialogDescription>Define a multi-year course plan pathway</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="STEM Track" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course sequence for STEM-focused students" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={create.isPending} className="bg-teal-600 text-white">
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Sequences Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((seq) => (
            <Card key={seq.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Network className="h-5 w-5 text-teal-600" />
                    {seq.name}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(seq.id, { onSuccess: () => toast.success("Deleted") })}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                {seq.description && <CardDescription>{seq.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{seq.studentCount} students</span>
                  <span>by {seq.createdByName}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Modified {new Date(seq.lastModified).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                    onClick={() => router.push(`/school-admin/course-sequences/${seq.id}/builder`)}
                  >
                    <PenSquare className="h-3 w-3 mr-1" />Open Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!data?.data || data.data.length === 0) && (
            <div className="col-span-full text-center py-16">
              <Network className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No course sequences yet. Create one to get started.</p>
            </div>
          )}
        </div>
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
