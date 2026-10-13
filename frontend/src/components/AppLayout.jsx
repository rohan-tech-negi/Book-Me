import logo from "../assets/logo.png"
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {ChevronDown, LogOut, Menu, SquareMenu, X} from 'lucide-react'
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
        <div className={s.container}>
            <header className={s.header}>
                <div className={s.headerInner}>
                    <Link to="/" className={s.loginLink}>
                    <img src={logo} alt="" className={s.logoImg}/>
                    <span className={s.logoText}>BookMe</span>
                    </Link>

                    {/* navigatuon desktop */}
                    <nav className={s.navDesktop}>
                        {navItems.map((item)=>{
                            <NavLink 
                            key={item.to}
                            to={item.to}
                            className={({isActive})=> isActive ? s.navLinkActive: s.navLinkInactive}>
                                {item.label}
                            </NavLink>
                        })}

                    </nav>

                    {/* right section */}
                    <div className={s.rightSection}>
                        {hasToken ? (
                            <div className={s.accountMenu} ref={dropDownRef}>
                                <button type="button" onClick={() => setDropDownOpen(!dropDownOpen)} className={s.avatarCircle}>
                                    <div className={s.avatarCircle}>
                                        {avatarInitial}
                                    </div>
                                    <span className={s.displayName}>
                                        {displayName}
                                    </span>
                                    <ChevronDown className={dropDownOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}></ChevronDown>
                                </button>
                                {dropDownOpen && (
                                    <div className={s.dropdown}>
                                        <button onClick={()=>{
                                            setDropDownOpen(flase)
                                            logout()
                                        }} className={s.logoutButton}>
                                                <LogOut className={s.logoutIcon}></LogOut>
                                                Log Out
                                        </button>
                                    </div>
                                )}
                            </div>

                        ) : (
                            <Link to="/login" className={s.logoLink}>
                                Log in
                            </Link>
                        )}

                        {/* mobile menu button */}

                        <button type="button" className={s.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <span className={s.srOnly}>
                                Open main menu
                            </span>
                            {mobileMenuOpen ? (
                                <X className={s.mobileMenuButton} aria-hidden="true"></X>
                            ) : (
                                <SquareMenu className={s.mobileMenuButton} aria-hidden="true"></SquareMenu>
                            )}
                        </button>
        
                    </div>
                </div>

                {/* mobile navigation */}
                {mobileMenuOpen && (
                    <div className={s.mobileNavInner}>
                        {navItems.map((item) =>(
                            <NavLink 
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({isActive})=> isActive ? s.mobileNavLinkActive : s.mobileNavLinkInactive}
                            >
                                {item.label}

                            </NavLink>
                            
                        ))}
                    </div>
                )}
            </header>
            <main className={s.main}>
                {children}
                
            </main>
            <footer className={s.footerBrandSection}>
                <div className={s.footerCard}>
                    <div className={s.footerCardTop}>
                        <div className={s.footerBrandMark}>
                            <img src={logo} className={s.footerMiniLogo} alt="" />
                            <span className={s.footerCopyright}>All rights reserved</span>
                            <div className={s.footerLinks}>
                                <Link to="/privacy" className={s.footerLink}>
                                    Privacy Policy
                                </Link>
                                <span className={s.footerSeparator}>
                                    .
                                </span>
                                <Link to="/terms" className={s.footerLink}>Terms of Services</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    )
}
