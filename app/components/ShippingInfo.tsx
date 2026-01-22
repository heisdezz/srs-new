import { pb } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import CompLoader from "@/components/layouts/ComponentLoader";
import type { ShippingInfoResponse } from "pocketbase-types";
import { Truck, Hash, User, Info, Phone } from "lucide-react";

export default function ShippingInfo({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: string;
}) {
  const query = useQuery({
    queryKey: ["shippingInfo", orderId],
    queryFn: async () => {
      return await pb
        .collection("shippingInfo")
        .getFirstListItem<ShippingInfoResponse>(`orderId="${orderId}"`);
    },
    enabled: !!orderId && orderStatus === "in transit",
  });

  if (orderStatus !== "in transit") {
    return (
      <div className="flex items-center gap-4 p-6 bg-base-200/50 rounded-2xl border border-base-300/50">
        <div className="p-3 bg-base-100 rounded-full shadow-sm">
          <Info className="w-5 h-5 text-info" />
        </div>
        <div>
          <h4 className="font-medium text-base-content">Shipping Pending</h4>
          <p className="text-sm text-base-content/60">
            Details will appear here once your order is in transit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CompLoader query={query}>
      {(data) => (
        <div className="card ring fade bg-base-100 shadow-md border border-base-200 overflow-hidden transition-all hover:shadow-lg">
          <div className="bg-primary/5 px-6 py-4 border-b border-base-200">
            <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-primary">
              <Truck className="w-4 h-4" />
              Shipping Details
            </h3>
          </div>
          <div className="card-body p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-base-200 rounded-lg">
                  <Truck className="w-4 h-4 text-base-content/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                    Carrier
                  </p>
                  <p className="text-base font-semibold text-base-content">
                    {data.ShippingProvider || "Standard Shipping"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-base-200 rounded-lg">
                  <Hash className="w-4 h-4 text-base-content/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                    Tracking ID
                  </p>
                  <p className="text-base font-mono font-medium text-primary">
                    {data.trackingNumber || "Not Assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-base-200 rounded-lg">
                  <User className="w-4 h-4 text-base-content/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                    Logistics Name
                  </p>
                  <p className="text-base font-medium text-base-content">
                    {data.Name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-base-200 rounded-lg">
                  <Phone className="w-4 h-4 text-base-content/70" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                    Contact Phone
                  </p>
                  <p className="text-base font-medium text-base-content">
                    {data.Phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CompLoader>
  );
}
