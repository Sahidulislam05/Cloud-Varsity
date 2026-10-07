// src/app/payment/success/page.tsx
import type { Metadata } from "next";
import { PaymentSuccessView } from "@/components/payment/payment-success-view";
import { getParam } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Payment status",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage(
  props: PageProps<"/payment/success">,
) {
  const searchParams = await props.searchParams;

  return (
    <PaymentSuccessView transactionId={getParam(searchParams, "tran_id")} />
  );
}
