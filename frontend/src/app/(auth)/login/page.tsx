import { GalleryVerticalEnd } from "lucide-react";
import { LoginCard } from "./_components/login-card";
import { authClient } from "@/auth/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const { data } = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  if (data && data.session && data.user) redirect("/");

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>

        {/* <button onClick={() => toast.success("Something Went Wrong")}>
          hello
        </button> */}

        <LoginCard />
      </div>
    </div>
  );
};

export default page;
