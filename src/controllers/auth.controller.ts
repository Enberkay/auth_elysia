import { AuthService } from '../services/auth.service'

export const AuthController = {
  login: async ({ body, jwt, set }: any) => {
    try {
      const user = await AuthService.login(body)
      
      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
      })

      set.status = 200
      return {
        message: 'Login successful',
        token,
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
  }
} 