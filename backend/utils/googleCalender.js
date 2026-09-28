import {google} from "googleapis"
import { buildCustomerCalenderUrl } from "./calenderLink.js"

const getOAuthClient = () =>{
    return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,)
}