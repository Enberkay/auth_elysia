import { Elysia } from 'elysia'
import jwt from '@elysiajs/jwt'
import dotenv from 'dotenv'

import { authRoute } from './routes/auth.route'

dotenv.config()

const app = new Elysia()

app.use(
  jwt({
    secret: process.env.JWT_SECRET!,
    name: 'jwt',
  })
)

// mount routes
app.use(authRoute)

app.listen(7878)
console.log('Server running on http://localhost:7878')
