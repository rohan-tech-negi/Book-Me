import logo from "../assets/logo.png"
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {ChevronDown, LogOut, Menu, X} from 'lucide-react'
import { useEffect, useState, useRef } from "react"
import {getMe} from "../api/auth"
import { appLayoutStyles as s } from '../assests/dummy'

const navItems = [
    {to: "/", label:"Dashboard"},
    {to: "/profile", label: "Profile"},
    {to: "/services", label: "Services"},
    {to: "/availability", label: "Availability"},
    {to: "/bookings", label: "Bookings"},
    {to: "/payments", label: "Payments"}
]


export default function AppLayout({children}) {
    const navigate = useNavigate()
    const hasToken = Boolean(localStorage.getItem('token'))
    const [user, setUser] = useState(null)
    const[dropDownOpen, setDropDownOpen] = useState(false)
    const dropDownRef = useRef(null)

    useEffect(()=>{
        const handleClickOutside = (event) => {
            if(dropDownRef.current && !dropDownRef.current.contains(event.target)){
                setDropDownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[])

    useEffect(()=>{
        if(hasToken){
            getMe().then(({data}) => setUser(data?.user)).catch(() => { })
        }
    }, [hasToken])

    const logout = () =>{
        localStorage.removeItem('token')
        navigate('/login')
    }

    const displayName = user?.businessName || user?.name || "My Business"
    const avatarInitial = displayName.slice(0,1).toUpperCase()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        
    )
}
