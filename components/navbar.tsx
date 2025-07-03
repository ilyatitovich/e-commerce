import Link from "next/link";
import UserNavLink from "./ui/user-nav-link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/products" className="text-white hover:text-gray-300">
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart" className="text-white hover:text-gray-300">
              Cart
            </Link>
          </li>
          <li>
            <UserNavLink className="text-white hover:text-gray-300" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
