import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { decodeToken } from '@/lib/token'
import { getStudentCourses } from '@/features/student/api/studentApi'
import type { StudentCourse, Grade } from '@/features/student/types'

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${parseInt(day)} ${MONTHS[parseInt(month) - 1]}`
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  Exam: 'Yazılı',
  Homework: 'Ödev',
  Project: 'Proje',
}

const COURSE_COLORS = [
  'bg-primary text-white',
  'bg-green-500 text-white',
  'bg-orange-500 text-white',
  'bg-purple-500 text-white',
  'bg-teal-500 text-white',
  'bg-yellow-500 text-white',
]

function courseAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0
  return grades.reduce((sum, g) => sum + g.value, 0) / grades.length
}

function scoreColorClass(value: number): string {
  if (value >= 85) return 'text-green-600'
  if (value >= 70) return 'text-yellow-600'
  return 'text-red-500'
}

function buildGradeNames(grades: Grade[]): string[] {
  const typeCount: Record<string, number> = {}
  return grades.map(g => {
    typeCount[g.examType] = (typeCount[g.examType] || 0) + 1
    const label = EXAM_TYPE_LABELS[g.examType] ?? g.examType
    return `${typeCount[g.examType]}. ${label}`
  })
}

export function GradesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const { sub } = decodeToken(token)
    getStudentCourses(sub, token).then(setCourses).catch(console.error)
  }, [])

  const averages = courses.map(c => courseAverage(c.grades))
  
  const gradedAverages = averages.filter((_, i) => courses[i].grades.length > 0)
  const overallAverage = gradedAverages.length > 0
    ? gradedAverages.reduce((a, b) => a + b, 0) / gradedAverages.length
    : 0
  const bestIdx = averages.indexOf(Math.max(...gradedAverages))
  const bestCourse = courses[bestIdx]

  return (
    <div className="p-8 space-y-6">

      {/* Summary Banner */}
      {courses.length > 0 && (
        <div className="rounded-2xl bg-primary px-8 py-6 flex items-center gap-10 text-white">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-1">Genel Ortalama</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                {overallAverage.toFixed(1)}
              </span>
              <span className="text-white/60 text-sm mb-1">/100</span>
            </div>
          </div>

          <div className="w-px h-12 bg-white/20" />

          <div>
            <p className="text-xs text-white/60 mb-1">En İyi Ders</p>
            <p className="font-semibold text-sm">
              {bestCourse?.courseName}
              <span className="text-white/70 font-normal"> · {averages[bestIdx]?.toFixed(0)}</span>
            </p>
          </div>

          <div className="ml-auto text-xs text-white/50">
            {courses.length} ders
          </div>
        </div>
      )}

      {/* Course Cards */}
      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="rounded-xl bg-white border border-border py-16 text-center text-sm text-muted-foreground">
            Henüz ders kaydı bulunamadı.
          </div>
        ) : (
          courses.map((course, idx) => {
            const avg = averages[idx]
            const isExpanded = expandedId === course.classroomCourseId
            const gradeNames = buildGradeNames(course.grades)

            return (
              <div key={course.classroomCourseId} className="rounded-xl bg-white border border-border overflow-hidden">

                {/* Course Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : course.classroomCourseId)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors text-left"
                >
                  {/* Abbr Avatar */}
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${COURSE_COLORS[idx % COURSE_COLORS.length]}`}>
                    {course.courseName.slice(0, 3)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{course.courseName}</p>
                    <p className="text-xs text-muted-foreground">{course.grades.length} not</p>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="flex items-end gap-0.5 h-6 shrink-0">
                    {course.grades.slice(0, 5).map((g, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-sm bg-primary"
                        style={{
                          height: `${Math.max(4, Math.round((g.value / 100) * 24))}px`,
                          opacity: 0.4 + (i / Math.max(course.grades.length, 1)) * 0.6,
                        }}
                      />
                    ))}
                  </div>

                  {/* Average + chevron */}
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`text-lg font-bold ${scoreColorClass(avg)}`}>
                      {avg.toFixed(1)}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                </button>

                {/* Grade Table */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {course.grades.length === 0 ? (
                      <p className="px-6 py-4 text-sm text-muted-foreground">Henüz not girilmemiş.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
                            <th className="px-6 py-2.5 text-left font-medium">Sınav</th>
                            <th className="px-4 py-2.5 text-left font-medium">Tür</th>
                            <th className="px-4 py-2.5 text-left font-medium">Tarih</th>
                            <th className="px-6 py-2.5 text-right font-medium">Not</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.grades.map((grade, i) => (
                            <tr key={i} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="px-6 py-3 font-medium text-foreground">
                                {gradeNames[i]}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {EXAM_TYPE_LABELS[grade.examType] ?? grade.examType}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(grade.date)}
                              </td>
                              <td className={`px-6 py-3 text-right font-semibold ${scoreColorClass(grade.value)}`}>
                                {grade.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
