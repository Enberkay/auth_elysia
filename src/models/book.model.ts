import { db } from '../lib/db'

export const BookModel = {
  findAll: () => db.book.findMany({
    orderBy: { createdAt: 'desc' }
  }),

  findById: (id: number) => db.book.findUnique({
    where: { id }
  }),

  create: (data: {
    title: string
    author: string
    type: string
    description?: string
  }) => db.book.create({ data }),

  update: (id: number, data: {
    title?: string
    author?: string
    type?: string
    description?: string
  }) => db.book.update({
    where: { id },
    data
  }),

  remove: (id: number) => db.book.delete({
    where: { id }
  })
}
