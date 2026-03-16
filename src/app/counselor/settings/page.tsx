"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarIntegrationPanel } from "@/components/shared/CalendarIntegrationPanel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getCounselorAvailability, updateCounselorAvailability } from "@/services/counselorSessionService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMEZONES = ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];

function generateTimeOptions() {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}
const TIME_OPTIONS = generateTimeOptions();

interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: { start: string; end: string }[];
}

export default function CounselorSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState("UTC");
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(d => ({ day: d, enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] }))
  );

  useEffect(() => {
    getCounselorAvailability()
      .then(data => {
        setTimezone(data.timezone || "UTC");
        if (data.weeklySchedule?.length) {
          setSchedule(
            DAYS.map(day => {
              const existing = data.weeklySchedule.find(
                (d: any) => d.day.toLowerCase() === day.toLowerCase()
              );
              return existing
                ? { day, enabled: existing.enabled, timeSlots: existing.timeSlots?.length ? existing.timeSlots : [{ start: "09:00", end: "17:00" }] }
                : { day, enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] };
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (day: string) =>
    setSchedule(s => s.map(d => d.day === day ? { ...d, enabled: !d.enabled } : d));

  const addSlot = (day: string) =>
    setSchedule(s => s.map(d => d.day === day ? { ...d, timeSlots: [...d.timeSlots, { start: "09:00", end: "17:00" }] } : d));

  const removeSlot = (day: string, idx: number) =>
    setSchedule(s => s.map(d => d.day === day ? { ...d, timeSlots: d.timeSlots.filter((_, i) => i !== idx) } : d));

  const updateSlot = (day: string, idx: number, field: "start" | "end", value: string) =>
    setSchedule(s => s.map(d => d.day === day ? { ...d, timeSlots: d.timeSlots.map((ts, i) => i === idx ? { ...ts, [field]: value } : ts) } : d));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCounselorAvailability({ timezone, weeklySchedule: schedule });
      toast.success("Availability saved!");
    } catch (e: any) {
      toast.error(e.message || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600">Settings</h1>
          <p className="text-indigo-900/60 mt-1">Manage your counselor preferences and integrations.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        {/* Calendar Integration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border-none p-6">
          <CalendarIntegrationPanel />
        </div>

        {/* Session Availability */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Session Availability</CardTitle>
                  <CardDescription>Set when students can book counseling sessions with you</CardDescription>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving || loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Timezone */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <Label className="text-sm font-medium text-gray-700 min-w-20">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-56 border-gray-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => <SelectItem key={tz} value={tz}>{tz.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="space-y-3">
                {schedule.map(({ day, enabled, timeSlots }) => (
                  <div key={day} className={`rounded-xl border transition-colors ${enabled ? "border-indigo-200 bg-indigo-50/50" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-4 px-4 py-3">
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => toggleDay(day)}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                      <span className={`text-sm font-semibold min-w-[90px] ${enabled ? "text-indigo-800" : "text-gray-400"}`}>{day}</span>
                      {!enabled && <Badge variant="secondary" className="text-xs">Unavailable</Badge>}
                      {enabled && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addSlot(day)}
                          className="ml-auto text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 h-7 px-2 text-xs rounded-lg"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />Add Slot
                        </Button>
                      )}
                    </div>
                    {enabled && timeSlots.map((ts, i) => (
                      <div key={i} className="px-4 pb-3 flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <Select value={ts.start} onValueChange={v => updateSlot(day, i, "start", v)}>
                            <SelectTrigger className="w-28 h-8 text-xs border-indigo-200 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <span className="text-gray-400 text-sm">→</span>
                          <Select value={ts.end} onValueChange={v => updateSlot(day, i, "end", v)}>
                            <SelectTrigger className="w-28 h-8 text-xs border-indigo-200 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        {timeSlots.length > 1 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            onClick={() => removeSlot(day, i)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
