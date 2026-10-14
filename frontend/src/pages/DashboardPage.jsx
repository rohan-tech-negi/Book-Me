import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import { getMe } from "../api/auth";
import { listBookings } from "../api/bookings";
import { getPaymentOverview } from "../api/payments";
import { listServices } from "../api/services";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  Copy,
  RefreshCcw,
} from "lucide-react";
import logo from "../assets/logo.png";
import p1Image from "../assets/P1.png";
import whatsappLogo from "../assets/WhatsApp-Logo.wine.png";
import instaLogo from "../assets/Instagram-Glyph-Color-Logo.wine.png";
import facebookLogo from "../assets/Facebook-f_Logo-Blue-Logo.wine.png";
import gmailLogo from "../assets/logo_gmail_lockup_default_2x_r7.png";
import googleCalendarLogo from "../assets/Google_Calendar-Logo.wine.png";
import { dashboardPageStyles as s } from "../assets/dummyStyles";

const formatMoney = (amount = 0) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount / 100,
  );

const formatLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseBookingDateValue = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getBookingDate = (booking, fallbackDate) =>
  parseBookingDateValue(booking.date || booking.createdAt) || fallbackDate;

const buildGmailShareUrl = (publicLink) => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    su: "Book a session with me",
    body: `Here is my booking link: ${publicLink}`,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
};

const buildPath = (points) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

const BarChart = ({ data, accent = "#7c3aed" }) => {
  const [tooltip, setTooltip] = useState(null);
  const width = 760;
  const height = 240;
  const padding = { top: 20, right: 10, bottom: 30, left: 40 };
  const values = data.map((item) => item.value);
  const maxValueOrig = Math.max(1, ...values);
  const maxValue = maxValueOrig * 1.2 || 1;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const barWidth = (plotWidth / data.length) * 0.55;
  const spacing = (plotWidth / data.length) * 0.45;

  const ticks = [0, 0.33, 0.66, 1].map((ratio) => ({
    y: padding.top + ratio * plotHeight,
    value: Math.round(maxValue - ratio * maxValue),
  }));

   return (
    <div className={s.barChartWrapper}>
      <svg viewBox={`0 0 ${width} ${height}`} className={s.barChartSvg}>
        {ticks.map((tick) => (
          <g key={tick.y}>
            <text
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className={s.barChartTickText}
            >
              ₹
              {tick.value >= 1000000
                ? `${(tick.value / 1000000).toFixed(1).replace(/\.0$/, "")}M`
                : tick.value >= 1000
                  ? `${(tick.value / 1000).toFixed(1).replace(/\.0$/, "")}K`
                  : tick.value}
            </text>
          </g>
        ))}
        {data.map((item, index) => {
          const barH = (item.value / maxValue) * plotHeight;
          const x = padding.left + index * (barWidth + spacing) + spacing / 2;
          const y = padding.top + plotHeight - barH;
          const showLabel =
            index % Math.ceil(data.length / 6) === 0 ||
            index === data.length - 1;
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={0}
                width={barWidth}
                height={height}
                fill="transparent"
                className={s.barChartBarInteractive}
                onMouseEnter={() =>
                  setTooltip({
                    x: x + barWidth / 2,
                    y: Math.max(y, padding.top),
                    text: `₹${item.value} earnings on ${item.label}`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
              <rect
                x={x}
                y={Math.max(y, padding.top)}
                width={barWidth}
                height={Math.max(barH, 4)}
                fill="url(#barGradient)"
                rx="4"
                className={`${s.barChartBar} ${tooltip?.x === x + barWidth / 2 ? "opacity-100" : "opacity-80"}`}
              />
              {showLabel && (
                <text
                  x={x + barWidth / 2}
                  y={height - 5}
                  textAnchor="middle"
                  className={s.barChartLabel}
                >
                  {item.short}
                </text>
              )}
            </g>
          );
        })}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      {tooltip && (
        <div
          className={s.barChartTooltip}
          style={{
            left: `${(tooltip.x / width) * 100}%`,
            top: `calc(${(tooltip.y / height) * 100}% - 4px)`,
          }}
        >
          {tooltip.text}
          <div className={s.barChartTooltipArrow}></div>
        </div>
      )}
    </div>
  );
};
