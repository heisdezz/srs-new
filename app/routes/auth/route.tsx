import PageHeader from "@/components/PageHeader";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <PageHeader />
      <Outlet />
    </>
  );
}
