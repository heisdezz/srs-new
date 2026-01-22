import type { CategoriesResponse } from "pocketbase-types";
import { pb } from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/helpers/modals";
import SimpleInput from "@/components/inputs/SimpleInput";
import { useForm } from "react-hook-form";

export default function CategoryCard({
  category,
}: {
  category: CategoriesResponse;
}) {
  const queryClient = useQueryClient();
  const editModal = useModal();
  const deleteModal = useModal();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: category?.name,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return await pb.collection("categories")?.update(category.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      editModal.closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await pb.collection("categories")?.delete(category.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      deleteModal.closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  return (
    <>
      <div
        key={category.id}
        className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow border border-base-200"
      >
        <div>
          <h3 className="font-medium text-lg">{category.name}</h3>
          <p className="text-sm text-base-content/60">
            Created: {new Date(category.created).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              reset({ name: category.name });
              editModal.showModal();
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={() => deleteModal.showModal()}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        ref={editModal.ref}
        title="Edit Category"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={editModal.closeModal}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit((data) => updateMutation.mutate(data))}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>
          <SimpleInput
            label="Category Name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter category name"
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        ref={deleteModal.ref}
        title="Delete Category"
        actions={
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={deleteModal.closeModal}>
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{category.name}</strong>? This
          action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
