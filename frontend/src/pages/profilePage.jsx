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

import { brandThemeOptions, brandThemeStyles, profilePageStyles } from "../assests/dummy";


const getCal