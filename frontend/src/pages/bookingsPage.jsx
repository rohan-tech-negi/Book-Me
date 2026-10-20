import {listBookings, updateBookingsStatus, rescheduleBooking} from "../api/bookings.js"
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  Copy,
  RefreshCcw,
} from "lucide-react";

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
import { use, useState } from "react";




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
  }
  return (
    <div>bookingsPage</div>
  )
}

export default bookingsPage