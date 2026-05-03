export interface RegisterDto {
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
    plan: string
  }
  token: string
}