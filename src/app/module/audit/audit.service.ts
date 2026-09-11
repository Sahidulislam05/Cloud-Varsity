import { prisma } from "../../lib/prisma";

type TLogActionPayload = {
  userId: string | null;
  action: string;
  entityName: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
};

const logAction = async (payload: TLogActionPayload) => {
  try {
    await prisma.auditLog.create({ data: payload });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

const getAuditLogs = async (query: {
  page?: string;
  limit?: string;
  entityName?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const where = { ...(query.entityName && { entityName: query.entityName }) };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: logs,
  };
};

export const AuditService = { logAction, getAuditLogs };
