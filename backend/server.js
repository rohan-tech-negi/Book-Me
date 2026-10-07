import express from "express"
import cors from "cors"
import 'dotenv/config'
import http from "http"
import { connectDB } from "./config/db.js";
import authRoutes from './routes/auth.routes.js'
import serviceRoutes from "./routes/service.routes.js"
import availibilityRoutes from "./routes/availibility.routes.js"
import integrationRoutes from "./routes/integration.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import bookingRoutes from "./routes/booking.routes.js"


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
app.use("/api/availibility", availibilityRoutes)
app.use('/api/integrations', integrationRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/bookings', bookingRoutes)
const server = http.createServer(app)

server.on('error', (error) => {
    if (error.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use`)
        process.exit(1)
    }
    throw error
})

server.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:${PORT}`)
})