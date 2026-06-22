import type { LoginRequest, LoginResponse } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/api/authentication/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? 'Giriş başarısız')
  }

  return res.json()
}
