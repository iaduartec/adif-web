import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADIF Telecomunicaciones | Estudio",
  description: "Plataforma independiente de preparación para ADIF Telecomunicaciones.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
