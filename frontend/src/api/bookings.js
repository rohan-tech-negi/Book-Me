import client from "./client"

export const listBookings = (params={}) => client.get("/booking", {params})
export const updateBookingsStatus = (id, status) => client.patch(`/booking/${id}`, {status})
export const rescheduleBooking = (id, data) => client.patch(`/booking/${id}/reschedule`, data)