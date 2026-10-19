import { useEffect, useState } from "react";
import {useSearchParams} from "react-router-dom"
import AppLayout from "../components/AppLayout"
import { getMe, updateProfile } from "../api/auth";
import {getGoogleConnectUrl} from "../api/integration"


import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  Copy,
  RefreshCcw,
} from "lucide-react";

import googleCalenderLogo from "../assets/Google_Calender-Logo.wine.png"
import stripeLogo from "../assets/stripeIcon.png"
import gmailLogo from "../assets/logo_gmail_lockup_default_2x_r7.png"
import p2Image from "../assets/P2.png"
import greenBanner from "../assets/green.png"
import purpleBanner from "../assets/purple.png"
import redBanner from "../assets/red.png"
import whiteBanner from "../assets/white.png"
import yellowBanner from "../assets/yellow.png"

import { brandThemeOptions, brandThemeStyles, getBrandThemeStyle, profilePageStyles } from "../assests/dummy";


const getCalenderMessage = (value) =>{
    if(value == "connected") return "Google Calender connected sucessfully"
    if(value) return "Google Calender connection was not completed"
    return ""
}

const themeBannerImages = {
    emerald: greenBanner,
    indigo : purpleBanner,
    rose: redBanner,
    amber: yellowBanner,
    slate: whiteBanner
}

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const calenderNotice = searchParams.get('calender')
  const [form, setForm] = useState({
    businessName: "",
    businessDescription: "",
    timezone: "Asia/kolkata",
    brandTheme: "emrald",
    brandAccent: "#6CA7FF"
  })

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [connectionCalender, setConnectionCalender] = useState(false)
  const [message, setMessage] = useState(getCalenderMessage(calenderNotice))

  const [copyMessage, setCopyMessage] = useState("")


  const publicLink = user?.slug ? `${window.location.origin}/book/${user.slug}` : `${window.location.origin}`

  const dynamicThemeUI = getBrandThemeStyle
}