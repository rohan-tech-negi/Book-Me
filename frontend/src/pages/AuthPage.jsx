import { useState, useEffect } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom"
import {login, register, requestRegistrationOtp, verifyRegistrationOtp} from "../api/auth"
import logo from "../assets/logo.png"
import {User, Mail, Lock, Building2, ArrowRight,CalenderDays, Shield, Zap, BadgeCheck} from "lucide-react"
import {authPageStyles as s} from "../assests/dummy"   

const initialForm = {
    name: "",
    email: "",
    password: "",
    businessName: "",
    emailOtp: ""
}

export default function AuthPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mode, setMode] = useState("login")
    const [form, setForm] = useState(initialForm)
    const[loading, setLoadin] = useState(false)
    const[otpLoading, setOtpLoading] = useState(false)
    const[otpSentTo, setOtpSentTo] = useState("")
    const [otpVerified, setOtpVerified] = useState(false)
    const [message, setMessage] = useState("")
    const [otpCooldown, setOtpCooldown] = useState(0)

    const isRegister = mode === "register"
    const formLocation = location.state?.form;
    const redirectTo  = formLocation ? `${formLocation.pathname}${formLocation.search | ""}` : "/profile"

    useState(()=> {
        if(otpCooldown <= 0) return ;
        const interval = setInterval(()=>{
            setOtpCooldown((prev)=>{
                if(prev <= 1){
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    },[otpCooldown])

    const handleChange = async(event) => {
        const {name, value} = event.target

        if(name === "emailOtp"){
            const digitalOnly = value.replace(/\D/g, "").slice(0,6)
            setForm((prev) => ({...prev, emailOtp: digitalOnly}))
            if
        }
    }

}