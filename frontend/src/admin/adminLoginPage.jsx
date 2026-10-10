import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { adminLogin } from '../api/admin'
import { adminLoginPageStyles as s } from '../assests/dummy'
import logo from '../assests/logo.png'

const AdminLoginPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const { data } = await adminLogin(form)
            if (data.token) {
                localStorage.setItem("adminToken", data.token)
            }
            navigate("/admin/dashboard")
        } catch (error) {
            setMessage(error.response?.data?.message || "Admin login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={s.pageContainer}>
            <div className={s.card}>
                {/* left decorative panel */}
                <div className={s.leftPanel}>
                    <div className={s.leftContent}>
                        <p className={s.leftEyebrow}>System access</p>
                        <div className={s.leftLogoRow}>
                            <img src={logo} alt="BookMe Logo" className={s.leftLogoImg} />
                        </div>
                        <h1 className={s.leftHeading}>
                            BookMe
                            <br />
                            <span className={s.leftHeadingAccent}>Admin</span>
                        </h1>
                        <p className={s.leftDescription}>
                            Money movement, user overview, and payout requests. Monitor platform from one desk
                        </p>
                    </div>
                </div>

                {/* right form panel */}
                <div className={s.rightPanel}>
                    <h2 className={s.formTitle}>
                        Admin login
                    </h2>
                    <p className={s.formSubtitle}>
                        Enter your credentials to access the dashboard
                    </p>
                    {message && <div className={s.messageBox}>{message}</div>}

                    <form onSubmit={handleSubmit} className={s.form}>
                        <div>
                            <label className={s.inputLabel}>Email address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, email: event.target.value }))
                                }
                                className={s.textInput}
                                placeholder="Enter admin email"
                                required
                            />
                        </div>

                        <div>
                            <label className={s.inputLabel}>Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, password: event.target.value }))
                                }
                                className={s.textInput}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className={s.submitButton}>
                            {loading ? "Authenticating..." : "Secure Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage