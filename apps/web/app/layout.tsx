import "ui/styles/globals.css";
import { Header } from "./components/header";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>Youtube Minner</title>
      <body className="bg-gray-50">
        <Header />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
