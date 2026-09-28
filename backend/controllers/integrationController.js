import User from "../models/user.models.js";

import { getGoogleAuthUrl, getGoogleTokens } from "../utils/googleCalender.js";

export const getGoogleConnectUrl = async (req, res) => {
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REDIRECT_URI
  ) {
    return res
      .status(503)
      .json({ message: "Google Calendar is not configured" });
  }

  res.json({ url: getGoogleAuthUrl(req.user.id) });
};


export const handleGoogleCallback = async(req,res)=>{
    try {
        const {code, state} = req.query;

        if(!code || !state){
            return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/profile?calendar=failed`)
        }

        const token = await getGoogleTokens(code)

        if(!token.refresh_token){
            return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/profile?calendar=missing-refresh-token`)
        }

        await User.findByIdAndUpdate(state, {
            googleRefreshToken: token.refresh_token,
            googleCalendarConnected: true,
            googleCalendarId: `primary`
        })

        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/profile?calendar=connected`)
    } catch (error) {
         res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/profile?calendar=failed`)
    }
}