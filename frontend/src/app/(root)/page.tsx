"use client";

import { authClient } from "@/auth/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useEffect, useState } from "react";

// import { redirect } from "next/navigation";
const Page = () => {
  // const session = await authClient.getSession({
  //   fetchOptions: { headers: await headers() },
  // });
  // const { data, error } = await api.GET("/api");

  // const { data, error } = await authClient.getSession();
  // if (error || !data) redirect("/login");
  // console.log("====================================");
  // console.log("data", data);
  // console.log("error", error);
  // console.log("====================================");
  // const [session, setSession] = useState("");
  // useEffect(() => {
  //   const something = async () => {
  //     const response = await api.GET("/api");
  //     const session = await authClient.useSession.get();

  //     console.log("====================================");
  //     console.log(session);
  //     console.log("====================================");

  //     // setSession(JSON.stringify(session.data));

  //     // console.log("====================================");
  //     // console.log(response, session);
  //     // console.log("====================================");
  //   };
  //   something();
  // }, []);

  return (
    <div>
      <Link href={"/login"}>Login</Link>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
    </div>
  );
};

export default Page;
