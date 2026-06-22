import { GraduationCap } from 'lucide-react'
import { LoginForm } from '@/features/auth/components/LoginForm'

const stats = [
  { value: '4',  label: 'rol' },
  { value: 'AI', label: 'haftalık özet' },
  { value: '∞',  label: 'soru & konu' },
]

export function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[42%_1fr]">

      {/* Sol panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary px-12 py-10">

        {/* Dekoratif daireler */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute top-1/2 -right-32 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
            EduVision AI
          </span>
        </div>

        {/* Orta içerik */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1
              className="text-5xl font-bold leading-tight text-white font-weight: 700"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Okulun her şeyi<br></br>tek bir yerde.
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-white/65">
              Yapay zeka destekli analizler, kişiselleştirilmiş ödevler ve
              gerçek zamanlı ilerleme takibi — öğrenci, veli ve öğretmen
              için tek panelde.
            </p>
          </div>

          {/* İstatistikler */}
          <div className="flex items-end gap-8">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {value}
                </p>
                <p className="text-sm text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-white/35">
          © 2025 EduVision AI · Tüm hakları saklıdır
        </p>
      </div>

      {/* Sağ panel */}
      <div className="flex items-center justify-center bg-muted/40 px-8 py-12">
        <div className="w-full max-w-md space-y-7">

          {/* Mobil logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>EduVision AI</span>
          </div>

          {/* Başlık */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Tekrar hoş geldin
            </h2>
            <p className="text-sm text-muted-foreground">
              Devam etmek için hesabına giriş yap.
            </p>
          </div>

          <LoginForm />

        </div>
      </div>

    </div>
  )
}
