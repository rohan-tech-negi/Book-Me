import { useState, useEffect } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom"
import {login, register, requestRegistrationOtp, verifyRegistrationOtp} from "../api/auth"
import logo from "../assets/logo.png"
import {User, Mail, Lock, Building2, ArrowRight,CalenderDays, Shield, Zap, BadgeCheck} from "lucide-react"
import {authPageStyles as s} from "../assests/dummy"   