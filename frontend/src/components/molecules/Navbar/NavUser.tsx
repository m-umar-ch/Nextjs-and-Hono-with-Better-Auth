"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { History, ShoppingCart, UserCircle } from "lucide-react";
import { authClient } from "@/auth/auth-client/client";
import { toast } from "sonner";
import { useCartStore } from "@/stores/CartStore";
import { useRouter } from "next/navigation";

const NavUser = () => {
  const { data, isPending, isRefetching, refetch } = authClient.useSession();
  const user = data?.user;
  const cartItems = useCartStore((state) => state.cartItems);
  const router = useRouter();

  if (isPending || isRefetching) {
    return (
      <UserCircle className="text-primary h-[25px] w-[25px] cursor-pointer md:h-7 md:w-7" />
    );
  }

  if (!user) {
    return (
      <UserCircle
        className="text-primary h-[25px] w-[25px] cursor-pointer md:h-7 md:w-7"
        onClick={() => router.push("/login")}
      />
    );
  }

  return (
    <div className="relative cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="border-primary border-2">
          <Avatar className="h-[25px] w-[25px] md:h-7 md:w-7">
            <AvatarImage
              src={
                user.image ??
                "https://developer-256.github.io/assets/newcrockeryuser.svg"
              }
              loading="lazy"
              alt={user.name ?? "User"}
            />
            {user.name ? (
              <AvatarFallback className="bg-primary text-white">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-primary text-white">
                OC
              </AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="pb-0">{user.name}</DropdownMenuLabel>
          <DropdownMenuItem disabled className="py-0 pb-2 text-xs">
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <Link href={"/order-history"}>
            <DropdownMenuItem className="hover:text-primary! transition-all duration-200 hover:cursor-pointer">
              <History /> Order History
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            className="hover:text-primary! transition-all duration-200 hover:cursor-pointer"
            disabled={cartItems.length === 0}
            onClick={() => {
              if (cartItems.length > 0) router.push("/checkout");
            }}
          >
            <ShoppingCart />
            Checkout
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <Button
            className="text-foreground w-full cursor-pointer bg-white hover:text-white"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    refetch();
                    toast.success("Successfully Logged Out");
                  },
                },
              })
            }
          >
            Log out
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavUser;
