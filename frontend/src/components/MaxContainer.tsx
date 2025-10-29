import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const MaxContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-10", className)}>
      {children}
    </div>
  );
};

export default MaxContainer;

export const MaxContainerAdmin = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full px-4 lg:px-6", className)}>
      {children}
    </div>
  );
};
