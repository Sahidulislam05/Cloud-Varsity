const DAY_MS = 24 * 60 * 60 * 1000;

type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE";

export const displayInvoiceStatus = (
  status: InvoiceStatus,
  dueDate: string,
): InvoiceStatus =>
  status === "PENDING" && new Date(dueDate).getTime() + DAY_MS < Date.now()
    ? "OVERDUE"
    : status;
