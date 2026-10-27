import { useEffect, useState } from "react";
import p6Image from "../assets/p6.png"
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import {getPayementOverview, requestWithdrawl, updatePayoutDetails} from "../api/payment"
import { paymentsPageStyles as s } from "../assests/dummy";