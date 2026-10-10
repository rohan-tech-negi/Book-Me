import {Navigate, Route, Routes} from "react-router-dom"
import adminDashboardPage from "./admin/adminDashboardPage"
import adminLoginPage from "./admin/adminLoginPage"



const AdminProtectedRoute = ({children}) => {
   const hasAdminToken = Boolean(localStorage.getItem('adminToken'))

  if(!hasAdminToken){
    return <Navigate to="/admin/login" replace></Navigate>
  }

  return children
}

 
const App = () => {

  return (
    <div>App</div>
  )
}

export default App