"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarClock, Loader2, MapPin, NotebookPen, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface ScheduleViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

const viewingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  notes: z.string().optional(),
});

type ViewingForm = z.infer<typeof viewingSchema>;

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

export function ScheduleViewingModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}: ScheduleViewingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ViewingForm>({
    resolver: zodResolver(viewingSchema),
    defaultValues: {
      time: timeSlots[0],
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const onSubmit = async (data: ViewingForm) => {
    try {
      const response = await fetch("/api/viewings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          propertyTitle,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to schedule viewing");
      }

      toast.success(result.message ?? "Viewing scheduled successfully!");
      reset();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to schedule viewing. Please try again.";
      toast.error(message);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm transition">
      <div className="mx-auto w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-xl md:my-10 md:rounded-3xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-2xl font-semibold text-primary">Schedule a Viewing</h3>
            <p className="text-sm text-muted-foreground">
              {propertyTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/80"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4 text-primary" /> Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.name
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.email
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.phone
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-primary" /> Preferred Date
            </label>
            <input
              type="date"
              {...register("date")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.date
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-primary" /> Preferred Time
            </label>
            <select
              {...register("time")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.time
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="mt-1 text-xs text-destructive">{errors.time.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <NotebookPen className="h-4 w-4 text-primary" /> Additional Notes (optional)
            </label>
            <textarea
              rows={3}
              {...register("notes")}
              className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share any specific requirements or questions"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
            <span>
              We will confirm the viewing with the agent and send you a calendar invite.
            </span>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2 font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Scheduling
                </>
              ) : (
                <>
                  <CalendarClock className="h-5 w-5" />
                  Confirm Viewing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
