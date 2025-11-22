import { cacheLife, cacheTag } from "next/cache";
import { api } from "../utils";
import { CacheTags } from "../utils/cacheTags";

export async function getSiteConfig() {
  "use cache";
  cacheTag(CacheTags.SITE_CONFIG);
  cacheLife("weeks");

  const { data, error } = await api.GET("/api/public/site-config");

  if (error) {
    return null;
  }

  return data.data;
}
