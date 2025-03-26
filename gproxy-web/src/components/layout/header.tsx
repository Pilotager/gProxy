"use client";

import Link from "next/link";
import { MainNav } from "./main-nav";
import { ModeToggle } from "../ui/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center px-4 w-full">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <span className="font-bold text-xl">gProxy</span>
        </Link>
        <MainNav className="mx-6 flex-1" />
        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
