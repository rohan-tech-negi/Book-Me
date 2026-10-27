import { useEffect, useState } from "react";
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


