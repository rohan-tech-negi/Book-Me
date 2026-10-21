import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPublicBookingStatus } from "../api/public";
import { BadgeCheck, Calendar, CalendarDays, ArrowLeft, Loader2, XCircle } from "lucide-react";
import { bookingSuccessPageStyles as s } from "../assests/dummy";

export default function BookingSuccessPage() {
    const [searchParams] = useSearchParams();
    const [booking, setBooking] = useState(null);
    const [statusType, setStatusType] = useState("loading"); // "loading" | "success" | "error"
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        let isMounted = true;

        const loadBooking = async () => {
            const sessionId = searchParams.get("session_id");
            const bookingId = searchParams.get("booking_id");

            if (!sessionId && !bookingId) {
                if (isMounted) {
                    setStatusType("error");
                    setMessage("We could not verify the payment. No booking was created.");
                }
                return;
            }

            try {
                const params = sessionId ? { session_id: sessionId } : { booking_id: bookingId };
                const { data } = await getPublicBookingStatus(params);

                if (!isMounted) return;

                const loadedBooking = data?.booking;
                setBooking(loadedBooking || null);

                const isConfirmed =
                    loadedBooking?.status === "confirmed" &&
                    (loadedBooking?.paymentStatus === "paid" || loadedBooking?.paymentStatus === "not_required");

                if (isConfirmed) {
                    setStatusType("success");
                    setMessage(
                        loadedBooking.paymentStatus === "paid"
                            ? "Payment received! Your booking is confirmed."
                            : "Your booking is confirmed!"
                    );
                } else {
                    setStatusType("error");
                    setMessage("We could not verify the payment. No booking was created.");
                }
            } catch (error) {
                if (!isMounted) return;
                setStatusType("error");
                if (error.response?.data?.booking) {
                    setBooking(error.response.data.booking);
                }
                setMessage(
                    error.response?.data?.message || "We could not verify the payment. No booking was created."
                );
            }
        };

        loadBooking();

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    const slug = searchParams.get("slug") || booking?.userId?.slug || "";
    const calendarUrl = booking?.customerCalendarUrl || booking?.customerCalenderUrl;

    return (
        <div className={s.container}>
            <main className={s.card}>
                {statusType === "loading" && (
                    <>
                        <div className={s.iconCircleLoading || s.iconCircle}>
                            <Loader2 className={s.loadingIcon || s.checkIcon} />
                        </div>
                        <p className={s.statusLabelLoading || s.statusLabel}>
                            Payment Verification
                        </p>
                        <h1 className={s.heading}>{message}</h1>
                        <p className={s.description || "mt-2 text-sm text-slate-500"}>
                            Please hold on while we verify your appointment details.
                        </p>
                    </>
                )}

                {statusType === "success" && (
                    <>
                        <div className={s.iconCircle}>
                            <BadgeCheck className={s.checkIcon} />
                        </div>
                        <p className={s.statusLabel}>Booking Confirmed</p>
                        <h1 className={s.heading}>{message}</h1>

                        {booking && (
                            <div className={s.bookingDetails}>
                                <div className={s.serviceRow}>
                                    <CalendarDays className={s.calendarDaysIcon} />
                                    <p className={s.serviceName}>
                                        {booking.serviceId?.name || "Appointment"}
                                    </p>
                                </div>
                                <p className={s.detailText}>
                                    {booking.date} • {booking.startTime} - {booking.endTime}
                                </p>
                                <p className={s.statusText}>
                                    Status: {booking.status?.replace(/_/g, " ")}
                                </p>
                            </div>
                        )}

                        {calendarUrl && (
                            <a
                                href={calendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={s.addToCalendarLink}
                            >
                                <Calendar className={s.calendarIcon} />
                                <span>Add to Google Calendar</span>
                            </a>
                        )}
                    </>
                )}

                {statusType === "error" && (
                    <>
                        <div className={s.iconCircleError || s.iconCircle}>
                            <XCircle className={s.errorIcon || s.checkIcon} />
                        </div>
                        <p className={s.statusLabelError || s.statusLabel}>
                            Verification Failed
                        </p>
                        <h1 className={s.heading}>{message}</h1>
                        <p className={s.description || "mt-2 text-sm text-slate-500"}>
                            If your payment was deducted, please check your bank account or reach out for assistance.
                        </p>
                    </>
                )}

                <Link
                    to={slug ? `/book/${slug}` : "/"}
                    className={s.backLink}
                >
                    <ArrowLeft className={s.backIcon} />
                    <span>Back to booking page</span>
                </Link>
            </main>
        </div>
    );
}