import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

type StudentStatus = 'İyi' | 'İzlemede' | 'Dikkat' | 'Kritik'

interface MockStudent {
  id: string
  firstName: string
  lastName: string
  email: string
  classroom: string
  average: number
  absentDays: number
  status: StudentStatus
}

interface MockTeacher {
  id: string
  firstName: string
  lastName: string
  email: string
  branch: string
  classCount: number
  attendanceRate: number
}

interface MockParent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  children: string[]
}

const TOTAL_STUDENTS = 487
const TOTAL_TEACHERS = 38
const TOTAL_PARENTS = 421

const mockStudents: MockStudent[] = [
  { id: '1', firstName: 'Ada',   lastName: 'Demir',   email: 'ada.demir@okul.edu.tr',   classroom: '9-A',  average: 58.5, absentDays: 5,  status: 'Dikkat' },
  { id: '2', firstName: 'Burak', lastName: 'Yılmaz',  email: 'burak.yilmaz@okul.edu.tr', classroom: '9-A',  average: 66.0, absentDays: 2,  status: 'İzlemede' },
  { id: '3', firstName: 'Elif',  lastName: 'Yıldız',  email: 'elif.yildiz@okul.edu.tr',  classroom: '9-A',  average: 88.5, absentDays: 2,  status: 'İyi' },
  { id: '4', firstName: 'İrem',  lastName: 'Tan',     email: 'irem.tan@okul.edu.tr',     classroom: '9-A',  average: 92.0, absentDays: 0,  status: 'İyi' },
  { id: '5', firstName: 'Kerem', lastName: 'Doğan',   email: 'kerem.dogan@okul.edu.tr',  classroom: '11-B', average: 54.2, absentDays: 14, status: 'Kritik' },
  { id: '6', firstName: 'Naz',   lastName: 'Şahin',   email: 'naz.sahin@okul.edu.tr',    classroom: '10-C', average: 71.0, absentDays: 12, status: 'Dikkat' },
]

const mockTeachers: MockTeacher[] = [
  { id: '1', firstName: 'Mehmet', lastName: 'Kaya',    email: 'mehmet.kaya@okul.edu.tr',    branch: 'Matematik', classCount: 4, attendanceRate: 89 },
  { id: '2', firstName: 'Zeynep', lastName: 'Arslan',  email: 'zeynep.arslan@okul.edu.tr',  branch: 'Türkçe',    classCount: 3, attendanceRate: 94 },
  { id: '3', firstName: 'Ali',    lastName: 'Vural',   email: 'ali.vural@okul.edu.tr',      branch: 'Fizik',     classCount: 3, attendanceRate: 91 },
  { id: '4', firstName: 'Selin',  lastName: 'Doğan',   email: 'selin.dogan@okul.edu.tr',    branch: 'Kimya',     classCount: 2, attendanceRate: 61 },
  { id: '5', firstName: 'Ayşe',   lastName: 'Korkmaz', email: 'ayse.korkmaz@okul.edu.tr',   branch: 'Biyoloji',  classCount: 5, attendanceRate: 96 },
  { id: '6', firstName: 'Hakan',  lastName: 'Şen',     email: 'hakan.sen@okul.edu.tr',      branch: 'Tarih',     classCount: 4, attendanceRate: 88 },
]

const mockParents: MockParent[] = [
  { id: '1', firstName: 'Fatma',  lastName: 'Demir',  email: 'fatma.demir@gmail.com',  phone: '0532 111 22 33', children: ['Ada Demir'] },
  { id: '2', firstName: 'Mustafa', lastName: 'Yılmaz', email: 'mustafa.yilmaz@gmail.com', phone: '0533 222 33 44', children: ['Burak Yılmaz'] },
  { id: '3', firstName: 'Hatice', lastName: 'Yıldız', email: 'hatice.yildiz@gmail.com', phone: '0534 333 44 55', children: ['Elif Yıldız'] },
  { id: '4', firstName: 'Osman',  lastName: 'Tan',    email: 'osman.tan@gmail.com',    phone: '0535 444 55 66', children: ['İrem Tan'] },
  { id: '5', firstName: 'Sevgi',  lastName: 'Doğan',  email: 'sevgi.dogan@gmail.com',  phone: '0536 555 66 77', children: ['Kerem Doğan', 'Naz Doğan'] },
]

