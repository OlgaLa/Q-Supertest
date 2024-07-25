import "dotenv/config";

export const ACCESS_TOKEN = process.env.ACCESS_TOKEN as string;
export const BASE_URL = process.env.BASE_URL ?? "https://gorest.co.in/";