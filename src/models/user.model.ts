import { db } from '../lib/db'
import { CreateUserDto } from '../types/user'

export const UserModel = {
  findByEmail: (email: string) => db.user.findUnique({
    where: { email }
  }),

  findById: (id: number) => db.user.findUnique({
    where: { id }
  }),

  create: (data: CreateUserDto) => db.user.create({ data }),

  update: (id: number, data: Partial<CreateUserDto>) => 
    db.user.update({
      where: { id },
      data
    }),

  delete: (id: number) => db.user.delete({
    where: { id }
  })
} 