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

export interface GradePoint {
  name: string
  score: number
  date: string
  type: string
}

export interface StudentDetailState {
  student: ClassStudent
  course: TeacherCourse
  allStudents: ClassStudent[]
}

export interface TeacherScheduleEntry {
  courseName: string
  gradeLevel: number
  section: string
  weekday: string
  startTime: string
  endTime: string
}
