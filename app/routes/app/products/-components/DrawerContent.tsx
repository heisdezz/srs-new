import { pb } from "@/api/apiClient";
import SimpleInput from "@/components/inputs/SimpleInput";
import CompLoader from "@/components/layouts/ComponentLoader";
import { useFiltersStore } from "@/store/client";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface DrawerFormProps {
  min: number;
  max: number;
  category: string;
}

export default function DrawerContent() {
  const query = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      let resp = await pb.collection("categories").getFullList();
      return resp;
    },
  });
  const { filters, updateFilters, resetFilters } = useFiltersStore();
  const form = useForm<DrawerFormProps>({
    defaultValues: {
      ...filters,
    },
  });

  const selectedCategory = form.watch("category");

  return (
    <>
      <h2 className="md:h-20 h-16 p-4 flex items-center text-lg font-bold border-b fade">
        Filters & Categories
      </h2>
      <form
        onSubmit={form.handleSubmit(updateFilters)}
        className="p-4 space-y-4"
      >
        <div>
          <h2 className="px-2 py-2 font-semibold">Price</h2>

          <div className="ring p-4 fade rounded-sleek space-y-2">
            <SimpleInput
              {...form.register("min")}
              type="number"
              placeholder="Min"
              label="Min Price"
            />
            <SimpleInput
              {...form.register("max")}
              type="number"
              placeholder="Max"
              label="Max Price"
            />
          </div>
        </div>
        <CompLoader query={query}>
          {(data) => {
            const payload = data;
            return (
              <div className="">
                <h2 className="px-2 py-2 font-semibold">Categories</h2>
                <ul className="menu w-full ring fade rounded-sleek">
                  <li
                    onClick={() => {
                      form.setValue("category", "");
                    }}
                  >
                    <a>All</a>
                  </li>
                  {payload.map((item) => {
                    return (
                      <li
                        key={item.id}
                        className="capitalize"
                        onClick={() => {
                          form.setValue("category", item.id);
                        }}
                      >
                        <a
                          className={`capitalize ${item.id === form.getValues().category ? "bg-primary text-primary-content" : ""}`}
                        >
                          {item.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }}
        </CompLoader>
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            // console.log(form.getValues());
            updateFilters(form.getValues());
          }}
        >
          Apply Filters
        </button>
      </form>
    </>
  );
}
