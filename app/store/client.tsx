import type { CartItem, UserCart } from "@/types";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { toast } from "sonner";

let cart_atom = atomWithStorage<UserCart>("cart", {});
export const useCartStore = () => {
  const [cart, setCart] = useAtom(cart_atom);
  const cart_array = Object.values(cart);
  // useEffect(() => {
  //   console.log(cart);
  // }, [cart]);

  const add_to_cart = ({
    id,
    cartItem,
  }: {
    id: string;
    cartItem: CartItem;
  }) => {
    if (cart[id]) {
      // console.log(cart[id], "position");
      return toast.info("Item already in cart");
    }
    const item_id = cartItem["id"];
    const new_cart = { ...cart, [item_id]: cartItem };
    setCart(new_cart);
    toast.success("Item added to cart");
  };
  const increase_quantity = (id: string) => {
    const new_cart = { ...cart };
    if (new_cart[id]) {
      new_cart[id].quantity += 1;
    }
    setCart(new_cart);
  };
  const decrease_quantity = (id: string) => {
    const new_cart = { ...cart };
    if (new_cart[id]) {
      new_cart[id].quantity -= 1;
      if (new_cart[id].quantity === 0) {
        delete new_cart[id];
      }
    }
    setCart(new_cart);
  };
  const remove_from_cart = (id: string) => {
    const new_cart = { ...cart };
    delete new_cart[id];
    setCart(new_cart);
  };
  const clear_cart = () => {
    setCart({});
  };
  return {
    cart,
    cart_array,
    add_to_cart,
    increase_quantity,
    decrease_quantity,
    remove_from_cart,
    clear_cart,
  };
};

interface DrawerFormProps {
  min: number;
  max: number;
  category: string;
}

const filters_atom = atom<DrawerFormProps>({
  min: 0,
  max: Infinity,
  category: "",
});

export const useFiltersStore = () => {
  const [filters, setFilters] = useAtom(filters_atom);

  const updateFilters = (newFilters: DrawerFormProps) => {
    setFilters(newFilters);
  };
  const resetFilters = () => {
    setFilters({
      min: 0,
      max: Infinity,
      category: "",
    });
  };
  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
interface DeliverySettingsProps {
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

const delivery_settings_atom = atomWithStorage<DeliverySettingsProps>(
  "delivery_settings",
  {
    street: null,
    city: null,
    state: null,
    country: null,
    zip: null,
  },
);

export const useDeliverySettings = () => {
  const [deliverySettings, setDeliverySettings] = useAtom(
    delivery_settings_atom,
  );
  const { street, city, state, zip, country } = deliverySettings;
  const isValid = Object.keys(deliverySettings).every(
    (key) => deliverySettings[key] !== null,
  );
  const full_address = `${street}, ${city}, ${state}, ${country}, ${zip}`;

  const updateDeliverySettings = (newSettings: DeliverySettingsProps) => {
    setDeliverySettings(newSettings);
  };
  return {
    ...deliverySettings,
    isValid,
    deliverySettings,
    full_address,
    updateDeliverySettings,
  };
};
export const validate_addr = (data: DeliverySettingsProps) => {
  const { street, city, state, zip, country } = data;
  const isValid = Object.values(data).every(
    (value) => value !== null && value !== "",
  );
  const full_address = `${street}, ${city}, ${state}, ${country}, ${zip}`;
  return { isValid, full_address };
};
