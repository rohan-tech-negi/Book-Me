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



export default function PublicBookingPage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [form, setForm] = useState({
    serviceId: "",
    date: today,
    customerName: "",
    customerEmail: "",
    customerAvatar: "A1.png",
    emailOtp: "",
    notes: "",
  });

  const selectedService = useMemo(
    () => services.find((service) => service._id === form.serviceId),
    [services, form.serviceId],
  );

  const brandTheme = getBrandThemeStyle(business?.brandTheme);
  const accent = business?.brandAccent || brandTheme.accent;
  const brandStyleVars = {
    "--brand-accent": accent,
    "--brand-panel": brandTheme.panel,
  };
  const bannerImage = themeBannerImages[business?.brandTheme] || greenBanner;

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldown]);

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const { data } = await getPublicBusiness(slug);
        setBusiness(data.business);
        setServices(data.services || []);
        setForm((prev) => ({
          ...prev,
          serviceId: data.services?.[0]?._id || "",
        }));
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not load booking page",
        );
      }
    };

    loadBusiness();
  }, [slug]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!form.serviceId || !form.date) return;
      setSelectedSlot(null);

      try {
        const { data } = await getPublicSlots(slug, {
          serviceId: form.serviceId,
          date: form.date,
        });
        setSlots(data.slots || []);
      } catch (error) {
        setSlots([]);
        setMessage(error.response?.data?.message || "Could not load slots");
      }
    };

    loadSlots();
  }, [slug, form.serviceId, form.date]);
  const handleChange = async (event) => {
    const { name, value } = event.target;
    if (name === "emailOtp") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setForm((prev) => ({ ...prev, emailOtp: digitsOnly }));
      if (otpVerified) setOtpVerified(false);

      if (digitsOnly.length === 6 && form.customerEmail) {
        try {
          await verifyPublicBookingOtp(slug, {
            customerEmail: form.customerEmail,
            emailOtp: digitsOnly,
          });
          setOtpVerified(true);
          setMessage("Email verified successfully.");
        } catch (error) {
          setOtpVerified(false);
          setMessage(error.response?.data?.message || "Invalid OTP");
        }
      }
      return;
    }
    if (name === "customerEmail") {
      setOtpVerified(false);
      setOtpSentTo("");
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
