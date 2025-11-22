"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CartItem from "./CartItem";
import CartTrigger from "./CartTrigger";
import CartCheckout from "./CartCheckout";
import { useCartStore } from "@/stores/CartStore";

const Cart = () => {
  const open = useCartStore((state) => state.open);
  const setOpen = useCartStore((state) => state.setOpen);
  const cartItems = useCartStore((state) => state.cartItems);
  let totalPrice = 0;
  cartItems.map((item) => {
    totalPrice += item.price * item.noOfItems;
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <CartTrigger />

      <SheetContent className="flex flex-col justify-between p-2 md:p-4">
        <SheetHeader className="mt-3 md:mt-0">
          <SheetTitle>My Cart:</SheetTitle>
          <SheetDescription className="hidden" aria-hidden />
        </SheetHeader>

        <section
          className="mx-1 flex h-full flex-col gap-4 overflow-auto md:mt-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {cartItems.map((item, idx) => {
            return (
              <CartItem
                key={idx}
                id={item.id}
                name={item.name}
                price={item.price}
                total={item.noOfItems}
                image={item.img}
              />
            );
          })}
        </section>

        <SheetFooter className="mb-2 flex w-full flex-col px-2 sm:flex-col sm:space-x-0 md:mb-0">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-semibold">Total:</p>
            <p className="font-medium">Rs. {totalPrice}</p>
          </div>

          <CartCheckout />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
