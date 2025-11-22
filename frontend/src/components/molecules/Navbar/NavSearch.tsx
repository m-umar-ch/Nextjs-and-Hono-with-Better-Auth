"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const NavSearch = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (term.trim()) {
      params.set("q", term.trim());
    } else {
      params.delete("q");
    }

    if (pathname === "/search") {
      replace(`${pathname}?${params.toString()}`);
    } else push(`/search?${params.toString()}`);
  }, 500);

  return (
    <ButtonGroup className="mt-1 flex w-full items-center md:mt-0 md:px-5 lg:max-w-[400px]">
      <Input
        placeholder="Search..."
        className="border-primary text-primary h-8"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("q")?.toString()}
      />

      <Button
        variant="outline"
        aria-label="Search"
        className="border-primary hover:text-primary bg-primary text-primary-foreground hover:bg-primary/5 h-8 cursor-pointer"
      >
        <span className="hidden md:block">Search</span>
        <Search className="md:hidden" />
      </Button>
    </ButtonGroup>
  );
};

export default NavSearch;
