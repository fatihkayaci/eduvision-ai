export type UserRole = 'Student' | 'Parent' | 'Teacher' | 'Principal'

export interface LoginRequest {
  email: string
  password: string
  role: UserRole
}

export interface LoginResponse {
  userId: string
  firstName: string
  lastName: string
  role: UserRole
  accessToken: string
  expiresAtUtc: string
}
