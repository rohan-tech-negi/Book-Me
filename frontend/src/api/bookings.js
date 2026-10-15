import client from "./client"

export const listBookings = (params={}) => client.get("/bookings", {params})
export const updateBookingsStatus = (id, status) => client.patch(`/bookings/${id}`, {status})
export const rescheduleBooking = (id, data) => client.patch(`/bookings/${id}/reschedule`, data)