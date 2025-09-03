"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = user.role === "ADMIN" ? adminNavItems : farmerNavItems;

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-gray-200">
        <Sprout className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">AgTech ERP</h1>
          <p className="text-sm text-gray-500 capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
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

      <div className="p-4 border-t border-gray-200">
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
            onLinkClick?.();
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
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar - Only shows on lg+ screens */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Header and Sheet - Only shows on screens smaller than lg */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="-m-2.5 p-2.5">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent onLinkClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <h1 className="text-lg font-semibold text-gray-900">AgTech ERP</h1>
          </div>
        </div>
      </div>

      {/* Desktop sidebar spacer - Only on lg+ screens */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0" aria-hidden="true">
        {/* Spacer element to force main content to the right on desktop */}
      </div>
    </>
  );
}
