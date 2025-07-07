export const adminSidebarItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Products",
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/products/categories" },
      { label: "Inventory", href: "/admin/products/inventory" },
    ],
  },
  {
    label: "Orders",
    children: [
      { label: "All Orders", href: "/admin/orders" },
      { label: "Returns", href: "/admin/orders/returns" },
    ],
  },
  {
    label: "Customers",
    href: "/admin/customers",
  },
  {
    label: "Settings",
    href: "/admin/settings",
  },
];
