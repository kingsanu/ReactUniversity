"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGlobalStore } from "@/store/useGlobalStore";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map((day) => ({
  day,
  enabled: ["Saturday", "Sunday"].includes(day) ? false : true,
  timeSlots: [{ start: "09:00", end: "17:00" }],
}));

interface AvailabilitySettingsTabProps {
  availability?: any | null;
  isLoading?: boolean;
  onUpdated?: (newData: any) => void;
}

export function AvailabilitySettingsTab({
  availability: parentAvailability,
  isLoading: parentLoading,
  onUpdated,
}: AvailabilitySettingsTabProps) {
  const { user } = useGlobalStore();
  const [timezone, setTimezone] = useState("UTC");
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        if (parentAvailability) {
          // Use parent-provided availability
          const data = parentAvailability;
          if (data) {
            if (data.timezone) setTimezone(data.timezone);
            if (data.weeklySchedule && data.weeklySchedule.length > 0) {
              const mergedSchedule = DEFAULT_SCHEDULE.map((defaultDay) => {
                const found = data.weeklySchedule.find(
                  (d: any) => d.day === defaultDay.day
                );
                return found || defaultDay;
              });
              setSchedule(mergedSchedule);
            }
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const { getAvailability } = await import("@/services/coachService");
        const data = await getAvailability();

        if (data) {
          if (data.timezone) setTimezone(data.timezone);
          if (data.weeklySchedule && data.weeklySchedule.length > 0) {
            // Merge with default to ensure all days exist
            const mergedSchedule = DEFAULT_SCHEDULE.map((defaultDay) => {
              const found = data.weeklySchedule.find(
                (d) => d.day === defaultDay.day
              );
              return found || defaultDay;
            });
            setSchedule(mergedSchedule);
          }
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
        // Don't show error toast on initial load if it's just empty
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchAvailability();
    }
  }, [user?.id]);

  const handleDayToggle = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    setSchedule(newSchedule);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.push({ start: "09:00", end: "17:00" });
    setSchedule(newSchedule);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setSchedule(newSchedule);
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { updateAvailability } = await import("@/services/coachService");

      await updateAvailability({
        timezone,
        weeklySchedule: schedule,
      });
      // Update parent-supplied data if callback provided
      if (onUpdated) onUpdated({ timezone, weeklySchedule: schedule });
      toast.success("Availability updated successfully");
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error("Failed to update availability");
    } finally {
      setIsSaving(false);
    }
  };

  if (parentLoading || isLoading) {
    return <div className="p-8 text-center">Loading availability...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Settings</CardTitle>
        <CardDescription>
          Set your weekly schedule and timezone for coaching sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Timezone Selection */}
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
              <SelectItem value="America/New_York">
                Eastern Time (US & Canada)
              </SelectItem>
              <SelectItem value="America/Chicago">
                Central Time (US & Canada)
              </SelectItem>
              <SelectItem value="America/Denver">
                Mountain Time (US & Canada)
              </SelectItem>
              <SelectItem value="America/Los_Angeles">
                Pacific Time (US & Canada)
              </SelectItem>
              <SelectItem value="Europe/London">London</SelectItem>
              <SelectItem value="Europe/Paris">Paris</SelectItem>
              <SelectItem value="Europe/Berlin">Berlin</SelectItem>
              <SelectItem value="Asia/Dubai">Dubai</SelectItem>
              <SelectItem value="Asia/Calcutta">
                India Standard Time (Kolkata)
              </SelectItem>
              <SelectItem value="Asia/Singapore">Singapore</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              <SelectItem value="Australia/Sydney">Sydney</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-6">
          <Label>Weekly Schedule</Label>
          <div className="space-y-4">
            {schedule.map((day, dayIndex) => (
              <div
                key={day.day}
                className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white"
              >
                <div className="flex items-center justify-between sm:w-40">
                  <div className="font-medium">{day.day}</div>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={() => handleDayToggle(dayIndex)}
                  />
                </div>

                {day.enabled ? (
                  <div className="flex-1 space-y-3">
                    {day.timeSlots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) =>
                              handleTimeChange(
                                dayIndex,
                                slotIndex,
                                "start",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              handleTimeChange(
                                dayIndex,
                                slotIndex,
                                "end",
                                e.target.value
                              )
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveTimeSlot(dayIndex, slotIndex)
                          }
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddTimeSlot(dayIndex)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Interval
                    </Button>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm italic py-2">
                    Unavailable
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
