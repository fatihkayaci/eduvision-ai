import { useState, useEffect } from 'react'
import { decodeToken } from '@/lib/token'
import { getCourses } from '@/features/teacher/api/teacherApi'
import type { TeacherCourse } from '@/features/teacher/types'

type AssignmentType = 'exam' | 'homework'

export function ExamsPage() {
  const [courses, setCourses] = useState<TeacherCourse[]>([])
  const [type, setType] = useState<AssignmentType>('exam')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [topicInput, setTopicInput] = useState('')
  const [description, setDescription] = useState('')
  const [notify, setNotify] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('accessToken')
    if (!t) return
    const payload = decodeToken(t)
    getCourses(payload.sub, t).then((data) => {
      setCourses(data)
      if (data.length > 0) setSelectedCourseId(data[0].classroomCourseId)
    })
  }, [])

  function addTopic() {
    const trimmed = topicInput.trim()
    if (!trimmed || topics.includes(trimmed)) return
    setTopics(prev => [...prev, trimmed])
    setTopicInput('')
  }

  function removeTopic(topic: string) {
    setTopics(prev => prev.filter(t => t !== topic))
  }

  const selectedCourse = courses.find(c => c.classroomCourseId === selectedCourseId)

  return (
    <div className="p-8">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
          Yeni değerlendirme
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ödev veya sınav tanımla; öğrenci ve velilere bildirim gider.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Tür */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tür</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('exam')}
              className={[
                'flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors',
                type === 'exam'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:bg-muted',
              ].join(' ')}
            >
              <div className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold', type === 'exam' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'].join(' ')}>
                S
              </div>
              <div>
                <p className={['text-sm font-semibold', type === 'exam' ? 'text-primary' : 'text-foreground'].join(' ')}>Sınav</p>
                <p className="text-xs text-muted-foreground">Yazılı, quiz, dönem sonu</p>
              </div>
            </button>

            <button
              onClick={() => setType('homework')}
              className={[
                'flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors',
                type === 'homework'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white hover:bg-muted',
              ].join(' ')}
            >
              <div className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold', type === 'homework' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'].join(' ')}>
                Ö
              </div>
              <div>
                <p className={['text-sm font-semibold', type === 'homework' ? 'text-primary' : 'text-foreground'].join(' ')}>Ödev</p>
                <p className="text-xs text-muted-foreground">Proje, rapor, alıştırma</p>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-5">

          {/* Başlık */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={type === 'exam' ? '3. Yazılı — Türev ve Uygulamaları' : 'Türev problemleri ödev'}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Sınıf + Ders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Sınıf</label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                {courses.map(c => (
                  <option key={c.classroomCourseId} value={c.classroomCourseId}>
                    {c.gradeLevel}-{c.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Ders</label>
              <input
                type="text"
                readOnly
                value={selectedCourse?.courseName ?? ''}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none"
              />
            </div>
          </div>

          {/* Tarih + Ağırlık */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Tarih</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Ağırlık (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="30"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Konular */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Konular</label>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="hover:text-primary/60">×</button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTopic() } }}
                  placeholder="+ Konu ekle"
                  className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground outline-none focus:border-primary focus:text-foreground transition-colors w-28"
                />
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Açıklama <span className="font-normal opacity-60">· opsiyonel</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>

          {/* Bildirim toggle */}
          <label className="flex items-center gap-4 cursor-pointer rounded-xl border border-border px-4 py-3">
            <button
              type="button"
              onClick={() => setNotify(v => !v)}
              className={[
                'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                notify ? 'bg-primary' : 'bg-muted',
              ].join(' ')}
            >
              <span className={[
                'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5',
                notify ? 'translate-x-5' : 'translate-x-0.5',
              ].join(' ')} />
            </button>
            <div>
              <p className="text-sm font-medium text-foreground">Öğrenci ve velileri bilgilendir</p>
              <p className="text-xs text-muted-foreground">Yayınlandığında bildirim gönderilir</p>
            </div>
          </label>

        </div>

        {/* Alt butonlar */}
        <div className="flex justify-end gap-3">
          <button className="rounded-xl border border-border bg-white px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            Taslak kaydet
          </button>
          <button className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Yayınla
          </button>
        </div>

      </div>
    </div>
  )
}
