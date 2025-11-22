import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/CartStore";
import Link from "next/link";
import {} from "@/auth/auth-client/server";
import { authClient } from "@/auth/auth-client/client";

const CartCheckout = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartOpen = useCartStore((state) => state.setOpen);
  const { push } = useRouter();
  const { data } = authClient.useSession();

  if (!data?.user)
    return (
      <>
        {cartItems.length === 0 ? (
          <Button className="mt-2 w-full" disabled>
            Checkout
          </Button>
        ) : (
          <Link href={"/login"}>
            <Button className="mt-2 w-full" disabled>
              Checkout
            </Button>
          </Link>
        )}
      </>
    );

  if (data.user)
    return (
      <Button
        className="mt-2 w-full"
        onClick={() => {
          push("/checkout");
          cartOpen(false);
        }}
        disabled={cartItems.length === 0}
      >
        Checkout
      </Button>
    );
};

export default CartCheckout;
