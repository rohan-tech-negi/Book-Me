import client from "./client";

export const listAvailability = () => client.get('/availability')