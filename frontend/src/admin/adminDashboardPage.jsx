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
  return (
    <div>adminDashboardPage</div>
  )
}

export default adminDashboardPage