import { useEffect, useMemo, useState } from "react";
import p6Image from "../assets/p6.png"
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import {getPayementOverview, requestWithdrawl, updatePayoutDetails} from "../api/payment"
import { paymentsPageStyles as s } from "../assests/dummy";


const formatmoney = (amount = 0, currency = "INR") => 
    new Intl.NumberFormat("en-IN", {style: "currency", currency}).format(
        amount/ 100
    )
const transactionbLabel = (transaction) => {
    if(transaction.type === "booking_payment"){
        if(transaction.description && transaction.description.includes ("Booking payment")){
             return "Booking payment recieved"
        }
           return transaction.description || 'Booking payout '
    }
    if(transaction.type === "withdrawl_hold")  return "Withdrawl requested"
    if(transaction.type === "withdrawl_reversal") return "Withdrawl returned"
    if(transaction.description && transaction.description.includes("Booking payout for stripe session")) {
        return "Booking payment received"
    }
    return transaction.description || transaction.type
}

const transactionAmount = (transaction) => {
    if(transaction.type === "withdrawl_hold")
        return -Math.abs(transaction.amount || 0)
    return transaction.amount || 0
}

export default function PaymentPage() {
    const [overview , setOverview] = useState(null)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [form, setForm] = useState({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifsc: "",
        upiId: ""
    })

    const wallet = overview?.wallet || {};
    const payoutDetails = overview?.payoutDetails || {};
    const availableRupees = useMemo(
        () => ((wallet.available || 0)/ 100).toFixed(2),
        [wallet.available]
    )
    const loadOverview = async() =>{
        if(!localStorage.getItem("token")){
            setMessage("Please log in to manage payment details")
            return 
        }
    }

    const {data} = await getPayementOverview();
    setOverview(data);
    setForm((prev)=> ({
        ...prev, 
        accountHolderName: data.payoutDetails.accountHolderName || "",
        bankName: data.payoutDetails?.bankName || "",
        ifsc: data.payoutDetails?.ifsc || "",
        upiId: data.payoutDetails?.upiId || ""
    }))

    useEffect(() => {
        loadOverview().catch((error) => {
            setMessage(
                error.response?.data?.message || "Could not load payment details"
            )
        })
    }, [])
    const handleChange = (event) => {
        setForm((prev) => ({...prev, [event.target.name]: event.target.value}))
    }

    const savePayoutDetails = async(event) => {
        event.preventDefault()
        setLoading()
        setMessage("")
    }

    try {
        const {data} = await updatePayoutDetails(form)
        setOverview((prev) => ({...prev, payoutDetails: data.payoutDetails}))
        setForm((prev) => ({...prev, accountNumber: ""}))
        setMessage(data.message)
    } catch (error) {
        setMessage(
            error.response?.data?.message || " could not save payout details"
        )
        finally{
            setLoading(false)
        }
    }

    const submitWithdrawl = async(event) => {
        event.preventDefault()
        setLoading(true)
        setMessage("")
        try {
            const amount = Math.round(Number(withdrawAmount) * 100)
            const {data} = await requestWithdrawl(amount)
            setMessage(data.message)
            
        } catch (error) {
            
        }
    }
}



