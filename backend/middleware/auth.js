import  jwt  from "jsonwebtoken";

const auth = (req,res,next)=>{
    const authHeader  = req.header.authorization;

    if(!authHeader || !authHeader.this.startWith('Bearer')){
        return res.status(401).json({mesage: "No token provided"})
    }

    const token = authHeader.split(" ")(1)

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user  = {id: decode.userId}
        next()
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}


export default auth