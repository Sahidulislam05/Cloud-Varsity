"use client";

import {
  CircleCheck,
  CircleX,
  Clock,
  LoaderCircle,
  LogIn,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { PaymentResult } from "@/components/payment/payment-result";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_POLLS, usePaymentStatus } from "@/hooks/use-payment-status";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ROLE_HOME } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

export function PaymentSuccessView({
  transactionId,
}: {
  transactionId?: string;
}) {
  const { user, isAuthenticated, isHydrating } = useAuthStore();
  const isStudent = isAuthenticated && user?.role === "STUDENT";
  const status = usePaymentStatus(transactionId, isStudent);

  const dashboardHref = user ? (ROLE_HOME[user.role] ?? "/") : "/";
  const paymentsButton = (
    <Button asChild>
      <Link href="/student/payments">View payments</Link>
    </Button>
  );
  const dashboardButton = (
    <Button asChild variant="outline">
      <Link href={dashboardHref}>
        {user ? "Go to dashboard" : "Back to home"}
      </Link>
    </Button>
  );

  if (isHydrating || (isStudent && status.isLoading)) {
    return (
      <main
        className="flex min-h-svh items-center justify-center px-4"
        role="status"
      >
        <span className="sr-only">Checking your payment…</span>
        <div className="w-full max-w-md space-y-4 border border-border bg-card p-6">
          <Skeleton className="mx-auto size-12" />
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
      </main>
    );
  }

  if (!transactionId) {
    return (
      <PaymentResult
        tone="neutral"
        icon={SearchX}
        title="No payment reference"
        description="This page opens after a payment. Open your payment history to see the status of your invoices."
      >
        {paymentsButton}
        {dashboardButton}
      </PaymentResult>
    );
  }

  // login ছাড়া সত্যতা যাচাই করা যায় না, তাই "সফল" বলি না
  if (!isAuthenticated) {
    return (
      <PaymentResult
        tone="neutral"
        icon={LogIn}
        title="Log in to see your receipt"
        description="Your payment was handled by SSLCommerz. Log in to confirm its status and view the receipt."
      >
        <Button asChild>
          <Link href="/login">Log in</Link>
        </Button>
        {dashboardButton}
      </PaymentResult>
    );
  }

  if (!isStudent) {
    return (
      <PaymentResult
        tone="neutral"
        icon={SearchX}
        title="This page is for student payments"
        description="Payment receipts are available to student accounts only."
      >
        {dashboardButton}
      </PaymentResult>
    );
  }

  if (status.isError) {
    return (
      <PaymentResult
        tone="danger"
        icon={TriangleAlert}
        title="Could not check your payment"
        description="We could not reach the server to confirm your payment. Your money is safe; please try again."
      >
        <Button onClick={() => status.refetch()}>Try again</Button>
        {dashboardButton}
      </PaymentResult>
    );
  }

  const result = status.data;

  if (!result) {
    return (
      <PaymentResult
        tone="warning"
        icon={SearchX}
        title="Payment not found"
        description="We could not find this transaction in your account. Check your payment history for the latest status."
      >
        {paymentsButton}
        {dashboardButton}
      </PaymentResult>
    );
  }

  const { invoice, payment } = result;

  if (payment.status === "SUCCESS") {
    return (
      <PaymentResult
        tone="success"
        icon={CircleCheck}
        title="Payment successful"
        description="Thank you. Your payment has been received and your invoice is now settled."
        details={[
          {
            label: "Fee",
            value: `${invoice.feeStructure.title} · ${invoice.feeStructure.semester.name} ${invoice.feeStructure.semester.year}`,
          },
          {
            label: "Amount paid",
            value: formatCurrency(Number(payment.amount)),
          },
          {
            label: "Paid on",
            value: formatDateTime(payment.paidAt ?? payment.createdAt),
          },
          {
            label: "Transaction ID",
            value: (
              <span className="font-mono text-xs break-all">
                {payment.transactionId}
              </span>
            ),
          },
        ]}
      >
        {paymentsButton}
        {dashboardButton}
      </PaymentResult>
    );
  }

  if (payment.status === "PENDING") {
    const gaveUp = status.dataUpdatedAt >= MAX_POLLS;

    return (
      <PaymentResult
        tone="warning"
        icon={gaveUp ? Clock : LoaderCircle}
        spin={!gaveUp}
        title={gaveUp ? "Still being confirmed" : "Confirming your payment…"}
        description={
          gaveUp
            ? "The bank is taking longer than usual. Check your payment history again in a few minutes."
            : "Please wait a moment while we confirm your payment with SSLCommerz."
        }
      >
        {gaveUp ? (
          <Button onClick={() => status.refetch()}>Check again</Button>
        ) : null}
        {paymentsButton}
      </PaymentResult>
    );
  }

  return (
    <PaymentResult
      tone="danger"
      icon={CircleX}
      title="Payment was not completed"
      description="This payment did not go through, so your invoice is still unpaid. You can try again from your payment page."
    >
      {paymentsButton}
      {dashboardButton}
    </PaymentResult>
  );
}
