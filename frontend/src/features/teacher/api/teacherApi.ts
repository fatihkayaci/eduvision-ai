import type { ClassStudent, CourseAssignment, TeacherCourse, TeacherScheduleEntry, Term } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

export async function getCourses(teacherId: string, token: string): Promise<TeacherCourse[]> {
  const res = await fetch(`${BASE_URL}/api/teacher/${teacherId}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Dersler alınamadı')

  return res.json()
}

export async function getClassStudents(teacherId: string, classroomCourseId: string, token: string): Promise<ClassStudent[]> {
  const res = await fetch(`${BASE_URL}/api/teacher/${teacherId}/classrooms/${classroomCourseId}/students`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Öğrenciler alınamadı')

  return res.json()
}

export async function getTerms(schoolId: string, token: string): Promise<Term[]> {
  const res = await fetch(`${BASE_URL}/api/terms/${schoolId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Dönemler alınamadı')

  return res.json()
}

export async function getCourseAssignments(teacherId: string, classroomCourseId: string, termId: string, token: string): Promise<CourseAssignment[]> {
  const res = await fetch(`${BASE_URL}/api/teacher/${teacherId}/classrooms/${classroomCourseId}/assignments?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Sınavlar alınamadı')

  return res.json()
}

export async function getSchedule(teacherId: string, termId: string, token: string): Promise<TeacherScheduleEntry[]> {
  const res = await fetch(`${BASE_URL}/api/teacher/${teacherId}/schedule?termId=${termId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('Ders programı alınamadı')

  return res.json()
}
