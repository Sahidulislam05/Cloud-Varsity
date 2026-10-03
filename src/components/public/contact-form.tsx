"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiClient } from "@/lib/api-client";

const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Please enter your name" }),
  email: z.email({ error: "Please enter a valid email address" }),
  subject: z
    .string()
    .trim()
    .min(3, { error: "Subject must be at least 3 characters" })
    .max(120, { error: "Subject must be at most 120 characters" }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(2000, { error: "Message must be at most 2000 characters" }),
});

type ContactValues = z.infer<typeof contactSchema>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  );
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      await apiClient.post("/contact", values);
      toast.success("Message sent. We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not send your message. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
            className="mt-1.5"
            {...register("name")}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            className="mt-1.5"
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          aria-invalid={!!errors.subject}
          aria-describedby="subject-error"
          className="mt-1.5"
          {...register("subject")}
        />
        <FieldError id="subject-error" message={errors.subject?.message} />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby="message-error"
          className="mt-1.5"
          {...register("message")}
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send /> Send message
          </>
        )}
      </Button>
    </form>
  );
}
