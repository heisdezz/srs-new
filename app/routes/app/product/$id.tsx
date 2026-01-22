import { useParams } from "react-router";
import ProductDetails from "./-components/ProductDetails";
import ProductInfo from "./-components/ProductInfo";
import { useQuery } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import type { ProductsRecord } from "pocketbase-types";
import type { OptionsConfig } from "@/types";

export default function ProductPage() {
  const { id } = useParams();
  if (!id) return null;

  const query = useQuery({
    queryKey: ["product", id],
    queryFn: () => pb.collection("products").getOne(id),
  });

  return (
    <>
      <PageLoader query={query}>
        {(data) => {
          let payload = data;
          return (
            <>
              <div className="min-h-screen flex   container mx-auto px-4 py-12 gap-4 p">
                <div className="flex-1">
                  <ProductInfo
                    item={payload as ProductsRecord<OptionsConfig>}
                  />
                </div>
                <div className="flex-1 hidden md:block max-w-md">
                  <ProductDetails
                    item={payload as ProductsRecord<OptionsConfig>}
                  />
                </div>
              </div>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
