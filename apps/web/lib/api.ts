import { initClient } from "@ts-rest/core";
import { apiYoutube } from "contract";
export const client = initClient(apiYoutube, {
  baseUrl: process.env.API_URL || "http://localhost:8000",
  baseHeaders: {},
});
