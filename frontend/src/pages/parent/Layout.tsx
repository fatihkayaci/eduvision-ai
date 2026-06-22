import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, UserX, BookOpen, Sparkles } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5163'

const navItems = [
  { to: '/parent/dashboard',  icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/parent/grades',     icon: FileText,         label: 'Notlar' },
  { to: '/parent/attendance', icon: UserX,            label: 'Devamsızlık' },
  { to: '/parent/exams',      icon: BookOpen,         label: 'Ödevler & Sınavlar' },
]

interface Student {
  studentId: string
  firstName: string
  lastName: string
}

interface TokenPayload {
  sub: string
  given_name: string
  family_name: string
}

function decodeToken(token: string): TokenPayload {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(json)
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function ParentLayout() {
  const [students, setStudents] = useState<Student[]>([])
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  const [parentName, setParentName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const payload = decodeToken(token)
    setParentName(`${payload.given_name} ${payload.family_name}`)

    fetch(`${BASE_URL}/api/parent/${payload.sub}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Student[]) => {
        setStudents(data)
        if (data.length > 0) setActiveStudentId(data[0].studentId)
      })
      .catch(console.error)
  }, [])

  const activeStudent = students.find((s) => s.studentId === activeStudentId)

  return (
    <div className="flex h-screen bg-[#f4f6fb] overflow-hidden">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-border">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
            O
          </div>
          <span className="font-semibold text-sm text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Okul Takip
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menü
          </p>
          <ul className="space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* AI widget */}
        {activeStudent && (
          <div className="mx-3 mb-3 rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Haftalık Özet hazır</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {activeStudent.firstName}'in bu haftaki gelişimi.
            </p>
          </div>
        )}

        {/* User */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
            {parentName ? initials(parentName.split(' ')[0], parentName.split(' ')[1] ?? '') : '..'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{parentName || '...'}</p>
            <p className="text-[10px] text-muted-foreground">Veli</p>
          </div>
        </div>

      </aside>

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                {activeStudent ? `${activeStudent.firstName}'in durumu` : '...'}
              </h1>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                Salt görüntüleme
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">2024-2025 Güz Dönemi</p>
          </div>

          {/* Childer */}
          {students.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Çocuk:</span>
              {students.map((s) => {
                const isActive = s.studentId === activeStudentId
                return (
                  <button
                    key={s.studentId}
                    onClick={() => setActiveStudentId(s.studentId)}
                    className={[
                      'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    ].join(' ')}
                  >
                    <span className={[
                      'flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold',
                      isActive ? 'bg-white/20 text-white' : 'bg-background text-foreground',
                    ].join(' ')}>
                      {initials(s.firstName, s.lastName)}
                    </span>
                    {s.firstName}
                  </button>
                )
              })}
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
