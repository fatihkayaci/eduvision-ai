import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'
import { getCourses, getClassStudents } from '@/features/teacher/api/teacherApi'
import type { TeacherCourse, ClassStudent } from '@/features/teacher/types'

export function ClassesPage() {
  const [teacherId, setTeacherId] = useState('')
  const [token, setToken] = useState('')
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(null)
  const [students, setStudents] = useState<ClassStudent[]>([])

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const payload = decodeToken(t)
    setTeacherId(payload.sub)
    setToken(t)

    getCourses(payload.sub, t).then((data) => {
      setCourses(data)
      if (data.length > 0) setSelectedCourse(data[0])
    })
  }, [])

  useEffect(() => {
    if (!selectedCourse || !teacherId || !token) return
    getClassStudents(teacherId, selectedCourse.classroomCourseId, token).then(setStudents)
  }, [selectedCourse, teacherId, token])

  return (
    <div className="p-8">

      {/* Başlık */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
          Sınıflarım
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {courses.length} sınıf
        </p>
      </div>

      {/* Sınıf kartları */}
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
              <div className={['mt-3 flex items-center justify-between text-xs', isSelected ? 'text-white/70' : 'text-muted-foreground'].join(' ')}>
                <span>{course.studentCount} öğrenci</span>
                <span>{course.average != null ? `Ort. ${course.average.toFixed(1)}` : '—'}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Öğrenci listesi */}
      {selectedCourse && (
        <div className="bg-white rounded-2xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-foreground">
              {selectedCourse.gradeLevel}-{selectedCourse.section} öğrenci listesi
            </h3>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ortalama
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Devamsız
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Durum
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.studentId} className="border-b border-border last:border-0 hover:bg-muted/60 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {initials(student.firstName, student.lastName)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </span>
                        <p className="text-xs text-muted-foreground">{student.studentNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    {student.average != null ? student.average.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <span className={student.totalAbsent > 0 ? 'font-medium text-red-500' : 'text-muted-foreground'}>
                      {student.totalAbsent}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    {student.totalAbsent >= 10 ? (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Kritik</span>
                    ) : student.totalAbsent >= 5 ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Riskli</span>
                    ) : student.totalAbsent > 0 || student.totalExcused > 0 ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Takipte</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Normal</span>
                    )}
                  </td>
                  <td className="pr-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
