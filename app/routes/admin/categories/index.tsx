import { pb } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "@/components/layouts/PageLoader";
import type { CategoriesResponse, CategoriesRecord } from "pocketbase-types";
import CategoryCard from "./-components/CategoryCard";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "@/components/inputs/SimpleInput";
import { Plus } from "lucide-react";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/helpers/modals";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const methods = useForm<CategoriesRecord>();
  const addCategoryModal = useModal();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await pb
        .collection("categories")
        ?.getFullList<CategoriesResponse>({
          sort: "-created",
        });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoriesRecord) => {
      return await pb.collection("categories")?.create(data);
    },
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      methods.reset();
      addCategoryModal.closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const onSubmit = (data: CategoriesRecord) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={addCategoryModal.showModal}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <PageLoader query={categoriesQuery}>
        {(categories) => (
          <div className="grid gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
            {categories.length === 0 && (
              <div className="text-center py-12 bg-base-100 rounded-lg border border-dashed border-base-300 text-base-content/50">
                No categories found.
              </div>
            )}
          </div>
        )}
      </PageLoader>

      <Modal
        ref={addCategoryModal.ref}
        title="Add New Category"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="btn"
              onClick={addCategoryModal.closeModal}
            >
              Cancel
            </button>
            <button
              form="add-category-form"
              type="submit"
              className="btn btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </button>
          </div>
        }
      >
        <FormProvider {...methods}>
          <form
            id="add-category-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <SimpleInput
              label="Category Name"
              placeholder="e.g. Electronics"
              {...methods.register("name", { required: "Name is required" })}
            />
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
}
