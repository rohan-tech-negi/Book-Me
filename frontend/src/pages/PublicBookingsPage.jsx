import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createPublicBooking,
  getPublicBusiness,
  getPublicSlots,
  requestPublicBookingOtp,
  verifyPublicBookingOtp,
} from "../api/public";
import {
  Clock,
  CalendarDays,
  User,
  Mail,
  Lock,
  BadgeCheck,
  Shield,
  Check,
} from "lucide-react";
import greenBanner from "../assets/green.png";
import purpleBanner from "../assets/purple.png";
import redBanner from "../assets/red.png";
import whiteBanner from "../assets/white.png";
import yellowBanner from "../assets/yellow.png";
import C1 from "../assets/icons/C1.png";
import C2 from "../assets/icons/C2.png";
import C3 from "../assets/icons/C3.png";
import C4 from "../assets/icons/C4.png";
import C5 from "../assets/icons/C5.png";
import C6 from "../assets/icons/C6.png";
import C7 from "../assets/icons/C7.png";
import C8 from "../assets/icons/C8.png";
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
import {
  getBrandThemeStyle,
  publicBookingPageStyles as s,
} from "../assets/dummyStyles";

const today = new Date().toISOString().slice(0, 10);

const ICON_MAP = {
  "C1.png": C1,
  "C2.png": C2,
  "C3.png": C3,
  "C4.png": C4,
  "C5.png": C5,
  "C6.png": C6,
  "C7.png": C7,
  "C8.png": C8,
};

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

const themeBannerImages = {
  emerald: greenBanner,
  indigo: purpleBanner,
  rose: redBanner,
  amber: yellowBanner,
  slate: whiteBanner,
};