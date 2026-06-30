import { AlertTriangle } from 'lucide-react'

interface MockClassroom {
  id: string
  name: string
  studentCount: number | null
  status: 'Dikkat' | null
  courses: string[]
}

interface MockAssignment {
  id: string
  firstName: string
  lastName: string
  branch: string
  classes: string[]
  warning?: string
}

const TOTAL_CLASSROOMS = 16
const TOTAL_COURSES = 24

const mockClassrooms: MockClassroom[] = [
  { id: '1', name: '9-A',  studentCount: 32, status: null,     courses: ['Matematik', 'Türkçe', 'Fizik'] },
  { id: '2', name: '9-B',  studentCount: 30, status: null,     courses: ['Matematik', 'Türkçe'] },
  { id: '3', name: '10-A', studentCount: 31, status: null,     courses: ['Fizik', 'Kimya'] },
  { id: '4', name: '11-B', studentCount: null, status: 'Dikkat', courses: ['Kimya', 'Tarih'] },
]

const mockAssignments: MockAssignment[] = [
  { id: '1', firstName: 'Mehmet', lastName: 'Kaya',   branch: 'Matematik', classes: ['9-A', '9-B', '10-C'] },
  { id: '2', firstName: 'Zeynep', lastName: 'Arslan', branch: 'Türkçe',    classes: ['9-A', '9-B'] },
  { id: '3', firstName: 'Ali',    lastName: 'Vural',  branch: 'Fizik',     classes: ['9-A', '10-A'] },
  { id: '4', firstName: 'Selin',  lastName: 'Doğan',  branch: 'Kimya',     classes: ['10-A', '11-B'], warning: 'Sınıf ort. düşük' },
]

const branchColors: Record<string, string> = {
  Matematik: 'bg-indigo-100 text-indigo-700',
  Türkçe: 'bg-emerald-100 text-emerald-700',
  Fizik: 'bg-amber-100 text-amber-700',
  Kimya: 'bg-rose-100 text-rose-700',
  Tarih: 'bg-violet-100 text-violet-700',
}

function courseColor(course: string) {
  return branchColors[course] ?? 'bg-muted text-muted-foreground'
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function ClassesPage() {
  return (
    <div className="p-8">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Sınıflar & Dersler
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {TOTAL_CLASSROOMS} sınıf · {TOTAL_COURSES} ders · öğretmen atamaları
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            + Ders ekle
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            + Sınıf ekle
          </button>
        </div>
      </div>

      {/* Sınıflar */}
      <h2 className="text-base font-semibold text-foreground mb-4">Sınıflar</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {mockClassrooms.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                {c.name}
              </span>
              {c.status ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                  {c.status}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {c.studentCount} öğrenci
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.courses.map((course) => (
                <span key={course} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${courseColor(course)}`}>
                  {course}
                </span>
              ))}
            </div>
            <button className="w-full rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Düzenle
            </button>
          </div>
        ))}
      </div>

      {/* Öğretmen - Ders Atamaları */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Öğretmen — Ders Atamaları</h2>
        <button className="text-sm font-medium text-primary hover:underline">Tümü →</button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Öğretmen</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branş</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sınıflar</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {mockAssignments.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${courseColor(a.branch)}`}>
                      {initials(a.firstName, a.lastName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.firstName} {a.lastName}</p>
                      {a.warning && (
                        <p className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {a.warning}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{a.branch}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {a.classes.map((cls) => (
                      <span key={cls} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${courseColor(a.branch)}`}>
                        {cls}
                      </span>
                    ))}
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      + Ekle
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
