import { Outlet } from "react-router";

export default function layout() {
  return (
    <div className="flex">
      <aside className="bg-red-200 h-screen sticky top-0 w-64">
        aside
      </aside>
      <main className="  flex-grow ">
        <Outlet />
      </main>
    </div>
  );
}
