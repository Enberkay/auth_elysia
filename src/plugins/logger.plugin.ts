import { Elysia } from 'elysia'

export const LoggerPlugin = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    const now = new Date().toISOString()
    const method = request.method
    const url = request.url
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    console.log(`[${now}] [REQUEST] ${method} ${url} - ${ip}`)
  })
  .onBeforeHandle(({ request }) => {
    // สามารถ log ข้อมูล context เพิ่มเติมได้ที่นี่ (optional)
    // ตัวอย่าง: log user-agent
    const userAgent = request.headers.get('user-agent') ?? 'unknown'
    const now = new Date().toISOString()
    console.log(`[${now}] [BEFORE_HANDLE] UA: ${userAgent}`)
  })
  .onAfterHandle(({ request, set }) => {
    const now = new Date().toISOString()
    const method = request.method
    const url = request.url
    const status = set.status ?? 200
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    console.log(`[${now}] [AFTER_HANDLE] ${method} ${url} -> ${status} - ${ip}`)
  })
  .onError(({ error, request, set }) => {
    const now = new Date().toISOString()
    const method = request.method
    const url = request.url
    const status = set.status ?? 500
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (error instanceof Error) {
      console.error(`[${now}] [ERROR] ${method} ${url} -> ${status} - ${ip} | ${error.message}`)
      if (error.stack) {
        console.error(error.stack)
      }
    } else {
      console.error(`[${now}] [ERROR] ${method} ${url} -> ${status} - ${ip} |`, error)
    }
  })