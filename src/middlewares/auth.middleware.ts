import { Elysia } from 'elysia'
import { JWTUser } from '../types/user'
import { db } from '../lib/db'
import { JWTPlugin } from '../plugins/jwt.plugin'
import type { JwtPayload } from "../app";

type JwtHelper = {
  sign: (payload: JwtPayload) => Promise<string>;
  verify: (token: string) => Promise<JwtPayload | null>;
};

export const AuthMiddleware = new Elysia()
  .use(JWTPlugin)
  .derive(async ({ jwt, request, set }) => {
    const auth = request.headers.get('authorization')

    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      throw new Error('Unauthorized: Missing token')
    }

    const token = auth.split(' ')[1]
    const payload = await jwt.verify(token)

    if (!payload || typeof payload !== 'object') {
      set.status = 401
      throw new Error('Unauthorized: Invalid token')
    }

    // ดึง user จาก DB เพื่อตรวจสอบ isActive
    const userDb = await db.user.findUnique({ where: { id: payload.id } })
    if (!userDb || userDb.isActive === false) {
      set.status = 403
      throw new Error('User account is deactivated')
    }

    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      } as JWTUser
    }
  })
