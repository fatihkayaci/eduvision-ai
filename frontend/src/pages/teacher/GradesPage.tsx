import { useState, useEffect } from 'react'
import { CheckCircle2, Save, Send } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'
import { getCourses, getCourseAssignments, getClassStudents, getTerms } from '@/features/teacher/api/teacherApi'
import type { TeacherCourse, CourseAssignment, ClassStudent, Term } from '@/features/teacher/types'

export function GradesPage() {
  const [teacherId, setTeacherId] = useState('')
  const [token, setToken] = useState('')
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [selectedTermId, setSelectedTermId] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(null)
  const [assignments, setAssignments] = useState<CourseAssignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<CourseAssignment | null>(null)
  const [students, setStudents] = useState<ClassStudent[]>([])
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const payload = decodeToken(t)
    setTeacherId(payload.sub)
    setToken(t)

    Promise.all([
      getCourses(payload.sub, t),
      getTerms(payload.school_id, t),
    ]).then(([courseData, termData]) => {
      setCourses(courseData)
      setTerms(termData)
      if (termData.length > 0) setSelectedTermId(termData[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selectedCourse || !teacherId || !token || !selectedTermId) return
    setSelectedAssignment(null)
    setStudents([])
    getCourseAssignments(teacherId, selectedCourse.classroomCourseId, selectedTermId, token)
      .then(setAssignments)
  }, [selectedCourse, teacherId, token, selectedTermId])

  useEffect(() => {
    if (!selectedAssignment || !selectedCourse || !teacherId || !token) return
    getClassStudents(teacherId, selectedCourse.classroomCourseId, token).then((data) => {
      setStudents(data)
      setGrades({})
      setSaved(false)
      setSent(false)
    })
  }, [selectedAssignment, selectedCourse, teacherId, token])

  return (
    <div className="p-8">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Not Girişi
          </h2>
          {selectedCourse && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCourse.gradeLevel}-{selectedCourse.section} · {selectedCourse.courseName} · {selectedCourse.studentCount} öğrenci
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {terms.map(term => (
            <button
              key={term.id}
              onClick={() => setSelectedTermId(term.id)}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                selectedTermId === term.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground hover:bg-muted',
              ].join(' ')}
            >
              {term.name}
            </button>
          ))}
        </div>
      </div>

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

      {selectedCourse && assignments.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Değerlendirme seç
          </p>
          <div className="flex flex-wrap gap-2">
            {assignments.map((a) => {
              const isSelected = a.assignmentId === selectedAssignment?.assignmentId
              return (
                <button
                  key={a.assignmentId}
                  onClick={() => setSelectedAssignment(a)}
                  className={[
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-white text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  <span>{a.title}</span>
                  <span className="ml-2 text-xs opacity-60">
                    {a.type === 'Exam' ? 'Yazılı' : 'Ödev'} · {new Date(a.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedCourse && assignments.length === 0 && (
        <p className="mb-8 text-sm text-muted-foreground">Bu sınıfa ait değerlendirme bulunamadı.</p>
      )}

      {selectedAssignment && students.length > 0 && (
        <div className="bg-white rounded-2xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-semibold text-foreground">
              {selectedAssignment.title}
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
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                  Not
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.studentId} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-3">
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
                  <td className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                    {student.average != null ? student.average.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={grades[student.studentId] ?? ''}
                      onChange={(e) => {
                        setGrades(prev => ({ ...prev, [student.studentId]: e.target.value }))
                        setSaved(false)
                        setSent(false)
                      }}
                      placeholder="—"
                      className="w-20 rounded-lg border border-border bg-white px-3 py-1.5 text-center text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Kaydedildi
              </span>
            )}
            {sent && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Gönderildi
              </span>
            )}
            <button
              onClick={() => setSaved(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Notları kaydet
            </button>
            <button
              onClick={() => setSent(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Notları gönder
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
