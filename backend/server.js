import express from "express"
import cors from "cors"
import 'dotenv/cofig'
import http from "http"


const PORT = 5000;
const app = express()



app.get("/",(req,res)=>{
    res.send("API working")
})

const server = http.createServer(app)