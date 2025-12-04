export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FoodTracker",
  description: "Track daily nutrients with barcode scans and charts.",
  navLeft: [
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
  ],
  navRight: [
    //TODO: show settings/logout when user logged in, login/register otherwise
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
  ],
  navMenu: [
    //TODO: show settings/logout when user logged in, login/register otherwise
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
  ],
};
