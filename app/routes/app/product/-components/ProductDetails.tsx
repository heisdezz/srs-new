import { pb } from "@/api/apiClient";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import { get_image, validateItems } from "@/helpers/client";
import { useCartStore } from "@/store/client";
import type {
  CartItem,
  CartItemOption,
  OptionsConfig,
  OptionValue,
} from "@/types";
import type { ProductsRecord } from "pocketbase-types";
import { useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

// The options are now dynamically loaded from the item prop, so this static definition is removed.
// The type for FormData will be derived from item.options.

export default function ProductDetails({
  item,
}: {
  item: ProductsRecord<OptionsConfig>;
}) {
  if (!item) return <></>;

  const options: OptionsConfig = item.options || {};

  // Define the type for the form data based on the selected options from the item
  type FormData = {
    [K in keyof OptionsConfig]: OptionValue;
  };

  let basePrice = item.discountPrice;
  const { add_to_cart } = useCartStore();
  const option_keys = Object.keys(options) as (keyof typeof options)[];
  const { handleSubmit, watch, control } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!pb.authStore.isValid)
      return toast.error("Please Login to Add to Cart");
    let isValid = validateItems(data);
    if (item.options && !isValid) return toast.error("Please Fill All Fields");

    const cartItemOptions: CartItemOption = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const optionValue = data[key as keyof FormData];
        cartItemOptions[key] = {
          label: options[key].label,
          type: options[key].type,
          values: [optionValue], // Store the selected option value in an array
        };
      }
    }

    const cartItem: CartItem = {
      name: item.name || "Unknown Product",
      id: item.id,
      img: get_image(item, item.images[0]) as string,
      options: cartItemOptions,
      quantity: quantity,
      price: (basePrice || 0) + additions,
    };
    // console.log(cartItem);

    add_to_cart({
      id: cartItem.id,
      cartItem: cartItem,
    });
  };

  const [quantity, setQuantity] = useState<number>(1);
  const values = watch();
  const additions = Object.values(values).reduce((sum, optionValue) => {
    return sum + (optionValue?.price || 0);
  }, 0);
  const computed_price = (basePrice || 0) + additions;
  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4 getValues">
      <h2 className="text-3xl font-bold">{item.name}</h2>
      <p>{item.description}</p>
      <div className="">
        {item.discountPrice && (
          <p className="text-lg line-through text-error">
            NGN {(item.price * quantity).toLocaleString()}
          </p>
        )}
        <p className="stat-value">
          NGN {(computed_price * quantity).toLocaleString()}
        </p>
      </div>
      <div className=" bg-base-100 ring fade rounded-sleek shadow">
        <h2 className="p-4 border-b font-bold text-current/80 fade">Options</h2>
        {/*<div className="bg-[beige] p-4">s</div>*/}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <>
            {option_keys.map((key) => {
              const currentOption = options[key];
              return (
                <div key={key}>
                  <Controller
                    control={control}
                    //@ts-ignore
                    name={key as keyof FormData} // Ensure correct type for name
                    render={({ field }) => {
                      return (
                        <div className="form-control w-full">
                          <span className="fieldset-label capitalize font-bold mb-2">
                            {currentOption.label}
                          </span>
                          <select
                            className="select select-bordered w-full space-y-2 "
                            defaultValue=""
                            onChange={(e) => {
                              const selectedIndex = parseInt(e.target.value);
                              field.onChange(
                                currentOption.values[selectedIndex],
                              );
                            }}
                          >
                            <option disabled value="" className="">
                              Pick your {currentOption.label}
                            </option>
                            {currentOption.values.map((optionValue, index) => (
                              <option key={optionValue.id} value={index}>
                                {optionValue.label}{" "}
                                {optionValue.price
                                  ? `(+${optionValue.price})`
                                  : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }}
                  ></Controller>
                </div>
              );
            })}
          </>
          <div className="form-control">
            <div className="mb-1">
              <label className="label">
                <span className="label-text capitalize font-bold">
                  Quantity
                </span>
              </label>
            </div>
            <div className="join">
              <button
                type="button"
                className="btn join-item"
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity === 1}
              >
                -
              </button>
              <input
                type="number"
                className="input input-bordered join-item w-20 text-center"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setQuantity(val);
                  } else if (e.target.value === "") {
                    setQuantity(1); // Allow clearing the input temporarily
                  }
                }}
                min="1"
              />
              <button
                type="button"
                className="btn join-item"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>
          </div>
          <div className="">
            <button type="submit" className="btn btn-primary btn-block">
              Add To Cart
            </button>
          </div>
        </form>
      </div>
      <DeliveryInfo />
    </div>
  );
}
