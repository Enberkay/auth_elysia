# Auth Elysia - Book Management System

ระบบจัดการหนังสือพร้อม Authentication & Authorization ด้วย Elysia + Prisma + JWT

## โครงสร้างโปรเจกต์

```
src/
├── app.ts                    # จุดเริ่มต้นของแอป
├── config/
│   └── env.ts               # Environment variables
├── controllers/
│   ├── auth.controller.ts    # Auth controller
│   └── book.controller.ts    # Book controller
├── middlewares/
│   ├── auth.middleware.ts    # JWT decode + inject user
│   └── role.middleware.ts    # Role authorization
├── models/
│   ├── user.model.ts         # User database operations
│   └── book.model.ts         # Book database operations
├── plugins/
│   ├── jwt.pugin.ts          # JWT plugin
│   └── logger.plugin.ts      # Request logging (morgan-like)
├── routes/
│   ├── auth.route.ts         # Auth endpoints
│   └── book.route.ts         # Book endpoints
├── services/
│   ├── auth.service.ts       # Auth business logic
│   └── book.service.ts       # Book business logic
├── types/
│   └── user.ts               # TypeScript interfaces
├── utils/
│   └── password.ts           # Password hashing utilities
└── lib/
    └── db.ts                 # Prisma client
```

## ระบบ Authentication & Authorization

### 1. JWT Decode Middleware (auth.middleware.ts)
- ตรวจสอบ Bearer token ใน Authorization header
- Decode JWT และ extract payload (id, email, role)
- Inject user object ไปยัง req.user
- Reject ทันทีถ้าไม่มี token หรือ token ไม่ถูกต้อง

### 2. Role Authorization Middleware (role.middleware.ts)
- รับ user จาก req.user (ที่ได้จาก auth middleware)
- ตรวจสอบ role ว่าตรงกับที่กำหนดไว้หรือไม่
- Reject ถ้า role ไม่ตรง

### 3. Current User Endpoint (/auth/me)
- ใช้ req.user.id ไป query database
- ตรวจสอบ role ว่าตรงกับ JWT payload หรือไม่
- ใช้สำหรับ ProtectRoute ฝั่ง frontend

## Book Management API

| Route | Method | Auth Required | Role Required | Description |
|-------|--------|---------------|---------------|-------------|
| `/books` | GET | ไม่ต้อง | - | ดูรายการหนังสือ (public) |
| `/books/:id` | GET | ต้อง | - | ดูรายละเอียดหนังสือ (ต้อง login) |
| `/books/admin` | POST | ต้อง | admin | เพิ่มหนังสือใหม่ |
| `/books/admin/:id` | PUT | ต้อง | admin | แก้ไขหนังสือ |
| `/books/admin/:id` | DELETE | ต้อง | admin | ลบหนังสือ |

## Auth API

| Route | Method | Description |
|-------|--------|-------------|
| `/auth/register` | POST | สมัครสมาชิก |
| `/auth/login` | POST | เข้าสู่ระบบ |
| `/auth/me` | GET | ดูข้อมูลผู้ใช้ปัจจุบัน |

## การติดตั้งและรัน

1. **ติดตั้ง dependencies**
```bash
bun install
```

2. **ตั้งค่า Database**
```bash
# สร้าง database และ migrate
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

3. **รันเซิร์ฟเวอร์**
```bash
bun run dev
```

## ตัวอย่างการใช้งาน

### 1. สมัครสมาชิก
```bash
curl -X POST http://localhost:7878/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. เข้าสู่ระบบ
```bash
curl -X POST http://localhost:7878/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 3. ดูรายการหนังสือ (public)
```bash
curl http://localhost:7878/books
```

### 4. ดูรายละเอียดหนังสือ (ต้อง login)
```bash
curl -X GET http://localhost:7878/books/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. เพิ่มหนังสือใหม่ (admin only)
```bash
curl -X POST http://localhost:7878/books/admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "type": "Fiction",
    "description": "A classic American novel"
  }'
```

### 6. ดูข้อมูลผู้ใช้ปัจจุบัน
```bash
curl -X GET http://localhost:7878/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_elysia"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=7878
```

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
}

model Book {
  id          Int      @id @default(autoincrement())
  title       String
  author      String
  type        String
  description String?
  createdAt   DateTime @default(now())
}
```

## Features

- JWT Authentication
- Role-based Authorization
- MVC Architecture
- Request Logging (morgan-like)
- TypeScript Support
- Prisma ORM
- PostgreSQL Database
- Error Handling
- RESTful API Design
- Password Hashing (bcryptjs)

## Security Notes

- ใช้ bcryptjs สำหรับ hash password (salt rounds = 12)
- ควรใช้ environment variables สำหรับ JWT_SECRET
- ควรเพิ่ม rate limiting และ CORS configuration
- ควรเพิ่ม input validation ด้วย Zod หรือ Joi

## การทดสอบระบบ

หลังจากรันเซิร์ฟเวอร์แล้ว สามารถทดสอบได้ดังนี้:

1. **ทดสอบ Public Route**: `GET /books` (ไม่ต้อง login)
2. **ทดสอบ Register**: `POST /auth/register` 
3. **ทดสอบ Login**: `POST /auth/login`
4. **ทดสอบ Current User**: `GET /auth/me` (ต้อง login)
5. **ทดสอบ Admin Route**: `POST /books/admin` (ต้องเป็น admin)

## Troubleshooting

### ปัญหาที่พบบ่อย

1. **Database Connection Error**
   - ตรวจสอบ DATABASE_URL ใน .env
   - รัน `npx prisma migrate dev`

2. **JWT Token Error**
   - ตรวจสอบ JWT_SECRET ใน .env
   - ตรวจสอบ Authorization header format

3. **Role Authorization Error**
   - ตรวจสอบ role ใน database
   - ตรวจสอบ token payload

## การพัฒนาต่อ

- เพิ่ม input validation ด้วย Zod
- เพิ่ม rate limiting
- เพิ่ม CORS configuration
- เพิ่ม refresh token
- เพิ่ม password reset functionality
- เพิ่ม email verification