import type { StudentProfile, StudentCourse, StudentAttendances, Assignment, ScheduleEntry, Term, StudentRank } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getTerms(schoolId: string, token: string): Promise<Term[]> {
  const res = await fetch(`${BASE_URL}/api/terms/${schoolId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Dönemler alınamadı')
  return res.json()
}

export async function getStudentProfile(studentId: string, token: string): Promise<StudentProfile> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Profil alınamadı')
  return res.json()
}

export async function getStudentCourses(studentId: string, termId: string, token: string): Promise<StudentCourse[]> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/courses?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Dersler alınamadı')
  return res.json()
}

export async function getStudentSchedule(studentId: string, termId: string, token: string): Promise<ScheduleEntry[]> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/schedule?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Ders programı alınamadı')
  return res.json()
}

export async function getStudentAssignments(studentId: string, termId: string, token: string): Promise<Assignment[]> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/assignments?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Ödevler alınamadı')
  return res.json()
}

export async function getStudentRank(studentId: string, termId: string, token: string): Promise<StudentRank | null> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/rank?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 204) return null
  if (!res.ok) throw new Error('Sıralama alınamadı')
  return res.json()
}

export async function getStudentAttendances(studentId: string, termId: string, token: string): Promise<StudentAttendances> {
  const res = await fetch(`${BASE_URL}/api/student/${studentId}/attendances?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Devamsızlık verisi alınamadı')
  return res.json()
}
