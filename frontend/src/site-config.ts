export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FoodTracker",
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
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
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
