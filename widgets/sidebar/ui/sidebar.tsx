import { adminSidebarItems as items } from "../model/config";
import NavLink from "./nav-link";
import { CollapsibleItem } from "./collapsible-item";

export default function Sidebar() {
  return (
    <nav className="space-y-3 text-gray-800">
      {items.map((item) =>
        item.children ? (
          <CollapsibleItem
            key={item.label}
            label={item.label}
            items={item.children}
          />
        ) : (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
}
