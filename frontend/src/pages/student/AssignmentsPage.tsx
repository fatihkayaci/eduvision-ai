import { useState, useEffect } from 'react'
import { decodeToken } from '@/lib/token'
import { getStudentAssignments } from '@/features/student/api/studentApi'
import type { Assignment } from '@/features/student/types'

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

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
  const [, month, day] = dateStr.split('-').map(Number)
  return { day: String(day).padStart(2, '0'), month: MONTHS[month - 1] }
}

function dateBoxColor(type: Assignment['type'], isPast: boolean): string {
  if (isPast) return 'bg-green-100 text-green-700'
  if (type === 'Exam') return 'bg-red-100 text-red-600'
  return 'bg-indigo-100 text-indigo-600'
}

function typeBadge(type: Assignment['type']) {
  if (type === 'Exam')
    return <span className="rounded-full bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5">Sınav</span>
  return <span className="rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-semibold px-2 py-0.5">Ödev</span>
}

function StatusBadge({ days }: { days: number }) {
  if (days < 0)
    return <span className="rounded-full bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1">Tamamlandı</span>
  if (days <= 3)
    return <span className="text-red-500 text-sm font-semibold">{days} gün kaldı</span>
  if (days <= 7)
    return <span className="text-orange-500 text-sm font-semibold">{days} gün kaldı</span>
  return <span className="rounded-full bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1">Planlandı</span>
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const days = daysUntil(assignment.dueDate)
  const isPast = days < 0
  const { day, month } = formatDateBox(assignment.dueDate)

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white border border-border px-5 py-4 cursor-pointer transition-all hover:border-primary hover:shadow-[0_0_0_1px_hsl(var(--primary))]">
      <div className={`flex flex-col items-center justify-center h-14 w-12 shrink-0 rounded-xl font-bold ${dateBoxColor(assignment.type, isPast)}`}>
        <span className="text-xl leading-none">{day}</span>
        <span className="text-[11px] uppercase tracking-wide mt-0.5">{month}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-foreground truncate">{assignment.title}</p>
          {typeBadge(assignment.type)}
        </div>
        {assignment.description && (
          <p className="text-xs text-muted-foreground truncate">{assignment.description}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <StatusBadge days={days} />
      </div>
    </div>
  )
}

function GroupSection({ label, items }: { label: string; items: Assignment[] }) {
  if (items.length === 0) return null
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground px-1">{label}</p>
      {items.map(a => <AssignmentCard key={a.id} assignment={a} />)}
    </div>
  )
}

type Tab = 'upcoming' | 'completed' | 'all'

export function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [tab, setTab] = useState<Tab>('upcoming')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const { sub } = decodeToken(token)
    getStudentAssignments(sub, token).then(setAssignments).catch(console.error)
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() + mondayOffset)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  const startOfNextWeek = new Date(startOfWeek)
  startOfNextWeek.setDate(startOfWeek.getDate() + 7)
  const endOfNextWeek = new Date(startOfNextWeek)
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6)

  const upcoming = assignments.filter(a => parseDate(a.dueDate) >= today)
  const completed = assignments.filter(a => parseDate(a.dueDate) < today).reverse()

  const thisWeek = upcoming.filter(a => { const d = parseDate(a.dueDate); return d >= startOfWeek && d <= endOfWeek })
  const nextWeek = upcoming.filter(a => { const d = parseDate(a.dueDate); return d >= startOfNextWeek && d <= endOfNextWeek })
  const later = upcoming.filter(a => parseDate(a.dueDate) > endOfNextWeek)

  const tabLabels: Record<Tab, string> = {
    upcoming: `Yaklaşanlar · ${upcoming.length}`,
    completed: `Tamamlananlar · ${completed.length}`,
    all: 'Tümü',
  }

  return (
    <div className="p-8 space-y-5">

      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {(['upcoming', 'completed', 'all'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
              tab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/60',
            ].join(' ')}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === 'upcoming' && (
          <>
            <GroupSection label="Bu Hafta" items={thisWeek} />
            <GroupSection label="Gelecek Hafta" items={nextWeek} />
            <GroupSection label="Daha Sonra" items={later} />
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">Yaklaşan ödev veya sınav yok.</p>
            )}
          </>
        )}

        {tab === 'completed' && (
          <>
            <GroupSection label="Yakın Zamanda Tamamlanan" items={completed} />
            {completed.length === 0 && (
              <p className="text-sm text-muted-foreground">Tamamlanan ödev veya sınav yok.</p>
            )}
          </>
        )}

        {tab === 'all' && (
          <>
            <GroupSection label="Yaklaşanlar" items={upcoming} />
            <GroupSection label="Tamamlananlar" items={completed} />
          </>
        )}
      </div>
    </div>
  )
}
