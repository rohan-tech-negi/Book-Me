import {google} from "googleapis"
import { buildCustomerCalenderUrl } from "./calenderLink.js"

const getOAuthClient = () =>{
    return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI)
}


export const getGoogleAuthUrl = (userId) =>{
    const oauth2Client = getOAuthClient()

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/calender.events'],
        state: String(userId)
    })
}


export const getGoogleTokens = async(code)=>{
    
}