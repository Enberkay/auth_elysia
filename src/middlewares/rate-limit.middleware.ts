import { Elysia } from 'elysia'

// กำหนดค่า rate limit
const WINDOW_MS = 60 * 1000 // 1 นาที
const MAX_REQUESTS = 5 // ต่อ IP ต่อ route ต่อ 1 นาที

// โครงสร้าง: { [ip_route]: { count, firstRequestTime } }
const store: Record<string, { count: number, firstRequestTime: number }> = {}

export const RateLimitMiddleware = new Elysia()
  .derive(({ request, path, set }) => {
    const ip = request.headers.get('x-forwarded-for') || 'local'
    const key = ip + ':' + path
    const now = Date.now()
    if (!store[key] || now - store[key].firstRequestTime > WINDOW_MS) {
      store[key] = { count: 1, firstRequestTime: now }
    } else {
      store[key].count++
    }
    if (store[key].count > MAX_REQUESTS) {
      set.status = 429
      throw new Error('Too many requests, please try again later.')
    }
    return {}
  }) 