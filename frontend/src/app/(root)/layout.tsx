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
          <div className="flex-1 grow">{children}</div>
        </main>
      </div>

      {/**
       * @todo: remove ResponsiveTester before production
       */}
      {/* <ResponsiveTester /> */}
    </section>
  );
}
