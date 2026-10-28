export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  plan: 'FREE' | 'PLUS' | 'PRO'
  createdAt: string
  profile?: {
    companyName: string | null
    siren: string | null
    taxRegime: string | null
    phone: string | null
    address: string | null
  }
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface RegisterDto {
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface ApiError {
  success: false
  message: string
  errors?: { field: string; message: string }[]
}