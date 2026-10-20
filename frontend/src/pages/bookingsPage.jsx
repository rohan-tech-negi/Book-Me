import {listBookings, updateBookingsStatus, rescheduleBooking} from "../api/bookings.js"
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  Copy,
  RefreshCcw,
  CalendarDays,
  Info,
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx"

import A1 from "../assets/avatars/A1.png";
import A2 from "../assets/avatars/A2.png";
import A3 from "../assets/avatars/A3.png";
import A4 from "../assets/avatars/A4.png";
import A5 from "../assets/avatars/A5.png";
import A6 from "../assets/avatars/A6.png";
import A7 from "../assets/avatars/A7.png";
import A8 from "../assets/avatars/A8.png";
import A9 from "../assets/avatars/A9.png";
import A10 from "../assets/avatars/A10.png";
import A11 from "../assets/avatars/A11.png";
import A12 from "../assets/avatars/A12.png";
import A13 from "../assets/avatars/A13.png";
import A15 from "../assets/avatars/A15.png";
import A16 from "../assets/avatars/A16.png";
import { bookingsPageStyles as s } from "../assests/dummy";
import { use, useEffect, useState } from "react";




const AVATAR_MAP = {
  "A1.png": A1,
  "A2.png": A2,
  "A3.png": A3,
  "A4.png": A4,
  "A5.png": A5,
  "A6.png": A6,
  "A7.png": A7,
  "A8.png": A8,
  "A9.png": A9,
  "A10.png": A10,
  "A11.png": A11,
  "A12.png": A12,
  "A13.png": A13,
  "A15.png": A15,
  "A16.png": A16,
};

const statuses = ["", "confirmed", "rescheduled", "cancelled"]

const bookingsPage = () => {
  const [cookings, setBookings] = useState([])
  const [filters, setFilters] = useState({date: "", status: ""})
  const [message, setMessage] = useState("")
  const [reschedule, setReschedule] = useState({})
  const [cancelModelBookingId, setCancelModelBookingId] = useState(null)
  const [rescheduleModelBooking, setRescheduleBooking] = useState(null)

  const formatTimeStamp = (value) =>{
    if(!value) return "Not available"
    return new Intl.DateTimeFormat("en-In", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))

    const fetchBookings = async(nextFilters) =>{
      try {
        const params = {}
        if(nextFilters.date) params.date = nextFilters.date;
        if(nextFilters.status) params.status = nextFilters.status

        const {data} = await listBookings(params)
        setBookings(data.bookings || [])
      } catch (error) {
        setMessage(error.response?.data?.message || "Could not load Bookings")
      }
    }

    const loadBookings = () => fetchBookings(filters)

    useEffect(() => {
      const loadFilteredBookings = async() => {
        await fetchBookings(filters)
      }
      loadFilteredBookings()
    }, [filters])

    const setStatus = async(bookings, status) => {
      await updateBookingsStatus(bookings._id, status)
      loadBookings()
    }

    const updateRescheduleDraft = (booking, key, value) => {
      setReschedule((prev) => ({
        ...prev, [booking._id] : {
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          ...prev[booking._id],
          [key] : value
        }
      }))
    }

    const submitReschedule = async(booking) =>{
      const draft = {
        data: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        ...reschedule[booking._id]
      }
      try {
        const {data} = await rescheduleBooking(booking._id, draft)
        setMessage(
          data.email?.skipped 
          ? `Booking rescheduled, but email was skipped : ${data.email.reason}`
          : "booking rescheduled, customer notifcation and caleder updated"
        )
        setReschedule((prev) => ({...prev, [booking._id]: undefined}))
        loadBookings()
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not reschedule booking"
        )
      }
    }

    const getBannerVarient = (msg) => 
      msg.toLowerCase().include("triggered") || msg.toLowerCase().include("success") 
    ? s.messageBannerSuccess : s.messageBannerInfo
  }
  return (
    <AppLayout>

      <section className={s.headerSection}>
          <div className={s.headerLeftArea}>
              <div>
                <p className={s.bookingLabel}>Bookings</p>
                <h1 className={s.mainHeading}>Manage customer{" "}
                  <span className={s.mainHeadingGradient}>
                    appointment
                  </span>
                </h1>
                <p className={s.subText}>Review payment , calender sync and appointment status from one calm workspace</p>
              </div>
              <div className={s.illustrationContainer}>
                <img src={p7Image} className={s.illustrationImg} alt="" />
              </div>
          </div>

          <div className={s.filterRow}>
            <div className={s.filterDateContainer}>
              <CalendarDays className={s.filterIcon}>

              </CalendarDays>
              <input type="data" value={filters.data} onChange={(event) => setFilters((prev)=> ({...prev, data: event.target.value}))}
              className={s.filterDateInput} placeholder="Select date" />
            </div>
            <div className={s.filterStatusContainer}>
              <select value={filters.status} onChange={(event) => 
                setFilters((prev) => ({...prev, status: event.target.value}))
              } className={s.filterStatusSelect}>
                {statuses.map((status)=> (
                  <option key={status} value={status}>{status ? status.replace("_" , " ") : "All statues"}</option>
                ))}
              </select>

              <Filter className={s.filterSelectIcon}></Filter>
            </div>
          </div>
      </section>

      {message && (
        <div className={`${s.messageBanner} ${getBannerVarient(message)}`}>
          <Info className="w-4 h-4"></Info>
          {message}
        </div>
      )}
    </AppLayout>
  )
}

export default bookingsPage