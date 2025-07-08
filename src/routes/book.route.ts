import { Elysia } from 'elysia'
import { listBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/book.controller'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'

interface BookBody {
  title: string
  author: string
  type: string
  description?: string
}

interface Params {
  id: string
}

interface ContextWithSet {
  set: { status: number }
}

// กลุ่ม route สำหรับ admin (auth + role)
const adminBookRoute = new Elysia()
  .onBeforeHandle(authMiddleware())
  .onBeforeHandle(roleMiddleware('admin'))
  .post('/books', async (context: { body: BookBody } & ContextWithSet) => {
    const { body, set } = context
    try {
      const { title, author, type, description } = body
      if (!title || !author || !type) {
        set.status = 400
        return { error: 'Missing required fields' }
      }
      const book = await createBook({ title, author, type, description })
      return { book }
    } catch (e: any) {
      set.status = 500
      return { error: e.message }
    }
  })
  .put('/books/:id', async (context: { params: Params; body: BookBody } & ContextWithSet) => {
    const { params, body, set } = context
    try {
      const id = Number(params.id)
      if (isNaN(id)) {
        set.status = 400
        return { error: 'Invalid id' }
      }
      const { title, author, type, description } = body
      const book = await updateBook(id, { title, author, type, description })
      return { book }
    } catch (e: any) {
      set.status = 500
      return { error: e.message }
    }
  })
  .delete('/books/:id', async (context: { params: Params } & ContextWithSet) => {
    const { params, set } = context
    try {
      const id = Number(params.id)
      if (isNaN(id)) {
        set.status = 400
        return { error: 'Invalid id' }
      }
      await deleteBook(id)
      return { message: 'Deleted' }
    } catch (e: any) {
      set.status = 500
      return { error: e.message }
    }
  })

export const bookRoute = new Elysia()
  // ทุกคนดู list ได้
  .get('/books', async (context: ContextWithSet) => {
    const { set } = context
    try {
      const books = await listBooks()
      return { books }
    } catch (e: any) {
      set.status = 500
      return { error: e.message }
    }
  })
  // ต้อง login ถึงดู detail ได้
  .get('/books/:id', authMiddleware(), async (context: { params: Params } & ContextWithSet) => {
    const { params, set } = context
    try {
      const id = Number(params.id)
      if (isNaN(id)) {
        set.status = 400
        return { error: 'Invalid id' }
      }
      const book = await getBook(id)
      if (!book) {
        set.status = 404
        return { error: 'Not found' }
      }
      return { book }
    } catch (e: any) {
      set.status = 500
      return { error: e.message }
    }
  })
  // mount admin route
  .use(adminBookRoute) 