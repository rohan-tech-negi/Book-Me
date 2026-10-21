import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {getPublicBookingStatus, getPublicStatus } from "../api/public"
import { BadgeCheck, Calendar, CalenderDays, ArrowLeft, Badge } from "lucide-react";
import { bookingSuccessPageStyles as s } from "../assests/dummy";


export default function BookingSuccessPage(){
    const [searchParams] = useSearchParams()
    const [booking, setBooking] = useState(null)
    const [message, setMessage] = useState("Verifying your payment....")

    useEffect(() => {
        const loadBookings = async()=> {
            const sessionId = searchParams.get("session_id")

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
            <main className={s.card}>
                <div className={s.iconCircle}>
                    <BadgeCheck className={s.checkIcon}></BadgeCheck>
                </div>
                <p className={s.statusLabel}>Payment verification</p>
                <h1 className={s.heading}>{message}</h1>
                {booking && (
                    <div className={s.bookingDetails}>
                        <div className={s.serviceRow}>
                            <CalenderDays className={s.calendarDaysIcon}></CalenderDays>
                            <p className={s.serviceName}>
                                {booking.serviceId?.name || "Appointment"}
                            </p>
                        </div>
                        <p className={s.detailText}>
                            {booking.date} . {booking.startTime} - {booking.endTime}
                        </p>
                        <p className={s.statusText}>
                            Status: {booking.status.replace("_", "")}
                        </p>
                    </div>
                )}
                {booking?.customerCalenderUrl && (
                    <a href={booking.customerCalenderUrl} target="_blank" className={s.addToCalendarLink}>
                        <Calendar className={s.calendarIcon}>Add to Google Calender</Calendar>
                    </a>
                )}
                <Link to={searchParams.get("slug") ? `/book/${searchParams.get("slug")}` : "/"} className={s.backLink}>
                <ArrowLeft className={s.backIcon}></ArrowLeft>
                Back to bookings page</Link>
            </main>
        </div>
    )
}