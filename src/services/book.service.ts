import { BookModel } from '../models/book.model'

export const BookService = {
  getAllBooks: () => BookModel.findAll(),

  getBookById: (id: number) => BookModel.findById(id),

  createBook: (data: {
    title: string
    author: string
    type: string
    description?: string
  }) => BookModel.create(data),

  updateBook: (id: number, data: {
    title?: string
    author?: string
    type?: string
    description?: string
  }) => BookModel.update(id, data),

  deleteBook: (id: number) => BookModel.remove(id)
}
