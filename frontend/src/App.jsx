import { Navigate, Route, Routes } from "react-router-dom"
import AdminDashboardPage from "./admin/adminDashboardPage"
import AdminLoginPage from "./admin/adminLoginPage"

const AdminProtectedRoute = ({ children }) => {
  const hasAdminToken = Boolean(localStorage.getItem('adminToken'))

  if (!hasAdminToken) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

const App = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboardPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default App