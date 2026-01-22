import { pb } from "@/api/apiClient";
import Card from "@/components/Card";
import CardContainer from "@/components/layouts/CardContainer";
import PageLoader from "@/components/layouts/PageLoader";
import Paginator, { usePagination } from "@/components/pagination/Pagination";
import SearchBar from "@/components/SearchBar";
import { useFiltersStore } from "@/store/client";
import type { OptionsConfig } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { Menu } from "lucide-react";
import type { ProductsResponse } from "pocketbase-types";

// route config migrated to react-router file-based routes
const red = String(202);

export default function ProductsIndex() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const pagination = usePagination();
  const { filters } = useFiltersStore();
  const query = useQuery({
    queryKey: ["products", search, filters, pagination.currentPage],
    queryFn: async () => {
      let filterString = `name ?~ "${search}"`;

      if (filters.category) {
        filterString += ` && category.id = "${filters.category}"`;
      }

      // Apply price filters considering both 'price' and 'discountPrice'
      if (filters.min !== 0) {
        // Filter where either price or discountPrice is greater than or equal to min
        filterString += ` && (price >= ${filters.min} || discountPrice >= ${filters.min})`;
      }
      if (filters.max !== Infinity) {
        // Filter where either price or discountPrice is less than or equal to max
        filterString += ` && (price <= ${filters.max} || discountPrice <= ${filters.max})`;
      }

      let resp = await pb
        .collection("products")
        .getList(pagination.currentPage, 10, {
          filter: filterString,
          expand: "category", // Expand the category relation to filter by category name
        });
      return resp;
    },
    retry: 3,
  });

  return (
    <>
      <div className="h-20 fade border-b p-4 flex container mx-auto items-center">
        <SearchBar />
        <label
          htmlFor="products-drawer"
          className="ml-2 btn btn-ghost ring fade btn-square"
        >
          <Menu />
        </label>
      </div>
      <div className="container mx-auto px-4 pb-12">
        <PageLoader query={query}>
          {(data) => {
            const items = data.items;
            return (
              <>
                <CardContainer>
                  {items.map((item) => (
                    //@ts-ignore
                    <Card
                      key={item.id}
                      item={item as ProductsResponse<OptionsConfig>}
                    >
                      {item.name}
                    </Card>
                  ))}
                </CardContainer>
                <Paginator totalPages={data.totalPages} />
              </>
            );
          }}
        </PageLoader>
      </div>
    </>
  );
}
