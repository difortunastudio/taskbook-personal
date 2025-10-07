import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import DifortunaLogo from "@/components/DifortunaLogo";
import UserEmailSidebar from "@/components/UserEmailSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskBook - Tu Cuaderno Virtual",
  description: "Organiza tus tareas y proyectos de manera simple y eficiente",
  manifest: "/manifest.json",
  themeColor: "#3B82F6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskBook",
    startupImage: "/icon-512.png",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TaskBook" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex`}
      >
        <Providers>
          <aside className="w-56 min-h-screen bg-gray-100 border-r border-gray-200 flex flex-col py-8 px-4">
            <div className="mb-8 text-center flex items-center justify-center gap-2">
              <a href="/home" className="flex items-center gap-2">
                <DifortunaLogo className="text-blue-600" size={32} variant="simple" />
                <span className="text-2xl font-bold text-gray-900">TaskBook</span>
              </a>
            </div>
            <nav className="flex-1">
              <ul className="flex flex-col gap-4">
                <li><a href="/home" className="hover:underline text-gray-900">Inicio</a></li>
                <li><a href="/today" className="hover:underline text-gray-900">Tareas</a></li>
                <li><Link href="/projects" className="hover:underline text-gray-900">Proyectos</Link></li>
                <li><Link href="/companies" className="hover:underline text-gray-900">Empresas</Link></li>
                <li><a href="/ideas" className="hover:underline font-semibold text-yellow-600 bg-yellow-50 rounded px-2 py-1">Eureka</a></li>
              </ul>
            </nav>
            <footer className="mt-8 text-xs text-gray-500 text-center">
              Creada con ❤️ por <span className="font-medium text-gray-900">Fiorella Gallo Di Fortuna</span>
            </footer>
            <UserEmailSidebar />
          </aside>
          <main className="flex-1 flex flex-col min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
