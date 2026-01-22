import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ProductsRecord, ProductsResponse } from "pocketbase-types";
import SimpleInput from "@/components/inputs/SimpleInput";
import SimpleTextArea from "@/components/inputs/SimpleTextArea";
import LocalSelect from "@/components/inputs/LocalSelect";
import { Package, DollarSign, Tag, Info, Plus, X } from "lucide-react";
import type { OptionsConfig, Option, OptionValue } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { pb } from "@/api/apiClient";
import { toast } from "sonner";
import SimpleSelect from "@/components/inputs/SimpleSelect";

// Zod schema for validating the dynamic product options
const optionValueSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  price: z.number().default(0),
});

const optionSchema = z.object({
  key: z.string(),
  label: z.string().min(1, "Option name is required"),
  type: z.literal("select"),
  values: z.array(optionValueSchema).min(1, "At least one value is required"),
});

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0),
  description: z.string().optional(),
  optionsDataArray: z.array(optionSchema),
});

type ProductFormValues = z.infer<typeof productFormSchema>;
type OptionWithKey = Option & { key: string };

export default function AdminProductDetails({
  item,
  add = false,
  addFn,
}: {
  item: ProductsResponse;
  add?: boolean;
  addFn?: (data: Partial<ProductsRecord<OptionsConfig>>) => void;
}) {
  const defaultOptions = (item.options || {}) as OptionsConfig;
  const defaultOptionsArray: OptionWithKey[] = Object.entries(
    defaultOptions,
  ).map(([key, option]) => ({ ...option, key }));

  const methods = useForm<ProductFormValues>({
    // @ts-ignore
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: item.name || "",
      category: item.category || "",
      price: item.price || 0,
      discountPrice: item.discountPrice || 0,
      quantity: item.quantity || 0,
      description: item.description || "",
      optionsDataArray: defaultOptionsArray,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "optionsDataArray",
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<ProductsRecord<OptionsConfig>>) =>
      pb.collection("products").update(item.id, data),
    onMutate: () => {
      toast.loading("Updating product...", { id: "product-update" });
    },
    onSuccess: () => {
      toast.success("Product updated successfully!", { id: "product-update" });
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`, {
        id: "product-update",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log("changes");
    const optionsConfigToSend: OptionsConfig = data.optionsDataArray.reduce(
      (acc, optionItem) => {
        const { key, ...rest } = optionItem;
        acc[key] = rest;
        return acc;
      },
      {} as OptionsConfig,
    );

    const productDataToSend: Partial<ProductsRecord<OptionsConfig>> = {
      name: data.name,
      category: data.category,
      price: data.price,
      discountPrice: data.discountPrice,
      quantity: data.quantity,
      description: data.description,
      options: optionsConfigToSend,
    };

    if (add && addFn) {
      return addFn(productDataToSend);
    }
    mutation.mutate(productDataToSend);
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 bg-base-100 rounded-box shadow-md ring fade">
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SimpleInput
              {...register("name")}
              label="Product Name"
              placeholder="Enter product name"
              icon={<Tag size={18} className="opacity-70" />}
            />

            <SimpleSelect
              route="categories"
              value={watch("category")}
              onChange={(newValue) => setValue("category", newValue as string)}
              label="Category"
              render={(category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )}
            />

            <SimpleInput
              {...register("price", { valueAsNumber: true })}
              type="number"
              label="Original Price"
              placeholder="0.00"
              icon={<DollarSign size={18} className="opacity-70" />}
            />

            <SimpleInput
              {...register("discountPrice", { valueAsNumber: true })}
              type="number"
              label="Discount Price"
              placeholder="0.00"
              icon={<DollarSign size={18} className="opacity-70" />}
            />

            <SimpleInput
              {...register("quantity", { valueAsNumber: true })}
              type="number"
              label="Stock Quantity"
              placeholder="0"
              icon={<Package size={18} className="opacity-70" />}
            />
          </div>

          <SimpleTextArea
            {...register("description")}
            label="Description"
            placeholder="Describe the product..."
            rows={4}
            icon={<Info size={18} className="opacity-70 self-start mt-2" />}
          />

          {/* Dynamic Options Section */}
          <div className="card bg-base-200 shadow-sm p-4">
            <h3 className="card-title text-lg mb-4">Product Options</h3>
            {optionFields.map((optionField, optionIndex) => (
              <div
                key={optionField.id}
                className="mb-4 p-3 border rounded-md border-base-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <SimpleInput
                    {...register(
                      `optionsDataArray.${optionIndex}.label` as const,
                    )}
                    label="Option Name"
                    placeholder="e.g., Color, Size"
                    className="grow w-full sm:w-auto"
                  />
                  <LocalSelect
                    {...register(
                      `optionsDataArray.${optionIndex}.type` as const,
                    )}
                    label="Option Type"
                    className="w-full sm:w-40"
                  >
                    <option value="select">Select</option>
                  </LocalSelect>
                  <button
                    type="button"
                    onClick={() => removeOption(optionIndex)}
                    className="btn btn-sm btn-error btn-outline w-full sm:w-auto"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h4 className="text-md font-semibold mt-4 mb-2">
                  Option Values
                </h4>
                {(watch(`optionsDataArray.${optionIndex}.values`) || []).map(
                  (value, valueIndex) => (
                    <div
                      key={value.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 ml-0 sm:ml-4 p-2 border-t border-base-300 sm:border-none pt-2 sm:pt-0"
                    >
                      <SimpleInput
                        {...register(
                          `optionsDataArray.${optionIndex}.values.${valueIndex}.label` as const,
                        )}
                        label="Value Label"
                        placeholder="e.g., Red, Small"
                        className="grow w-full sm:w-auto"
                      />
                      <SimpleInput
                        {...register(
                          `optionsDataArray.${optionIndex}.values.${valueIndex}.price` as const,
                          { valueAsNumber: true },
                        )}
                        type="number"
                        label="Price Adjustment"
                        placeholder="0.00"
                        className="w-full sm:w-32"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentValues = watch(
                            `optionsDataArray.${optionIndex}.values`,
                          );
                          const updatedValues = (currentValues || []).filter(
                            (_, i) => i !== valueIndex,
                          );
                          setValue(
                            `optionsDataArray.${optionIndex}.values`,
                            updatedValues,
                            { shouldDirty: true },
                          );
                        }}
                        className="btn btn-sm btn-ghost btn-circle self-end sm:self-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => {
                    const newOptionValue: OptionValue = {
                      id: crypto.randomUUID(),
                      label: "",
                      price: 0,
                    };
                    const currentValues = watch(
                      `optionsDataArray.${optionIndex}.values`,
                    );
                    setValue(
                      `optionsDataArray.${optionIndex}.values`,
                      [...(currentValues || []), newOptionValue],
                      { shouldDirty: true },
                    );
                  }}
                  className="btn btn-sm btn-outline btn-info mt-2 ml-0 sm:ml-4 w-full sm:w-auto"
                >
                  <Plus size={16} className="mr-1" /> Add Value
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newOption: OptionWithKey = {
                  key: `option_${crypto.randomUUID()}`,
                  label: "",
                  type: "select",
                  values: [{ id: crypto.randomUUID(), label: "", price: 0 }],
                };
                appendOption(newOption);
              }}
              className="btn btn-outline btn-primary mt-4 w-full"
            >
              <Plus size={18} className="mr-1" /> Add New Option
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button type="button" className="btn btn-ghost w-full sm:w-auto">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
