import { compute_total_price, get_image } from "@/helpers/client";
import { useCartStore } from "@/store/client";
import type { CartItem } from "@/types";

export default function CartListItem({ item }: { item: CartItem }) {
  const { remove_from_cart } = useCartStore();
  const hasItems = Object.keys(item.options).length > 0;
  return (
    <>
      <div className="card card-compact rounded-sleek bg-base-100 ring fade shadow-md p-4 flex flex-row gap-4">
        <figure className="size-20   overflow-hidden bg-surface-container-low">
          <img src={item.img} alt="" className="w-full h-full object-cover" />
        </figure>
        {/*item details*/}
        <div className="grow flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-on-surface">{item.name}</h2>
            {hasItems &&
              Object.entries(item.options).map(([key, option]) => (
                <p key={key} className="text-sm text-on-surface-variant">
                  <span className="font-medium capitalize text-on-surface">
                    {key}
                  </span>
                  : {option.values[0].label}
                </p>
              ))}
          </div>
          <div className="flex flex-col lg:flex-row gap-2 lg:items-center justify-between mt-2">
            <QuantityInput id={item.id} quantity={item.quantity} />
            <div className="text-lg font-semibold text-primary">
              <span className="text-on-surface-variant text-sm">NGN</span>{" "}
              {compute_total_price(
                item.price,
                item.options,
                item.quantity,
              ).toFixed(2)}
            </div>
          </div>

          <div className="flex gap-4 mt-3">
            <button
              onClick={() => {
                console.log(item);
              }}
              className="btn btn-sm btn-ghost text-secondary hover:bg-secondary/10 hover:text-secondary-focus p-0 h-auto min-h-0"
            >
              Move to Favorites
            </button>
            <button
              className="btn btn-sm btn-ghost text-error hover:bg-error/10 hover:text-error-focus p-0 h-auto min-h-0"
              onClick={() => remove_from_cart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const QuantityInput = (props: { id: string; quantity: number }) => {
  const cartProps = useCartStore();

  const handleQuantityChange = (action: "increase" | "decrease") => {
    action === "increase"
      ? cartProps.increase_quantity(props.id)
      : cartProps.decrease_quantity(props.id);
  };
  const { quantity } = props;
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline btn-primary rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => handleQuantityChange("decrease")}
          disabled={quantity === 1}
        >
          -
        </button>
        <div className="text-base font-medium text-on-surface w-6 text-center">
          {quantity}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => handleQuantityChange("increase")}
        >
          +
        </button>
      </div>
    </>
  );
};
