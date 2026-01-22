import { pb } from "@/api/apiClient";
import SimpleInput from "@/components/inputs/SimpleInput";
import CompLoader from "@/components/layouts/ComponentLoader";
import { useUser, validateItems } from "@/helpers/client";
import { validate_addr } from "@/store/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DeliverySettingsResponse } from "pocketbase-types";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DeliverySettings() {
  const { user } = useUser();
  const defaultDeliverySettings = {
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  };

  const query = useQuery({
    queryKey: ["delvierySettings"],
    queryFn: () =>
      pb
        .collection("deliverySettings")
        .getOne(user.id)
        .catch((stat) => {
          if (stat.status === 404) {
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });

  return (
    <div className="ring  fade rounded-sleek">
      <div className="p-4 border-b font-bold text-current/80 fade flex">
        Delivery Settings
        {query.isFetching && (
          <span className="loading loading-spinner ml-auto text-primary"></span>
        )}
        {query.isError && <span className="text-error ml-auto">Error</span>}
      </div>
      <div className="p-4">
        <CompLoader query={query}>
          {(data) => {
            if (!data) return null;
            return <DeliveryForm initial={data}></DeliveryForm>;
          }}
        </CompLoader>
      </div>
    </div>
  );
}

const DeliveryForm = ({
  initial,
}: {
  initial: Partial<DeliverySettingsResponse>;
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const form = useForm({
    values: {
      ...initial,
    },
  });
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await pb
        .collection("deliverySettings")
        .update(user.id, { ...data, user_id: user.id, id: user.id })
        .catch(async (err) => {
          if (err.status === 404) {
            return await pb
              .collection("deliverySettings")
              .create({ ...data, user_id: user.id, id: user.id });
          }
          throw err;
        });
    },
    onSuccess: (newData) => {
      queryClient.invalidateQueries({ queryKey: ["delvierySettings"] });
      form.reset(newData);
    },
  });

  const onSubmit = (data: Record<string, any>) => {
    const isValid = validateItems(data);
    // return console.log(data);
    if (isValid) {
      return toast.promise(
        mutation.mutateAsync({ ...data, user_id: user.id }),
        {
          loading: "Updating...",
          success: "Delivery Settings Updated",
          error: "Error Updating Delivery Settings",
        },
      );
    }
    return toast.error("Not Complete/Valid");
  };
  const props = validate_addr(initial as any);
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormProvider {...form}>
        <SimpleInput {...form.register("street")} label="Street" />
        <SimpleInput {...form.register("city")} label="City" />
        <SimpleInput {...form.register("state")} label="State" />
        <SimpleInput {...form.register("country")} label="Country" />
        <SimpleInput {...form.register("zip")} label="Zip" />
      </FormProvider>

      <div className="text-sm p-2 ring fade rounded-sleek ">
        {props.full_address}
      </div>
      <div className="space-y-4">
        <button className="btn btn-sm btn-primary btn-block ">Submit</button>
      </div>
    </form>
  );
};
