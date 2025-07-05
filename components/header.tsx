"use client";

import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: any;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Main navigation items that are always shown
  const mainNavItems: NavItem[] = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  // Dashboard items - empty array as we don't want navigation items in dashboard
  const dashboardItems: NavItem[] = [];

  // Choose which navigation items to show
  const navItems = isDashboard ? dashboardItems : mainNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <div className="hidden flex-1 items-center space-x-4 sm:justify-end md:flex">
          <nav className="hidden flex-row items-center gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "secondary" }))}
                >
                  Dashboard
                </Link>
                <form action={signOutAction}>
                  <Button variant="ghost" type="submit">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "text-foreground/80"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Sign up
                </Link>
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4 md:hidden">
          {user && (
            <Link href="/dashboard" className={cn(buttonVariants())}>
              Dashboard
            </Link>
          )}
          <MobileNav items={navItems} user={user} isDashboard={isDashboard} />
        </div>
      </div>
    </header>
  );
}
