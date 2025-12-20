'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MapPin, Package, Users, LogOut, Store, Menu, X } from "lucide-react";
import { menuItems } from "@/hooks/menu-item";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const navigation = menuItems;

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            <div className="flex items-center justify-center h-16 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Store className="w-8 h-8 text-blue-500" />
                    <span>POS Portal</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 flex-shrink-0 h-5 w-5",
                                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 h-screen">
                <SidebarContent />
            </div>

            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-64" onClick={(e) => e.stopPropagation()}>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
}
