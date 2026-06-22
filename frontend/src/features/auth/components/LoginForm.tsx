import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '../api/authApi'
import type { UserRole, LoginRequest } from '../types'

const roles: { id: UserRole; label: string; initial: string }[] = [
  { id: 'student',  label: 'Öğrenci',   initial: 'Ö' },
  { id: 'parent',   label: 'Veli',       initial: 'V' },
  { id: 'teacher',  label: 'Öğretmen',   initial: 'T' },
  { id: 'admin',    label: 'Yönetici',   initial: 'Y' },
]

const roleLabels: Record<UserRole, string> = {
  student: 'Öğrenci olarak giriş yap',
  parent:  'Veli olarak giriş yap',
  teacher: 'Öğretmen olarak giriş yap',
  admin:   'Yönetici olarak giriş yap',
}

export function LoginForm() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload: LoginRequest = {
      email:    formData.get('email') as string,
      password: formData.get('password') as string,
      role:     selectedRole,
    }

    try {
      const response = await login(payload)
      localStorage.setItem('accessToken', response.accessToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Rol seçici */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Rolün</Label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map(role => {
            const isSelected = selectedRole === role.id
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={[
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer text-left',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background text-foreground hover:border-primary/40',
                ].join(' ')}
              >
                <span className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  isSelected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                ].join(' ')}>
                  {role.initial}
                </span>
                {role.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* E-posta */}
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ornek@okul.edu.tr"
          required
          autoComplete="email"
          className="bg-background"
        />
      </div>

      {/* Şifre */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Şifre</Label>
          <a
            href="#"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Şifremi unuttum
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="pr-10 bg-background"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Giriş yapılıyor…' : roleLabels[selectedRole]}
      </Button>

      {/* Kayıt */}
      <p className="text-center text-sm text-muted-foreground">
        Hesabın yok mu?{' '}
        <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
          Okul koduyla katıl
        </a>
      </p>

    </form>
  )
}
