"use client";

import { useQueries } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AXIS_TICK,
  TOOLTIP_STYLE,
} from "@/components/super-admin/chart-styles";
import { ChartCard } from "@/components/super-admin/chart-card";
import { useReport } from "@/hooks/use-reports";
import { type ApiResponse, apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/roles";
import type { EnrollmentReportRow, FinanceReport } from "@/types/admin";
import type { Role } from "@/store/auth-store";

export function EnrollmentChart({ className }: { className?: string }) {
  const { data, isLoading } = useReport<EnrollmentReportRow[]>("enrollment");

  // সবচেয়ে ভরা ৮টা section, নইলে অক্ষ ঠাসাঠাসি হয়ে যায়
  const chartData = [...(data ?? [])]
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 8)
    .map((row) => ({
      label: `${row.courseCode}-${row.section}`,
      enrolled: row.enrolled,
      capacity: row.capacity,
    }));

  return (
    <ChartCard
      title="Enrollment by section"
      description="Enrolled students against capacity for the busiest sections."
      isLoading={isLoading}
      isEmpty={chartData.length === 0}
      emptyText="No sections have been created yet."
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: "var(--muted)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="enrolled" name="Enrolled" fill="var(--chart-1)" />
          <Bar dataKey="capacity" name="Capacity" fill="var(--chart-5)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueChart({
  semesterId,
  className,
}: {
  semesterId?: string;
  className?: string;
} = {}) {
  const { data, isLoading } = useReport<FinanceReport>("finance", {
    semesterId,
  });

  const pieData = data
    ? [
        {
          name: "Collected",
          value: data.totalCollected,
          fill: "var(--success)",
        },
        { name: "Pending", value: data.totalPending, fill: "var(--warning)" },
      ]
    : [];

  return (
    <ChartCard
      title="Tuition collection"
      description="Collected versus pending invoice amounts."
      isLoading={isLoading}
      isEmpty={!data || data.totalInvoiced === 0}
      emptyText="No invoices have been generated yet."
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="var(--card)"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const ROLES = Object.keys(ROLE_LABEL) as Role[];

export function UsersByRoleChart() {
  // role প্রতি একটা অনুরোধ, limit=1 বলে শুধু meta.total টা নিই (খুব হালকা)
  const queries = useQueries({
    queries: ROLES.map((role) => ({
      queryKey: ["users", "count", role],
      queryFn: async () => {
        const res = await apiClient.get<ApiResponse<unknown[]>>("/user", {
          params: { role, limit: 1 },
        });
        return res.data.meta?.total ?? 0;
      },
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const chartData = ROLES.map((role, index) => ({
    label: ROLE_LABEL[role],
    count: queries[index]?.data ?? 0,
  }));

  return (
    <ChartCard
      title="Users by role"
      description="How many accounts exist for each role."
      isLoading={isLoading}
      isEmpty={chartData.every((item) => item.count === 0)}
      emptyText="No users yet."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: "var(--muted)" }}
          />
          <Bar dataKey="count" name="Users" fill="var(--chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
