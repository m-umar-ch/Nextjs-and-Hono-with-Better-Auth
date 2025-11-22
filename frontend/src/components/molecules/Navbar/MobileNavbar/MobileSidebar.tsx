"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  History,
  House,
  Menu,
  MessageSquareMore,
  Store,
  UserCog,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ImageAssets } from "@/assets/imageAssets";
import SubNavLink, { PrivateSubNavLink } from "../SubNav/SubNavLinks";
import { ALL_ROLES, Roles } from "@/auth/permissions";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="text-primary" size={25} />
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="hidden" aria-hidden />
          <SheetDescription className="hidden" aria-hidden />
          <Link href={"/"} className="mx-auto pt-4">
            <SheetClose className="h-12">
              <Image
                src={ImageAssets.Base.Logo}
                alt={"Online Crockery Store"}
                className="h-full w-full object-contain object-center"
              />
            </SheetClose>
          </Link>

          <div className="border-b pt-4" />
        </SheetHeader>

        <section className="mx-1 mt-5 flex h-full flex-col gap-7 overflow-auto pl-5">
          <PrivateSubNavLink
            Icon={UserCog}
            name="Admin Panel"
            url="/admin"
            roles={ALL_ROLES.filter((item) => item !== Roles.CUSTOMER)}
            isMobile
          />

          <SubNavLink Icon={House} name="Home" url="/" isMobile />

          <SubNavLink Icon={Store} name="Shop" url="/shop/all" isMobile />

          <PrivateSubNavLink
            Icon={History}
            name="Order History"
            url="/order-history"
            isMobile
            roles={ALL_ROLES}
          />

          <SubNavLink
            Icon={MessageSquareMore}
            name="Contact Us"
            url="/contact"
            isMobile
          />
        </section>

        <SheetFooter className="mx-auto w-full">
          {/**
           * @todo make this dynamic for login
           */}
          {/* <SheetClose className="w-full">
            <Button className="w-full text-lg">Login</Button>
          </SheetClose> */}
          {/* <Popover>
            <PopoverTrigger className="flex w-full items-center">
              <Avatar className="rounded-lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <span className="ml-3 mr-1 inline-block w-[70%] text-sm font-medium leading-4 sm:w-[80%]">
                <h3 className="truncate text-start">Username</h3>
                <p className="truncate text-start">username@email.com</p>
              </span>

              <ChevronsUpDown size={18} className="" />
            </PopoverTrigger>

            <PopoverContent className="mb-3 flex w-64 flex-col gap-3">
              <span className="flex items-center gap-2.5 font-medium hover:text-primary">
                <BadgeCheck /> Account
              </span>

              <span className="border-t" />

              <span className="flex items-center gap-2.5 font-medium hover:text-primary">
                <LogOut /> Logout
              </span>
            </PopoverContent>
          </Popover> */}

          <div className="mb-5 border-t" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
