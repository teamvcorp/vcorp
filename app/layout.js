import "./globals.css";
export const metadata = {
  title: "Von Der Becke Academy Corp",
  description:
    "Enabling transformative change through the power of education, compassion, and innovative problem-solving.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
