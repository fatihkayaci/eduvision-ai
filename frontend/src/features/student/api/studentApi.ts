import type { StudentProfile } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getStudentProfile(studentId: string, token: string): Promise<StudentProfile> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Profil alınamadı')

  return res.json()
}
