import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import AdminDashboardPage from "./admin/adminDashboardPage"
import AdminLoginPage from "./admin/adminLoginPage"
import AuthPage from "./pages/AuthPage"
import DashboardPage from "./pages/DashboardPage"
import ProfilePage from "./pages/profilePage"
import BookingsPage from "./pages/bookingsPage"
import BookingSuccessPage from "./pages/BookingSuccessPage"
import BookingCancelledPage from "./pages/BookingCancelledPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import ServicePage from "./pages/ServicesPage"
import PaymentPage from "./pages/PaymentPage"
import PublicBookingPage from "./pages/PublicBookingsPage"
import TermsOfServicePage from "./pages/TermsOfServicesPage"
import 


const ProtectedRoute  = ({children}) => {
  const location = useLocation()
  const hasToken = Boolean(localStorage.getItem('token'))

  if(!hasToken){
    return <Navigate to="/login" replace state={({from: location})}></Navigate>
  }

  return children
}

const AdminProtectedRoute = ({ children }) => {
  const hasAdminToken = Boolean(localStorage.getItem('adminToken'))

  if (!hasAdminToken) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}


const PublicOnlyRoute = ({children}) => {
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
      <Route path="/" element={<ProtectedRoute><DashboardPage></DashboardPage></ProtectedRoute>}></Route>
      <Route path="/bookings" element={<ProtectedRoute><BookingsPage></BookingsPage></ProtectedRoute>}></Route>
      <Route path="/payments" element={<ProtectedRoute><PaymentPage></PaymentPage></ProtectedRoute>}></Route>
      <Route path="/booking/success" element={<BookingSuccessPage></BookingSuccessPage>}></Route>
      <Route path="/availability" element={<ProtectedRoute><AvailabilityPage></AvailabilityPage></ProtectedRoute>}></Route>
      <Route path="/services" element={<ProtectedRoute><ServicePage></ServicePage></ProtectedRoute>}></Route>
      <Route path="/booking/cancelled" element={<BookingCancelledPage></BookingCancelledPage>}></Route>
      <Route path="/profile" element={<ProtectedRoute><ProfilePage></ProfilePage></ProtectedRoute>}></Route>
      <Route path="/login" element={<PublicOnlyRoute><AuthPage></AuthPage></PublicOnlyRoute>}></Route>
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