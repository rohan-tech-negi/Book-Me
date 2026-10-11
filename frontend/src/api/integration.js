import client from "./client";
export const getGoogleConnectedUrl = () => client.get('/integration/google/connect')