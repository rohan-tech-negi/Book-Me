import Service from "../models/service.models.js";

export const listServices =  async(req, res)=>{
    try {
        const services = await Service.find({userId: req.user.Id, isDeleted: {$ne: true}}).toSorted({createdAt: -1})
        res.json({services})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}