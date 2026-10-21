import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {cancelPublicBookingPayments} from "../api/public"
import { XCircle, ArrowLeft } from "lucide-react";
import { bookingCancelledPageStyles as s } from "../assests/dummy";