// src/app/payment/cancel/page.tsx
import { Ban, CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentResult } from "@/components/payment/payment-result";
import { Button } from "@/components/ui/button";
import { getParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Payment not completed",
  robots: { index: false, follow: false },
};

export default async function PaymentCancelPage(
  props: PageProps<"/payment/cancel">,
) {
  const searchParams = await props.searchParams;

  const failed = getParam(searchParams, "reason") === "failed";
  const reference = getParam(searchParams, "tran_id");

  return (
    <PaymentResult
      tone={failed ? "danger" : "warning"}
      icon={failed ? CircleX : Ban}
      title={failed ? "Payment failed" : "Payment cancelled"}
      description={
        failed
          ? "We could not complete your payment. Your invoice is still unpaid and you can try again at any time. If you were charged, contact the finance office with the reference below."
          : "You cancelled the payment, so no payment was made. Your invoice is still unpaid and you can pay whenever you are ready."
      }
      details={
        reference
          ? [
              {
                label: "Reference",
                value: (
                  <span className="font-mono text-xs break-all">
                    {reference}
                  </span>
                ),
              },
            ]
          : undefined
      }
    >
      <Button asChild>
        <Link href="/student/payments">Try again</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/student">Go to dashboard</Link>
      </Button>
    </PaymentResult>
  );
}
