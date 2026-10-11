import client from "./client";

export const getPayementOverview = () => client.get('/payments')
export const updatePayoutDetails = (data) => client.get('/payments/payout-details', data)
export const requestWithdrawl = (amount) => client.post('/payments/withdrawls', {amount})