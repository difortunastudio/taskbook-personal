"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, CheckSquare, FolderOpen, Building, Lightbulb } from "lucide-react"

const BottomNavigation = () => {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/home",
      icon: Home,
      label: "Inicio",
      isActive: pathname === "/home" || pathname === "/"
    },
    {
      href: "/today",
      icon: CheckSquare,
      label: "Tareas",
      isActive: pathname === "/today"
    },
    {
      href: "/projects",
      icon: FolderOpen,
      label: "Proyectos",
      isActive: pathname.startsWith("/projects")
    },
    {
      href: "/companies",
      icon: Building,
      label: "Empresas",
      isActive: pathname.startsWith("/companies")
    }
  ]

  const eurekaItem = {
    href: "/ideas",
    icon: Lightbulb,
    label: "Eureka",
    isActive: pathname === "/ideas"
  }

  return (
    <>
      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 z-50 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[70px] min-h-[60px] transition-all active:scale-95 ${
                  item.isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-[11px] font-medium leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-56 min-h-screen bg-gray-100 border-r border-gray-200 flex-col py-8 px-4">
        <div className="mb-8 text-center flex items-center justify-center gap-2">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">📚 TaskBook</span>
          </Link>
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      item.isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link
                href={eurekaItem.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  eurekaItem.isActive
                    ? "text-yellow-700 bg-yellow-100 border border-yellow-200"
                    : "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200"
                }`}
              >
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold">{eurekaItem.label}</span>
              </Link>
            </li>
          </ul>
        </nav>
        <footer className="mt-8 text-xs text-gray-500 text-center">
          Creada con ❤️ por <span className="font-medium text-gray-900">Fiorella Gallo Di Fortuna</span>
        </footer>
      </aside>
    </>
  )
}

export default BottomNavigation
