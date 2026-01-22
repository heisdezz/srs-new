import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ProductsResponse, OrdersResponse } from "pocketbase-types";
import OrderStatus from "./-components/OrderStatus";
import { ShippingAddress } from "@/routes/admin/-components/AdminOrderCard";

export default function AdminOrderPage() {
  const { orderId } = useParams();
  if (!orderId) return null;

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      return await pb
        .collection("orders")
        .getOne<
          OrdersResponse<any, { productId: ProductsResponse<OptionsConfig> }>
        >(orderId as string, {
          expand: "productId",
        });
    },
  });

  return (
    <div className="mx-auto container max-w-3xl px-4 min-h-screen py-8 md:py-12">
      <header className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
        <div className="badge badge-ghost badge-md mt-2 font-mono opacity-70">
          ID: {orderId}
        </div>
      </header>

      <PageLoader query={query}>
        {(data) => {
          const product = data.expand?.productId;
          if (!product)
            return (
              <div className="alert alert-error">Product data missing</div>
            );

          const unitPrice = data.price || 0;
          const quantity = data.quantity || 1;
          const subtotal = unitPrice * quantity;
          const deliveryFee = data.deliveryFee || 0;
          const grandTotal = subtotal + deliveryFee;

          return (
            <div className="grid grid-cols-1 gap-6">
              {/* Status Card - Material Surface elevation-1 */}
              <div className="card bg-base-200/50 shadow-sm border border-base-300">
                <div className="card-body p-6">
                  <h2 className="card-title text-sm uppercase tracking-wider opacity-60">
                    Status
                  </h2>
                  <OrderStatus
                    id={data.id}
                    deliveryCode={data.deliveryCode}
                    status={data.status}
                  />
                </div>
              </div>

              <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                {/* Media Section */}
                <figure className="lg:w-1/2 bg-base-300 relative min-h-75">
                  <SimpleCarousel>
                    {product.images?.map((item: string) => (
                      <div
                        key={item}
                        className="h-full w-full flex items-center justify-center bg-base-300"
                      >
                        <img
                          className="object-contain max-h-100 w-full"
                          src={get_image(product, item)}
                          alt={product.name}
                        />
                      </div>
                    ))}
                  </SimpleCarousel>
                </figure>

                {/* Content Section */}
                <div className="card-body lg:w-1/2 gap-4">
                  <div>
                    <h2 className="card-title text-2xl font-bold">
                      {product.name}
                    </h2>
                    <p className="text-base-content/70 mt-2 line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="divider my-0"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/60">Unit Price</span>
                      <span className="font-medium">
                        ₦{unitPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/60">Quantity</span>
                      <span className="badge badge-outline">
                        {quantity} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-base-content/60">Subtotal</span>
                      <span className="font-semibold">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/60">Delivery Fee</span>
                      <span className="font-medium">
                        ₦{deliveryFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-base-300">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-2xl font-black text-primary">
                        ₦{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {product.options && (
                    <div className="mt-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">
                        Selected Options
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(product.options as OptionsConfig).map(
                          ([key, option]) => (
                            <div
                              key={key}
                              className="badge badge-secondary badge-outline py-3"
                            >
                              <span className="opacity-70 mr-1">
                                {option.label}:
                              </span>
                              <strong>{option.values[0]?.label}</strong>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Section - Material Surface */}
              <div className="card bg-base-100 shadow-md border border-base-200">
                <div className="card-body p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h3 className="font-bold text-lg">Shipping Address</h3>
                  </div>
                  <ShippingAddress user_id={data.userId} />
                </div>
              </div>
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
