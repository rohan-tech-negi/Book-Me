import express from "express"
import cors from "cors"
import 'dotenv/config'
import http from "http"
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.routes.js'
import serviceRoutes from "./routes/service.routes.js"


const PORT = process.env.PORT || 5002;
const app = express()


app.use(cors())
app.use(express.json())

connectDB()

app.get("/",(req,res)=>{
    res.send("API working")
})

app.use("/api/auth", authRoutes)
app.use('/api/services', serviceRoutes)

const server = http.createServer(app)

server.on('error', (error)=>{
    if(error.code === "EAASSRINUSE") {
        console.log(`Port ${PORT} is already in use`)
        process.exit(1)
    }
    throw error
})

server.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}`)
})