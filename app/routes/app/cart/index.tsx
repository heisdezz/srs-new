import { compute_total_price } from "@/helpers/client";
import { useCartStore } from "@/store/client";

import CartListItem from "./-components/CartItem";
import Checkout from "./-components/Checkout.client";
import EmptyList from "@/components/EmptyList";

export default function CartPage() {
  const { add_to_cart, cart, cart_array } = useCartStore();
  const cart_length = cart_array.length;
  return (
    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-3xl font-bold">Cart Items ({cart_length})</h2>
      <div className=" flex gap-4  ">
        <div className="flex-1 flex flex-col gap-2 ">
          {cart_array.map((item) => (
            <CartListItem item={item} />
          ))}
          <EmptyList list={cart_array} />
          <div className=" lg:hidden">
            <Checkout />
          </div>
        </div>

        <div className="flex-1 hidden lg:block max-w-md bg-base-300/20">
          <Checkout />
        </div>
      </div>
    </section>
  );
}
