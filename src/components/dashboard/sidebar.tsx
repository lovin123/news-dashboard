"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Home,
  Newspaper,
  Settings,
  DollarSign,
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  onNavClick?: () => void;
}

export function DashboardSidebar({ isMobile, onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const handleNavClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        isMobile ? "w-full" : "hidden md:flex"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
          onClick={handleNavClick}
        >
          <Newspaper className="h-5 w-5" />
          <span>News Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard" && "bg-muted text-foreground"
            )}
            onClick={handleNavClick}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/news"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/news" && "bg-muted text-foreground"
            )}
            onClick={handleNavClick}
          >
            <Newspaper className="h-4 w-4" />
            <span>News & Blogs</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/analytics" && "bg-muted text-foreground"
            )}
            onClick={handleNavClick}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/payouts"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === "/dashboard/payouts" && "bg-muted text-foreground"
              )}
              onClick={handleNavClick}
            >
              <DollarSign className="h-4 w-4" />
              <span>Payouts</span>
            </Link>
          )}
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/settings" && "bg-muted text-foreground"
            )}
            onClick={handleNavClick}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-xs text-muted-foreground">
                Check our documentation
              </p>
            </div>
          </div>
          <Link
            href="#"
            className="mt-3 block w-full rounded-md bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground"
            onClick={handleNavClick}
          >
            View Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
