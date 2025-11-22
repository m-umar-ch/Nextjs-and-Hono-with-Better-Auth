import { cacheLife, cacheTag } from "next/cache";
import { api } from "../utils";
import { CacheTags } from "../utils/cacheTags";

export async function getCategories() {
  "use cache";
  cacheTag(CacheTags.CATEGORIES);
  cacheLife("weeks");

  const { data, error } = await api.GET("/api/public/category", {
    params: { query: { limit: 30 } },
  });

  if (error) {
    return null;
  }

  return data.data;
}
