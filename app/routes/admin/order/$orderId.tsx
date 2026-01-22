import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ProductsRecord, UsersRecord } from "pocketbase-types";
import OrderStatus from "./-components/AdminOrderStatus";
import ShippingInfo from "@/components/ShippingInfo";

export default function AdminOrderPage() {
  const { orderId } = useParams();
  if (!orderId) return null;
  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      let resp = pb.collection("orders").getOne(orderId, {
        expand: "productId, userId, deliverySettings_via_user_id",
      });
      return resp;
    },
  });

  return (
    <div className="mx-auto container max-w-3xl px-4 min-h-screen py-8 space-y-8">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight">Order Details</h1>
        <p className="text-sm font-mono opacity-60">ID: {orderId}</p>
      </div>

      <PageLoader query={query}>
        {(data) => {
          const product = data.expand[
            "productId"
          ] as ProductsRecord<OptionsConfig>;

          const user = data.expand["userId"] as UsersRecord;
          const subtotal = (data.price || 0) * (data.quantity || 1);
          const deliveryFee = data.deliveryFee || 0;
          const total = subtotal + deliveryFee;

          return (
            <div className="flex flex-col gap-8">
              {/* Status Section */}
              <section className="w-full">
                <OrderStatus refetch={query.refetch} status={data.status} />
              </section>

              {/* Customer Section */}
              <section className="ring-1 ring-base-content/10 p-6 rounded-sleek bg-base-200/30">
                <h3 className="text-sm uppercase tracking-widest font-bold mb-4 opacity-70">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold opacity-50">
                      Full Name
                    </span>
                    <p className="font-medium">{user.fullName || "N/A"}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold opacity-50">
                      Email Address
                    </span>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </section>

              {/* Product Section */}
              <section className="ring-1 ring-base-content/10 rounded-sleek overflow-hidden bg-base-100">
                <div className="w-full">
                  <SimpleCarousel>
                    {data.expand["productId"].images.map((item: string) => (
                      <div
                        key={item}
                        className="aspect-square md:aspect-video bg-base-300 flex"
                      >
                        <img
                          className="flex-1 object-contain"
                          src={get_image(data.expand["productId"], item)}
                          alt={product.name}
                        />
                      </div>
                    ))}
                  </SimpleCarousel>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <p className="text-base opacity-70 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y py-6 border-base-content/5">
                    <div>
                      <span className="text-xs font-semibold opacity-50 block mb-1">
                        Unit Price
                      </span>
                      <p className="text-lg font-medium">
                        ₦{data.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold opacity-50 block mb-1">
                        Quantity
                      </span>
                      <p className="text-lg font-medium">
                        {data.quantity} Units
                      </p>
                    </div>
                  </div>

                  {product.options && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold opacity-70">
                        Selected Options
                      </h3>
                      <div className="grid gap-2">
                        {Object.entries(product.options).map(
                          ([key, option]) => (
                            <div
                              key={key}
                              className="flex justify-between text-sm p-3 bg-base-200 rounded-lg"
                            >
                              <span className="font-medium">
                                {option.label}
                              </span>
                              <span className="opacity-70">
                                {option.values[0]?.label}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-primary text-primary-content p-6 rounded-sleek shadow-lg space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-primary-content/20 pb-2">
                      <span className="font-medium opacity-80">Subtotal</span>
                      <span className="font-bold">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-primary-content/20 pb-2">
                      <span className="font-medium opacity-80">
                        Delivery Fee
                      </span>
                      <span className="font-bold">
                        ₦{deliveryFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-sm font-bold uppercase tracking-wider opacity-90">
                        Total Amount
                      </span>
                      <span className="text-3xl font-black">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <ShippingInfo orderId={data.id} orderStatus={data.status} />
                  </div>
                </div>
              </section>
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
