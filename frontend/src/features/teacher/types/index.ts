export interface TeacherCourse {
  classroomCourseId: string
  courseName: string
  gradeLevel: number
  section: string
  studentCount: number
  average: number | null
}

export interface Term {
  id: string
  name: string
  year: number
  startDate: string
  endDate: string
}

export interface CourseAssignment {
  assignmentId: string
  title: string
  type: string
  dueDate: string
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
