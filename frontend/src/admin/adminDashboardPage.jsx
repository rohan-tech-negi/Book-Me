import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminDashboard, updateWithdrawlStatus } from '../api/admin'
import {Users, Wallet, TrendingUp, IndianRuppe, LandMark, CheckCircle, XOctagon, Clock, UserCheck, ShieldCheck} from "lucide-react"
import { adminDashboardPageStyles as s } from '../assests/dummy'
const adminDashboardPage = () => {
  return (
    <div>adminDashboardPage</div>
  )
}

export default adminDashboardPage