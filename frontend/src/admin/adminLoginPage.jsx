import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { adminLogin } from '../api/admin'
// import { adminLoginPageStyles as s } from '../api/admin'


const adminLoginPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({email: "" , password: ""})
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")

    const handleSubmit =  async(event)=>{
        event.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const {data} = await adminLogin(form)
            if(data.token){
                localStorage.setItem("adminToken", data.token)
            }
            navigate("/admin/dashboard")
        } catch (error) {
            setMessage(error.response?.data?.message || "Admin login failed")
        }finally{
            setLoading(false)
        }
    
    }
  return (
    <div className={s.pageContainer}>
        <div>
            
        </div>

    </div>
  )
}

export default adminLoginPage