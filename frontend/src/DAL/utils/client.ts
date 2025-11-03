import { env } from "@/env";
import createClient from "openapi-fetch";
import { paths } from "../api-types";

export const api = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  credentials: "include",
});
