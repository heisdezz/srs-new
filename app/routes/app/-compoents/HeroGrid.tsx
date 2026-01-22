import { pb } from "@/api/apiClient";
import CompLoader from "@/components/layouts/ComponentLoader";
import { get_image } from "@/helpers/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { BannersResponse, ProductsRecord } from "pocketbase-types";

export default function HeroGrid() {
  const query = useQuery<BannersResponse[]>({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      let resp = await pb.collection("banners").getFullList({
        expand: "product_id",
      });
      return resp;
    },
  });
  return (
    <CompLoader
      query={query}
      customLoading={
        <div className="flex-1 grid md:grid-cols-2 gap-4">
          <div className=" ring fade skeleton flex rounded-sleek"></div>
          <div className="flex flex-col gap-4 rounded-sleek">
            <div className=" ring fade skeleton flex-1 rounded-sleek"></div>
            <div className=" ring fade skeleton flex-1 rounded-sleek"></div>
          </div>
        </div>
      }
    >
      {(data) => {
        const items = data || [];
        return (
          <>
            <div className="flex-1  grid md:grid-cols-2 gap-4">
              <div className="bg-primary flex rounded-sleek">
                <ImageCard item={items[0]} />
              </div>
              <div className="flex flex-col gap-4 rounded-sleek">
                <ImageCard item={items[1]} />
                <ImageCard item={items[2]} />
              </div>
            </div>
          </>
        );
      }}
    </CompLoader>
  );
}
const ImageCard = ({
  item,
}: {
  item: BannersResponse<{ product_id?: ProductsRecord }>;
}) => {
  if (!item) return <></>;
  return (
    <Link
      to={`/app/product/${item.expand["product_id"].id}`}
      className="flex-1 rounded-sleek isolate object-cover overflow-hidden relative flex group"
    >
      <img
        src={get_image(item, item.banner_img)}
        className="flex-1 object-cover rounded-sleek transition-transform duration-300 group-hover:scale-110"
        alt=""
      />
      <div className="m-1 absolute bottom-0 ring fade p-4 z-10 bg-base-100/80 backdrop-blur-md left-0 right-0 rounded-sleek flex">
        <div className="flex-1">
          <h2 className="text-sm font-bold line-clamp-1">{item.title}</h2>
          <p className="line-clamp-1 text-xs">
            {item.expand["product_id"].description}
          </p>
        </div>
        <span className="divider  divider-horizontal"></span>
        <p className="self-center ml-auto flex-1 max-w-fit">
          <span className="text-base font-bold">
            N {item.expand["product_id"]?.price?.toLocaleString()}
          </span>
        </p>
      </div>
    </Link>
  );
};
