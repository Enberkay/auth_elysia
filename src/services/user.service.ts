import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function currentUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })
}
