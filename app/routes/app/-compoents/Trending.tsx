import { pb } from "@/api/apiClient";
import Card from "@/components/Card";
import CardContainer from "@/components/layouts/CardContainer";
import CompContainer from "@/components/layouts/CompContainer";
import CompLoader from "@/components/layouts/ComponentLoader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export default function Trending() {
  const query = useQuery({
    queryKey: ["products", "Trending"],
    queryFn: async () => {
      let resp = await pb.collection("products").getList(1, 10, {
        sort: "-created",
      });
      return resp;
    },
  });
  return (
    <>
      <CompContainer
        title="Trending"
        rightComponent={
          <>
            <Link
              to="/app/products"
              className="btn btn-primary btn-soft ring btn-sm fade"
            >
              See All
            </Link>
          </>
        }
      >
        <CompLoader query={query} minHeight={520}>
          {(data) => {
            return (
              <>
                <CardContainer>
                  {data.items.map((item, index) => (
                    <Card item={item} key={index} />
                  ))}
                </CardContainer>
              </>
            );
          }}
        </CompLoader>
      </CompContainer>
    </>
  );
  return;
}
