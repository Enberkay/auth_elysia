import { Elysia } from 'elysia'
import { JWTUser } from '../types/user'

export const AuthMiddleware = new Elysia()
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

    return {
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role
      } as JWTUser
    }
  })
