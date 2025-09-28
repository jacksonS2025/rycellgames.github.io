import "./globals.css";
import Header from "@/lib/navigation/header";
import Footer from "@/lib/navigation/footer";
import PrimaryScripts from "@/lib/scripts/primaryScripts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PrimaryScripts />
      </head>
      <body
        className={` antialiased`}
      >
        <Header />
        <div className="ml-18 min-h-screen flex flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
