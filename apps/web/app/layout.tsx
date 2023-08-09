import "ui/styles/globals.css";
import { Header } from "./components/header";

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
      </body>
    </html>
  );
}
