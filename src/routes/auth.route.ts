import { Elysia } from 'elysia'
import { AuthController } from '../controllers/auth.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { JWTPlugin } from '../plugins/jwt.pugin'

export const AuthRoute = new Elysia({ prefix: '/auth' })
  .post('/login', AuthController.login)
  .post('/register', AuthController.register)
  .post('/refresh', AuthController.refresh)
  .post('/request-reset', AuthController.requestReset)
  .post('/reset-password', AuthController.resetPassword)
  .use(AuthMiddleware)
  .group('/me', app => app
    .use(JWTPlugin)
    .get('/', async ({ jwt, request, set }) => {
      try {
        const auth = request.headers.get('authorization')
        if (!auth?.startsWith('Bearer ')) {
          set.status = 401
          return { error: 'Unauthorized: Missing token' }
        }
        const token = auth.split(' ')[1]
        const payload = await jwt.verify(token)
        if (!payload || typeof payload !== 'object') {
          set.status = 401
          return { error: 'Unauthorized: Invalid token' }
        }
        const user = await AuthController.getCurrentUser({ 
          user: { id: payload.id, email: payload.email, role: payload.role },
          set 
        })
        return user
      } catch (error: any) {
        set.status = 401
        return { error: error.message }
      }
    })
  ) 