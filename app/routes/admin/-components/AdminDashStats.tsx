import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { useQuery } from "@tanstack/react-query";
import type { AnalyticsRecord } from "pocketbase-types";
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDashStats() {
  const query = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => pb.collection("analytics").getOne<AnalyticsRecord>("1"),
  });

  return (
    <div className="p-6  ring fade rounded-sleek  shadow bg-base-200/50  ">
      <div className="mb-4">
        <h2 className="text-lg font-bold opacity-70 uppercase tracking-wider">
          Order Overview
        </h2>
      </div>
      <CompLoader query={query}>
        {(data) => {
          return (
            <div className="grid  grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                item={data.pending}
                name="Pending"
                icon={<Clock className="text-warning" size={20} />}
              />
              <StatCard
                item={data.processing}
                name="Processing"
                icon={<Package className="text-info" size={20} />}
              />
              <StatCard
                item={data.in_transit}
                name="In Transit"
                icon={<Truck className="text-primary" size={20} />}
              />
              <StatCard
                item={data.delivered}
                name="Delivered"
                icon={<CheckCircle2 className="text-success" size={20} />}
              />
              <StatCard
                item={data.cancelled}
                name="Cancelled"
                icon={<XCircle className="text-error" size={20} />}
              />
            </div>
          );
        }}
      </CompLoader>
    </div>
  );
}

const StatCard = ({
  item,
  name,
  icon,
}: {
  item: any;
  name: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="stat bg-base-100 border border-base-content/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="stat-figure opacity-80">{icon}</div>
      <div className="stat-title text-xs font-medium uppercase tracking-tight opacity-60">
        {name}
      </div>
      <div className="stat-value text-2xl">{item ?? 0}</div>
    </div>
  );
};
