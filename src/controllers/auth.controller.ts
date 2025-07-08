import { PrismaClient } from '@prisma/client'
import Bun from 'bun'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('User already exists')

  const hashed = await Bun.password.hash(password)
  return prisma.user.create({
    data: { email, password: hashed },
  })
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('User not found')

  const valid = await Bun.password.verify(password, user.password)
  if (!valid) throw new Error('Invalid password')

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}
