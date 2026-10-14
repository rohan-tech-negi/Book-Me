import { Navigate, Route, Routes } from "react-router-dom"
import AdminDashboardPage from "./admin/adminDashboardPage"
import AdminLoginPage from "./admin/adminLoginPage"
import AuthPage from "./pages/AuthPage"

const AdminProtectedRoute = ({ children }) => {
  const hasAdminToken = Boolean(localStorage.getItem('adminToken'))

  if (!hasAdminToken) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}


const publicOnlyRoute = ({children}) => {
  const hasToken = Boolean(localStorage.getItem("token"))

  if(hasToken){
    return(
      <Navigate to="/" replace></Navigate>
    )
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