import { Elysia } from 'elysia'
import { BookController } from '../controllers/book.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

export const BookRoute = new Elysia({ prefix: '/books' })
  // Public route - ใครก็เข้าดูได้
  .get('/', BookController.list)

  // Require login - ต้องมี JWT token
  .use(AuthMiddleware)
  .get('/:id', BookController.detail)

  // Admin only - ต้องเป็น admin เท่านั้น
  .group('/admin', app => app
    .use(AuthMiddleware)
    .guard({
      beforeHandle: requireRole(['admin'])
    }, app => app
      .post('/', BookController.create)
      .put('/:id', BookController.update)
      .delete('/:id', BookController.remove)
    )
  )
