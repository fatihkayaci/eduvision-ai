import { useLocation, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react'
import { initials } from '@/lib/token'
import type { GradePoint, StudentDetailState } from '@/features/teacher/types'

function buildGradeHistory(avg: number): GradePoint[] {
  const meta = [
    { name: '1.Yaz',  date: '12 Eki', type: '1. Yazılı' },
    { name: 'Quiz',   date: '15 Kas', type: 'Quiz' },
    { name: '2.Yaz',  date: '8 Ara',  type: '2. Yazılı' },
    { name: 'Proje',  date: '19 Mar', type: 'Proje · Türev Uyg.' },
    { name: '3.Yaz',  date: '18 Haz', type: '3. Yazılı · Türev' },
  ]

  let scores: number[]
  if (avg < 60) {
    const end = Math.round(avg)
    scores = [
      Math.min(95, end + 35),
      Math.min(90, end + 22),
      Math.min(85, end + 13),
      Math.min(80, end + 8),
      end,
    ]
  } else if (avg < 75) {
    scores = [
      Math.round(avg + 12),
      Math.round(avg + 6),
      Math.round(avg + 1),
      Math.round(avg - 4),
      Math.round(avg - 9),
    ]
  } else {
    scores = [
      Math.round(avg - 4),
      Math.round(avg + 4),
      Math.round(avg - 2),
      Math.round(avg + 5),
      Math.round(avg),
    ]
  }

  return meta.map((m, i) => ({ ...m, score: Math.max(0, Math.min(100, scores[i])) }))
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

function buildAiNote(student: ClassStudent, history: GradePoint[]) {
  const first = history[0].score
  const last = history[history.length - 1].score
  const isDeclining = last < first - 5

  if (isDeclining && student.totalAbsent >= 3) {
    return `${student.firstName}'nın notları ${history.length} sınavdır istikrarlı düşüşte (${first} → ${last}). Aynı dönemde devamsızlığı arttı (${student.totalAbsent} gün). Akademik düşüş ile devam sorunu birlikte seyrediyor — veli görüşmesi önerilir.`
  }
  if (isDeclining) {
    return `${student.firstName}'nın notlarında son dönemde ${first - last} puanlık düşüş gözlemlendi (${first} → ${last}). Konu bazlı tekrar ve bireysel destek önerilir.`
  }
  return `${student.firstName} stabil bir seyir izliyor. Ortalama ${student.average?.toFixed(1)} ile sınıf performansına yakın. Mevcut tempo korunursa dönem sonu başarı bekleniyor.`
}

function statusBadge(student: ClassStudent) {
  if ((student.average ?? 100) < 60 || student.totalAbsent >= 5) {
    return { label: 'Dikkat gerektiriyor', cls: 'bg-red-100 text-red-600' }
  }
  if ((student.average ?? 100) < 70 || student.totalAbsent >= 3) {
    return { label: 'Takipte', cls: 'bg-amber-100 text-amber-600' }
  }
  return { label: 'Normal', cls: 'bg-green-100 text-green-700' }
}

const TOTAL_CLASSES = 55

export function StudentDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as StudentDetailState | null

  if (!state) {
    navigate('/teacher/classes', { replace: true })
    return null
  }

  const { student, course, allStudents } = state

  const gradeHistory = buildGradeHistory(student.average ?? 65)
  const firstScore = gradeHistory[0].score
  const lastScore = gradeHistory[gradeHistory.length - 1].score
  const isDeclining = lastScore < firstScore - 5

  const rank = [...allStudents]
    .filter((s) => s.average != null)
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0))
    .findIndex((s) => s.studentId === student.studentId) + 1

  const attendanceRate = Math.round(((TOTAL_CLASSES - student.totalAbsent) / TOTAL_CLASSES) * 100)
  const badge = statusBadge(student)
  const aiNote = buildAiNote(student, gradeHistory)

  const recentGrades = [...gradeHistory].reverse()

  return (
    <div className="p-8">

      {/* Breadcrumb + action */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {course.gradeLevel}-{course.section} sınıfı
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">
            {student.firstName} {student.lastName}
          </span>
        </div>
        <button className="rounded-lg border border-border bg-white px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Veliye not gönder
        </button>
      </div>

      {/* Student header card */}
      <div className="bg-white rounded-2xl border border-border px-6 py-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-500 text-lg font-bold">
            {initials(student.firstName, student.lastName)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                {student.firstName} {student.lastName}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {course.gradeLevel}-{course.section} · Okul no {student.studentNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Sora, sans-serif' }}>
              {student.average != null ? student.average.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{course.courseName} ort.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {rank > 0 ? `${rank}.` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">sınıf sıralaması</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-500" style={{ fontFamily: 'Sora, sans-serif' }}>
              {student.totalAbsent}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">devamsızlık</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 380px' }}>

        {/* Left column */}
        <div className="space-y-4">

          {/* Not gelişimi */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">
                {course.courseName} not gelişimi
              </h3>
              <span className={[
                'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                isDeclining ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700',
              ].join(' ')}>
                {isDeclining
                  ? <><TrendingDown className="h-3 w-3" /> düşüş trendi</>
                  : <><TrendingUp className="h-3 w-3" /> stabil</>}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={gradeHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[50, 75, 100]}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(value: number) => [`${value} puan`, 'Not']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ fill: '#ef4444', r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Son notlar */}
          <div className="bg-white rounded-2xl border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">Son notlar</h3>
            </div>
            <div className="divide-y divide-border">
              {recentGrades.map((g) => (
                <div key={g.name} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{g.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.date}</p>
                  </div>
                  <span className={`text-base font-bold ${scoreColor(g.score)}`}>
                    {g.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* AI Öğretmen notu */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                AI
              </div>
              <p className="text-base font-semibold text-foreground">Öğretmen notu</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {aiNote}
            </p>
            <button className="w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
              Veli görüşmesi planla
            </button>
          </div>

          {/* Devam durumu */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-5">Devam durumu</h3>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Devam oranı</span>
                <span className="text-sm font-semibold text-foreground">%{attendanceRate}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-3xl font-bold text-red-500" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {student.totalAbsent}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Gelmedi</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-3xl font-bold text-amber-500" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {student.totalExcused}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Geç kaldı</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
