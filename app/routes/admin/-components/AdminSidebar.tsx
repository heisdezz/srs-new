import { useUser } from "@/helpers/client";
import { Link } from "react-router";

const links = [
  {
    path: "/admin",
    label: "Home",
  },
  {
    path: "/admin/products",
    label: "Store",
  },
  {
    path: "/admin/orders",
    label: "Orders",
  },
  {
    path: "/admin/categories",
    label: "Categories",
  },
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
export default function AdminSidebar() {
  const { user } = useUser();
  return (
    <div className="flex-1 space-y-2 flex-col flex">
      <h2 className="h-20 border-b fade flex items-center px-4 text-xl font-bold text-current/80">
        SRU ADMIN
      </h2>
      <div className="menu w-full space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path} className="text-lg">
              {link.label}
            </Link>
          </li>
        ))}
      </div>
      <div className="mt-auto  menu">
        {user ? (
          <>
            {profile_links.map((link) => (
              <li key={link.path}>
                <a href={link.path} className="text-lg">
                  {link.label}
                </a>
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
