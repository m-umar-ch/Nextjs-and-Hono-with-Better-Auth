"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle, LayoutGrid, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SubNavCategories from "./SubNavCategories";
import { Roles } from "@/auth/permissions";
import { authClient } from "@/auth/auth-client/client";
import { SheetClose } from "@/components/ui/sheet";

export default function SubNavLink({
  url,
  name,
  Icon,
  isMobile,
}: {
  url: string;
  name: string;
  isMobile?: boolean;
  Icon?: LucideIcon;
}) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <Link href={url as never}>
        <SheetClose
          className={cn("flex w-full items-center gap-4", {
            "text-primary font-medium": pathname === url,
          })}
        >
          {Icon && <Icon className="h-6 w-6" />}
          <p className="text-lg leading-3 font-medium">{name}</p>
        </SheetClose>
      </Link>
    );
  }

  return (
    <Link
      href={url as never}
      className={cn(
        "hover:text-primary flex items-center gap-2 transition-all",
        {
          "text-primary font-medium": pathname === url,
        },
      )}
    >
      {name}
      <Circle size={10} strokeWidth={3} className="mt-[2px]" />
    </Link>
  );
}

export function PrivateSubNavLink({
  name,
  roles,
  url,
  Icon,
  isMobile,
}: {
  roles: Roles[];
  name: string;
  url: string;
  isMobile?: boolean;
  Icon?: LucideIcon;
}) {
  const { data } = authClient.useSession();

  if (data?.user?.role && roles.includes(data.user.role as Roles)) {
    return <SubNavLink url={url} name={name} isMobile={isMobile} Icon={Icon} />;
  }

  return null;
}

export function CategorySubNavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-primary flex cursor-pointer items-center gap-2 ring-0! transition-all outline-none!">
        Categories
        <ChevronDown size={16} className="mt-[2px]" />
      </DropdownMenuTrigger>

      <Suspense>
        <SubNavCategories />
      </Suspense>
    </DropdownMenu>
  );
}

export function RoundWidgetCategorySubNavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-[1.5px] outline-none!">
        <LayoutGrid className="text-primary" size={20} strokeWidth={1.6} />
      </DropdownMenuTrigger>

      <Suspense>
        <SubNavCategories />
      </Suspense>
    </DropdownMenu>
  );
}
