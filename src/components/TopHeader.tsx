"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Lightbulb, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const TopHeader = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  // No mostrar header en la página de login
  if (pathname === "/auth/signin") {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Logo y título para móvil */}
      <div className="flex items-center gap-2">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">📚 TaskBook</span>
        </Link>
      </div>

      {/* Botones de la derecha */}
      <div className="flex items-center gap-2">
        {/* Botón Eureka destacado */}
        <Link
          href="/ideas"
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
            pathname === "/ideas"
              ? "text-yellow-700 bg-yellow-100 border border-yellow-300 shadow-sm"
              : "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200"
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold text-sm">Eureka</span>
        </Link>

        {/* Usuario y logout */}
        {session && (
          <div className="flex items-center gap-2 ml-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="truncate max-w-[150px]">{session.user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopHeader
