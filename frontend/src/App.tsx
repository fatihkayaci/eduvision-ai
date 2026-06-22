import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { PrincipalDashboardPage } from '@/pages/principal/DashboardPage'
import { TeacherDashboardPage } from '@/pages/teacher/DashboardPage'
import { StudentDashboardPage } from '@/pages/student/DashboardPage'
import { ParentDashboardPage } from '@/pages/parent/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/principal/dashboard" element={<PrincipalDashboardPage />} />
        <Route path="/teacher/dashboard"   element={<TeacherDashboardPage />} />
        <Route path="/student/dashboard"   element={<StudentDashboardPage />} />
        <Route path="/parent/dashboard"    element={<ParentDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
