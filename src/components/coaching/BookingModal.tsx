"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Coach, DaySchedule, TimeSlot } from "@/types/coach";
import { toast } from "sonner";
import { format, getDay } from "date-fns";
import { Clock, Video, Globe, ChevronLeft, ChevronRight, Loader2, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BookingModalProps {
  coach: Coach | null;
  isOpen: boolean;
  onClose: () => void;
}

// Default fallback time slots (used when coach has no availability set)
const DEFAULT_TIME_SLOTS = [
  "09:00am", "09:30am", "10:00am", "10:30am",
  "11:00am", "11:30am", "12:00pm", "12:30pm",
  "01:00pm", "01:30pm", "02:00pm", "02:30pm",
  "03:00pm", "03:30pm", "04:00pm", "04:30pm"
];

// Day name mapping
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Generate 30-min slots from a time range
function generateSlotsFromRange(start: string, end: string): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const hour12 = currentHour % 12 || 12;
    const meridian = currentHour < 12 ? "am" : "pm";
    const timeStr = `${hour12.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}${meridian}`;
    slots.push(timeStr);
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
}

export function BookingModal({ coach, isOpen, onClose }: BookingModalProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [step, setStep] = useState<"date-time" | "details">("date-time");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get available slots based on coach availability and selected date
  const availableTimeSlots = useMemo(() => {
    if (!date || !coach?.availability?.weeklySchedule) {
      return DEFAULT_TIME_SLOTS;
    }

    const dayIndex = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    const dayName = DAY_NAMES[dayIndex];
    
    const daySchedule = coach.availability.weeklySchedule.find(
      (schedule: DaySchedule) => schedule.day === dayName && schedule.enabled
    );

    if (!daySchedule || !daySchedule.timeSlots || daySchedule.timeSlots.length === 0) {
      return []; // No availability on this day
    }

    // Generate slots from all time ranges for the day
    const allSlots: string[] = [];
    daySchedule.timeSlots.forEach((slot: TimeSlot) => {
      const slots = generateSlotsFromRange(slot.start, slot.end);
      allSlots.push(...slots);
    });

    return allSlots;
  }, [date, coach?.availability]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("date-time");
      setSelectedTime(null);
      setTopic("");
      setDate(new Date());
      setCurrentMonth(new Date());
    }
  }, [isOpen]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleBook = async () => {
    if (!date || !selectedTime || !topic || !coach) {
      toast.error(t("coaching.booking.fillAllFields"));
      return;
    }

    try {
      const { bookSession } = await import("@/services/coachService");
      
      // Construct start and end times
      // This is a simplification. In a real app, parse time string properly.
      // Assuming time is like "09:00am"
      const timeParts = selectedTime.match(/(\d+):(\d+)(am|pm)/i);
      if (!timeParts) return;
      
      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const meridian = timeParts[3].toLowerCase();
      
      if (meridian === 'pm' && hours < 12) hours += 12;
      if (meridian === 'am' && hours === 12) hours = 0;
      
      const startDate = new Date(date);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + 30); // 30 min duration
      
      await bookSession({
        coachId: coach.id,
        slot: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        topic,
        notes: "" // Add notes field to state if needed
      });

      toast.success(t("coaching.booking.successMessage", { name: coach?.name, date: format(date, "PPP"), time: selectedTime }));
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(t("coaching.booking.errorMessage"));
    }
  };

  if (!coach) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] w-full p-0 overflow-hidden gap-0 bg-white text-gray-900 border-gray-200 shadow-2xl rounded-xl">
        <div className="flex flex-col md:flex-row min-h-[550px]">
          {/* Column 1: Coach Info (Sidebar) */}
          <div className="w-full md:w-[280px] p-6 border-r border-gray-100 flex flex-col bg-white">
            <div className="mb-8">
              {step === "details" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep("date-time")}
                  className="mb-4 -ml-2 text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> {t("coaching.booking.back")}
                </Button>
              )}
              <Avatar className="h-14 w-14 mb-4 border border-gray-100 shadow-sm">
                <AvatarImage src={coach.image} alt={coach.name} />
                <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-gray-500 text-sm font-medium mb-1">{t("coaching.booking.coach")}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{coach.name}</h3>
              <p className="text-gray-900 font-semibold text-xl mb-6">{t("coaching.booking.meetingDuration")}</p>
              
              <div className="space-y-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium">{t("coaching.booking.duration")}</span>
                </div>
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium">{t("coaching.booking.platform")}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium">Asia/Kolkata</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:flex-row">
            {step === "date-time" ? (
              <>
                {/* Column 2: Calendar */}
                <div className="flex-1 p-6 border-r border-gray-100 flex flex-col">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">{t("coaching.booking.selectDateTime")}</h2>
                  
                  {/* Custom Calendar Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() - 1);
                        setCurrentMonth(newMonth);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-base font-semibold text-gray-900">
                      {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() + 1);
                        setCurrentMonth(newMonth);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setSelectedTime(null); // Reset time when date changes
                    }}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="p-0 mx-auto"
                    showOutsideDays={false}
                    classNames={{
                      months: "flex flex-col",
                      month: "space-y-2",
                      caption: "hidden", // Hide default caption since we use custom
                      nav: "hidden", // Hide default nav
                      month_grid: "w-full border-collapse",
                      weekdays: "flex justify-around mb-2",
                      weekday: "text-gray-400 font-medium text-xs uppercase w-10 text-center",
                      week: "flex justify-around w-full",
                      day: cn(
                        "h-10 w-10 text-center text-sm relative flex items-center justify-center",
                        "[&:has([aria-selected])]:bg-transparent"
                      ),
                      day_button: cn(
                        "h-10 w-10 p-0 font-normal rounded-full transition-all duration-200",
                        "hover:bg-blue-50 hover:text-blue-600",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      ),
                      selected: cn(
                        "!bg-blue-600 !text-white font-semibold",
                        "hover:!bg-blue-700 hover:!text-white",
                        "shadow-md"
                      ),
                      today: "bg-gray-100 text-gray-900 font-semibold",
                      outside: "text-gray-300 opacity-50 pointer-events-none",
                      disabled: "text-gray-300 opacity-50 cursor-not-allowed",
                      hidden: "invisible",
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                  
                  {/* Coach Timezone Info */}
                  {coach?.availability?.timezone && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{t("coaching.booking.timesShownIn", { timezone: coach.availability.timezone })}</span>
                    </div>
                  )}
                </div>

                {/* Column 3: Time Slots */}
                <div className="w-full md:w-[260px] p-5 bg-gray-50/50 flex flex-col h-[550px]">
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-900">
                      {date ? format(date, "EEEE, MMM d") : t("coaching.booking.selectDate")}
                    </h4>
                    {date && availableTimeSlots.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {t("coaching.booking.slotsAvailable", { count: availableTimeSlots.length })}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                    {!date ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
                        <p>{t("coaching.booking.selectDatePrompt")}</p>
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm text-center px-4">
                        <Clock className="h-12 w-12 mb-3 opacity-30" />
                        <p className="font-medium text-gray-600">{t("coaching.booking.noAvailability")}</p>
                        <p className="mt-1">{t("coaching.booking.noAvailabilityMessage")}</p>
                      </div>
                    ) : (
                      availableTimeSlots.map((time) => {
                        const isPast = (() => {
                          if (!date) return false;
                          const today = new Date();
                          const isToday = date.getDate() === today.getDate() &&
                                        date.getMonth() === today.getMonth() &&
                                        date.getFullYear() === today.getFullYear();
                          
                          if (!isToday) return false;

                          const timeParts = time.match(/(\d+):(\d+)(am|pm)/i);
                          if (!timeParts) return false;
                          
                          let hours = parseInt(timeParts[1]);
                          const minutes = parseInt(timeParts[2]);
                          const meridian = timeParts[3].toLowerCase();
                          
                          if (meridian === 'pm' && hours < 12) hours += 12;
                          if (meridian === 'am' && hours === 12) hours = 0;
                          
                          const slotDate = new Date(date);
                          slotDate.setHours(hours, minutes, 0, 0);
                          
                          return slotDate < new Date();
                        })();

                        const isSelected = selectedTime === time;

                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            disabled={isPast}
                            className={cn(
                              "w-full justify-center font-medium h-11 transition-all rounded-lg",
                              isSelected 
                                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md" 
                                : "border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700",
                              isPast && "opacity-40 cursor-not-allowed hover:bg-transparent hover:border-gray-200 hover:text-gray-400 text-gray-400"
                            )}
                            onClick={() => !isPast && handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Continue Button */}
                  {selectedTime && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium"
                        onClick={() => setStep("details")}
                      >
                        {t("coaching.booking.continue")}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Details Step
              <div className="flex-1 p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t("coaching.booking.enterDetails")}</h2>
                <div className="max-w-md space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="topic" className="text-gray-700 font-medium">{t("coaching.booking.topicLabel")}</Label>
                    <Select onValueChange={setTopic} value={topic}>
                      <SelectTrigger className="h-11 border-gray-300 focus:ring-black focus:ring-offset-0">
                        <SelectValue placeholder={t("coaching.booking.selectTopic")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="career-guidance">{t("coaching.booking.topics.careerGuidance")}</SelectItem>
                        <SelectItem value="interview-prep">{t("coaching.booking.topics.interviewPrep")}</SelectItem>
                        <SelectItem value="resume-review">{t("coaching.booking.topics.resumeReview")}</SelectItem>
                        <SelectItem value="skill-development">{t("coaching.booking.topics.skillDevelopment")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes" className="text-gray-700 font-medium">{t("coaching.booking.notesLabel")}</Label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder={t("coaching.booking.notesPlaceholder")}
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep("date-time")}
                      className="h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      {t("coaching.booking.cancel")}
                    </Button>
                    <Button 
                      className="h-11 px-8 bg-black text-white hover:bg-gray-800" 
                      onClick={handleBook}
                    >
                      {t("coaching.booking.scheduleEvent")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
