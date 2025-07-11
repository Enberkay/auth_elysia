export const env = {
  JWT_SECRET: process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-in-production',
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/auth_elysia',
  PORT: process.env.PORT ?? 3000
}
