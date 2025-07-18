"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/(auth-pages)/actions";
import { User } from "@supabase/supabase-js";
import { useTransition } from "react";

interface MobileNavProps {
  items: { label: string; href: string }[];
  user: User | null;
}

export function MobileNav({ items, user }: MobileNavProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          {user ? (
            <div className="flex flex-col gap-2">
              <form
                action={() => {
                  startTransition(() => {
                    signOutAction();
                  });
                }}
                className="w-full"
              >
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                >
                  Log out
                </Button>
              </form>
              <Button asChild variant="default" className="w-full">
                <Link href="/image-generator">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button asChild variant="default" className="w-full">
                <Link href="/sign-up">Get started now</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
