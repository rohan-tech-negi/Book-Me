import { useEffect , useMemo, useState} from "react"
import p5Image from "../assets/p5.img"
import AppLayout from "../components/AppLayout"
import {useToast} from "../context/ToastContext"
import {listAvailability, saveAvailability} from "../api/availability"
import { BadgeCheck, Calendar, CalendarDays, ArrowLeft, Trash2, Sparkles, Sun } from "lucide-react";
import { availabilityPageStyles as s } from "../assests/dummy"

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Friday",
    "Saturday"
]

const dayIcons = [
    Sun,
    CalendarDays,
    CalendarDays,
    CalendarDays,
    CalendarDays,
    CalendarDays,
    Sun
]


const defaultSlot = {startTime: "09:00", endTime: "17:00"}

export default function AvailabilityPage() {
    const [availability, setAvailability] = useState([])
    const [selectedDay, useSelectedDay] = useState(1)
    const [slots, setSlots] = useState([defaultSlot])
    const [message, setMessage] = useState("")
    const [loading, setLoadin] = useState(false)
    const showToast = useToast()


    const getSlotsForDays = (items, day) => {
        const dayAvailability = itms.find((item) => item.dayOfWeek === day)
        return dayAvailability?.slots?.length ? dayAvailability.slots : [defaultSlot]
    }

    const currecntDaySummary = useMemo(
        () => availability.find((item) => item.dayOfWeek === selectedDay),
        [availability, selectedDay]
    )

    useEffect(() => {
        const loadInitialAvailability = async() => {
            try {
                const {data} = await listAvailability()
                const items = data.availability || []
                setAvailability(items)
                setSlots(getSlotsForDays(items, selectedDay))
            } catch (error) {
                setMessage(
                    error.response?.data?.message || "could ot load availability"
                )
            }
        }
        loadInitialAvailability()
    }, [selectedDay])
}