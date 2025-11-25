"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Coach } from "@/types/coach";
import { toast } from "sonner";
import { format } from "date-fns";
import { Clock, Video, Globe, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  coach: Coach | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock time slots
const TIME_SLOTS = [
  "09:00am", "09:30am", "10:00am", "10:30am",
  "11:00am", "11:30am", "12:00pm", "12:30pm",
  "01:00pm", "01:30pm", "02:00pm", "02:30pm",
  "03:00pm", "03:30pm", "04:00pm", "04:30pm"
];

export function BookingModal({ coach, isOpen, onClose }: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [step, setStep] = useState<"date-time" | "details">("date-time");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("date-time");
      setSelectedTime(null);
      setTopic("");
      setDate(new Date());
    }
  }, [isOpen]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleBook = async () => {
    if (!date || !selectedTime || !topic || !coach) {
      toast.error("Please fill in all fields");
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

      toast.success(`Session booked with ${coach?.name} on ${format(date, "PPP")} at ${selectedTime}`);
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book session. Please try again.");
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
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              <Avatar className="h-14 w-14 mb-4 border border-gray-100 shadow-sm">
                <AvatarImage src={coach.image} alt={coach.name} />
                <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-gray-500 text-sm font-medium mb-1">Coach</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{coach.name}</h3>
              <p className="text-gray-900 font-semibold text-xl mb-6">30 Min Meeting</p>
              
              <div className="space-y-4 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium">30 min</span>
                </div>
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-medium">Google Meet</span>
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
                <div className="flex-1 p-8 border-r border-gray-100 flex flex-col items-center justify-start pt-10">
                  <h2 className="text-lg font-semibold mb-6 w-full text-left pl-4">Select a Date & Time</h2>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-between pt-1 relative items-center mb-4 px-2",
                      caption_label: "text-base font-medium text-gray-900",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors"
                      ),
                      nav_button_previous: "",
                      nav_button_next: "",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex mb-2",
                      head_cell: "text-gray-400 rounded-md w-10 font-normal text-[0.8rem] uppercase tracking-wider",
                      row: "flex w-full mt-2",
                      cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: cn(
                        "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
                      ),
                      day_selected: "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white font-medium shadow-md",
                      day_today: "bg-gray-50 text-gray-900 font-semibold",
                      day_outside: "text-gray-300 opacity-50",
                      day_disabled: "text-gray-300 opacity-50",
                      day_hidden: "invisible",
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </div>

                {/* Column 3: Time Slots */}
                <div className="w-full md:w-[280px] p-6 bg-white flex flex-col h-[550px]">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-gray-900 font-medium">
                      {date ? format(date, "EEEE, MMM d") : "Select date"}
                    </h4>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2.5">
                    {date ? (
                      TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="w-full justify-center border border-gray-200 text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 h-11 transition-all rounded-md"
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Select a date
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Details Step
              <div className="flex-1 p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>
                <div className="max-w-md space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="topic" className="text-gray-700 font-medium">What would you like to discuss?</Label>
                    <Select onValueChange={setTopic} value={topic}>
                      <SelectTrigger className="h-11 border-gray-300 focus:ring-black focus:ring-offset-0">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="career-guidance">Career Guidance</SelectItem>
                        <SelectItem value="interview-prep">Interview Prep</SelectItem>
                        <SelectItem value="resume-review">Resume Review</SelectItem>
                        <SelectItem value="skill-development">Skill Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes" className="text-gray-700 font-medium">Additional Notes (Optional)</Label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      placeholder="Share anything that will help prepare for our meeting..."
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep("date-time")}
                      className="h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="h-11 px-8 bg-black text-white hover:bg-gray-800" 
                      onClick={handleBook}
                    >
                      Schedule Event
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
