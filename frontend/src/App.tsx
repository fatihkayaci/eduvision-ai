import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { PrincipalDashboardPage } from '@/pages/principal/DashboardPage'
import { TeacherDashboardPage } from '@/pages/teacher/DashboardPage'
import { TeacherLayout } from '@/pages/teacher/Layout'
import { ClassesPage } from '@/pages/teacher/ClassesPage'
import { GradesPage as TeacherGradesPage } from '@/pages/teacher/GradesPage'
import { AttendancePage as TeacherAttendancePage } from '@/pages/teacher/AttendancePage'
import { StudentDashboardPage } from '@/pages/student/DashboardPage'
import { GradesPage } from '@/pages/student/GradesPage'
import { AttendancePage } from '@/pages/student/AttendancePage'
import { AssignmentsPage } from '@/pages/student/AssignmentsPage'
import { SchedulePage } from '@/pages/student/SchedulePage'
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
          <Route path="classes" element={<ClassesPage />} />
          <Route path="grades" element={<TeacherGradesPage />} />
          <Route path="attendance" element={<TeacherAttendancePage />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="exams" element={<AssignmentsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>
        <Route path="/parent" element={<ParentLayout />}>
          <Route path="dashboard" element={<ParentDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
