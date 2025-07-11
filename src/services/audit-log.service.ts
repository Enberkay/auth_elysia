import { db } from '../lib/db'

export const AuditLogService = {
  async log({ userId, event, ip, userAgent }: { userId?: number, event: string, ip?: string, userAgent?: string }) {
    return db.auditLog.create({
      data: {
        userId,
        event,
        ip,
        userAgent,
      },
    })
  },
} 