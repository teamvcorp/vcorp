import "./globals.css";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
export const metadata = {
  title: "Von Der Becke Academy Corp",
  description:
    "Enabling transformative change through the power of education, compassion, and innovative problem-solving.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
