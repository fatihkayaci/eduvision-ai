import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { PrincipalDashboardPage } from '@/pages/principal/DashboardPage'
import { PrincipalLayout } from '@/pages/principal/Layout'
import { UsersPage as PrincipalUsersPage } from '@/pages/principal/UsersPage'
import { ClassesPage as PrincipalClassesPage } from '@/pages/principal/ClassesPage'
import { SchedulePage as PrincipalSchedulePage } from '@/pages/principal/SchedulePage'
import { TeacherDashboardPage } from '@/pages/teacher/DashboardPage'
import { TeacherLayout } from '@/pages/teacher/Layout'
import { ClassesPage } from '@/pages/teacher/ClassesPage'
import { GradesPage as TeacherGradesPage } from '@/pages/teacher/GradesPage'
import { AttendancePage as TeacherAttendancePage } from '@/pages/teacher/AttendancePage'
import { ExamsPage as TeacherExamsPage } from '@/pages/teacher/ExamsPage'
import { TeacherSchedulePage } from '@/pages/teacher/SchedulePage'
import { StudentDetailPage } from '@/pages/teacher/StudentDetailPage'
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
        <Route path="/principal" element={<PrincipalLayout />}>
          <Route path="dashboard" element={<PrincipalDashboardPage />} />
          <Route path="users" element={<PrincipalUsersPage />} />
          <Route path="classes" element={<PrincipalClassesPage />} />
          <Route path="schedule" element={<PrincipalSchedulePage />} />
        </Route>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="schedule" element={<TeacherSchedulePage />} />
          <Route path="grades" element={<TeacherGradesPage />} />
          <Route path="attendance" element={<TeacherAttendancePage />} />
          <Route path="exams" element={<TeacherExamsPage />} />
          <Route path="student/:studentId" element={<StudentDetailPage />} />
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
