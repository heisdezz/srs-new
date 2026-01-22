import { pb } from "@/api/apiClient";
import { create_config } from "@/api/payment";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import {
  calculate_cart_total,
  compute_total_price,
  useUser,
} from "@/helpers/client";
import { useCartStore, validate_addr } from "@/store/client";
import type { OrderType } from "@/types";
import { toast } from "sonner";

import { usePaystackPayment } from "react-paystack";
import { extract_message } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";

const defaultDeliverySettings = {
  street: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};

export default function Checkout() {
  const { user } = useUser();
  const query = useQuery({
    queryKey: ["delvierySettings"],
    queryFn: () =>
      pb
        .collection("deliverySettings")
        .getOne(user.id)
        .catch((stat) => {
          if (stat.status === 404) {
            pb.collection("deliverySettings").create({
              id: user.id,
              user_id: user.id,
              street: "",
              city: "",
              state: "",
              country: "",
              zip: "",
            });
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });
  const data = query.data;
  const { isValid } = validate_addr({
    state: data.state,
    street: data.street,
    city: data.city,
    country: data.country,
    zip: data.zip,
  });
  const initialize = usePaystackPayment(null);
  const props = useCartStore();
  const deliveryFee = 3374;
  const total = calculate_cart_total(props.cart) + deliveryFee;
  const config = create_config(total, "desto4q@gmail.com");

  const create_orders = async () => {
    if (query.isError) {
      query.refetch();
      return toast.error("Failed to fetch delivery details");
    }
    if (!isValid) return toast.error("Please fill in your delivery details");
    await pb
      .collection("users")
      .authRefresh()
      .catch((err) => {
        if (err.status === 401) {
          pb.authStore.clear();
          toast.error("Please login to continue");
          throw err;
        }
        toast.error(extract_message(err));
        throw err;
      });
    if (!user) {
      return toast.error("Please login to continue");
    }
    const orders = props.cart_array.map((item) => {
      const order = {
        productId: item.id,
        productOptions: item.options,
        userId: user.id as string,
        refId: config.reference,
        price:
          compute_total_price(item.price, item.options, item.quantity) +
          deliveryFee,
        quantity: item.quantity,
        deliveryFee: deliveryFee,
      } satisfies OrderType;
      return order;
    });

    const send_batch = async () => {
      const batch = pb.createBatch();
      for (const order of orders) {
        batch.collection("orders").create(order);
      }
      await batch.send();
    };
    initialize({
      config: config,
      onSuccess: () => {
        toast.promise(send_batch, {
          loading: "Sending orders...",
          success: () => {
            props.clear_cart();
            return "Orders sent successfully";
          },
          error: extract_message,
        });
      },
    });
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-sleek overflow-hidden fade ring">
      <div className="p-6 space-y-6">
        <header>
          <h2 className="text-2xl font-medium tracking-tight text-base-content">
            Order Summary
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Review your total and delivery details
          </p>
        </header>

        <div className="bg-base-200/50 rounded-2xl p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-base-content/70">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="font-mono">
                NGN {calculate_cart_total(props.cart).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-base-content/70">
              <span className="text-sm font-medium">Delivery Fee</span>
              <span className="font-mono">
                NGN {deliveryFee.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="divider my-0 opacity-50"></div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-base-content">Total</span>
            <span className="text-xl font-bold text-primary tracking-tight">
              NGN {total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            disabled={query.isLoading || query.isError}
            onClick={() => create_orders()}
            className="btn btn-primary btn-block h-14 rounded-xl shadow-md hover:shadow-lg transition-all normal-case text-lg font-semibold"
          >
            {query.isLoading ? (
              <div className="flex items-center gap-3">
                <span className="loading loading-spinner loading-sm"></span>
                <span>Processing...</span>
              </div>
            ) : (
              "Complete Purchase"
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-base-content/40 uppercase tracking-widest font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Checkout
          </div>
        </div>

        <div className="pt-2">
          <DeliveryInfo />
        </div>
      </div>
    </div>
  );
}
