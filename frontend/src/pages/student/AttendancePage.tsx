import { useState, useEffect } from 'react'
import { decodeToken } from '@/lib/token'
import { getStudentAttendances } from '@/features/student/api/studentApi'
import type { StudentAttendances, AttendanceRecord } from '@/features/student/types'

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum']

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayName = DAYS[date.getDay() - 1] ?? ''
  return `${day} ${MONTHS[month - 1]}, ${dayName}`
}

function buildCalendar(records: AttendanceRecord[]) {
  const recordMap = new Map(records.map(r => [r.date, r]))

  const dates = records.map(r => new Date(r.date))
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))


  const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0)

  const months: { label: string; weeks: (string | null)[][] }[] = []

  let current = new Date(start)
  while (current <= end) {
    const year = current.getFullYear()
    const month = current.getMonth()
    const label = `${MONTHS[month]} ${year}`
    const weeks: (string | null)[][] = []
    let week: (string | null)[] = Array(5).fill(null)

    const lastDay = new Date(year, month + 1, 0)

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      const dow = date.getDay()
      if (dow === 0 || dow === 6) continue

      const weekIdx = dow - 1
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

      if (d > 1 && dow === 1 && week.some(v => v !== null)) {
        weeks.push(week)
        week = Array(5).fill(null)
      }

      week[weekIdx] = dateStr
    }
    if (week.some(v => v !== null)) weeks.push(week)

    months.push({ label, weeks })
    current = new Date(year, month + 1, 1)
  }

  return { months, recordMap }
}

function dayColor(dateStr: string, recordMap: Map<string, AttendanceRecord>): string {
  const record = recordMap.get(dateStr)
  if (!record) return 'bg-green-500'
  if (record.type === 'Absent') return 'bg-red-500'
  return 'bg-blue-500'
}

export function AttendancePage() {
  const [data, setData] = useState<StudentAttendances | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const { sub } = decodeToken(token)
    getStudentAttendances(sub, token).then(setData).catch(console.error)
  }, [])

  const calendar = data && data.records.length > 0 ? buildCalendar(data.records) : null

  return (
    <div className="p-8 space-y-6">

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-border p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Devam Oranı</p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>—</p>
        </div>

        <div className="rounded-xl bg-white border border-border p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Gelmedi</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {data?.totalAbsent ?? '—'}
            </p>
            {data && <span className="text-sm text-muted-foreground mb-0.5">gün</span>}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-border p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Geç Kaldı</p>
          <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>—</p>
        </div>

        <div className="rounded-xl bg-white border border-border p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">İzinli</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {data?.totalExcused ?? '—'}
            </p>
            {data && <span className="text-sm text-muted-foreground mb-0.5">gün</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-4">

        <div className="rounded-xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-foreground">Dönem takvimi</h2>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-green-500 inline-block" /> Geldi</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500 inline-block" /> Yok</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500 inline-block" /> İzinli</span>
            </div>
          </div>

          {!calendar ? (
            <p className="text-sm text-muted-foreground">Devamsızlık kaydı bulunamadı.</p>
          ) : (
            <div className="flex gap-8">
              {calendar.months.map(({ label, weeks }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
                  <div className="flex gap-1">
                    <div className="flex flex-col gap-1 mr-1">
                      {DAYS.map(d => (
                        <span key={d} className="text-[10px] text-muted-foreground w-6 text-right">{d}</span>
                      ))}
                    </div>
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((dateStr, di) => (
                          <div
                            key={di}
                            className={`h-5 w-5 rounded-sm ${dateStr ? dayColor(dateStr, calendar.recordMap) : 'bg-transparent'}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white border border-border p-6 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Kayıt dökümü</h2>

          {!data || data.records.length === 0 ? (
            <p className="text-sm text-muted-foreground">Kayıt bulunamadı.</p>
          ) : (
            <div className="space-y-3">
              {data.records.map((record, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${record.type === 'Absent' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {record.type === 'Absent' ? 'Gelmedi' : 'İzinli'} · Tüm gün
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(record.date)}{record.note ? ` · ${record.note}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
