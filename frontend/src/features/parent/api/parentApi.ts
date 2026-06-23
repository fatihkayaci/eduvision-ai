import type { Student } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getStudents(parentId: string, token: string): Promise<Student[]> {
  const res = await fetch(`${BASE_URL}/api/parent/${parentId}/students`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Öğrenciler alınamadı')

  return res.json()
}
