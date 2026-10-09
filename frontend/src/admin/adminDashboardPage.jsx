import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminDashboard, updateWithdrawlStatus } from '../api/admin'
import {Users, Wallet, TrendingUp, IndianRuppe, LandMark, CheckCircle, XOctagon, Clock, UserCheck, ShieldCheck} from "lucide-react"
import { adminDashboardPageStyles as s } from '../assests/dummy'

const formatMoney = (amount = 0, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {styles: "currency", currency}).format(
        amount/100
    )

    const withdrawlStatuses = ["processing", "paid", "rejected"]
    const terminalWithdrawlStatuses = ["paid", "rejected"]

    const isTerminalWithdrawlStatus = (status)=>{
        terminalWithdrawlStatuses.include(status)
    }

    const formatStatusLabel = (status = "") => status ? `${status.slice(0,1).toUpperCase()} ${status.slice(1)}` : ""

const adminDashboardPage = () => {

    const navigate = useNavigate()
    const [dashboard, setDashboard] = useState(null)
    const [message, setMessage] = useState("")
    const [updatigWithdrawlId, setUpdatingWithdrawlId] = useState("")
    const [pendingWithdrawlAction, setPendingWithdrawlAction] = useState(null)

    useEffect(() =>{
        if(!localStorage.getItem("adminToken")){
            navigate("/admin/login")
            return undefined
        }
        let isActive = true

        getAdminDashboard()
        .then(({data})=>{
            if(isActive){
                setDashboard(data)
            }
        })
        .catch((error)=>{
            if(isActive){
                setMessage(error.response?.data?.message || "Could not load admin dashboard")
            }
        })

        return () =>{
            isActive = false
        }
    }, [navigate])

    const 

  return (
    <div>adminDashboardPage</div>
  )
}

export default adminDashboardPage