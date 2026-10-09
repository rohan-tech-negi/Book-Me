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
        <div className={s.card}>
            {/* left decorative panel */}
            <div className={s.leftPanel}>
                <p className={s.leftEyebrow}>System access</p>
                <div className={s.leftLogoRow}>
                    <img src={} className={s.leftLogoImg}/>
                </div>
                <h1 className={s.leftHeading}>
                    BookMe
                    <br />
                    <span className={s.leftHeadingAccent}>Admin</span>
                    </h1>
                    <p className={s.leftDescription}>
                        Money momvement, user overview, and payout request.Moniter platfrom from one desk
                    </p>
            </div>


            {/* right form panel */}
            
        </div>

    </div>
  )
}

export default adminLoginPage