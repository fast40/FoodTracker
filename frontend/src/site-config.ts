export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FoodTracker",
  description: "Track daily nutrients with barcode scans and charts.",
  navLeft: [
    {
      label: "Dashboard",
      href: "/dashboard",
      show: "always",
    },
    {
      label: "Add Food",
      href: "/add",
      show: "always",
    },
    {
      label: "History",
      href: "/history",
      show: "always",
    },
  ],
  navRight: [
    {
      label: "Login",
      href: "/login",
      show: "logged_out",
    },
    {
      label: "Register",
      href: "/register",
      show: "logged_out",
    },
    {
      label: "Logout",
      href: "/logout",
      show: "logged_in",
    },
    {
      label: "Settings",
      href: "/settings",
      show: "logged_in",
    },
  ],
  navMenu: [
    {
      label: "Dashboard",
      href: "/dashboard",
      show: "always",
    },
    {
      label: "Add Food",
      href: "/add",
      show: "always",
    },
    {
      label: "History",
      href: "/history",
      show: "always",
    },
    {
      label: "Login",
      href: "/login",
      show: "logged_out",
    },
    {
      label: "Register",
      href: "/register",
      show: "logged_out",
    },
    {
      label: "Logout",
      href: "/logout",
      show: "logged_in",
    },
    {
      label: "Settings",
      href: "/settings",
      show: "logged_in",
    },
  ],
};
