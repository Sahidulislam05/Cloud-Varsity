import { Clock, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";
import { PageHeader } from "@/components/shared/page-header";
import { getUniversities } from "@/lib/public-data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: "Questions about admissions, courses or your account? Send the CloudVarsity team a message.",
  path: "/contact",
});

export default async function ContactPage() {
  const university = (await getUniversities().catch(() => null))?.data[0];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about admissions, courses or your account? Send us a message and the team will get back to you."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.4fr]">
        <aside className="space-y-6">
          {university?.address && (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">{university.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{university.address}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold">Office hours</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sunday to Thursday, 9:00 AM to 5:00 PM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold">Response time</h2>
              <p className="mt-1 text-sm text-muted-foreground">We usually reply within two working days.</p>
            </div>
          </div>
        </aside>

        <div className="border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}