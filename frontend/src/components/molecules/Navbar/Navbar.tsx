import { Suspense } from "react";
import MaxContainer from "../../MaxContainer";
import { cn } from "@/lib/utils/";
import NavLogo from "./NavLogo";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";
import Cart from "./NavCart/Cart";

// prettier-ignore
const Navbar = async () => {
  return (
    <div className="hidden border-b bg-transparent py-1 md:block">
      <MaxContainer className={cn("relative flex items-center justify-between")}>
        <NavLogo />

        <Suspense>
          <NavSearch />
        </Suspense>

        <div className="flex items-center gap-5">
            <NavUser />

            <Cart />
        </div>
      </MaxContainer>
    </div>
  );
};

export default Navbar;
