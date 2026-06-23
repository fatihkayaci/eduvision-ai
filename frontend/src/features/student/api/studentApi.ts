import type { StudentProfile, StudentCourse, StudentAttendances, Assignment } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getStudentProfile(studentId: string, token: string): Promise<StudentProfile> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Profil alınamadı')

  return res.json()
}

export async function getStudentCourses(studentId: string, token: string): Promise<StudentCourse[]> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Dersler alınamadı')

  return res.json()
}

export async function getStudentAssignments(studentId: string, token: string): Promise<Assignment[]> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/assignments`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Ödevler alınamadı')

  return res.json()
}

export async function getStudentAttendances(studentId: string, token: string): Promise<StudentAttendances> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/attendances`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Devamsızlık verisi alınamadı')

  return res.json()
}
