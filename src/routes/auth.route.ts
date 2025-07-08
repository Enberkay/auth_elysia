import { Elysia } from 'elysia'
import { register, login } from '../controllers/auth.controller'

interface AuthBody {
  email: string
  password: string
}

interface JwtContext {
  jwt?: {
    sign: (payload: any) => Promise<string>
  }
  body: unknown
  store: {
    user?: any
    [key: string]: any
  }
}

// Helper type for context with store
interface StoreContext {
  store: {
    user?: any
    [key: string]: any
  }
}

export const authRoute = new Elysia()
  .post('/register', async ({ body }) => {
    const { email, password } = body as AuthBody
    try {
      const user = await register(email, password)
      return { message: 'Registered', userId: user.id }
    } catch (e: any) {
      return { error: e.message }
    }
  })
  .post('/login', async (context: JwtContext) => {
    const { body, jwt } = context
    const { email, password } = body as AuthBody
    if (!jwt) return { error: 'JWT not available' }
    try {
      const user = await login(email, password)
      const token = await jwt.sign(user)
      return { token }
    } catch (e: any) {
      return { error: e.message }
    }
  })
  // Protected routes
  .derive(async (context) => {
    const authHeader = context.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    
    if (!token) {
      context.set.status = 401
      return { user: null }
    }
    
    // ใช้ any type เพื่อเข้าถึง jwt
    const jwtContext = context as any
    if (!jwtContext.jwt) {
      context.set.status = 500
      return { user: null }
    }
    
    try {
      const payload = await jwtContext.jwt.verify(token)
      return { user: payload }
    } catch {
      context.set.status = 401
      return { user: null }
    }
  })
  .get('/me', ({ user, set }) => {
    if (!user) {
      set.status = 401
      return { error: 'Unauthorized' }
    }
    return { user }
  })
  .get('/admin', ({ user, set }) => {
    if (!user) {
      set.status = 401
      return { error: 'Unauthorized' }
    }
    if (user.role !== 'admin') {
      set.status = 403
      return { error: 'Forbidden' }
    }
    return { message: 'Welcome admin!' }
  })
