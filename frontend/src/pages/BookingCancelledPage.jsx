import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cancelPublicBookingPayments } from "../api/public";
import { XCircle, ArrowLeft } from "lucide-react";
import { bookingCancelledPageStyles as s } from "../assests/dummy";

export default function BookingCancelledPage() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const bookingId = searchParams.get("booking_id");
        if (bookingId) {
            cancelPublicBookingPayments(bookingId).catch(() => {});
        }
    }, [searchParams]);

    const slug = searchParams.get("slug") || "";

    return (
        <div className={s.container}>
            <main className={s.card}>
                <div className={s.iconCircle}>
                    <XCircle className={s.icon} />
                </div>
                <p className={s.statusLabel}>
                    Payment Cancelled
                </p>
                <h1 className={s.heading}>
                    Your booking was not confirmed
                </h1>
                <p className={s.description}>
                    No payment was completed. You can return to the booking page and choose a slot again.
                </p>
                <Link
                    to={slug ? `/book/${slug}` : "/"}
                    className={s.homeLink}
                >
                    <ArrowLeft className={s.homeLinkIcon} />
                    <span>Back to booking page</span>
                </Link>
            </main>
        </div>
    );
}