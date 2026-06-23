import type { TeacherCourse } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getCourses(teacherId: string, token: string): Promise<TeacherCourse[]> {
  const res = await fetch(`${BASE_URL}/api/teacher/${teacherId}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Dersler alınamadı')

  return res.json()
}
