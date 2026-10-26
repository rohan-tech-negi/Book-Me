import { useEffect, useState } from "react";
import p6Image from "../assets/p6.png"
 import C1 from "../assets/icons/C1.png";
import C2 from "../assets/icons/C2.png";
import C3 from "../assets/icons/C3.png";
import C4 from "../assets/icons/C4.png";
import C5 from "../assets/icons/C5.png";
import C6 from "../assets/icons/C6.png";
import C7 from "../assets/icons/C7.png";
import C8 from "../assets/icons/C8.png";
import Applayout from "../components/AppLayout"
import {useToast} from "../context/ToastContext"
import {createServices, deleteServices, listServices, updateServices} from "../api/service"
import {servicesPageStyles as s} from "../assests/dummy"

const ICON_MAP = {
  "C1.png": C1,
  "C2.png": C2,
  "C3.png": C3,
  "C4.png": C4,
  "C5.png": C5,
  "C6.png": C6,
  "C7.png": C7,
  "C8.png": C8,
};

const emptyForm = {
    name: "",
    duration: 30,
    price: 0,
    description: "",
    icon: "C1.png"
}

export default function ServicePage () {
    const [services, setServices] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const showToast = useToast()

    const applyServices = (item) => {
        setServices(item || [])
    }
    const loadServices = async() =>{
        try {
            const {data} = await listServices()
            applyServices(data.services)
        } catch (error) {
            setMessage(error.message?.data?.message || "Could not load services")
        }
    }

    useEffect(()=>{
        const loadInitialServices = async() => {
            try {
                const {data} = await listServices()
                applyServices(data.services)
            } catch (error) {
                setMessage(error.response?.data?.message || "Could not load services")
            }
        }
        loadInitialServices()
    },[])
    const handleChange = (event) => {
        setForm((prev)=>({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = async(event) =>{
        event.preventDefault()
        setLoading(true)
        setMessage("")
        try {
            const payload = {
                ...form,
                duration:Number(form.duration),
                price: Number(form.price)
            }
            if(editingId){
                await updateServices(editingId, payload)
            }else{
                await createServices(payload)
            }
            setForm(emptyForm)
            setEditingId("")
            showToast(editingId ? "Service updated successfully" : "Service added successfully")
            loadServices()
        } catch (error) {
            showToast(error.response?.data?.message || "could not save services","error")
        }finally{
            setLoading(false)
        }
    }

    const toggleServices = async(service) =>{
        await updateServices(service._id, {isActive: !service.isActive})
        loadServices()
    }

    const startEditing
}