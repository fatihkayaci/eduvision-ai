import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useOutletContext } from 'react-router-dom'
import { decodeToken } from '@/lib/token'
import { getStudentCourses, getStudentAttendances, getStudentAssignments } from '@/features/student/api/studentApi'
import type { StudentCourse, StudentAttendances, Assignment, AttendanceRecord } from '@/features/student/types'
import type { StudentLayoutContext } from './Layout'

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum']
const COURSE_COLORS = ['#6366f1', '#22c55e', '#f97316', '#8b5cf6', '#14b8a6']

function courseAverage(c: StudentCourse): number {
  if (!c.grades.length) return 0
  return c.grades.reduce((s, g) => s + g.value, 0) / c.grades.length
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysUntil(dateStr: string): number {
  const due = parseDate(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDateBox(dateStr: string) {
  const [, m, d] = dateStr.split('-').map(Number)
  return { day: String(d).padStart(2, '0'), month: MONTHS[m - 1] }
}

function buildChartData(courses: StudentCourse[]) {
  const monthSet = new Set<string>()
  courses.forEach(c => c.grades.forEach(g => {
    const [y, m] = g.date.split('-')
    monthSet.add(`${y}-${m}`)
  }))

  return Array.from(monthSet).sort().map(ym => {
    const [, m] = ym.split('-')
    const entry: Record<string, string | number> = { month: MONTHS[parseInt(m) - 1] }
    courses.forEach(c => {
      const monthGrades = c.grades.filter(g => g.date.startsWith(ym))
      if (monthGrades.length)
        entry[c.courseName] = Math.round(monthGrades.reduce((s, g) => s + g.value, 0) / monthGrades.length)
    })
    return entry
  })
}

function buildMiniCalendar(records: AttendanceRecord[]) {
  const recordMap = new Map(records.map(r => [r.date, r]))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const thisMonday = new Date(today)
  thisMonday.setDate(today.getDate() + mondayOffset)

  const startDate = new Date(thisMonday)
  startDate.setDate(thisMonday.getDate() - 9 * 7)

  const weeks: string[][] = []
  for (let w = 0; w < 10; w++) {
    const week: string[] = []
    for (let d = 0; d < 5; d++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + w * 7 + d)
      week.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
    }
    weeks.push(week)
  }

  return { weeks, recordMap }
}

function calendarDayColor(dateStr: string, recordMap: Map<string, AttendanceRecord>, today: Date): string {
  if (parseDate(dateStr) > today) return 'bg-muted/30'
  const record = recordMap.get(dateStr)
  if (!record) return 'bg-green-500'
  if (record.type === 'Absent') return 'bg-red-500'
  return 'bg-yellow-400'
}

function weekDateRange(): string {
  const today = new Date()
  const dow = today.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  return `${monday.getDate()}-${friday.getDate()} ${MONTHS[today.getMonth()]}`
}

function generateSummary(courses: StudentCourse[], attendance: StudentAttendances | null): string {
  const parts: string[] = []
  courses.filter(c => c.grades.length >= 2).forEach(c => {
    const first = c.grades[0].value
    const last = c.grades[c.grades.length - 1].value
    const diff = last - first
    if (diff >= 8) parts.push(`${c.courseName} dersinde belirgin bir yükseliş var (${first}→${last}).`)
    else if (diff <= -8) parts.push(`${c.courseName} dersinde düşüş görülüyor (${first}→${last}); tekrar faydalı olabilir.`)
    else parts.push(`${c.courseName} istikrarlı seyrediyor.`)
  })
  if (attendance?.totalAbsent === 0 && attendance?.totalExcused === 0)
    parts.push('Bu dönem hiç devamsızlık yok, katılım mükemmel!')
  else if (attendance?.totalAbsent)
    parts.push(`${attendance.totalAbsent} özürsüz devamsızlık var, takip edilmesinde fayda var.`)
  return parts.join(' ') || 'Veri yükleniyor...'
}

function getSummaryTags(courses: StudentCourse[], attendance: StudentAttendances | null): string[] {
  const tags: string[] = []
  courses.filter(c => c.grades.length >= 2).forEach(c => {
    const first = c.grades[0].value
    const last = c.grades[c.grades.length - 1].value
    if (last > first) tags.push(`${c.courseName} +`)
  })
  if (attendance?.totalAbsent === 0) tags.push('Devamsızlık yok')
  return tags.slice(0, 4)
}

function StatCard({
  label, value, unit, badge, badgeColor = 'gray',
}: {
  label: string
  value: string
  unit?: string
  badge?: string
  badgeColor?: 'green' | 'orange' | 'blue' | 'gray'
}) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-muted text-muted-foreground',
  }
  return (
    <div className="rounded-xl bg-white border border-border p-5">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</p>
        {unit && <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>}
      </div>
      {badge && (
        <span className={`mt-2 inline-block rounded-full text-xs font-medium px-2.5 py-0.5 ${colors[badgeColor]}`}>
          {badge}
        </span>
      )}
    </div>
  )
}

