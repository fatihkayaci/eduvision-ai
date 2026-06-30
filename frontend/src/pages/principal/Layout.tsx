import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, FileText, CalendarDays, ChevronDown } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'

const navItems = [
  { to: '/principal/dashboard', icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/principal/users',     icon: Users,            label: 'Kullanıcılar' },
  { to: '/principal/classes',   icon: BookOpen,         label: 'Sınıflar & Dersler' },
  { to: '/principal/schedule',  icon: CalendarDays,     label: 'Ders Programı' },
  { to: '/principal/reports',   icon: FileText,         label: 'Raporlar' },
]

export function PrincipalLayout() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

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
            Yönetim
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

        {/* User */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
            {firstName && lastName ? initials(firstName, lastName) : '..'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {firstName ? `${firstName} ${lastName}` : '...'}
            </p>
            <p className="text-[10px] text-muted-foreground">Okul Müdürü</p>
          </div>
        </div>

      </aside>

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-border">
          <div>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Okul Genel Durumu
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              2024-2025 Güz Dönemi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Güz Dönemi
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
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
