import { useEffect, useState } from "react";
import p6Image from "../assets/p6.png"
 import C1 from "../assets/icons/C1.png";
import C2 from "../assets/icons/C2.png";
import C3 from "../assets/icons/C3.png";
import C4 from "../assets/icons/C4.png";
import C5 from "../assets/icons/C5.png";
import C6 from "../assets/icons/C6.png";
import C7 from "../assets/icons/C7.png";
import C8 from "../assets/icons/C8.png";
import Applayout from "../components/AppLayout"
import {useToast} from "../context/ToastContext"
import {createServices, deleteServices, listServices, updateServices} from "../api/service"
import {servicesPageStyles as s} from "../assests/dummy"

