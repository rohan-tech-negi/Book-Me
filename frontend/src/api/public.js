import client from "./client";

export const getPublicBusiness = (slug) => client.get(`/public/${slug}`)
export const getPublicSlots = (slug, params) => client.get(`/public/${slug}/slots`, {params})
export const requestPublicBookingOtp = (slug, customerEmail) => client.post(`/public/${slug}/request-otp`, {customerEmail})
export const verifyPublicBookingOtp = (slug, data) => client.post(`/public/${slug}/verify-opt`, data)
export const createPublicBooking = (slug) => client.get(`/public/${slug}`)