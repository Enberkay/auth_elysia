import { Elysia } from 'elysia'

export const LoggerPlugin = new Elysia({ name: 'logger' })
  .onAfterHandle(({ request, set }) => {
    const now = new Date().toISOString()
    const method = request.method
    const url = request.url
    const status = set.status ?? 200
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    
    console.log(`[${now}] ${method} ${url} -> ${status} - ${ip}`)
  })