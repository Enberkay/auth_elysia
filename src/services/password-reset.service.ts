import { db } from '../lib/db'
import crypto from 'crypto'

export const PasswordResetService = {
  // สร้าง token สำหรับ reset password และบันทึกลง DB
  async generate(userId: number, expiresInMinutes = 30) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
    const resetToken = await db.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    })
    return resetToken
  },

  // ตรวจสอบ token ว่า valid, ไม่หมดอายุ, ไม่ถูกใช้ไปแล้ว
  async validate(token: string) {
    const found = await db.passwordResetToken.findUnique({ where: { token }, include: { user: true } })
    if (!found || found.used || found.expiresAt < new Date()) {
      return null
    }
    return found
  },

  // mark token ว่าใช้ไปแล้ว
  async markUsed(token: string) {
    return db.passwordResetToken.update({
      where: { token },
      data: { used: true },
    })
  },
} 