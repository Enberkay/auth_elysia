import { Context as ElysiaContext } from 'elysia'
import { currentUser } from '../services/user.service'

// ขยาย Context เพื่อรองรับ jwt และ store.user
interface JwtContext extends ElysiaContext {
  jwt?: {
    verify: (token: string) => Promise<any>
  }
  store: {
    user?: any
    [key: string]: any
  }
}

export function authMiddleware() {
  return async (context: JwtContext) => {
    try {
      const authHeader = context.headers.authorization
      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined
      if (!token) {
        context.set.status = 401
        return { error: 'No token' }
      }
      if (!context.jwt) {
        context.set.status = 500
        return { error: 'JWT not available' }
      }
      const payload = await context.jwt.verify(token)
      if (!payload) {
        context.set.status = 401
        return { error: 'Invalid token' }
      }
      context.store.user = payload
    } catch {
      context.set.status = 401
      return { error: 'Unauthorized' }
    }
  }
}

export function roleMiddleware(requiredRole: string) {
  return async (context: any) => {
    const jwtUser = context.store.user
    if (!jwtUser) {
      context.set.status = 401
      return { error: 'Unauthorized' }
    }

    const dbUser = await currentUser(jwtUser.id)
    if (!dbUser) {
      context.set.status = 404
      return { error: 'User not found' }
    }

    if (dbUser.role !== requiredRole) {
      context.set.status = 403
      return { error: 'Forbidden: Insufficient role' }
    }

    context.store.user = dbUser
  }
}
