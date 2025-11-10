import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "../env";
import * as schema from "./schema";

const conn = postgres(env.DATABASE_URL);

/**
 * @todo remove logger
 */
export const db = drizzle(conn, { schema, logger: true });
export type dbType = typeof db;
