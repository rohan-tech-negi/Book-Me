import client from "./client";
export const getGoogleConnectedUrl = () => client.get('/integrations/google/connect');
export const getGoogleConnectUrl = getGoogleConnectedUrl;