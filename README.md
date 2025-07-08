# Auth System + Book API

ระบบตัวอย่างสำหรับทดสอบ authentication และ authorization ด้วย Elysia (Bun) + Prisma + JWT

## ฟีเจอร์
- สมัครสมาชิก / ล็อกอิน (JWT)
- CRUD หนังสือ (Book)
  - ดูรายชื่อหนังสือ (public)
  - ดูรายละเอียดหนังสือ (ต้อง login)
  - เพิ่ม/แก้ไข/ลบหนังสือ (admin เท่านั้น)
- ตัวอย่าง middleware เช็คสิทธิ์ (auth, role)

## การเริ่มต้นใช้งาน
1. ติดตั้ง dependency
   ```sh
   bun install
   ```
2. ตั้งค่า environment (สร้างไฟล์ `.env`)
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/auth-system
   JWT_SECRET=your_jwt_secret
   ```
3. รัน migration
   ```sh
   npx prisma migrate dev
   ```
4. เริ่มเซิร์ฟเวอร์
   ```sh
   bun run dev
   ```

## ตัวอย่าง API
- POST `/register` สมัครสมาชิก
- POST `/login` ล็อกอิน รับ JWT
- GET `/books` ดูรายชื่อหนังสือ (ไม่ต้อง login)
- GET `/books/:id` ดูรายละเอียด (ต้อง login)
- POST `/books` เพิ่มหนังสือ (admin)
- PUT `/books/:id` แก้ไข (admin)
- DELETE `/books/:id` ลบ (admin)

## การทดสอบ
- สามารถ import Postman collection (ไฟล์ JSON ที่แนบไว้) เพื่อทดสอบ API ได้ทันที (ยังไม่แนบ)
- หลัง login ให้นำ token ที่ได้ไปใส่ใน Authorization header (Bearer)

## หมายเหตุ
- User ที่สมัครใหม่จะมี role เป็น user โดยอัตโนมัติ
- หากต้องการทดสอบสิทธิ์ admin ให้แก้ role ในฐานข้อมูลเป็น 'admin' ด้วยตนเอง (ผ่าน DB tool หรือ Prisma Studio)