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