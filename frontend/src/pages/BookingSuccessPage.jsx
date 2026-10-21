import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {getPublicBookingStatus, getPublicStatus } from "../api/public"
import { BadgeCheck, Calendar, CalenderDays, ArrowLeft } from "lucide-react";
import { bookingSuccessPageStyles as s } from "../assests/dummy";


export default function BookingSuccessPage(){
    const [searchParams] = useSearchParams()
    const [booking, setBooking] = useState(null)
    const [message, setMessage] = useState("Verifying your payment....")

    useEffect(() => {
        const loadBookings = async()=> {
            const sessionId = useSearchParams.get("session_id")

            if(!sessionId){
                setMessage(
                    "We could not verify the payment. No booking was created"
                )
                return;
            }
            try {
                const {data} = await getPublicBookingStatus({
                    session_id: sessionId
                })
                setBooking(data.booking)
                setMessage(
                    data.booking.status === "confirmed" && data.booking.paymentStatus === "paid"
                    ? "Payment recieve your booking is confirmed": "we could not verify the payment. no booking was created"
                )
            } catch (error) {
                setMessage(
                    error.response?.data?.message || "We could not vrify the payment. No booking was created"
                )
            }
        }
        loadBookings()
    }, [searchParams])

    return (
        <div className={s.container}>

        </div>
    )
}