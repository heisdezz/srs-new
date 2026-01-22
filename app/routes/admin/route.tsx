import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useUser } from "@/helpers/client";
import AdminNavBar from "./-components/AdminNavBar";
import AdminSideBar from "./-components/AdminSidebar";

export default function AdminRoute() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.collectionName !== "admins") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Avoid rendering the admin UI while the user check is pending / unauthorized
  if (!user) return null;

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content  ">
          <AdminNavBar />
          <main className="p-4 pt-8 container mx-auto space-y-8">
            <Outlet />
          </main>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="app-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className=" bg-base-200 min-h-full w-3xs md:border-r fade flex">
            {/* Sidebar content here */}
            <AdminSideBar />
            {/*<AppDrawer />*/}
          </div>
        </div>
      </div>
    </>
  );
}
