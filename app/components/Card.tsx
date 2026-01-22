import { Link } from "react-router";
import { Star } from "lucide-react";
import type { ProductsResponse } from "pocketbase-types"; // Updated import path to ProductsResponse
import { get_image } from "@/helpers/client"; // Import get_image helper

export default function Card(props: {
  item: ProductsResponse;
  admin?: boolean;
}) {
  // Use ProductsResponse for item prop
  const { item, admin = false } = props;
  const price = item.price || 0; // Use item.price from the ProductsRecord
  const discountPrice = item.discountPrice || price; // Use item.discountPrice, or price if not set

  // Get the first image URL, or a placeholder if no images are available
  const imageUrl =
    item.images && item.images.length > 0
      ? get_image(item, item.images[0])
      : "https://fastly.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA";

  return (
    <Link
      to={`/${admin ? "admin" : "app"}/product/${item.id}`}
      className="group flex flex-col bg-base-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-base-content/10"
    >
      {/* Image Container (M3 Card Media) */}
      <div className="relative h-56 w-full overflow-hidden bg-base-300">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageUrl}
          alt={item.name || "Product image"}
        />
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary font-medium shadow-sm border-none py-3 px-3">
            <Star className="fill-current size-3 mr-1" /> 4.5
          </span>
        </div>
      </div>

      {/* Content (M3 Card Content) */}
      <div className="flex flex-col p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-success">
              New Arrival
            </span>
            <h2 className="text-lg font-semibold text-base-content leading-tight line-clamp-1">
              {item.name || "Product Name"}
            </h2>
          </div>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 mb-4 flex-1">
          {item.description || "No description available."}
        </p>

        {/* Price Section (M3 Supporting Text/Actions area) */}
        <div className="pt-3 border-t border-base-content/5 flex items-end justify-between">
          <div className="flex flex-col">
            {item.discountPrice && (
              <span className="text-xs line-through text-base-content/50">
                N {price.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-primary">
              N {discountPrice.toLocaleString()}
            </span>
          </div>
          <button className="btn btn-circle btn-ghost btn-sm text-base-content/60 group-hover:text-primary transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
