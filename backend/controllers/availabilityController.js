import Availability from "../models/availability.models";
import { isValidTimeRande } from "../utils/time";

export const listAvailability = async(req,res)=>{
    try {
        const availability = (await Availability.find({
            userId: req.user.id
        })).toSorted({dayOfWeek: 1})
        res.json({availability})
    } catch (error) {
        res.status(500).json({message: "servicer error", error: error.message})
    }
}