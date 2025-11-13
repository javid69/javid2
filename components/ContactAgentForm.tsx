"use client";

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Calendar,
  Headset,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import type { AgentInfo } from "@/app/api/properties/data";
import { cn } from "@/lib/utils";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryForm = z.infer<typeof inquirySchema>;

interface ContactAgentFormProps {
  agent: AgentInfo;
  propertyId: string;
  propertyTitle: string;
  onScheduleViewing: () => void;
  className?: string;
}

export function ContactAgentForm({
  agent,
  propertyId,
  propertyTitle,
  onScheduleViewing,
  className,
}: ContactAgentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: `I'm interested in ${propertyTitle}. Please contact me with more details.`,
    },
  });

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to send inquiry");
      }

      toast.success(result.message ?? "Inquiry sent successfully!");
      reset({
        name: "",
        email: "",
        phone: "",
        message: `I'm interested in ${propertyTitle}. Please contact me with more details.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send inquiry. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-white shadow-lg", className)}>
      <div className="border-b border-border bg-primary/5 px-6 py-4">
        <h3 className="text-xl font-semibold text-primary">Contact Agent</h3>
      </div>

      <div className="border-b border-border px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-primary/10">
            <Image
              src={agent.avatar}
              alt={agent.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">
              {agent.name}
            </h4>
            <p className="text-sm text-muted-foreground">{agent.title}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <a
            href={`tel:${agent.phone}`}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <Phone className="h-4 w-4" />
            <span>{agent.phone}</span>
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <Mail className="h-4 w-4" />
            <span className="truncate">{agent.email}</span>
          </a>
          <a
            href={agent.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <User className="h-4 w-4 text-primary" /> Your Name
              <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.name
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="Enter your name"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Mail className="h-4 w-4 text-primary" /> Your Email
              <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.email
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="your@email.com"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Phone className="h-4 w-4 text-primary" /> Your Phone
              <span className="text-destructive">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className={cn(
                "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.phone
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="+91 98765 43210"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Headset className="h-4 w-4 text-primary" /> Message
              <span className="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              className={cn(
                "w-full resize-none rounded-lg border px-4 py-2 focus:outline-none focus:ring-2",
                errors.message
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary",
              )}
              placeholder="Tell us about your inquiry..."
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Send Inquiry
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onScheduleViewing}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent bg-accent/5 px-6 py-3 font-semibold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Calendar className="h-5 w-5" />
              Schedule Viewing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
