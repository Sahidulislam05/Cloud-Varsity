// src/hooks/use-payment-status.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchData } from "@/lib/fetch-data";
import type { Invoice, PaymentRecord } from "@/types/student";

export const MAX_POLLS = 10;
const POLL_MS = 3000;

type PaymentLookup = { invoice: Invoice; payment: PaymentRecord } | null;

const findPayment = (
  invoices: Invoice[] | undefined,
  transactionId: string | undefined,
): PaymentLookup => {
  for (const invoice of invoices ?? []) {
    const payment = invoice.payments.find(
      (item) => item.transactionId === transactionId,
    );
    if (payment) return { invoice, payment };
  }
  return null;
};

export function usePaymentStatus(
  transactionId: string | undefined,
  enabled: boolean,
) {
  // Successful fetches since this view mounted. We count them ourselves
  // instead of reading query.state.dataUpdateCount: that counter is shared
  // with /student/payments (same queryKey) and is never exposed by the
  // observer result, while this view needs it to stop polling and to show
  // the "gave up" state.
  const pollCountRef = useRef(0);

  const query = useQuery({
    // /student/payments এর সাথে একই key, তাই একই cache ভাগাভাগি হয়
    queryKey: ["student", "invoices"],
    queryFn: async () => {
      const data = await fetchData<Invoice[]>("/payments/my-invoices");
      pollCountRef.current += 1;
      return data;
    },
    enabled: enabled && Boolean(transactionId),
    // ইউজারের নিজের invoice এর ভেতর থেকে শুধু এই transaction টা খুঁজে বের করি
    select: (invoices) => findPayment(invoices, transactionId),
    // PENDING থাকলে ৩ সেকেন্ড পরপর (সর্বোচ্চ ১০ বার) আবার জিজ্ঞেস করি
    refetchInterval: (query) => {
      const current = findPayment(query.state.data, transactionId);
      return current?.payment.status === "PENDING" &&
        pollCountRef.current < MAX_POLLS
        ? POLL_MS
        : false;
    },
  });

  return { ...query, pollCount: pollCountRef.current };
}
