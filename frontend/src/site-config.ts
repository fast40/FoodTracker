export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Clolo",
  description: "Track daily nutrients with barcode scans and charts.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Add Food",
      href: "/add",
    },
    {
      label: "History",
      href: "/history",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Add Food",
      href: "/add",
    },
    {
      label: "History",
      href: "/history",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
