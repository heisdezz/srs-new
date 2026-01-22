import { pb } from "@/api/apiClient";
import CompContainer from "@/components/layouts/CompContainer";
import { useQuery } from "@tanstack/react-query";
import AdminOrderCard from "./AdminOrderCard";

export default function RecentOrders() {
  const query = useQuery({
    queryKey: ["orders-admin"],
    queryFn: () =>
      pb.collection("orders").getList(1, 20, {
        expand: "productId",
        filter: "status = 'pending'",
      }),
  });
  return (
    <CompContainer title="Recent Orders">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,auto))] gap-4">
        {query.data?.items.map((order) => {
          return <AdminOrderCard order={order as any} />;
        })}
      </div>
    </CompContainer>
  );
}
