import { useState } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'

type Category = 'sayisal' | 'sozel' | 'sosyal'

interface ScheduleEntry {
  day: string
  period: number
  course: string
  teacher: string
  room: string
  category: Category
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
const PERIOD_TIMES = ['08:40', '09:40', '10:40', '11:40']

const CATEGORY_STYLE: Record<Category, { bg: string; border: string; text: string }> = {
  sayisal: { bg: 'bg-indigo-50', border: 'border-l-indigo-400', text: 'text-indigo-900' },
  sozel:   { bg: 'bg-emerald-50', border: 'border-l-emerald-400', text: 'text-emerald-900' },
  sosyal:  { bg: 'bg-amber-50', border: 'border-l-amber-400', text: 'text-amber-900' },
}

const mockSchedule: ScheduleEntry[] = [
  { day: 'Pazartesi', period: 1, course: 'Matematik',      teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },
  { day: 'Pazartesi', period: 2, course: 'Tarih',           teacher: 'M. Çelik',  room: 'A-110', category: 'sosyal' },
  { day: 'Pazartesi', period: 3, course: 'Biyoloji',        teacher: 'F. Aydın',  room: 'Lab-3', category: 'sozel' },
  { day: 'Pazartesi', period: 4, course: 'Geometri',        teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },

  { day: 'Salı', period: 1, course: 'Türkçe',               teacher: 'Z. Arslan', room: 'A-110', category: 'sozel' },
  { day: 'Salı', period: 2, course: 'Matematik',            teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },
  { day: 'Salı', period: 3, course: 'Matematik',            teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },
  { day: 'Salı', period: 4, course: 'Beden Eğitimi',        teacher: 'K. Arslan', room: 'Salon', category: 'sosyal' },

  { day: 'Çarşamba', period: 1, course: 'Fizik',            teacher: 'A. Vural',  room: 'Lab-1', category: 'sosyal' },
  { day: 'Çarşamba', period: 2, course: 'Türkçe',           teacher: 'Z. Arslan', room: 'A-110', category: 'sozel' },
  { day: 'Çarşamba', period: 4, course: 'İngilizce',        teacher: 'D. Şahin',  room: 'A-205', category: 'sozel' },

  { day: 'Perşembe', period: 1, course: 'Kimya',            teacher: 'S. Doğan',  room: 'Lab-2', category: 'sayisal' },
  { day: 'Perşembe', period: 2, course: 'Fizik',            teacher: 'A. Vural',  room: 'Lab-1', category: 'sosyal' },
  { day: 'Perşembe', period: 3, course: 'Türkçe',           teacher: 'Z. Arslan', room: 'A-110', category: 'sozel' },
  { day: 'Perşembe', period: 4, course: 'Matematik',        teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },

  { day: 'Cuma', period: 1, course: 'İngilizce',            teacher: 'D. Şahin',  room: 'A-205', category: 'sozel' },
  { day: 'Cuma', period: 2, course: 'Matematik',            teacher: 'M. Kaya',   room: 'B-204', category: 'sayisal' },
  { day: 'Cuma', period: 3, course: 'Tarih',                teacher: 'M. Çelik',  room: 'A-112', category: 'sosyal' },
  { day: 'Cuma', period: 4, course: 'Coğrafya',             teacher: 'E. Yurt',   room: 'A-112', category: 'sosyal' },
]

const byCell = new Map<string, ScheduleEntry>()
for (const entry of mockSchedule) {
  byCell.set(`${entry.day}-${entry.period}`, entry)
}

type View = 'class' | 'teacher' | 'course'

export function SchedulePage() {
  const [activeView, setActiveView] = useState<View>('class')

  return (
    <div className="p-8">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Ders Programı Ayarlama
          </h1>
          <p className="text-sm text-muted-foreground mt-1">2024-2025 Güz Dönemi · haftalık program</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Taslak kaydet
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            Yayınla
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-5 flex items-end justify-between flex-wrap gap-4">
        <div className="flex items-end gap-6">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Görünüm</p>
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              {([
                ['class', 'Sınıfa göre'],
                ['teacher', 'Öğretmene göre'],
                ['course', 'Derse göre'],
              ] as [View, string][]).map(([view, label]) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={[
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    activeView === view
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Sınıf</p>
            <button className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              9-A
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Dönem</p>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Güz 2025
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            30 / 30 saat dolu
          </span>
          <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">
            0 çakışma
          </span>
        </div>
      </div>

      {/* Program tablosu */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden mb-6">
        <div className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr]">
          <div className="border-b border-border" />
          {DAYS.map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-foreground border-l border-b border-border">
              {day}
            </div>
          ))}
        </div>

        {[1, 2].map((period) => (
          <div key={period} className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr] border-b border-border">
            <div className="flex flex-col items-center justify-center p-3 border-r border-border">
              <span className="text-sm font-bold text-foreground">{period}</span>
              <span className="text-[10px] text-muted-foreground">{PERIOD_TIMES[period - 1]}</span>
            </div>
            {DAYS.map((day) => {
              const entry = byCell.get(`${day}-${period}`)
              const style = entry ? CATEGORY_STYLE[entry.category] : null
              return (
                <div key={day} className="p-2 border-l border-border min-h-[72px]">
                  {entry && style ? (
                    <div className={`h-full rounded-lg border-l-4 px-3 py-2 ${style.bg} ${style.border}`}>
                      <p className={`text-sm font-semibold ${style.text}`}>{entry.course}</p>
                      <p className="text-xs text-muted-foreground">{entry.teacher} · {entry.room}</p>
                    </div>
                  ) : (
                    <button className="h-full w-full rounded-lg border-2 border-dashed border-border hover:bg-muted/60 transition-colors" />
                  )}
                </div>
              )
            })}
          </div>
        ))}

        <div className="py-2 text-center text-xs font-semibold text-muted-foreground tracking-wide bg-muted/40 border-b border-border">
          TENEFFÜS · 10:20 – 10:40
        </div>

        {[3, 4].map((period) => (
          <div key={period} className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr] border-b border-border last:border-b-0">
            <div className="flex flex-col items-center justify-center p-3 border-r border-border">
              <span className="text-sm font-bold text-foreground">{period}</span>
              <span className="text-[10px] text-muted-foreground">{PERIOD_TIMES[period - 1]}</span>
            </div>
            {DAYS.map((day) => {
              const entry = byCell.get(`${day}-${period}`)
              const style = entry ? CATEGORY_STYLE[entry.category] : null
              return (
                <div key={day} className="p-2 border-l border-border min-h-[72px]">
                  {entry && style ? (
                    <div className={`h-full rounded-lg border-l-4 px-3 py-2 ${style.bg} ${style.border}`}>
                      <p className={`text-sm font-semibold ${style.text}`}>{entry.course}</p>
                      <p className="text-xs text-muted-foreground">{entry.teacher} · {entry.room}</p>
                    </div>
                  ) : (
                    <button className="h-full w-full rounded-lg border-2 border-dashed border-border hover:bg-muted/60 transition-colors" />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Alt kartlar */}
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Ders renk kodu</p>
          <div className="flex items-center flex-wrap gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400" />
              Sayısal (Mat/Kim/Geo)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
              Sözel / Dil
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              Sosyal / Diğer
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border-2 border-dashed border-border" />
              Boş (tıkla ekle)
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-green-50 border border-green-200 p-5 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Çakışma yok</p>
            <p className="text-sm text-green-700 mt-0.5">
              Tüm öğretmen ve derslikler uyumlu. Programı yayınlayabilirsin.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
