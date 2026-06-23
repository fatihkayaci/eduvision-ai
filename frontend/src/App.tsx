import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { PrincipalDashboardPage } from '@/pages/principal/DashboardPage'
import { TeacherDashboardPage } from '@/pages/teacher/DashboardPage'
import { TeacherLayout } from '@/pages/teacher/Layout'
import { StudentDashboardPage } from '@/pages/student/DashboardPage'
import { StudentLayout } from '@/pages/student/Layout'
import { ParentLayout } from '@/pages/parent/Layout'
import { ParentDashboardPage } from '@/pages/parent/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/principal/dashboard" element={<PrincipalDashboardPage />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboardPage />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboardPage />} />
        </Route>
        <Route path="/parent" element={<ParentLayout />}>
          <Route path="dashboard" element={<ParentDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
