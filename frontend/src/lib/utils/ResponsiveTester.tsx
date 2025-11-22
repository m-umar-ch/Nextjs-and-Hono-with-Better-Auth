"use client";
import { cn } from "@/lib/utils/";
import React, { useEffect, useState } from "react";

const ResponsiveTester = ({ className }: { className?: string }) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);

    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  return (
    <div className={cn("fixed left-0 top-0 z-50", className)}>
      {screenWidth}
    </div>
  );
};

export default ResponsiveTester;

// TODO: delete this component before production
