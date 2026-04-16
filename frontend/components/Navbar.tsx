"use client";

import Link from "next/link";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useTheme } from "./theme-provider";

import NavbarAuth from "./auth/NavbarAuth";
import BrandLogo from "./BrandLogo";
import PageContainer from "./PageContainer";
import { navItems } from "./site-data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };


  const themeToggleButton = mounted ? (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl border-border/60 bg-background/50 backdrop-blur-sm transition-all hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-300"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  ) : (
    <Button
      variant="outline"
      size="icon"
      aria-hidden="true"
      className="cursor-pointer transition-colors hover:bg-cyan-300"
    />
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <PageContainer className="flex min-h-16 min-w-0 items-center gap-3 py-3">
        <div className="flex flex-1 items-center gap-2">
          <BrandLogo />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "border-cyan-300 text-cyan-300"
                  : "border-transparent text-muted-foreground hover:border-cyan-300 hover:text-cyan-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex lg:min-w-[17rem] lg:flex-1 lg:justify-end">

          {themeToggleButton}
          {/* {languageToggleButton} */}
          <NavbarAuth />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {themeToggleButton}
          {/* {languageToggleButton} */}

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Open menu" />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm border-border/70 bg-background"
            >
              <SheetHeader className="space-y-2 border-b border-border/60 bg-background">
                <SheetTitle className="text-left">
                  <BrandLogo />
                </SheetTitle>
                <SheetDescription className="max-w-[26ch] text-sm leading-6">
                  Navigate admissions, exams, colleges, and guidance from one
                  place.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 bg-background p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search colleges, exams, cities"
                    className="border-border/70 bg-background pl-9"
                  />
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <SheetClose
                      key={item.name}
                      nativeButton={false}
                      render={
                        <Link
                          href={item.href}
                          className={`rounded-xl border border-l-4 px-4 py-3 text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "border-cyan-300 bg-background text-cyan-300"
                              : "border-border/70 border-l-transparent bg-background hover:border-l-cyan-300 hover:bg-muted/50 hover:text-cyan-300"
                          }`}
                        />
                      }
                    >
                      {item.name}
                    </SheetClose>
                  ))}
                </nav>

                <NavbarAuth mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
      </header>
      <div className="h-[4.5rem] sm:h-[4.75rem]" aria-hidden="true" />
    </>
  );
}
