export interface StudentRank {
  rank: number
  totalStudents: number
}

export interface Term {
  id: string
  name: string
  year: number
  startDate: string
  endDate: string
}

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

export interface AttendanceRecord {
  date: string
  type: 'Absent' | 'Excused'
  note: string | null
}

export interface ScheduleEntry {
  courseName: string
  weekday: string
  startTime: string
  endTime: string
}

export interface Assignment {
  id: string
  title: string
  description: string | null
  type: 'Homework' | 'Exam'
  fileUrl: string | null
  startDate: string
  dueDate: string
}

export interface StudentAttendances {
  totalAbsent: number
  totalExcused: number
  records: AttendanceRecord[]
}
