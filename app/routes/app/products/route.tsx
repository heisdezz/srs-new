import { Outlet } from "react-router";
import DrawerContent from "./-components/DrawerContent";

export default function ProductsLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="products-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {/* Page content here */}
        {/*<label htmlFor="products-drawer" className="btn drawer-button lg:hidden">
          Open drawer
        </label>*/}
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="products-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className=" bg-base-200 min-h-full w-2xs md:border-r fade ">
          {/* Sidebar content here */}
          <DrawerContent />
        </div>
      </div>
    </div>
  );
}
