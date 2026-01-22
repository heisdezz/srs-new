import SimpleCarousel from "@/components/SimpleCarousel";
import { get_image } from "@/helpers/client";
import type { ProductsResponse } from "pocketbase-types";

export default function AdminProductInfo({ item }: { item: ProductsResponse }) {
  const data = item;
  return (
    <>
      <SimpleCarousel>
        {data.images.map((item) => {
          return (
            <figure className="h-62.5  bg-base-200">
              <img
                src={get_image(data, item)}
                className="size-full object-contain"
                alt=""
              />
            </figure>
          );
        })}
      </SimpleCarousel>
    </>
  );
}
