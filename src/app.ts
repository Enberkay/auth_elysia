import { Elysia } from 'elysia'
import { JWTPlugin } from './plugins/jwt.pugin'
import { LoggerPlugin } from './plugins/logger.plugin'
import { AuthRoute } from './routes/auth.route'
import { BookRoute } from './routes/book.route'

const app = new Elysia()
  .use(LoggerPlugin)
  .use(JWTPlugin)
  .use(AuthRoute)
  .use(BookRoute)
  .listen(7878)

console.log('🚀 Server is running on http://localhost:7878')
