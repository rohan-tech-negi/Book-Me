import jwt from "jsonwebtoken"

const adminAuth = (req,res, next) =>{
    const authHeader = req.header.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message: 'Admin authorization required'})
    }

    try {
        const token = authHeader.split(' ')(1)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded.role !== 'admin'){
            return res.status(403).json({message: "admin access required"})
        }

        res.admin = {email: decoded.email}
    } catch (error) {
        res.status(401).json({message: "Invalid admin token"})
    }
}

export default adminAuth