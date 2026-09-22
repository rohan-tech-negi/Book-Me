import express from "express"
import cors from "cors"
import 'dotenv/config'
import http from "http"
import { connectDB } from "./config/db.js";


const PORT = process.env.PORT || 5000;
const app = express()


app.use(cors())
app.use(express.json())

connectDB()

app.get("/",(req,res)=>{
    res.send("API working")
})

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