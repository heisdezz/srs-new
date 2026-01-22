import { Outlet } from "react-router";
import DrawerContent from "../products/-components/DrawerContent";
import OrderDrawerContent from "./-components/OrderDrawerContent";

export default function OrdersLayout() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="order-drawer" type="checkbox" className="drawer-toggle" />
        <div className=" drawer-content">
          <Outlet />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="order-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-2xs p-4">
            <OrderDrawerContent />
            {/* Sidebar content here */}
            {/*<li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>*/}
          </ul>
        </div>
      </div>
    </>
  );
}
