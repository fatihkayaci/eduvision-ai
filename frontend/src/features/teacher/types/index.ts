export interface TeacherCourse {
  classroomCourseId: string
  courseName: string
  gradeLevel: number
  section: string
  studentCount: number
  average: number | null
}

export interface ClassStudent {
  studentId: string
  firstName: string
  lastName: string
  studentNumber: string
  average: number | null
  totalAbsent: number
  totalExcused: number
}
