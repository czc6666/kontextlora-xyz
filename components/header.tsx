"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { signOutAction } from "@/app/(auth-pages)/actions";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Coins,
  ImageIcon,
  Link as LucideLink,
  Moon,
  Sun,
  MoreVertical,
  Settings,
  User as LucideUser,
  Image,
  Wand2,
  Droplet,
  Scissors,
  Camera,
} from "lucide-react";

interface HeaderProps {
  user: User | null;
}

const freeTools: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Image To Caption",
    href: "/tool/image-to-caption",
    description: "Turn images into captions free online.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Remove Background",
    href: "/tool/remove-background",
    description: "Remove background from images free online.",
    icon: <Scissors className="h-5 w-5" />,
  },
  {
    title: "Photo Restore",
    href: "/tool/photo-restore",
    description: "Restore your old photos.",
    icon: <Camera className="h-5 w-5" />,
  },
];

const baseTools: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Image Resizer",
    href: "/tools/base/image-resizer",
    description: "Resize images to exact dimensions.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Filterer",
    href: "/tools/base/image-filterer",
    description: "Apply artistic filters to your photos.",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "Image Cropper",
    href: "/tools/base/image-cropper",
    description: "Crop images with ease.",
    icon: <Scissors className="h-5 w-5" />,
  },
  {
    title: "EXIF Remover",
    href: "/tools/base/exif-remover",
    description: "Remove metadata from your images.",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    title: "Image Converter",
    href: "/tools/base/image-converter",
    description: "Convert images to different formats.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Compressor",
    href: "/tools/base/image-compressor",
    description: "Reduce image file size.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Mirrorer",
    href: "/tools/base/image-mirrorer",
    description: "Flip your images.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "ICO Generator",
    href: "/tools/base/ico-generator",
    description: "Create ICO files from your images.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Transformer",
    href: "/tools/base/image-transformer",
    description: "Rotate and flip your images with ease.",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "Image Stitcher",
    href: "/tools/base/image-stitcher",
    description: "Combine multiple images into one.",
    icon: <Image className="h-5 w-5" />,
  },
];

export default function Header({ user }: HeaderProps) {
  const mainNavItems = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

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

  const allMobileNavItems = [
    ...freeTools.map(tool => ({ label: tool.title, href: tool.href })),
    ...baseTools.map(tool => ({ label: tool.title, href: tool.href })),
    ...mainNavItems,
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-6 flex items-center space-x-2">
          <Logo />
        </div>
        <div className="hidden flex-1 items-center space-x-4 sm:justify-end md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Free Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {freeTools.map((tool) => (
                      <ListItem
                        key={tool.title}
                        title={tool.title}
                        href={tool.href}
                        icon={tool.icon}
                      >
                        {tool.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Base Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {baseTools.map((tool) => (
                      <ListItem
                        key={tool.title}
                        title={tool.title}
                        href={tool.href}
                        icon={tool.icon}
                      >
                        {tool.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <AuthBlock />
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4 md:hidden">
          <MobileNav items={allMobileNavItems} user={user} />
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
