import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, UserX, BookOpen, Sparkles, ChevronDown, Plus } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'

const navItems = [
  { to: '/teacher/dashboard',  icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/teacher/classes',    icon: Users,           label: 'Sınıflarım' },
  { to: '/teacher/grades',     icon: ClipboardList,   label: 'Not Girişi' },
  { to: '/teacher/attendance', icon: UserX,           label: 'Yoklama' },
  { to: '/teacher/exams',      icon: BookOpen,        label: 'Ödev & Sınav' },
]

const mockClasses = ['9-A · Matematik', '9-B · Matematik', '10-A · Matematik']

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Günaydın'
  if (hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

function todayLabel() {
  return new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function TeacherLayout() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [activeClass, setActiveClass] = useState(mockClasses[0])
  const [classDropdownOpen, setClassDropdownOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const payload = decodeToken(token)
    setFirstName(payload.given_name)
    setLastName(payload.family_name)
  }, [])

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
        <div className="mx-3 mb-3 rounded-xl bg-primary/5 border border-primary/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Sınıf raporu</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Bu haftaki sınıf gelişimini özetle.
          </p>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
            {firstName && lastName ? initials(firstName, lastName) : '..'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {firstName ? `${firstName} ${lastName}` : '...'}
            </p>
            <p className="text-[10px] text-muted-foreground">Matematik · Öğretmen</p>
          </div>
        </div>

      </aside>

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-border">
          <div>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              {firstName ? `${greeting()}, ${firstName} Hocam` : '...'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {todayLabel()} · Bugün 4 dersin var
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Not gir
            </button>

            <div className="relative">
              <button
                onClick={() => setClassDropdownOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {activeClass}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {classDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-white shadow-md z-10">
                  {mockClasses.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setActiveClass(c); setClassDropdownOpen(false) }}
                      className={[
                        'w-full px-3 py-2 text-left text-sm transition-colors',
                        c === activeClass
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-muted',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {firstName && lastName ? initials(firstName, lastName) : '..'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
