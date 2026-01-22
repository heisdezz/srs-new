import { pb } from "@/api/apiClient";
import PageLoader from "@/components/layouts/PageLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import AdminProductInfo from "./-components/AdminProductInfo";
import AdminProductDetails from "./-components/AdminProductDetails";
import UpdateImages from "@/components/inputs/UpdateImages";
import { useImages } from "@/helpers/images";
import { toast } from "sonner";
import { extract_message } from "@/helpers/api";
import type { ProductsRecord } from "pocketbase-types";
import PageHeader from "@/components/Headers/PageHeader";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/helpers/modals";

export default function AdminProduct() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { images, setPrev, newImages, setNew } = useImages();

  const query = useQuery({
    queryKey: ["product_info_admin", id],
    queryFn: async () => {
      const res = await pb.collection("products").getOne(id);
      const formattedImages = ((res.images as string[]) || []).map((img) => ({
        url: pb.files.getUrl(res, img),
        path: img,
      }));
      setPrev(formattedImages);
      return res;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: FormData) => pb.collection("products").update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_info_admin", id] });
    },
  });

  const submit = (data: ProductsRecord) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("price", data.price?.toString() || "0");
    formData.append("discountPrice", data.discountPrice?.toString() || "0");
    formData.append("quantity", data.quantity?.toString() || "0");
    if (data.category) {
      formData.append("category", data.category);
    }
    if (data.options) {
      formData.append("options", JSON.stringify(data.options));
    }

    // Handle new image uploads
    if (newImages) {
      Array.from(newImages).forEach((file) => {
        formData.append("images", file);
      });
    }

    // PocketBase handles deletions by omitting existing filenames or using "images-"
    // Based on UpdateImages logic, 'images' state contains the ones we want to KEEP.
    // We identify deleted ones by comparing original record images with current 'images' state.
    const originalImages = query.data?.images || [];
    const currentPaths = images?.map((img) => img.path) || [];
    const deletedImages = originalImages.filter(
      (path: string) => !currentPaths.includes(path),
    );

    deletedImages.forEach((path: string) => {
      formData.append("images-", path);
    });

    toast.promise(mutateAsync(formData), {
      loading: "Updating product...",
      success: "Product updated successfully!",
      error: extract_message,
    });
  };

  const { ref, showModal, closeModal } = useModal();
  return (
    <div className="container mx-auto py-8">
      <Modal ref={ref} title="Preview ">
        <iframe
          className="w-full min-h-120"
          src={`/app/product/${id}`}
        ></iframe>
      </Modal>
      <PageHeader
        title={`Edit Product: ${id}`}
        description="Update product details and images"
      >
        <>
          <button className="btn btn-primary" onClick={showModal}>
            Preview
          </button>
        </>
        {/*<Link className="btn btn-primary" to={`/app/product/${id}`}>
          Preview
        </Link>*/}
      </PageHeader>
      <PageLoader query={query}>
        {(data) => {
          return (
            <div className="flex-1 flex flex-col gap-6">
              <div className="my-4">
                <UpdateImages
                  images={images || []}
                  setPrev={setPrev}
                  setNew={setNew}
                />
              </div>
              <div className="flex-1">
                {/*<AdminProductInfo item={data} />*/}
              </div>
              <div className="flex-1">
                <AdminProductDetails item={data} addFn={submit as any} />
              </div>
            </div>
          );
        }}
      </PageLoader>
    </div>
  );
}
