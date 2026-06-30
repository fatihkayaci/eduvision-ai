import { useState, useEffect, useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList, ResponsiveContainer,
} from 'recharts'
import { TrendingDown, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'
import { getClassStudents } from '@/features/teacher/api/teacherApi'
import type { ClassStudent } from '@/features/teacher/types'
import type { TeacherOutletContext } from './Layout'


const QUICK_STUDENTS = [
  { name: 'Elif Yıldız',  status: 'Geldi', color: 'text-green-700 bg-green-100' },
  { name: 'Ada Demir',    status: 'Yok',   color: 'text-red-600 bg-red-100'   },
  { name: 'Burak Yılmaz', status: 'Geç',   color: 'text-orange-600 bg-orange-100' },
]

export function TeacherDashboardPage() {
  const { activeCourse, courses, setActiveCourse } = useOutletContext<TeacherOutletContext>()
  const [teacherId, setTeacherId] = useState('')
  const [token, setToken] = useState('')
  const [students, setStudents] = useState<ClassStudent[]>([])
  const [classDropdownOpen, setClassDropdownOpen] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const payload = decodeToken(t)
    setTeacherId(payload.sub)
    setToken(t)
  }, [])

  useEffect(() => {
    if (!activeCourse || !teacherId || !token) return
    getClassStudents(teacherId, activeCourse.classroomCourseId, token).then(setStudents)
  }, [activeCourse, teacherId, token])

  const atRisk = [...students]
    .filter((s) => s.average != null)
    .sort((a, b) => (a.average ?? 100) - (b.average ?? 100))
    .slice(0, 4)

  const courseAvg = activeCourse?.average ?? 0

  const activeLabel = activeCourse
    ? `${activeCourse.gradeLevel}-${activeCourse.section} · ${activeCourse.courseName}`
    : '...'

  const gradeBins = useMemo(() => {
    const bins = [0, 0, 0, 0, 0]
    students.forEach((s) => {
      if (s.average == null) return
      if (s.average < 40) bins[0]++
      else if (s.average < 60) bins[1]++
      else if (s.average < 75) bins[2]++
      else if (s.average < 90) bins[3]++
      else bins[4]++
    })
    return [
      { range: '0–40',   count: bins[0], color: '#dc2626' },
      { range: '40–60',  count: bins[1], color: '#d97706' },
      { range: '60–75',  count: bins[2], color: '#a5b4fc' },
      { range: '75–90',  count: bins[3], color: '#4f46e5' },
      { range: '90–100', count: bins[4], color: '#16a34a' },
    ]
  }, [students])

  return (
    <div className="p-8">

      {/* Class selector */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button
            onClick={() => setClassDropdownOpen((v) => !v)}
            className="flex items-center justify-between gap-1.5 w-44 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            {activeLabel}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {classDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-white shadow-md z-10">
              {courses.map((c) => {
                const label = `${c.gradeLevel}-${c.section} · ${c.courseName}`
                const isActive = c.classroomCourseId === activeCourse?.classroomCourseId
                return (
                  <button
                    key={c.classroomCourseId}
                    onClick={() => { setActiveCourse(c); setClassDropdownOpen(false) }}
                    className={[
                      'w-full px-3 py-2 text-left text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Sınıf Ortalaması
          </p>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {courseAvg > 0 ? courseAvg.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-muted-foreground mb-1">/100</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            ▲ 1.8 bu dönem
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Öğrenci
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {activeCourse?.studentCount ?? '—'}
            </span>
            {activeCourse && (
              <span className="text-sm text-muted-foreground mb-1">
                {activeCourse.gradeLevel}-{activeCourse.section} sınıfı
              </span>
            )}
          </div>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            28 aktif bugün
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Bugün Devamsız
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              4
            </span>
            <span className="text-sm text-muted-foreground mb-1">öğrenci</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
            2 özürsüz
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Bekleyen
          </p>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              2
            </span>
            <span className="text-sm text-muted-foreground mb-1">not girişi</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
            Türev sınavı
          </span>
        </div>

      </div>

      {/* Main two-column grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>

        {/* Left column */}
        <div className="space-y-4 min-w-0">

          {/* Not dağılımı */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Not dağılımı</h3>
                {activeCourse && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeCourse.gradeLevel}-{activeCourse.section} · son sınav (Türev Testi)
                  </p>
                )}
              </div>
              <Link
                to="/teacher/grades"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Detay <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gradeBins} barSize={52} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: 12, fontWeight: 700, fill: '#334155' }}
                  />
                  {gradeBins.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dikkat gerektirenler */}
          <div className="bg-white rounded-2xl border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Dikkat gerektirenler</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Notu düşen veya devamsızlığı artan öğrenciler
                </p>
              </div>
              <Link
                to="/teacher/classes"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Tüm sınıf <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {atRisk.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Öğrenci
                    </th>
                    <th className="px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Ortalama
                    </th>
                    <th className="px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Devamsızlık
                    </th>
                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.map((student) => {
                    const gap = Math.max(0, courseAvg - (student.average ?? courseAvg))
                    return (
                      <tr key={student.studentId} className="border-b border-border last:border-0">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {initials(student.firstName, student.lastName)}
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {student.firstName} {student.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center text-sm font-semibold text-amber-500">
                          {student.average != null ? student.average.toFixed(0) : '—'}
                        </td>
                        <td className="px-6 py-3 text-center text-sm text-muted-foreground">
                          {student.totalAbsent + student.totalExcused} gün
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-500">
                            <TrendingDown className="h-3.5 w-3.5" />
                            {gap > 0 ? gap.toFixed(0) : '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">
                {activeCourse ? 'Dikkat edilmesi gereken öğrenci yok.' : 'Sınıf verisi yükleniyor...'}
              </p>
            )}
          </div>

        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* AI Sınıf Raporu */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-[11px] font-bold">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sınıf Raporu</p>
                <p className="text-[11px] text-muted-foreground">bu hafta</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Sınıf ortalaması <span className="font-semibold text-foreground">türev</span> konusunda
              bekleninin altında (8 öğrenci 60 altı). Üst dilimde{' '}
              <span className="font-semibold text-foreground">11 öğrenci</span> 75–90 bandında
              yoğunlaşıyor. Ada, Burak ve Can son iki sınavda belirgin düşüşte — birebir destek önerilir.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                Türev zayıf
              </span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                3 öğrenci riskli
              </span>
            </div>
          </div>

          {/* Bugünkü ders */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Bugünkü ders</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                3. ders
              </span>
            </div>

            {activeCourse ? (
              <>
                <div className="mb-4">
                  <p className="text-base font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {activeCourse.gradeLevel}-{activeCourse.section} {activeCourse.courseName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">10:40 – 11:20 · B-204</p>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Hızlı yoklama
                </p>

                <div className="space-y-2.5 mb-4">
                  {QUICK_STUDENTS.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {s.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm text-foreground">{s.name}</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/teacher/attendance"
                  className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Yoklamayı tamamla
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Sparkles className="h-4 w-4 text-muted-foreground animate-pulse" />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
