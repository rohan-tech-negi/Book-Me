export const timeToMinutes = (time)=>{
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
}

export const minutesToTime = (totalMinutes) =>{
    const hours
}