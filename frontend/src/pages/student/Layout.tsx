import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, UserX, BookOpen, Calendar, Sparkles, ChevronDown } from 'lucide-react'
import { decodeToken, initials } from '@/lib/token'
import { getStudentProfile, getTerms } from '@/features/student/api/studentApi'
import type { StudentProfile, Term } from '@/features/student/types'

export interface StudentLayoutContext {
  termId: string
  termEndDate: string
}

const navItems = [
  { to: '/student/dashboard',   icon: LayoutDashboard, label: 'Genel Bakış' },
  { to: '/student/grades',      icon: FileText,         label: 'Notlarım' },
  { to: '/student/attendance',  icon: UserX,            label: 'Devamsızlık' },
  { to: '/student/exams',       icon: BookOpen,         label: 'Ödevler & Sınavlar' },
  { to: '/student/schedule',    icon: Calendar,         label: 'Ders Programı' },
]

export function StudentLayout() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [terms, setTerms] = useState<Term[]>([])
  const [selectedTermId, setSelectedTermId] = useState('')
  const [isTermOpen, setIsTermOpen] = useState(false)
  const termRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const payload = decodeToken(token)
    setFirstName(payload.given_name)
    setLastName(payload.family_name)

    Promise.all([
      getStudentProfile(payload.sub, token),
      getTerms(payload.school_id, token),
    ]).then(([prof, fetchedTerms]) => {
      setProfile(prof)
      setTerms(fetchedTerms)
      if (fetchedTerms.length > 0) setSelectedTermId(fetchedTerms[0].id)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (termRef.current && !termRef.current.contains(e.target as Node)) {
        setIsTermOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const classroom = profile?.classroom ?? ''
  const selectedTerm = terms.find(t => t.id === selectedTermId)

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
            <span className="text-xs font-semibold text-primary">Haftalık Özet hazır</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Bu haftaki gelişimini gör.
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
              {classroom ? `${classroom} · Öğrenci` : 'Öğrenci'}
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
              {firstName ? `Merhaba, ${firstName}` : '...'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedTerm ? `${selectedTerm.year} ${selectedTerm.name}` : '...'}
              {classroom ? ` · ${classroom}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Term Dropdown */}
            <div className="relative" ref={termRef}>
              <button
                onClick={() => setIsTermOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {selectedTerm ? selectedTerm.name : '...'}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {isTermOpen && terms.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-white shadow-lg z-50 overflow-hidden">
                  {terms.map(term => (
                    <button
                      key={term.id}
                      onClick={() => { setSelectedTermId(term.id); setIsTermOpen(false) }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${
                        term.id === selectedTermId ? 'text-primary font-semibold' : 'text-foreground'
                      }`}
                    >
                      <span>{term.name}</span>
                      <span className="text-xs text-muted-foreground">{term.year}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {firstName && lastName ? initials(firstName, lastName) : '..'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ termId: selectedTermId, termEndDate: selectedTerm?.endDate ?? '' } satisfies StudentLayoutContext} />
        </main>

      </div>
    </div>
  )
}
