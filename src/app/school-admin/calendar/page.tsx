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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Loader2, Trash2, CalendarDays, BookOpenCheck, SunMedium } from "lucide-react";
import { toast } from "sonner";
import {
  useAcademicYears,
  useCreateAcademicYear,
  useDeleteAcademicYear,
  useAssessmentPeriods,
  useCreateAssessmentPeriod,
  useDeleteAssessmentPeriod,
  useHolidays,
  useCreateHolidays,
  useDeleteHoliday,
} from "@/hooks/useCalendarQueries";
import type { AcademicYearPayload, AssessmentPeriodPayload, AssessmentType } from "@/types/calendar";

export default function CalendarPage() {
  const { t } = useTranslation();

  // Data hooks
  const { data: years, isLoading: yearsLoading } = useAcademicYears();
  const { data: periods, isLoading: periodsLoading } = useAssessmentPeriods();
  const { data: holidays, isLoading: holidaysLoading } = useHolidays();
  const createYear = useCreateAcademicYear();
  const deleteYear = useDeleteAcademicYear();
  const createPeriod = useCreateAssessmentPeriod();
  const deletePeriod = useDeleteAssessmentPeriod();
  const createHoliday = useCreateHolidays();
  const deleteHolidayMut = useDeleteHoliday();

  // Dialogs
  const [yearOpen, setYearOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [holidayOpen, setHolidayOpen] = useState(false);

  // Year form
  const [yearForm, setYearForm] = useState<AcademicYearPayload>({
    name: "", startDate: "", endDate: "",
    terms: [{ name: "Semester 1", startDate: "", endDate: "" }],
  });

  // Period form
  const [periodForm, setPeriodForm] = useState<AssessmentPeriodPayload>({
    name: "", termId: "", startDate: "", endDate: "", assessmentTypes: ["MIL"],
  });

  // Holiday form
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState<"national" | "school" | "custom">("school");

  const handleCreateYear = () => {
    createYear.mutate(yearForm, {
      onSuccess: () => { toast.success("Academic year created"); setYearOpen(false); },
      onError: () => toast.error("Failed to create"),
    });
  };

  const handleCreatePeriod = () => {
    createPeriod.mutate(periodForm, {
      onSuccess: () => { toast.success("Assessment period created"); setPeriodOpen(false); },
      onError: () => toast.error("Failed to create"),
    });
  };

  const handleCreateHoliday = () => {
    createHoliday.mutate(
      { holidays: [{ name: holidayName, date: holidayDate, type: holidayType }] },
      {
        onSuccess: () => { toast.success("Holiday added"); setHolidayOpen(false); setHolidayName(""); setHolidayDate(""); },
        onError: () => toast.error("Failed to add holiday"),
      }
    );
  };

  const isLoading = yearsLoading || periodsLoading || holidaysLoading;
  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-[500px] w-full" /></div>);
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("schoolAdmin.calendar.title", "Academic Calendar")}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t("schoolAdmin.calendar.subtitle", "Manage academic years, assessment windows, and holidays.")}
        </p>
      </motion.div>

      {/* Academic Years */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-teal-600" />Academic Years</CardTitle>
              <CardDescription>Define your academic year structure with terms/semesters</CardDescription>
            </div>
            <Dialog open={yearOpen} onOpenChange={setYearOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white"><Plus className="h-4 w-4 mr-1" />Add Year</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Academic Year</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={yearForm.name} onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })} placeholder="2025-2026" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={yearForm.startDate} onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="date" value={yearForm.endDate} onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setYearOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateYear} disabled={createYear.isPending} className="bg-teal-600 text-white">
                    {createYear.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {years?.map((y) => (
                <div key={y.id} className={`p-4 rounded-lg border-2 ${y.isCurrent ? "border-teal-400 bg-teal-50" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{y.name}</p>
                      {y.isCurrent && <Badge className="bg-teal-100 text-teal-700">Current</Badge>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteYear.mutate(y.id, { onSuccess: () => toast.success("Deleted") })}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(y.startDate).toLocaleDateString()} — {new Date(y.endDate).toLocaleDateString()}
                  </p>
                  {y.terms.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {y.terms.map((term) => (
                        <div key={term.id} className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                          {term.name}: {new Date(term.startDate).toLocaleDateString()} — {new Date(term.endDate).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!years || years.length === 0) && <p className="text-gray-400 col-span-2 text-center py-6">No academic years configured</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assessment Periods */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-teal-600" />Assessment Periods</CardTitle>
              <CardDescription>Configure when assessments (MIL, PCA, 360, TIMS) are available</CardDescription>
            </div>
            <Dialog open={periodOpen} onOpenChange={setPeriodOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white"><Plus className="h-4 w-4 mr-1" />Add Period</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Assessment Period</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={periodForm.name} onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Assessment Type</Label>
                    <Select value={periodForm.assessmentTypes[0]} onValueChange={(v) => setPeriodForm({ ...periodForm, assessmentTypes: [v as AssessmentType] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MIL">MIL</SelectItem>
                        <SelectItem value="PCA">PCA</SelectItem>
                        <SelectItem value="360">360</SelectItem>
                        <SelectItem value="TIMS">TIMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Start</Label><Input type="date" value={periodForm.startDate} onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })} /></div>
                    <div className="space-y-2"><Label>End</Label><Input type="date" value={periodForm.endDate} onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })} /></div>
                  </div>
                  {years && years.length > 0 && (
                    <div className="space-y-2">
                      <Label>Term</Label>
                      <Select value={periodForm.termId} onValueChange={(v) => setPeriodForm({ ...periodForm, termId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger>
                        <SelectContent>{years.flatMap((y) => y.terms).map((term) => <SelectItem key={term.id} value={term.id}>{term.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPeriodOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePeriod} disabled={createPeriod.isPending} className="bg-teal-600 text-white">
                    {createPeriod.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periods?.map((p) => (
                <div key={p.id} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {p.assessmentTypes.map((at) => <Badge key={at} variant="secondary">{at}</Badge>)}
                      <span className="font-medium text-sm">{p.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deletePeriod.mutate(p.id, { onSuccess: () => toast.success("Deleted") })}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(p.startDate).toLocaleDateString()} — {new Date(p.endDate).toLocaleDateString()}</p>
                </div>
              ))}
              {(!periods || periods.length === 0) && <p className="text-gray-400 col-span-3 text-center py-6">No assessment periods configured</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Holidays */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><SunMedium className="h-5 w-5 text-teal-600" />Holidays</CardTitle>
              <CardDescription>School holidays and non-instructional days</CardDescription>
            </div>
            <Dialog open={holidayOpen} onOpenChange={setHolidayOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white"><Plus className="h-4 w-4 mr-1" />Add Holiday</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Holiday</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={holidayName} onChange={(e) => setHolidayName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Date</Label><Input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={holidayType} onValueChange={(v) => setHolidayType(v as "national" | "school" | "custom")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setHolidayOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateHoliday} disabled={createHoliday.isPending} className="bg-teal-600 text-white">
                    {createHoliday.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {holidays?.map((h) => (
                <Badge key={h.id} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                  {h.name} ({new Date(h.date).toLocaleDateString()})
                  <button onClick={() => deleteHolidayMut.mutate(h.id, { onSuccess: () => toast.success("Removed") })} className="ml-1 text-red-400 hover:text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(!holidays || holidays.length === 0) && <p className="text-gray-400 text-center w-full py-6">No holidays defined</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
