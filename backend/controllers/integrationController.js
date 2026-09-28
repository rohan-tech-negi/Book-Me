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
      .json({ message: "Google Calender is not configure" });
  }

  res.jso({ url: getGoogleAuthUrl(req.user.id) });
};


export const handleGoogleCallback = async(req,res)=>{
    try {
        const {code, state} = req.query;
    } catch (error) {
        
    }
}