/* eslint-disable */
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/site-config";
//import { ThemeSwitch } from "@/components/theme-switch";
//import { Logo } from "@/components/icons";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      className="bg-transparent backdrop-blur-none shadow-none"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="white"
            href="/"
          >
            {/* <Logo /> */}
            <p className="font-bold">FoodTracker</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navLeft.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "white" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="white"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          { user ? (
            <NavbarItem onClick={logout} style={{ cursor: 'pointer' }}>Logout</NavbarItem>
          ) : (
            <>
              <NavbarItem>
                <Link
                  className={clsx(
                    linkStyles({ color: "white" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="white"
                  href={'/login'}
                >
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  className={clsx(
                    linkStyles({ color: "white" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="white"
                  href={'/register'}
                >
                  Register
                </Link>
              </NavbarItem>
            </>
          )}
        </div>
        <div className="hidden lg:flex gap-4 justify-end ml-auto">
          {siteConfig.navRight.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "white" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="white"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <Link
              className={clsx(
                linkStyles({ color: "white" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="white"
              href="/settings"
            >
              Settings
            </Link>
          </NavbarItem>
        </div>
      </NavbarContent>
      <NavbarMenu className="bg-[#131313]">
        {siteConfig.navMenu.map((item) => (
          <NavbarMenuItem key={item.href} onClick={() => setMenuOpen(false)}>
            <Link href={item.href} color="white">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem onClick={() => setMenuOpen(false)}>
          <Link href="/settings" color="white">
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
