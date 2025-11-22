import { ImageAssets } from "@/assets/imageAssets";
import Image from "next/image";
import Link from "next/link";

const NavLogo = () => {
  return (
    <span className="flex items-center justify-start">
      <Link href={"/"} className="h-10 w-auto md:h-11">
        <Image
          src={ImageAssets.Base.Logo}
          alt="Online Crockery"
          className="h-full w-full object-contain object-center"
        />
      </Link>
    </span>
  );
};

export default NavLogo;
