"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wheat,
  User,
  LogOut,
  Sprout,
  Menu,
} from "lucide-react";
import { useState } from "react";

const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farmers", label: "Farmers", icon: Users },
  { href: "/crops", label: "All Crops", icon: Wheat },
];

const farmerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/my-crops", label: "My Crops", icon: Wheat },
];

export function MobileSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const navItems = user.role === "ADMIN" ? adminNavItems : farmerNavItems;

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white lg:hidden">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-green-600" />
          <h1 className="text-lg font-bold text-gray-900">AgTech ERP</h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <div>
                  <SheetTitle className="text-xl font-bold text-gray-900 text-left">
                    AgTech ERP
                  </SheetTitle>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex flex-col h-full">
              <nav className="flex-1 space-y-1 px-4 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-200 mt-auto">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {user.farmer
                      ? `${user.farmer.firstName} ${user.farmer.lastName}`
                      : user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
