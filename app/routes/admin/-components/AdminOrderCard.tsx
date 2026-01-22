import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { render_status } from "@/helpers/ui";
import { validate_addr } from "@/store/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";
import type { OrdersResponse, ProductsResponse } from "pocketbase-types";

export default function AdminOrderCard({
  order,
}: {
  order: OrdersResponse<OptionsConfig, { productId: ProductsResponse }>;
}) {
  const [showAddress, setShowAddress] = useState(false);
  const product = order.expand?.productId;
  const date = new Date(order.created).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = new Date(order.created).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const productOptions = order["productOptions"] as OptionsConfig;
  const keys = productOptions ? Object.keys(productOptions) : [];

  return (
    <div
      key={order.id}
      className="group relative bg-base-200 ring ring-primary/30  border border-base-300 rounded-[28px] overflow-hidden transition-shadow duration-200 hover:shadow-md h-[520px]"
    >
      <div className="p-4 md:p-6 flex flex-col h-full">
        {/* Material Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium tracking-wide text-primary uppercase">
                #{order.refId || order.id.slice(0, 5)}
              </span>
              <span className="text-[12px] text-base-content/60">•</span>
              <span className="text-[12px] text-base-content/60 font-medium">
                {time}
              </span>
            </div>
            <h2 className="text-xl font-medium text-base-content tracking-tight line-clamp-1">
              {product?.name || "Product"}
            </h2>
          </div>
          <div className="shrink-0">{render_status(order.status as any)}</div>
        </div>

        {/* Material Divider & Info */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-base-200">
          <div>
            <p className="text-[11px] font-medium text-base-content/50 uppercase tracking-widest mb-1">
              Order Date
            </p>
            <p className="text-sm font-medium text-base-content/90">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-base-content/50 uppercase tracking-widest mb-1">
              Quantity
            </p>
            <p className="text-sm font-bold text-base-content">
              {order.quantity}{" "}
              <span className="font-normal opacity-60">pcs</span>
            </p>
          </div>
        </div>

        {/* Chips for Options */}
        <div className="h-12 overflow-hidden mb-4">
          {keys.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keys.map((item) => (
                <div
                  key={item}
                  className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[11px] font-medium flex gap-1.5 items-center"
                >
                  <span className="text-secondary/70">{item}:</span>
                  <span className="text-secondary font-bold">
                    {productOptions[item].values[0].label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Section - Material Surface */}
        <div className="bg-base-200/40 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest mb-1">
                Total Amount
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-base-content">
                  ₦
                  {(
                    (order.price || 0) + (order.deliveryFee || 0)
                  ).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-base-content/40">
                  NGN
                </span>
              </div>
            </div>
            <div className="text-[10px] font-bold px-2 py-1 rounded-md bg-success/10 text-success uppercase tracking-tighter">
              Paid
            </div>
          </div>
        </div>

        {/* Shipping Toggle - Material Text Button */}
        <div className="mb-4">
          {showAddress ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <ShippingAddress user_id={order.userId || ""} />
            </div>
          ) : (
            <button
              onClick={() => setShowAddress(true)}
              className="btn btn-ghost btn-sm w-full normal-case font-bold text-primary hover:bg-primary/5 gap-2"
            >
              View Shipping Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Button - Material Contained Button */}
        <div className="mt-auto">
          <Link
            to={`/admin/order/${order.id}`}
            className="btn btn-primary w-full rounded-full normal-case font-bold shadow-sm hover:shadow-md transition-shadow"
          >
            Manage Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ShippingAddress = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["shipping-address", user_id],
    queryFn: async () => pb.collection("deliverySettings").getOne(user_id),
    enabled: !!user_id,
  });

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-base-200/30 border-b border-base-200 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-primary"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-base-content/60">
          Delivery Destination
        </h2>
      </div>
      <div className="p-4">
        <CompLoader
          query={query}
          customError={() => (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-error font-medium">
                Load failed
              </span>
              <button
                onClick={() => query.refetch()}
                className="btn btn-link btn-xs text-error no-underline font-bold"
              >
                Retry
              </button>
            </div>
          )}
          customLoading={
            <div className="flex items-center gap-3">
              <span className="loading loading-ring loading-xs text-primary"></span>
              <span className="text-xs font-medium text-base-content/40">
                Locating...
              </span>
            </div>
          }
        >
          {(data) => {
            const { full_address } = validate_addr(data);
            return (
              <p className="text-sm leading-relaxed text-base-content/70 font-medium italic line-clamp-2">
                {full_address || "No address provided"}
              </p>
            );
          }}
        </CompLoader>
      </div>
    </div>
  );
};
