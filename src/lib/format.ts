const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatDate = (value: string | Date) =>
  dateFormatter.format(new Date(value));
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatCurrency = (value: number) =>
  `৳${currencyFormatter.format(value)}`;

export const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const todayLocal = () => new Date().toLocaleDateString("en-CA");

export const formatDateTime = (value: string | Date) =>
  dateTimeFormatter.format(new Date(value));
