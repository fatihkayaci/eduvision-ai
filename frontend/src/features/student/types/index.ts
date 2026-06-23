export interface StudentProfile {
  studentNumber: string
  classroom: string | null
}

export interface Grade {
  value: number
  examType: string
  date: string
}

export interface StudentCourse {
  classroomCourseId: string
  courseName: string
  grades: Grade[]
}
