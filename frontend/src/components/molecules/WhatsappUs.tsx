import Image from "next/image";
import Link from "next/link";
import WhatsappImg from "@/assets/icons/whatsapp.png";
import { getSiteConfig } from "@/DAL/server/site-config";

const WhatsappUs = async () => {
  const something = await getSiteConfig();

  return (
    <Link
      href={`https://api.whatsapp.com/send?phone=${
        something?.storeContactWhatsappNumber ?? "#"
      }`}
      className="fixed right-5 bottom-5"
      target="_blank"
    >
      <div className="h-12 w-12 transition-all duration-300 hover:h-16 hover:w-16">
        <Image
          src={WhatsappImg}
          alt="Whatsapp Us"
          className="h-full w-full object-contain object-center"
          width={250}
          height={250}
        />
      </div>
    </Link>
  );
};

export default WhatsappUs;
