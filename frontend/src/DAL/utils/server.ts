import { env } from "@/env";
import { headers } from "next/headers";
import createClient from "openapi-fetch";
import { paths } from "../api-types";

export const api = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  credentials: "include",
  headers: await headers(),
});
