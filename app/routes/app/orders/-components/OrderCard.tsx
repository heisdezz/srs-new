import { convert_to_array, get_image } from "@/helpers/client";
import type { OptionsConfig, OrderType } from "@/types";
import { Link } from "react-router";
import type { OrdersRecord, ProductsResponse } from "pocketbase-types";

export default function OrderCard({
  item,
}: {
  item: OrdersRecord<OptionsConfig>;
}) {
  const options_array = convert_to_array(
    item["productOptions"] as OptionsConfig,
  );
  const { arr } = options_array;
  const img_url = get_image(
    item["expand"].productId,
    item["expand"].productId.images[0],
  );
  const options = arr.map((opt) => {
    return {
      name: opt["label"],
      value: opt["values"][0]["label"],
    };
  });
  const product_info = item["expand"].productId as ProductsResponse;
  return (
    <Link to={`/app/order/${item.id}`}>
      <div className="h-full ring fade rounded-sleek flex flex-col md:flex-row gap-4 p-2">
        <div className="flex flex-1 md:items-center md:w-fit w-full  gap-2">
          <img
            className="md:aspect-square size-26 object-contain bg-base-200 rounded-sleek"
            src={img_url}
            alt=""
          />
          <div className=" h-full ">
            <h2 className="font-bold text-base md:text-lg">
              {product_info.name}
            </h2>
            <p className="">
              Quantity: <span className="text-info">{item.quantity} Items</span>
            </p>
            <ul className="mt-1 ">
              {options.map((option) => {
                return (
                  <li key={option.name} className="text-xs md:text-sm">
                    {option.name}: {option.value}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/*//pricing*/}
        <section className="p-2">
          <div className="ml-auto flex flex-col justify-center items-end gap-1">
            <span className="text-xs md:text-sm ml-auto w-fit">
              <span>Price: </span>N {item.price}
            </span>
            <span className="font-bold text-sm md:text-base">
              Total: N {item.price + item.deliveryFee}
            </span>
          </div>
        </section>
      </div>
    </Link>
  );
}
