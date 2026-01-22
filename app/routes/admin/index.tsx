import AdminDashStats from "./-components/AdminDashStats";
import PageHeader from "@/components/Headers/PageHeader";
import RecentOrders from "./-components/RecentOrders";

export default function AdminIndex() {
  return (
    <>
      <PageHeader title="DashBoard" />
      <AdminDashStats />
      <RecentOrders />
    </>
  );
}
