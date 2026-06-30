import { useState, useEffect, useMemo } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, UserX, BookOpen, Sparkles, CalendarDays } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'
import { getCourses } from '@/features/teacher/api/teacherApi'
import type { TeacherCourse } from '@/features/teacher/types'

export type TeacherOutletContext = {
  activeCourse: TeacherCourse | null
  courses: TeacherCourse[]
  setActiveCourse: (course: TeacherCourse) => void
}

const navItems = [
  { to: '/teacher/dashboard',  icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/teacher/classes',    icon: Users,           label: 'Sınıflarım' },
  { to: '/teacher/schedule',   icon: CalendarDays,    label: 'Ders Programı' },
  { to: '/teacher/grades',     icon: ClipboardList,   label: 'Not Girişi' },
  { to: '/teacher/attendance', icon: UserX,           label: 'Yoklama' },
  { to: '/teacher/exams',      icon: BookOpen,        label: 'Ödev & Sınav' },
]

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
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [activeCourse, setActiveCourse] = useState<TeacherCourse | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const payload = decodeToken(token)
    setFirstName(payload.given_name)
    setLastName(payload.family_name)

    getCourses(payload.sub, token)
      .then((data) => {
        setCourses(data)
        if (data.length > 0) setActiveCourse(data[0])
      })
      .catch(console.error)
  }, [])

  const outletContext = useMemo(
    () => ({ activeCourse, courses, setActiveCourse }),
    [activeCourse, courses],
  )

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
            <p className="text-[10px] text-muted-foreground">
              {activeCourse ? `${activeCourse.courseName} · Öğretmen` : 'Öğretmen'}
            </p>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {firstName && lastName ? initials(firstName, lastName) : '..'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={outletContext} />
        </main>

      </div>
    </div>
  )
}
