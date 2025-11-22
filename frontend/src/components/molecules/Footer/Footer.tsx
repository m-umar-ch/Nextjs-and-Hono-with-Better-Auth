import { Suspense } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MaxContainer from "@/components/MaxContainer";
import { ImageAssets } from "@/assets/imageAssets";
import FooterCategories from "./FooterCategories";
import { Skeleton } from "@/components/ui/skeleton";

const getDate = new Date();

const Footer = () => {
  return (
    <div className="mt-10 bg-white md:mt-16">
      <MaxContainer className="text-foreground/85 pt-10 pb-8 text-sm">
        <footer className="grid grid-cols-1 gap-5 md:grid-cols-3 md:justify-items-center lg:grid-cols-4">
          <div className="">
            <Link href={"/"}>
              <div className="h-8 w-auto md:h-10">
                <Image
                  src={ImageAssets.Base.Logo}
                  alt="InnovateX Logo"
                  priority
                  className="h-full w-full object-contain object-left"
                />
              </div>
            </Link>
            <p className="mt-2 lg:mt-3">
              Discover premium crockery online at unbeatable prices. Shop dinner
              sets, plate sets, bowls, tea sets, glassware, melamine, and
              ceramic crockery.
            </p>
            <div className="mt-4 flex items-center gap-3 md:mt-7">
              {footerData.social.map((Item, idx) => {
                return (
                  <Link
                    key={idx}
                    href={Item.url as never}
                    target="_blank"
                    className="bg-primary/20 text-primary hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:text-white"
                  >
                    <Item.icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-5 md:mt-0">
            <h3 className="text-primary text-xl font-semibold">
              Popular Categories
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 md:flex-col md:gap-3 lg:mt-5">
              <Suspense
                fallback={
                  <>
                    <Skeleton className="h-[19px] w-48 rounded-sm" />
                    <Skeleton className="h-[19px] w-48 rounded-sm" />
                    <Skeleton className="h-[19px] w-48 rounded-sm" />
                    <Skeleton className="h-[19px] w-48 rounded-sm" />
                    <Skeleton className="h-[19px] w-48 rounded-sm" />
                  </>
                }
              >
                <FooterCategories />
              </Suspense>
            </div>
          </div>
          <div className="mt-5 md:mt-0">
            <h3 className="text-primary text-xl font-semibold">Get In Touch</h3>
            <div className="mt-4 flex flex-col gap-4 lg:mt-5">
              {footerData.contact.map((Item, idx) => {
                return (
                  <div
                    key={idx}
                    className="hover:text-primary flex gap-2 transition-all duration-200"
                  >
                    <Item.icon className="w-[5%] md:w-[7%]" />
                    <Link
                      href={Item.url as never}
                      className="w-[93%] md:w-[95%]"
                      target="_blank"
                    >
                      {Item.text}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-5 w-full justify-self-start lg:mt-0 lg:justify-self-center">
            <h3 className="text-primary text-xl font-semibold">
              Subscribe Now
            </h3>
            <div className="mt-3 flex items-center lg:mt-5">
              <Input
                className="flex-1 rounded-r-none shadow-none"
                placeholder="Email Address"
              />
              <Button className="bg-primary/95 hover:bg-primary/85 rounded-l-none text-xs">
                Subscribe
              </Button>
            </div>
          </div>
        </footer>
        <div className="bg-primary/60 mt-10 h-px w-full" />
        <div className="mt-5 flex flex-col justify-between px-2 md:mt-7 md:flex-row md:px-0">
          <Suspense>
            <p>
              © {getDate.getUTCFullYear()} Online Crockery Store, All Rights
              Reserved.
            </p>
          </Suspense>
          <div className="mt-3 flex items-end justify-end gap-5 md:mt-0 md:flex-row md:items-center">
            <Link
              href={"#"}
              className="hover:text-primary transition-all duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              href={"#"}
              className="hover:text-primary transition-all duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </MaxContainer>
    </div>
  );
};

export default Footer;

export const footerData = {
  social: [
    {
      type: "facebook",
      url: "https://www.linkedin.com/in/developer256/",
      icon: ImageAssets.Footer.Facebook,
    },
    {
      type: "instagram",
      url: "https://www.linkedin.com/in/developer256/",
      icon: ImageAssets.Footer.Instagram,
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/in/developer256/",
      icon: ImageAssets.Footer.LinkedIn,
    },
    {
      type: "tiktock",
      url: "https://www.linkedin.com/in/developer256/",
      icon: ImageAssets.Footer.Tiktock,
    },
    {
      type: "youtube",
      url: "https://www.linkedin.com/in/developer256/",
      icon: ImageAssets.Footer.Youtube,
    },
  ],

  contact: [
    {
      icon: MapPin,
      title: "Our Location",
      text: "Ghas Mandi, near Baghichi Seithann Wali Masjid, GT Road Lahore",
      url: "https://maps.app.goo.gl/Nxc75pbVocYhJG556",
    },
    {
      icon: Mail,
      title: "Email Address",
      text: "info@onlinecrockerystore.com",
      url: "mailto:info@onlinecrockerystore.com",
    },
    {
      icon: Phone,
      title: "Phone Number",
      text: "0311-7361015",
      url: "https://api.whatsapp.com/send?phone=923117361015",
      // url: "tel:03117361015",
    },
  ],
};
