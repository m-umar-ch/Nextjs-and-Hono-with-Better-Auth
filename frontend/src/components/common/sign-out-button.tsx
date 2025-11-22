"use client";
import { authClient } from "@/auth/auth-client/server";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="destructive"
      onClick={() => {
        authClient.signOut();
        router.refresh();
      }}
      className="cursor-pointer"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
