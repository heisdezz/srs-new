import { Link } from "react-router";
import { Menu, ShoppingCart } from "lucide-react";
import AuthButtonHeader from "./AuthButtonHeader";
import HeaderLinks from "./HeaderLinks";
import ThemeButton from "./ThemeButton";

export default function PageHeader() {
  return (
    <div className="h-16 border-b fade ">
      <nav className="container mx-auto px-4 flex h-full items-center gap-2">
        <Link to="/" className="btn  btn-ghost font-lobster-two">
          <span className="md:hidden text-xl font-bold">SRU</span>
          <span className="hidden md:inline text-xl">StuffsAreUs</span>
        </Link>

        <HeaderLinks />
        <div className="ml-auto md:ml-0 space-x-2 hidden md:flex  items-center">
          <ThemeButton />
          <AuthButtonHeader />
        </div>
        <div className="ml-auto  md:ml-0 md:hidden  space-x-2">
          <ThemeButton />

          <Link to="/app/cart" className="btn btn-ghost btn-circle ">
            <ShoppingCart className="size-5" />
          </Link>
          <label
            htmlFor="app-drawer"
            className="btn btn-square btn-ghost ring  fade drawer-button lg:hidden"
          >
            <Menu />
          </label>
        </div>
      </nav>
    </div>
  );
}
