import { createContext, useContext, useState, useCallback } from "react";
import { BadgeCheck, AlertCircle } from "lucide-react";

const ToastContect = createContext(null)

export const useText = () =>{
    const context = useContext(ToastContect)
    if(!context){
        throw new Error("userToast must be used within a ToastPrivider")
    }
    return context
}


exprt c