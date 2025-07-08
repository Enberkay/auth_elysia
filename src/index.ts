import { Elysia } from 'elysia'
import jwt from '@elysiajs/jwt'
import dotenv from 'dotenv'

import { authRoute } from './routes/auth.route'

dotenv.config()

//logger func
const logger = () =>
  new Elysia().onBeforeHandle(({ request }) => {
    const now = new Date().toISOString()
    console.log(`[${now}] ${request.method} ${request.url}`)
  })


const app = new Elysia()

app.use(
  jwt({
    secret: process.env.JWT_SECRET!,
    name: 'jwt',
  })
)

// mount routes
app.use(authRoute)
app.use(logger())

app.listen(7878)
console.log('Server running on http://localhost:7878')