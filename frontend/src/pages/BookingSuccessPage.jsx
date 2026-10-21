import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {getPublicStatus } from "../api/public"
import { BadgeCheck, Calendar, CalenderDays, ArrowLeft } from "lucide-react";
import { bookingSuccessPageStyles as s } from "../assests/dummy";
