export interface JWTUser {
  id: number
  email: string
  role: 'admin' | 'user'
}

export interface CreateUserDto {
  /**
   * Email ต้องเป็นรูปแบบอีเมลที่ถูกต้อง (RFC 5322)
   */
  email: string
  /**
   * Password ต้องมีอย่างน้อย 8 ตัว มีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ
   */
  password: string
  role?: 'admin' | 'user'
  isActive?: boolean
}

export interface LoginDto {
  email: string
  password: string
}
