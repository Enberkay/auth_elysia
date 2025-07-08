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
  set: {
    status: number
  }
}

// Helper type for context with store
interface StoreContext {
  store: {
    user?: any
    [key: string]: any
  }
  set: {
    status: number
  }
}

export const authRoute = new Elysia()
  .post('/register', async (context: JwtContext) => {
    const { body, set } = context
    const { email, password } = body as AuthBody
    try {
      const user = await register(email, password)
      return { message: 'Registered', userId: user.id }
    } catch (e: any) {
      // ถ้า user ซ้ำ ให้ 409, อื่น ๆ ให้ 400
      if (e.message === 'User already exists') {
        set.status = 409
      } else {
        set.status = 400
      }
      return { error: e.message }
    }
  })
  .post('/login', async (context: JwtContext) => {
    const { body, jwt, set } = context
    const { email, password } = body as AuthBody
    if (!jwt) {
      set.status = 500
      return { error: 'JWT not available' }
    }
    try {
      const user = await login(email, password)
      const token = await jwt.sign(user)
      return { token }
    } catch (e: any) {
      // ถ้า user ไม่พบ หรือ password ผิด ให้ 401, อื่น ๆ ให้ 400
      if (e.message === 'User not found' || e.message === 'Invalid password') {
        set.status = 401
      } else {
        set.status = 400
      }
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
