import { useState, useEffect } from 'react'
import { decodeToken, initials } from '@/lib/token'
import { getCourses, getClassStudents } from '@/features/teacher/api/teacherApi'
import type { TeacherCourse, ClassStudent } from '@/features/teacher/types'

type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused'

const STATUS_OPTIONS: { key: AttendanceStatus; label: string }[] = [
  { key: 'present', label: 'G' },
  { key: 'late',    label: 'Geç' },
  { key: 'absent',  label: 'Y' },
  { key: 'excused', label: 'İ' },
]

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-500 text-white',
  late:    'bg-orange-400 text-white',
  absent:  'bg-red-500 text-white',
  excused: 'bg-blue-500 text-white',
}

const STATUS_INACTIVE = 'bg-muted text-muted-foreground hover:bg-muted/80'

export function AttendancePage() {
  const [teacherId, setTeacherId] = useState('')
  const [token, setToken] = useState('')
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(null)
  const [students, setStudents] = useState<ClassStudent[]>([])
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const payload = decodeToken(t)
    setTeacherId(payload.sub)
    setToken(t)
    getCourses(payload.sub, t).then(setCourses)
  }, [])

  useEffect(() => {
    if (!selectedCourse || !teacherId || !token) return
    getClassStudents(teacherId, selectedCourse.classroomCourseId, token).then((data) => {
      setStudents(data)
      const initial: Record<string, AttendanceStatus> = {}
      data.forEach(s => { initial[s.studentId] = 'present' })
      setStatuses(initial)
    })
  }, [selectedCourse, teacherId, token])

  function setStatus(studentId: string, status: AttendanceStatus) {
    setStatuses(prev => ({ ...prev, [studentId]: status }))
  }

  const counts = {
    present: Object.values(statuses).filter(s => s === 'present').length,
    late:    Object.values(statuses).filter(s => s === 'late').length,
    absent:  Object.values(statuses).filter(s => s === 'absent').length,
    excused: Object.values(statuses).filter(s => s === 'excused').length,
  }

  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-8">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Yoklama
          </h2>
          {selectedCourse ? (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCourse.gradeLevel}-{selectedCourse.section} · {selectedCourse.courseName} · {today}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">Sınıf seçin</p>
          )}
        </div>

        {selectedCourse && (
          <button className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Yoklamayı kaydet
          </button>
        )}
      </div>

      {/* Sınıf seçimi */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {courses.map((course) => {
          const isSelected = course.classroomCourseId === selectedCourse?.classroomCourseId
          return (
            <button
              key={course.classroomCourseId}
              onClick={() => setSelectedCourse(course)}
              className={[
                'rounded-2xl p-5 text-left transition-colors',
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border hover:bg-muted',
              ].join(' ')}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {course.gradeLevel}-{course.section}
                </span>
                {isSelected && (
                  <span className="text-xs font-medium bg-white/20 text-white rounded px-2 py-0.5">
                    Seçili
                  </span>
                )}
              </div>
              <p className={['text-sm font-medium', isSelected ? 'text-white/80' : 'text-muted-foreground'].join(' ')}>
                {course.courseName}
              </p>
              <p className={['mt-2 text-xs', isSelected ? 'text-white/60' : 'text-muted-foreground/70'].join(' ')}>
                {course.studentCount} öğrenci
              </p>
            </button>
          )
        })}
      </div>

      {/* Özet + öğrenci listesi */}
      {selectedCourse && students.length > 0 && (
        <>
          {/* Özet */}
          <div className="mb-6 flex items-center justify-between bg-white rounded-2xl border border-border px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                {counts.present} Geldi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                {counts.late} Geç
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                {counts.absent} Yok
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
                {counts.excused} İzinli
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Hepsini işaretle:
              <button
                onClick={() => {
                  const all: Record<string, AttendanceStatus> = {}
                  students.forEach(s => { all[s.studentId] = 'present' })
                  setStatuses(all)
                }}
                className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
              >
                Tümü geldi
              </button>
            </div>
          </div>

          {/* Öğrenci kartları - 2 sütun */}
          <div className="grid grid-cols-2 gap-3">
            {students.map((student, index) => {
              const current = statuses[student.studentId] ?? 'present'
              return (
                <div
                  key={student.studentId}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-border px-5 py-3.5"
                >
                  <span className="text-sm text-muted-foreground w-6 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {initials(student.firstName, student.lastName)}
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground">
                    {student.firstName} {student.lastName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {STATUS_OPTIONS.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setStatus(student.studentId, key)}
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                          current === key ? STATUS_COLORS[key] : STATUS_INACTIVE,
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

    </div>
  )
}
