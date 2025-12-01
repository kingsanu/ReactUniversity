"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateInput } from "@/components/ui/datefield-rac";
import {
  DatePicker,
  Group,
  DateValue,
  Button as AriaButton,
  Popover as AriaPopover,
  Dialog as AriaDialog,
  Label as AriaLabel,
  Calendar,
} from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";

export function SingleInviteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contractStart, setContractStart] = useState<DateValue | null>(null);
  const [contractEnd, setContractEnd] = useState<DateValue | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !name) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const { inviteCoach } = await import("@/services/coachService");
      await inviteCoach({
        email,
        name,
        contractStart: contractStart ? contractStart.toString() : undefined,
        contractEnd: contractEnd ? contractEnd.toString() : undefined,
      });

      toast.success(`An invitation has been sent to ${name} (${email})`);
      setName("");
      setEmail("");
      setContractStart(null);
      setContractEnd(null);
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite Single Coach
        </CardTitle>
        <CardDescription>
          Send an email invitation to a new coach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="coach@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <AriaLabel>Contract Start Date</AriaLabel>
              <DatePicker
                value={contractStart}
                onChange={setContractStart}
                minValue={today(getLocalTimeZone())}
                className="group flex flex-col gap-1"
              >
                <div className="flex">
                  <Group className="w-full">
                    <DateInput className="pe-9" />
                  </Group>
                  <AriaButton className="-ms-9 -me-px z-10 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
                    <CalendarIcon size={16} />
                  </AriaButton>
                </div>
                <AriaPopover
                  className="data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out"
                  offset={4}
                >
                  <AriaDialog className="max-h-[inherit] overflow-auto p-2 outline-none">
                    <Calendar />
                  </AriaDialog>
                </AriaPopover>
              </DatePicker>
            </div>
            <div className="space-y-2">
              <AriaLabel>Contract End Date</AriaLabel>
              <DatePicker
                value={contractEnd}
                onChange={setContractEnd}
                minValue={contractStart ?? today(getLocalTimeZone())}
                className="group flex flex-col gap-1"
              >
                <div className="flex">
                  <Group className="w-full">
                    <DateInput className="pe-9" />
                  </Group>
                  <AriaButton className="-ms-9 -me-px z-10 flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
                    <CalendarIcon size={16} />
                  </AriaButton>
                </div>
                <AriaPopover
                  className="data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out"
                  offset={4}
                >
                  <AriaDialog className="max-h-[inherit] overflow-auto p-2 outline-none">
                    <Calendar />
                  </AriaDialog>
                </AriaPopover>
              </DatePicker>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
