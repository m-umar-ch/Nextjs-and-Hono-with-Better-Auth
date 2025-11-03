"use client";
import { api } from "@/DAL/dal-utils/client";
import Link from "next/link";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const something = async () => {
      const response = await api.GET("/api");

      console.log("====================================");
      console.log(response);
      console.log("====================================");

      // setSession(JSON.stringify(session.data));

      // console.log("====================================");
      // console.log(response, session);
      // console.log("====================================");
    };
    something();
  }, []);
  return (
    <div className="flex flex-col">
      Falana
      <Link href={"/"}>home</Link>
      <Link href={"/login"}>login</Link>
    </div>
  );
};

export default Page;
