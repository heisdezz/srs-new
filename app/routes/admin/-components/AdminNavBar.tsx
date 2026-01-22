import { Search, Bell, ChevronDown, Menu } from "lucide-react";

export default function AdminNavBar() {
  return (
    <nav className="border-b fade h-20">
      <div className="navbar bg-base-100 px-4 h-full fade container mx-auto">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-current/80">Overview</h1>
        </div>

        <div className="flex-none gap-2 flex items-center">
          {/*<div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell size={20} />
                <span className="badge badge-xs badge-error indicator-item"></span>
              </div>
            </button>
          </div>*/}
          <div className="dropdown dropdown-end ">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-full flex items-center gap-2 h-auto py-2  btn-secondary border-none normal-case"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src="https://picsum.photos/seed/picsum/450/300"
                    alt="Zoia M."
                  />
                </div>
              </div>
              <span className="text-sm hidden mg:inline font-medium">
                Zoia M.
              </span>
              <ChevronDown size={16} className="" />
            </button>
            <ul
              tabIndex={0}
              className="mt-3  p-2 shadow menu  dropdown-content bg-base-100 rounded-sleek w-52"
            >
              <li>
                <a href="/auth/logout"> Logout</a>
              </li>
            </ul>
          </div>
          <label
            htmlFor="app-drawer"
            className="btn btn-square btn-ghost ring  fade drawer-button lg:hidden"
          >
            <Menu />
          </label>
        </div>
      </div>
    </nav>
  );
}