export function StudentDashboardPage() {
  const { termId } = useOutletContext<StudentLayoutContext>()
  const [courses, setCourses] = useState<StudentCourse[]>([])
  const [attendance, setAttendance] = useState<StudentAttendances | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    if (!termId) return
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const { sub } = decodeToken(token)
    Promise.all([
      getStudentCourses(sub, termId, token),
      getStudentAttendances(sub, termId, token),
      getStudentAssignments(sub, termId, token),
    ]).then(([c, a, as]) => {
      setCourses(c)
      setAttendance(a)
      setAssignments(as)
    }).catch(console.error)
  }, [termId])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const gradedCourses = courses.filter(c => c.grades.length > 0)
  const overallAverage = gradedCourses.length > 0
    ? gradedCourses.reduce((s, c) => s + courseAverage(c), 0) / gradedCourses.length
    : 0

  const upcoming = assignments.filter(a => parseDate(a.dueDate) >= today)
  const nearestDays = upcoming.length > 0 ? daysUntil(upcoming[0].dueDate) : null

  const chartData = buildChartData(courses)
  const calendar = attendance && attendance.records.length > 0
    ? buildMiniCalendar(attendance.records)
    : null

  return (
    <div className="p-8 space-y-4">

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Genel Ortalama"
          value={overallAverage > 0 ? overallAverage.toFixed(1) : '—'}
          unit={overallAverage > 0 ? '/100' : undefined}
        />
        <StatCard
          label="Sınıf Sıralaması"
          value="—"
        />
        <StatCard
          label="Devamsızlık"
          value={attendance ? String(attendance.totalAbsent + attendance.totalExcused) : '—'}
          unit={attendance ? 'gün' : undefined}
          badge={attendance?.totalAbsent ? `${attendance.totalAbsent} özürsüz` : undefined}
          badgeColor="orange"
        />
        <StatCard
          label="Yaklaşan"
          value={upcoming.length > 0 ? String(upcoming.length) : '—'}
          unit={upcoming.length > 0 ? 'ödev / sınav' : undefined}
          badge={nearestDays !== null ? `en yakın ${nearestDays} gün` : undefined}
          badgeColor="blue"
        />
      </div>

      {/* Chart + AI Summary */}
      <div className="grid grid-cols-[1fr_380px] gap-4">

        <div className="rounded-xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Not gelişimi</h2>
              <p className="text-xs text-muted-foreground">Ders bazında sınav ortalamaları</p>
            </div>
            <div className="flex items-center gap-4">
              {courses.slice(0, 3).map((c, i) => (
                <span key={c.classroomCourseId} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-0.5 w-5 rounded-full inline-block" style={{ backgroundColor: COURSE_COLORS[i] }} />
                  {c.courseName}
                </span>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                {courses.map((c, i) => (
                  <Line
                    key={c.classroomCourseId}
                    type="monotone"
                    dataKey={c.courseName}
                    stroke={COURSE_COLORS[i % COURSE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COURSE_COLORS[i % COURSE_COLORS.length] }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">
              Henüz not verisi yok.
            </div>
          )}
        </div>

        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">AI</span>
            </div>
            <p className="text-sm font-semibold text-foreground">Haftalık Özet</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{weekDateRange()}</p>
          <p className="text-sm text-foreground/80 leading-relaxed flex-1">
            {generateSummary(courses, attendance)}
          </p>
          {courses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {getSummaryTags(courses, attendance).map(tag => (
                <span key={tag} className="rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Calendar + Upcoming */}
      <div className="grid grid-cols-[1fr_380px] gap-4">

        <div className="rounded-xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Devamsızlık takvimi</h2>
              <p className="text-xs text-muted-foreground">Son 10 hafta · hafta içi</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-green-500 inline-block" /> Geldi</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-yellow-400 inline-block" /> Geç</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500 inline-block" /> Gelmedi</span>
            </div>
          </div>
          {calendar ? (
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-2 mt-5">
                {DAYS.map(d => (
                  <span key={d} className="text-[10px] text-muted-foreground w-6 text-right leading-5">{d}</span>
                ))}
              </div>
              {calendar.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground text-center leading-4">
                    {week[0].split('-')[2]}/{week[0].split('-')[1]}
                  </span>
                  {week.map((dateStr, di) => (
                    <div
                      key={di}
                      className={`h-5 w-5 rounded-sm ${calendarDayColor(dateStr, calendar.recordMap, today)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Devamsızlık kaydı bulunamadı.</p>
          )}
        </div>

        <div className="rounded-xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Yaklaşanlar</h2>
            <span className="text-xs text-muted-foreground">Tümü →</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Yaklaşan ödev veya sınav yok.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 4).map(a => {
                const { day, month } = formatDateBox(a.dueDate)
                const days = daysUntil(a.dueDate)
                const isExam = a.type === 'Exam'
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className={`flex flex-col items-center justify-center h-12 w-10 shrink-0 rounded-xl font-bold ${isExam ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      <span className="text-base leading-none">{day}</span>
                      <span className="text-[10px] uppercase tracking-wide">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {days === 0 ? 'Bugün' : `${days} gün kaldı`}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${isExam ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {isExam ? 'Sınav' : 'Ödev'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
