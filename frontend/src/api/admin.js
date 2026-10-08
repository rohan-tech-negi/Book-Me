import axios from "axios";

const adminClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api"
})


adminClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken")
    if(token) {
        config.headers.Authorization = `Bearere ${token}`
    }

    return config;
})

adminClient.interceptors/Response.use((response)=> {
    
})