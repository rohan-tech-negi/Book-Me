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


const LineChart = ({ data, accent = "#7D57F5" }) => {
  const [tooltip, setTooltip] = useState(null);
  const width = 760;
  const height = 300;
  const padding = { top: 28, right: 26, bottom: 42, left: 42 };
  const values = data.map((item) => item.value);
  const maxValue = Math.max(1, ...values);
  const minValue = Math.min(0, ...values);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const range = Math.max(1, maxValue - minValue);
  const points = data.map((item, index) => {
    const x = padding.left + (index / Math.max(1, data.length - 1)) * plotWidth;
    const y = padding.top + ((maxValue - item.value) / range) * plotHeight;
    return { ...item, x, y };
  });
  const linePath = buildPath(points);
  const areaPath = `${linePath} L ${padding.left + plotWidth} ${padding.top + plotHeight} L ${padding.left} ${padding.top + plotHeight} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: padding.top + ratio * plotHeight,
    value: Math.round(maxValue - ratio * range),
  }));

  return (
    <div className={s.lineChartWrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={s.lineChartSvg}
        role="img"
        aria-label="Bookings line graph"
      >
        <defs>
          <linearGradient id="bookingLineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="8"
              floodColor={accent}
              floodOpacity="0.12"
            />
          </filter>
        </defs>
        {ticks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={padding.left}
              x2={padding.left + plotWidth}
              y1={tick.y}
              y2={tick.y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 12}
              y={tick.y + 4}
              textAnchor="end"
              className={s.lineChartTickText}
            >
              {tick.value >= 1000000
                ? `${(tick.value / 1000000).toFixed(1).replace(/\.0$/, "")}M`
                : tick.value >= 1000
                  ? `${(tick.value / 1000).toFixed(1).replace(/\.0$/, "")}K`
                  : tick.value}
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#bookingLineFill)" />
        <path
          d={linePath}
          fill="none"
          stroke={accent}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softShadow)"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="18"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() =>
                setTooltip({
                  x: point.x,
                  y: point.y,
                  text: `${point.value} bookings on ${point.label}`,
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke={accent}
              strokeWidth="3.5"
              className="pointer-events-none"
            />
            <text
              x={point.x}
              y={height - 14}
              textAnchor="middle"
              className={s.lineChartLabel}
            >
              {point.short}
            </text>
          </g>
        ))}
      </svg>
      {tooltip && (
        <div
          className={s.lineChartTooltip}
          style={{
            left: `${(tooltip.x / width) * 100}%`,
            top: `calc(${(tooltip.y / height) * 100}% - 8px)`,
          }}
        >
          {tooltip.text}
          <div className={s.lineChartTooltipArrow}></div>
        </div>
      )}
    </div>
  );
};