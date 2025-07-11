import { db } from '../lib/db'
import crypto from 'crypto'

export const RefreshTokenService = {
  // สร้าง refresh token ใหม่และบันทึกลง DB
  async generate(userId: number, expiresInDays = 7) {
    const token = crypto.randomBytes(40).toString('hex')
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    const refreshToken = await db.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    })
    return refreshToken
  },

  // ตรวจสอบ refresh token ว่า valid และไม่หมดอายุ/ถูก revoke
  async validate(token: string) {
    const found = await db.refreshToken.findUnique({ where: { token }, include: { user: true } })
    if (!found || found.revoked || found.expiresAt < new Date()) {
      return null
    }
    return found
  },

  // revoke refresh token (เช่น ตอน logout หรือ rotate)
  async revoke(token: string) {
    return db.refreshToken.update({
      where: { token },
      data: { revoked: true },
    })
  },

  // ลบ refresh token ทั้งหมดของ user (option)
  async revokeAllForUser(userId: number) {
    return db.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    })
  },
} 