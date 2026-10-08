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

    const 
  return (
    <div>adminLoginPage</div>
  )
}

export default adminLoginPage