import { pb } from "@/api/apiClient";
import type { CartItemOption, Option, UserCart } from "@/types";

export const validateItems = (item: Record<string, unknown>) => {
  return (
    Object.keys(item).length > 0 &&
    Object.values(item).every((v) => v !== undefined && v !== null)
  );
};
export const compute_total_price = (
  basePrice: number,
  options: CartItemOption,
  quantity: number,
) => {
  const optionsTotal = Object.values(options).reduce((acc, option) => {
    // Assuming 'option.values' is an array of OptionValue, and we need to sum their prices.
    // If 'option.values' is not an array, or is empty, its contribution to the total is 0.
    if (Array.isArray(option.values)) {
      return acc + option.values.reduce((sum, val) => sum + val.price, 0);
    }
    return acc;
  }, 0);
  return (basePrice + optionsTotal) * quantity;
};

export const calculate_cart_total = (cart: UserCart) => {
  return Object.values(cart).reduce((total, item) => {
    const itemPrice = compute_total_price(
      item.price,
      item.options,
      item.quantity,
    );
    return total + itemPrice;
  }, 0);
};

export const useUser = () => {
  const user = pb.authStore.record;
  const isValid = pb.authStore.isValid;
  if (!user) {
    return { user: null };
  }
  return { user };
};

export const validate_user = () => {
  const isValid = pb.authStore.isValid;
  const record = pb.authStore.record;

  if (isValid) {
    return pb
      .collection(record.collectionName)
      .authRefresh()
      .catch((err) => {
        if (err.status === 401) {
          pb.authStore.clear();
        } else {
          throw err;
        }
      });
  }
  pb.authStore.clear();
};

export const get_image = (item: Record<string, unknown>, file_name: string) => {
  return pb.files.getURL(item, file_name);
};

export const convert_to_array = (value: Record<string, unknown>) => {
  if (!value) return { arr: [], keys: [] };
  let keys = Object.keys(value);
  let arr = Object.values(value);
  return { arr, keys };
};