const avatarPalette = [
  'bg-emerald-100 text-emerald-700',
  'bg-indigo-100 text-indigo-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-teal-100 text-teal-700',
]

function avatarColor(index: number) {
  return avatarPalette[index % avatarPalette.length]
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function statusBadge(status: StudentStatus) {
  const styles: Record<StudentStatus, string> = {
    İyi: 'bg-green-100 text-green-700',
    İzlemede: 'bg-amber-100 text-amber-700',
    Dikkat: 'bg-rose-100 text-rose-700',
    Kritik: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

function averageColor(average: number) {
  if (average < 60) return 'text-red-600'
  if (average < 75) return 'text-amber-600'
  return 'text-green-600'
}

function absentColor(days: number) {
  return days >= 10 ? 'text-red-600 font-medium' : 'text-foreground'
}

type Tab = 'students' | 'teachers' | 'parents'

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('students')
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('Tümü')
  const [isClassFilterOpen, setIsClassFilterOpen] = useState(false)
  const classFilterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (classFilterRef.current && !classFilterRef.current.contains(e.target as Node)) {
        setIsClassFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const classrooms = ['Tümü', ...Array.from(new Set(mockStudents.map((s) => s.classroom)))]

  const filteredStudents = mockStudents.filter((s) => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesClass = classFilter === 'Tümü' || s.classroom === classFilter
    return matchesSearch && matchesClass
  })

  const filteredTeachers = mockTeachers.filter((t) =>
    `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const filteredParents = mockParents.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const searchPlaceholder =
    activeTab === 'students' ? 'Öğrenci ara...' : activeTab === 'teachers' ? 'Öğretmen ara...' : 'Veli ara...'

  return (
    <div className="p-8">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Kullanıcılar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {TOTAL_STUDENTS} öğrenci · {TOTAL_TEACHERS} öğretmen · {TOTAL_PARENTS} veli
          </p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
          + Kullanıcı ekle
        </button>
      </div>

      {/* Tabs + filtreler */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {([
            ['students', `Öğrenciler · ${TOTAL_STUDENTS}`],
            ['teachers', `Öğretmenler · ${TOTAL_TEACHERS}`],
            ['parents', `Veliler · ${TOTAL_PARENTS}`],
          ] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch('') }}
              className={[
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-border bg-white pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {activeTab === 'students' && (
          <div className="relative" ref={classFilterRef}>
            <button
              onClick={() => setIsClassFilterOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Sınıf: {classFilter}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {isClassFilterOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-white shadow-lg z-50 overflow-hidden">
                {classrooms.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setClassFilter(c); setIsClassFilterOpen(false) }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                      c === classFilter ? 'text-primary font-semibold' : 'text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">

        {activeTab === 'students' && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sınıf</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ortalama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devamsızlık</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Durum</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(i)}`}>
                        {initials(s.firstName, s.lastName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{s.classroom}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${averageColor(s.average)}`}>{s.average.toFixed(1)}</td>
                  <td className={`px-6 py-4 text-sm ${absentColor(s.absentDays)}`}>{s.absentDays} gün</td>
                  <td className="px-6 py-4">{statusBadge(s.status)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'teachers' && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branş</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sınıf Sayısı</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Devam Oranı</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t, i) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(i)}`}>
                        {initials(t.firstName, t.lastName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.firstName} {t.lastName}</p>
                        <p className="text-xs text-muted-foreground">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{t.branch}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{t.classCount}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${t.attendanceRate < 70 ? 'text-red-600' : 'text-green-600'}`}>
                    %{t.attendanceRate}
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
        )}

        {activeTab === 'parents' && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Çocuk(lar)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefon</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((p, i) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(i)}`}>
                        {initials(p.firstName, p.lastName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{p.children.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{p.phone}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'students' && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            + {TOTAL_STUDENTS - mockStudents.length} öğrenci daha · <button className="text-primary font-medium hover:underline">tümünü gör</button>
          </div>
        )}
      </div>

    </div>
  )
}
