import createClient from "openapi-fetch";
import type { paths } from "@/DAL/api-types";
import { env } from "@/env";

const api = createClient<paths>({
  baseUrl: env.BACKEND_BASE_URL,
  credentials: "include",
});

const response = api.GET("/api");

type GetApiResponse = Awaited<ReturnType<typeof api.GET>>["data"];

// "openapi": "bunx openapi-typescript http://localhost:9999/api/doc -o ./src/DAL/api-types.d.ts"
