import { Elysia } from 'elysia'
import { JWTPlugin } from './plugins/jwt.plugin'
import { LoggerPlugin } from './plugins/logger.plugin'
import { AuthRoute } from './routes/auth.route'
import { BookRoute } from './routes/book.route'

const app = new Elysia()
  .onError(({ error, set }) => {
    if (error instanceof Error && 'status' in error) {
      set.status = (error as any).status || 400
      return { error: error.message }
    }
    set.status = 500
    return { error: 'Internal Server Error' }
  })
  .use(LoggerPlugin)
  .use(JWTPlugin)
  .use(AuthRoute)
  .use(BookRoute)
  .listen(7878)

console.log('🚀 Server is running on http://localhost:7878')
