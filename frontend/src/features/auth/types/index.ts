export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

export interface LoginRequest {
  email: string
  password: string
  role: UserRole
}

export interface LoginResponse {
  userId: string
  firstName: string
  lastName: string
  accessToken: string
  expiresAtUtc: string
}

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
}
