"use client";

import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/(auth-pages)/actions";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  user: User | null;
}

interface NavItem {
  label: string;
  href: string;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];
  
  const navItems = mainNavItems;

  const AuthBlock = () => {
    if (user) {
      return (
        <>
          <form action={signOutAction} className="flex items-center">
            <Button variant="ghost" type="submit">
              Log out
            </Button>
          </form>
          <Link
            href="/image-generator"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Dashboard
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-foreground/80"
            )}
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Get started now &rarr;
          </Link>
        </>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-6 flex items-center space-x-2">
          <Logo />
        </div>
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
          </nav>
          <div className="flex items-center gap-2">
            <AuthBlock />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4 md:hidden">
          <MobileNav items={navItems} user={user} />
        </div>
      </div>
    </header>
  );
}
