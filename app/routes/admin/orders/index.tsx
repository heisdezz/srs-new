import { pb } from "@/api/apiClient";
import PageHeader from "@/components/Headers/PageHeader";
import CardContainer from "@/components/layouts/CardContainer";
import PageLoader from "@/components/layouts/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import AdminOrderCard from "../-components/AdminOrderCard";
import Paginator, { usePagination } from "@/components/pagination/Pagination";
import GeneralSearchBar from "@/components/GeneralSearchBar";
import LocalSelect from "@/components/inputs/LocalSelect";
import { useForm } from "react-hook-form";
import EmptyList from "@/components/EmptyList";

export default function AdminOrders() {
  const pageProps = usePagination();
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? undefined;
  const { watch, setValue } = useForm({
    defaultValues: {
      status: "all",
    },
  });

  const statusFilter = watch("status");

  const query = useQuery({
    queryKey: [
      "orders-admin-list",
      pageProps.currentPage,
      statusFilter,
      currentSearch,
    ],
    queryFn: async () => {
      let filters = [];

      if (currentSearch) {
        filters.push(`productId.name ~ "${currentSearch}"`);
      }

      if (statusFilter && statusFilter !== "all") {
        filters.push(`status = "${statusFilter}"`);
      }

      const filterString = filters.join(" && ");

      return pb.collection("orders").getList(pageProps.currentPage, 20, {
        expand: "productId,userId",
        filter: filterString,
        sort: "-created",
      });
    },
  });

  return (
    <>
      <PageHeader title="Orders" />
      <div className="flex gap-2 mb-4">
        <GeneralSearchBar />
        <div className="w-48">
          <LocalSelect
            value={statusFilter}
            onChange={(e) => setValue("status", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </LocalSelect>
        </div>
      </div>
      <PageLoader query={query}>
        {(data) => {
          const items = data.items;
          return (
            <>
              <CardContainer>
                {items.map((item) => {
                  return <AdminOrderCard order={item as any} key={item.id} />;
                })}
              </CardContainer>
              <EmptyList list={items} />
              <Paginator totalPages={data.totalPages}></Paginator>
            </>
          );
        }}
      </PageLoader>
    </>
  );
}
