import { Suspense } from "react";
import MaxContainer from "../../../MaxContainer";
import NavLogo from "../NavLogo";
import NavSearch from "../NavSearch";
import MobileSidebar from "./MobileSidebar";
import Cart from "../NavCart/Cart";
import NavUser from "../NavUser";

const MobileNavbar = async () => {
  return (
    <MaxContainer className="py-2 md:hidden">
      <div className="flex items-center justify-between">
        <NavLogo />

        <div className="flex items-center gap-4">
          <NavUser />

          <Cart />

          <MobileSidebar />
        </div>
      </div>

      <Suspense>
        <NavSearch />
      </Suspense>
    </MaxContainer>
  );
};

export default MobileNavbar;
