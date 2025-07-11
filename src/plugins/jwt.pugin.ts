import { Elysia } from 'elysia'
import jwt from '@elysiajs/jwt'
import { env } from '../config/env'

export const JWTPlugin = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: env.JWT_SECRET
  }))
