import { ShoppingBag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/CartStore";

const CartTrigger = () => {
  const open = useCartStore((state) => state.open);
  const setOpen = useCartStore((state) => state.setOpen);
  const cartItems = useCartStore((state) => state.cartItems);
  let totalCartItems = 0;
  cartItems.map((item) => {
    totalCartItems += item.noOfItems;
  });
  return (
    <div
      className="flex items-center justify-center"
      onClick={() => setOpen(!open)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="relative">
              <ShoppingBag className="text-primary size-6 cursor-pointer md:size-7" />
              <Badge className="bg-primary text-primary-foreground absolute -top-2 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-semibold select-none">
                {totalCartItems}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cart</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CartTrigger;
