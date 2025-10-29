import createClient from "openapi-fetch";
import type { paths } from "@/DAL/api-types";
import { env } from "@/env";

const api = createClient<paths>({
  baseUrl: env.BACKEND_BASE_URL,
  credentials: "include",
});
