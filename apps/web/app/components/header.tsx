"use client";

import * as React from "react";
import Link from "next/link";
import { BrainCircuit, MoreVertical, PlusIcon } from "lucide-react";
import { cn } from "ui/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "ui";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "ui";

import { Button, buttonVariants } from "ui/components/ui/button";
import { PanelRight } from "lucide-react";

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="pl-8 pr-8 flex h-14 items-center">
        <div className="mr-4 hidden md:flex space-x-4">
          <div className="flex items-center">
            <Link href="/" passHref className="inline-flex">
              <BrainCircuit className="w-6 h-6 mr-4" /> YouTube Minner
            </Link>
          </div>
          <Navigation />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <a
              href="https://github.com/ahmadrosid/youtube-minner"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "link" }),
                "gap-2 w-full justify-start"
              )}
            >
              <span>Github</span>
            </a>

            <Button size="sm" variant="ghost">
              <PanelRight className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

const tools: { title: string; href: string; description: string }[] = [
  {
    title: "Comments",
    href: "/",
    description: "Get youtube comments",
  },
  {
    title: "Transcription",
    href: "/transcription",
    description: "Get youtube Transcription",
  },
];

export function Navigation() {
  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            All tools
          </Button>
        </MenubarTrigger>
        <MenubarContent>
          {tools.map((tool) => (
            <React.Fragment key={tool.title}>
              <MenubarItem className="cursor-pointer">
                <a href={tool.href}>{tool.title}</a>
              </MenubarItem>
            </React.Fragment>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
