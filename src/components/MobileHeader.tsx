"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X, Home, CheckSquare, FolderOpen, Building, Lightbulb, Trash2 } from "lucide-react"
import DifortunaLogo from "@/components/DifortunaLogo"

const MobileHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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
        },
        {
            href: "/ideas",
            icon: Lightbulb,
            label: "Eureka",
            isActive: pathname === "/ideas",
            special: true
        },
        {
            href: "/trash",
            icon: Trash2,
            label: "Papelera",
            isActive: pathname === "/trash"
        }
    ]

    const handleLinkClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <>
            {/* Header móvil fijo */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-top">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/home" className="flex items-center gap-2" onClick={handleLinkClick}>
                        <DifortunaLogo className="text-blue-600" size={24} variant="simple" />
                        <span className="text-xl font-bold text-gray-900">TaskBook</span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-900" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-900" />
                        )}
                    </button>
                </div>
            </header>

            {/* Overlay del menú */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Menú lateral deslizante */}
            <div
                className={`md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header del menú */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <DifortunaLogo className="text-blue-600" size={24} variant="simple" />
                            <span className="text-lg font-bold text-gray-900">Menú</span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                            aria-label="Cerrar menú"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isSpecial = item.special

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95 min-h-[52px] ${item.isActive
                                                    ? isSpecial
                                                        ? "text-yellow-700 bg-yellow-100 border border-yellow-200"
                                                        : "text-blue-600 bg-blue-50 font-semibold"
                                                    : isSpecial
                                                        ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5 flex-shrink-0" />
                                            <span className="text-base font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Footer del menú */}
                    <div className="border-t border-gray-200 p-4">
                        <p className="text-xs text-gray-500 text-center">
                            Creada con ❤️ por
                            <br />
                            <span className="font-medium text-gray-900">Fiorella Gallo Di Fortuna</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Espaciador para el header fijo (solo en móvil) */}
            <div className="md:hidden h-[57px]" />
        </>
    )
}

export default MobileHeader
