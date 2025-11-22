import Footer from "@/components/molecules/Footer/Footer";
import MobileNavbar from "@/components/molecules/Navbar/MobileNavbar/MobileNavbar";
import Navbar from "@/components/molecules/Navbar/Navbar";
import SubNav from "@/components/molecules/Navbar/SubNav/SubNav";
import WhatsappUs from "@/components/molecules/WhatsappUs";
import ResponsiveTester from "@/lib/utils/ResponsiveTester";
import "@/styles/globals.css";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="font-poppins">
      <div className="relative h-full antialiased">
        <main className="relative flex min-h-screen flex-col">
          <div className="fixed top-0 z-50 w-full bg-white shadow-md backdrop-blur-md md:static">
            <Navbar />
            <SubNav />
            <MobileNavbar />
          </div>

          <div className="mt-22.5 flex-1 grow md:mt-0">{children}</div>

          <Footer />
        </main>
      </div>

      <WhatsappUs />

      {/**
       * @todo: remove ResponsiveTester before production
       */}
      <ResponsiveTester />
    </section>
  );
}
