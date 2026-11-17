// src/app/payment/fail/page.tsx
import { CircleX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentResult } from "@/components/payment/payment-result";
import { Button } from "@/components/ui/button";
import { getParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Payment failed",
  robots: { index: false, follow: false },
};

export default async function PaymentFailPage(
  props: PageProps<"/payment/fail">,
) {
  // SSLCommerz redirects back here with ?tran_id=<transactionId>
  const searchParams = await props.searchParams;
  const reference = getParam(searchParams, "tran_id");

  return (
    <PaymentResult
      tone="danger"
      icon={CircleX}
      title="Payment failed"
      description="We could not complete your payment. Your invoice is still unpaid and you can try again at any time. If you were charged, contact the finance office with the reference below."
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
