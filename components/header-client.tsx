"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { signOutAction } from "@/app/(auth-pages)/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileNav } from "./mobile-nav";
import React, { useEffect, useState } from "react";
import {
  Coins,
  ImageIcon,
  Home,
  Heart,
  Video,
  LogOut,
  Trash2,
  PlusCircle,
  RefreshCcw,
  LogIn,
  Image,
  Wand2,
  Scissors,
  Camera,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

interface HeaderClientProps {
  user: User | null;
  credits: number;
}

const aiTools: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Image To Caption",
    href: "/tools/free/image-to-caption",
    description: "Turn images into captions free online.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image To Prompt",
    href: "/tools/free/image-to-prompt",
    description: "Turn images into prompts free online.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Remove Background",
    href: "/tools/free/remove-background",
    description: "Remove background from images free online.",
    icon: <Scissors className="h-5 w-5" />,
  },
  {
    title: "Photo Restore",
    href: "/tools/free/photo-restore",
    description: "Restore your old photos.",
    icon: <Camera className="h-5 w-5" />,
  },
];

const baseTools: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Image Resizer",
    href: "/tools/free/image-resizer",
    description: "Resize images to exact dimensions.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Filterer",
    href: "/tools/free/image-filterer",
    description: "Apply artistic filters to your photos.",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "Image Cropper",
    href: "/tools/free/image-cropper",
    description: "Crop images with ease.",
    icon: <Scissors className="h-5 w-5" />,
  },
  {
    title: "EXIF Remover",
    href: "/tools/free/exif-remover",
    description: "Remove metadata from your images.",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    title: "Image Converter",
    href: "/tools/free/image-converter",
    description: "Convert images to different formats.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Compressor",
    href: "/tools/free/image-compressor",
    description: "Reduce image file size.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Mirrorer",
    href: "/tools/free/image-mirrorer",
    description: "Flip your images.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "ICO Generator",
    href: "/tools/free/ico-generator",
    description: "Create ICO files from your images.",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Image Transformer",
    href: "/tools/free/image-transformer",
    description: "Rotate and flip your images with ease.",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "Image Stitcher",
    href: "/tools/free/image-stitcher",
    description: "Combine multiple images into one.",
    icon: <Image className="h-5 w-5" />,
  },
];

const mainNavItems = [
  { label: "Generate", href: "/tools/image-generator" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
  { label: "Home", href: "/" },
];

const userMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: <Home className="mr-2 h-4 w-4" /> },
];

function UserCredits({ credits }: { credits: number }) {
  return (
    <div className="flex items-center gap-2">
      <Coins className="h-5 w-5 text-yellow-500" />
      <span className="font-semibold">{credits}</span>
      <Link href="/pricing">
        <PlusCircle className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
      </Link>
    </div>
  );
}

function UserNav({ user, credits }: { user: User; credits: number }) {
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              <span>{credits} Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
              <PlusCircle className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {userMenuItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOutAction()}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function HeaderClient({ user, credits }: HeaderClientProps) {
  const allMobileNavItems = [
    ...mainNavItems,
    ...aiTools.map(item => ({ label: item.title, href: item.href })),
    ...baseTools.map(item => ({ label: item.title, href: item.href })),
  ];

  const supabase = createClient();
  const [currentCredits, setCurrentCredits] = useState(credits);

  useEffect(() => {
    setCurrentCredits(credits);
  }, [credits]);

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('db-customers')
        .on<any>(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'customers', filter: `id=eq.${user.id}` },
          (payload) => {
            setCurrentCredits(payload.new.credits);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, supabase]);

  const CenterNav = () => (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Free Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] grid-cols-2 gap-4 p-4">
              <div className="flex flex-col">
                <h3 className="mb-2 text-lg font-medium">AI Tools</h3>
                <ul className="flex flex-col space-y-1">
                  {aiTools.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="mb-2 text-lg font-medium">Base Tools</h3>
                <ul className="flex flex-col space-y-1">
                  {baseTools.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {mainNavItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const LeftNav = () => (
    <div className="flex items-center gap-6">
      <Logo />
      <div className="hidden lg:flex">
        <CenterNav />
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <LeftNav />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex">
                <UserCredits credits={currentCredits} />
              </div>
              <UserNav user={user} credits={currentCredits} />
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild>
                <Link href="/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>
            </div>
          )}
          <ThemeSwitcher />
          <div className="md:hidden">
            <MobileNav user={user} items={allMobileNavItems} />
          </div>
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
