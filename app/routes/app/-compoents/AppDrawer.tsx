import { useUser } from "@/helpers/client";
import { Link } from "react-router";

const links = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/app/products",
    label: "Store",
  },
  {
    path: "/app/orders",
    label: "Orders",
  },
  { path: "/app/faqs", label: "FAQs" },
];

const profile_links = [
  {
    path: "/app/profile",
    label: "Profile",
  },

  {
    path: "/auth/logout",
    label: "Logout",
  },
];
export default function AppDrawer() {
  const { user } = useUser();
  return (
    <div className="flex-1 space-y-2 flex-col flex">
      <h2 className="h-20 border-b fade flex items-center px-4 text-xl font-bold">
        StuffsAreus
      </h2>
      <div className="menu w-full space-y-2">
        <li>
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="text-lg">
              {link.label}
            </Link>
          ))}
        </li>
      </div>
      <div className="mt-auto  menu">
        {user ? (
          <>
            {profile_links.map((link) => (
              <li key={link.path}>
                <a href={link.path}>{link.label}</a>
              </li>
            ))}
          </>
        ) : (
          <li>
            <a href="/auth/login" className="text-lg">
              {" "}
              Login
            </a>
          </li>
        )}
      </div>
    </div>
  );
}
