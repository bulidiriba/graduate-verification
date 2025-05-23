"use client";

import Image from "next/image";
import { LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    // In a real app, you would check if the user has admin privileges
    // For now, we'll assume all authenticated users are admins
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link
        href="/verify"
        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/about"
        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        About Us
      </Link>
      <Link
        href="/contact"
        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Contact Us
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-sm p-2 md:p-1">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-1">
            <Image src="/moe-logo.svg" alt="MiNT Logo" width={80} height={80} />
            <div className="items-center -mr-2 flex-0 text-mgray">
              <span className="text-[10px] tracking-wide text-gray-500 flex pl-3 -mb-2">
                FDRE
              </span>
              <span className="inline-flex items-center text-gray-600 justify-center font-bold px-3 -mt-2">
                Ministry of Education
              </span>
              <span className="text-[#263E6E] flex mx-3 -mt-2">
                Graduate Verification System
              </span>
            </div>
          </div>
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    University Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/moe_dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  MOE Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full mt-4">
            <nav className="flex flex-col items-center gap-4">
              <NavLinks />
              {isAuthenticated ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 w-full"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        University Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link
                    href="/moe_dashboard"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      MOE Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost">Login</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
