import { authClient } from "@/auth/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthPage from "../_components/auth-page";

const page = async () => {
  const { data } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  if (data && data.session && data.user) redirect("/");

  return <AuthPage type="authorize" />;
};

export default page;
