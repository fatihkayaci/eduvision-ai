import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { decodeToken } from '@/lib/token'
import { getStudentSchedule } from '@/features/student/api/studentApi'
import type { ScheduleEntry } from '@/features/student/types'
import type { StudentLayoutContext } from './Layout'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const DAY_LABELS: Record<string, string> = {
  Monday: 'Pazartesi', Tuesday: 'Salı', Wednesday: 'Çarşamba',
  Thursday: 'Perşembe', Friday: 'Cuma',
}

const COLORS = [
  { bg: 'bg-blue-50',   border: 'border-l-blue-400',   text: 'text-blue-900'   },
  { bg: 'bg-green-50',  border: 'border-l-green-400',  text: 'text-green-900'  },
  { bg: 'bg-yellow-50', border: 'border-l-yellow-400', text: 'text-yellow-900' },
  { bg: 'bg-purple-50', border: 'border-l-purple-400', text: 'text-purple-900' },
  { bg: 'bg-orange-50', border: 'border-l-orange-400', text: 'text-orange-900' },
]

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function SchedulePage() {
  const { termId, termEndDate } = useOutletContext<StudentLayoutContext>()
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])

  useEffect(() => {
    if (!termId) return
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const { sub } = decodeToken(token)
    getStudentSchedule(sub, termId, token).then(setSchedule).catch(console.error)
  }, [termId])

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const isTermOver = termEndDate !== '' && termEndDate < todayStr
  const jsDay = now.getDay()
  const todayWeekday = !isTermOver && jsDay >= 1 && jsDay <= 5 ? DAYS[jsDay - 1] : null
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  const courseNames = [...new Set(schedule.map(e => e.courseName))]
  const colorMap = new Map(courseNames.map((name, i) => [name, COLORS[i % COLORS.length]]))

  const timeSlots = [...new Set(schedule.map(e => e.startTime))].sort()
  const bySlot = new Map<string, Map<string, ScheduleEntry>>()
  for (const entry of schedule) {
    if (!bySlot.has(entry.startTime)) bySlot.set(entry.startTime, new Map())
    bySlot.get(entry.startTime)!.set(entry.weekday, entry)
  }

  const nextClass = todayWeekday
    ? schedule
        .filter(e => e.weekday === todayWeekday && toMinutes(e.startTime) > currentMinutes)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
    : null

  const minutesUntilNext = nextClass ? toMinutes(nextClass.startTime) - currentMinutes : null

  function formatTimeUntil(mins: number): string {
    if (mins < 5) return 'Az kaldı!'
    if (mins < 60) return `${mins} dk sonra`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m === 0 ? `${h} saat sonra` : `${h} sa ${m} dk sonra`
  }

  return (
    <div className="p-8 space-y-5">

      {nextClass && !isTermOver && (
        <div className="rounded-2xl bg-primary px-8 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-10">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Sıradaki Ders</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                {nextClass.courseName}
              </p>
            </div>
            <p className="text-xl font-semibold">{nextClass.startTime.slice(0, 5)}</p>
          </div>
          <div className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold">
            {minutesUntilNext !== null ? formatTimeUntil(minutesUntilNext) : ''}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="grid grid-cols-[56px_1fr_1fr_1fr_1fr_1fr]">
          <div className="p-4 border-b border-border" />
          {DAYS.map(day => {
            const isToday = day === todayWeekday
            return (
              <div
                key={day}
                className={`p-4 text-center text-sm font-semibold border-l border-b border-border ${isToday ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
              >
                {DAY_LABELS[day]}{isToday ? ' · Bugün' : ''}
              </div>
            )
          })}
        </div>

        {timeSlots.map((slot, idx) => {
          const row = bySlot.get(slot)!
          return (
            <div key={slot} className="grid grid-cols-[56px_1fr_1fr_1fr_1fr_1fr] border-b border-border last:border-b-0">
              <div className="flex flex-col items-center justify-center p-3 border-r border-border">
                <span className="text-sm font-bold text-foreground">{idx + 1}</span>
                <span className="text-[10px] text-muted-foreground">{slot.slice(0, 5)}</span>
              </div>

              {DAYS.map(day => {
                const entry = row.get(day)
                const isToday = day === todayWeekday
                const isCurrent = isToday && entry &&
                  toMinutes(entry.startTime) <= currentMinutes &&
                  toMinutes(entry.endTime) > currentMinutes
                const color = entry ? colorMap.get(entry.courseName)! : null

                return (
                  <div
                    key={day}
                    className={`p-2 border-l border-border min-h-[72px] ${isToday ? 'bg-primary/5' : ''}`}
                  >
                    {entry && color && (
                      <div className={`h-full rounded-lg border-l-4 px-3 py-2 ${color.bg} ${color.border} ${isCurrent ? 'ring-1 ring-primary' : ''}`}>
                        <p className={`text-sm font-semibold ${isCurrent ? 'text-primary' : color.text}`}>
                          {entry.courseName}
                          {isCurrent && <span className="ml-1 text-[10px] font-normal opacity-70">· şimdi</span>}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

    </div>
  )
}
