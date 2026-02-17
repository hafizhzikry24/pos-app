import { LayoutDashboard, MapPin, Package, Users, UserPlus, Gift, FileText } from "lucide-react";

export const menuItems = [
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Items", href: "/items", icon: Package },
    { name: "Cashiers", href: "/cashier", icon: Users },
    { name: "Customers", href: "/customers", icon: UserPlus },
    { name: "Free Items", href: "/free-items", icon: Gift },
    { name: "Receipts", href: "/receipts", icon: FileText },
];