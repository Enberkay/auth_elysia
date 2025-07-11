import { UserModel } from '../models/user.model'
import { LoginDto, CreateUserDto } from '../types/user'
import { hashPassword, verifyPassword } from '../utils/password'
import { validateEmail, validatePassword } from '../utils/validation'

export const AuthService = {
  login: async (data: LoginDto) => {
    // Validation
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format')
    }
    if (!validatePassword(data.password)) {
      throw new Error('Invalid password format')
    }
    const user = await UserModel.findByEmail(data.email)
    
    if (!user) {
      throw new Error('User not found')
    }

    // ใช้ bcrypt เปรียบเทียบ password
    const isPasswordValid = await verifyPassword(data.password, user.password)
    
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  },

  register: async (data: CreateUserDto) => {
    // Validation
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format')
    }
    if (!validatePassword(data.password)) {
      throw new Error('Password must be at least 8 characters, contain uppercase, lowercase, number, and special character')
    }
    const existingUser = await UserModel.findByEmail(data.email)
    
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password ก่อนบันทึกลง database
    const hashedPassword = await hashPassword(data.password)
    
    const user = await UserModel.create({
      ...data,
      password: hashedPassword
    })
    
    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  },

  getCurrentUser: async (userId: number) => {
    const user = await UserModel.findById(userId)
    
    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  }
} 