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

    const requestWithdrawlStatusChange = (withdrawl , status) =>{
        if(withdrawl.status === status || 
            isTerminalWithdrawlStatus(withdrawl.status)
        ){
            return
        }
        setPendingWithdrawlAction({withdrawl, status})
    }

    const closeWithdrawlConfirm = ()=>{
        if(updatingWithdrawlId) return 
        setPendingWithdrawlAction(null)
    }


    const changeWithdrawalStatus = async () => {
    if (!pendingWithdrawalAction) return;

    const { withdrawal, status } = pendingWithdrawalAction;
    setUpdatingWithdrawalId(withdrawal._id);

    try {
      const { data } = await updateWithdrawalStatus(withdrawal._id, { status });
      setDashboard((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          summary: data.summary || prev.summary,
          withdrawals: prev.withdrawals.map((withdrawal) =>
            withdrawal._id === data.withdrawal._id
              ? data.withdrawal
              : withdrawal,
          ),
        };
      });
      setMessage(data.message || `Withdrawal marked as ${status}`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not update withdrawal",
      );
    } finally {
      setUpdatingWithdrawalId("");
      setPendingWithdrawalAction(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const summary = dashboard?.summary || {};
  const pendingWithdrawal = pendingWithdrawalAction?.withdrawal;
  const WithdrawalConfirmIcon =
    pendingWithdrawalAction?.status === "rejected" ? XOctagon : ShieldCheck;
  const isConfirmingWithdrawal =
    pendingWithdrawal && updatingWithdrawalId === pendingWithdrawal._id;

  // Helpers for dynamic classes from styles
  const getPayoutStatusClass = (isComplete) =>
    isComplete ? s.userPayoutReady : s.userPayoutPending;

  const getWithdrawalStatusClass = (status) =>
    s.withdrawalStatusColors[status] || s.withdrawalStatusDefault;

  const statCards = [
    {
      label: "Total Users",
      value: summary.users || 0,
      icon: Users,
      bg: s.statBg1,
      c: s.statColor1,
    },
    {
      label: "Paid Bookings",
      value: summary.paidBookings || 0,
      icon: CheckCircle,
      bg: s.statBg2,
      c: s.statColor2,
    },
    {
      label: "Gross Revenue",
      value: formatMoney(summary.grossRevenue),
      icon: TrendingUp,
      bg: s.statBg3,
      c: s.statColor3,
    },
    {
      label: "Platform Fees",
      value: formatMoney(summary.platformFees),
      icon: IndianRupee,
      bg: s.statBg4,
      c: s.statColor4,
    },
    {
      label: "Provider Payouts",
      value: formatMoney(summary.providerPayouts),
      icon: Wallet,
      bg: s.statBg5,
      c: s.statColor5,
    },
    {
      label: "Withdrawal Hold",
      value: formatMoney(summary.withdrawalHolds),
      icon: Landmark,
      bg: s.statBg6,
      c: s.statColor6,
    },
  ];

  return (
    <div>adminDashboardPage</div>
  )
}

export default adminDashboardPage