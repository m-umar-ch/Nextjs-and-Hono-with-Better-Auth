"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/DAL/client/category";
import { useRouter, useSearchParams } from "next/navigation";

const SubNavCategories = () => {
  const { data, isLoading, isError } = useCategories();

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    replace(`/shop/${category}?${params.toString()}` as never);
  };

  if (isLoading)
    return (
      <DropdownMenuContent className="mt-1 ml-8 min-w-[180px]">
        <DropdownMenuItem className="text-foreground">
          Loading...
        </DropdownMenuItem>
      </DropdownMenuContent>
    );

  if (isError) return;

  if (data && !data.items.length)
    return (
      <DropdownMenuContent className="mt-1 ml-8 min-w-[180px]">
        <DropdownMenuItem className="hover:bg-secondary/60 cursor-pointer text-red-500 hover:text-red-500!">
          No Items
        </DropdownMenuItem>
      </DropdownMenuContent>
    );

  if (data)
    return (
      <DropdownMenuContent className="mt-1 ml-8 min-w-[180px]">
        {data.items.map((Item, idx) => {
          return (
            <DropdownMenuItem
              key={idx}
              onClick={() => handleClick(Item.slug)}
              className="text-foreground hover:bg-secondary/60 hover:text-primary cursor-pointer"
            >
              {Item.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    );
};

export default SubNavCategories;
