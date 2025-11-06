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
        <meta name="google-site-verification" content="md-SDraxZZxz_PUPJwrZO94ZLEmj0KIxgSj9B4UOhPU" />
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
