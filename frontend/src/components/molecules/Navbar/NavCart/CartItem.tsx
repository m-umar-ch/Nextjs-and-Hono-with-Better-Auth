import { useCartStore } from "@/stores/CartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import React from "react";

const CartItem = ({
  id,
  image,
  name,
  price,
  total,
}: {
  id: number;
  name: string;
  price: number;
  image: string | StaticImageData;
  total: number;
}) => {
  const addCartItem = useCartStore((state) => state.addCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  return (
    <div className="flex items-center gap-4 rounded-md bg-slate-400/20 px-4 py-3">
      <div className="h-12 w-20 overflow-hidden rounded-sm">
        <Image
          src={image}
          alt={name + " img"}
          width={80}
          height={48}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="w-full">
        <h3 className="text-start text-xs font-semibold">{name}</h3>

        <p className="text-start text-xs font-semibold text-foreground/90">
          Price: <span className="text-foreground/70">{price}</span>
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-md border-[1.5px] bg-white">
              <div
                className="flex w-6 cursor-pointer items-center justify-center rounded-l-md py-1.5"
                onClick={() => removeCartItem(id)}
              >
                <Minus className="h-2.5 w-2.5" />
              </div>
              <div className="flex h-4 items-center justify-center p-0.5 text-xs">
                {total}
              </div>
              <div
                className="flex w-6 cursor-pointer items-center justify-center rounded-r-md py-1.5"
                onClick={() =>
                  addCartItem({
                    id: id,
                    img: image,
                    name: name,
                    price: price,
                    noOfItems: 0,
                  })
                }
              >
                <Plus className="h-2.5 w-2.5" />
              </div>
            </div>

            <Trash2
              className="size-4 cursor-pointer text-red-500"
              onClick={() => removeCartItem(id, "force-delete")}
            />
          </div>

          <p className="text-xs text-foreground/70">Rs. {price * total}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
