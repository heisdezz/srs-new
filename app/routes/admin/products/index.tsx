import { pb } from "@/api/apiClient";
import Card from "@/components/Card";
import EmptyList from "@/components/EmptyList";
import GeneralSearchBar from "@/components/GeneralSearchBar";
import PageHeader from "@/components/Headers/PageHeader";
import SimpleSelect from "@/components/inputs/SimpleSelect";
import CardContainer from "@/components/layouts/CardContainer";
import PageLoader from "@/components/layouts/PageLoader";
import Paginator, { usePagination } from "@/components/pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";

export default function AdminProducts() {
  const props = usePagination();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? undefined;
  const { watch, setValue } = useForm({
    defaultValues: {
      category: "all",
    },
  });
  const cat = watch("category");
  const query = useQuery({
    queryKey: ["product_list", "admin", props.currentPage, cat, currentSearch],
    queryFn: async () => {
      let filterString = `name ?~ "${currentSearch ?? ""}"`;
      // const nameFilter = `name ~ "${currentSearch ?? ""}"`;
      if (cat && cat !== "all") {
        filterString += ` && category.id = "${cat}"`;
      }

      let resp = await pb
        .collection("products")
        .getList(props.currentPage, 20, {
          filter: filterString,
          sort: "-created",
          expand: "category",
        });
      return resp;
    },
    retry: 3,
  });

  return (
    <>
      <PageHeader title="Product List">
        <Link to="/admin/product/new" className="btn btn-primary">
          New Product
        </Link>
      </PageHeader>
      <div className="flex gap-2">
        <GeneralSearchBar />
        <form>
          <SimpleSelect
            route="categories"
            value={cat}
            onChange={(newValue) => setValue("category", newValue as string)}
            // label="Category"
            render={(category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            )}
          />
        </form>
      </div>
      <div>
        <PageLoader query={query}>
          {(data) => {
            const items = data.items;
            return (
              <>
                <CardContainer>
                  {items.map((item) => (
                    <Card admin key={item.id} item={item}></Card>
                  ))}
                </CardContainer>
                <EmptyList list={items} />
                <Paginator totalPages={data.totalPages} />
              </>
            );
          }}
        </PageLoader>
      </div>
    </>
  );
}
