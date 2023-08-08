import { initClient } from "@ts-rest/core";
import { apiYoutube } from "contract";
export const client = initClient(apiYoutube, {
  baseUrl: "http://localhost:8000",
  baseHeaders: {},
});
