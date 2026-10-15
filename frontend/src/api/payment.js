import client from "./client";

export const getPaymentOverview = () => client.get('/payments');
export const getPayementOverview = getPaymentOverview;
export const updatePayoutDetails = (data) => client.get('/payments/payout-details', data)
export const requestWithdrawl = (amount) => client.post('/payments/withdrawls', {amount})