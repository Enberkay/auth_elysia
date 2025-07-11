import { BookService } from '../services/book.service'

export const BookController = {
  list: async ({ set }: any) => {
    try {
      const books = await BookService.getAllBooks()
      set.status = 200
      return { books }
    } catch (error: any) {
      set.status = 500
      return { error: error.message }
    }
  },

  detail: async ({ params, set }: any) => {
    try {
      const book = await BookService.getBookById(Number(params.id))
      
      if (!book) {
        set.status = 404
        return { error: 'Book not found' }
      }

      set.status = 200
      return { book }
    } catch (error: any) {
      set.status = 500
      return { error: error.message }
    }
  },

  create: async ({ body, set }: any) => {
    try {
      const book = await BookService.createBook(body)
      set.status = 201
      return { 
        message: 'Book created successfully',
        book 
      }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  update: async ({ params, body, set }: any) => {
    try {
      const book = await BookService.updateBook(Number(params.id), body)
      set.status = 200
      return { 
        message: 'Book updated successfully',
        book 
      }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  },

  remove: async ({ params, set }: any) => {
    try {
      await BookService.deleteBook(Number(params.id))
      set.status = 200
      return { message: 'Book deleted successfully' }
    } catch (error: any) {
      set.status = 400
      return { error: error.message }
    }
  }
}
