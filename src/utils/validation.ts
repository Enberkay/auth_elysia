// ตรวจสอบรูปแบบอีเมล (basic RFC 5322)
export function validateEmail(email: string): boolean {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)
}

// ตรวจสอบรหัสผ่าน: อย่างน้อย 8 ตัว มีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ
export function validatePassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)
} 