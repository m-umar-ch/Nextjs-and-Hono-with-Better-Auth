import { authClient } from "@/auth/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const { data, error } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  if (data && data.session && data.user) redirect("/");

  return { hasSession: false, data, error };
}
