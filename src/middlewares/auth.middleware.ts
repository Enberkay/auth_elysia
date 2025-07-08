import { Context as ElysiaContext } from 'elysia'

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

export function roleMiddleware(role: string) {
  return async (context: JwtContext) => {
    const user = context.store.user
    if (!user || user.role !== role) {
      context.set.status = 403
      return { error: 'Forbidden' }
    }
  }
}
