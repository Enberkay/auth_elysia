export interface JWTUser {
  id: number
  email: string
  role: 'admin' | 'user'
}

export interface CreateUserDto {
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface LoginDto {
  email: string
  password: string
}
