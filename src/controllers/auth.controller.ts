import { AuthService } from '../services/auth.service'
import { RefreshTokenService } from '../services/refresh-token.service'
import { PasswordResetService } from '../services/password-reset.service'
import { UserModel } from '../models/user.model'
import { hashPassword } from '../utils/password'
import { AuditLogService } from '../services/audit-log.service'

export const AuthController = {
  login: async ({ body, jwt, set, request }: any) => {
    try {
      const user = await AuthService.login(body)
      // log event
      await AuditLogService.log({
        userId: user.id,
        event: 'login',
        ip: request?.headers.get('x-forwarded-for') || '',
        userAgent: request?.headers.get('user-agent') || ''
      })
      
      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      set.status = 200
      return {
        message: 'Login successful',
        token,
        refreshToken: user.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  register: async ({ body, jwt, set }: any) => {
    try {
      const user = await AuthService.register(body)
      
      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      set.status = 201
      return {
        message: 'Registration successful',
        token,
        refreshToken: user.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  refresh: async ({ body, jwt, set }: any) => {
    try {
      const { refreshToken } = body
      if (!refreshToken) {
        set.status = 400
        return { error: 'Missing refresh token' }
      }
      const found = await RefreshTokenService.validate(refreshToken)
      if (!found) {
        set.status = 401
        return { error: 'Invalid or expired refresh token' }
      }
      if (!found.user) {
        set.status = 404
        return { error: 'User not found' }
      }
      const token = await jwt.sign({ id: found.user.id, email: found.user.email, role: found.user.role })
      set.status = 200
      return { token, user: { id: found.user.id, email: found.user.email, role: found.user.role } }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  getCurrentUser: async ({ user, set }: any) => {
    try {
      console.log('getCurrentUser context:', user)
      if (!user) {
        set.status = 401
        return { error: 'No user in context' }
      }
      const currentUser = await AuthService.getCurrentUser(user.id)
      set.status = 200
      return {
        user: currentUser
      }
    } catch (error: any) {
      set.status = 404
      return { error: error.message }
    }
  },

  requestReset: async ({ body, set, request }: any) => {
    try {
      const { email } = body
      if (!email) {
        set.status = 400
        return { error: 'Missing email' }
      }
      const user = await UserModel.findByEmail(email)
      if (!user) {
        set.status = 404
        return { error: 'User not found' }
      }
      await AuditLogService.log({
        userId: user.id,
        event: 'request_password_reset',
        ip: request?.headers.get('x-forwarded-for') || '',
        userAgent: request?.headers.get('user-agent') || ''
      })
      const resetToken = await PasswordResetService.generate(user.id)
      // mock ส่งอีเมล (log token)
      console.log(`[MOCK EMAIL] Password reset link: http://localhost:7878/auth/reset-password?token=${resetToken.token}`)
      set.status = 200
      return { message: 'Password reset link sent (mock)', token: resetToken.token }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  resetPassword: async ({ body, set, request }: any) => {
    try {
      const { token, newPassword } = body
      if (!token || !newPassword) {
        set.status = 400
        return { error: 'Missing token or new password' }
      }
      const found = await PasswordResetService.validate(token)
      if (!found) {
        set.status = 400
        return { error: 'Invalid or expired token' }
      }
      // hash new password
      const hashed = await hashPassword(newPassword)
      await UserModel.update(found.userId, { password: hashed })
      await PasswordResetService.markUsed(token)
      await AuditLogService.log({
        userId: found.userId,
        event: 'reset_password',
        ip: request?.headers.get('x-forwarded-for') || '',
        userAgent: request?.headers.get('user-agent') || ''
      })
      set.status = 200
      return { message: 'Password reset successful' }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  }
} 