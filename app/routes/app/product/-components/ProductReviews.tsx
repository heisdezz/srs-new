import { pb } from "@/api/apiClient";
import SimpleTextArea from "@/components/inputs/SimpleTextArea";
import Modal from "@/components/modals/DialogModal";
import { extract_message } from "@/helpers/api";
import { useUser } from "@/helpers/client";
import { useModal } from "@/helpers/modals";
import type {
  ReviewCountResponse,
  ReviewsResponse,
  UsersResponse,
} from "pocketbase-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import CompLoader from "@/components/layouts/ComponentLoader";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      rating: 5,
      review: "",
    },
  });
  const reviews = useQuery({
    queryKey: [productId, "reviews"],
    queryFn: async () => {
      let resp = await pb
        .collection("reviews")
        .getList<ReviewsResponse<{ user_id: UsersResponse }>>(1, 3, {
          filter: `product_id = "${productId}"`,
          sort: "-created",
          expand: "user_id",
          skipTotal: true,
        });
      return resp;
    },
    enabled: !!productId,
  });
  const { mutateAsync } = useMutation({
    mutationFn: async (data: { review: string; rating: number }) => {
      let resp = await pb
        .collection("reviews")
        .create({ product_id: productId, ...data, user_id: user.id });
      return resp;
    },
    onSuccess: () => {
      reviews.refetch();
      queryClient.invalidateQueries({ queryKey: ["reviews_count", productId] });
      modal.closeModal();
      form.reset();
    },
  });
  const modal = useModal();

  return (
    <>
      <Modal ref={modal.ref} title="Add Review">
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => {
              toast.promise(() => mutateAsync(data), {
                loading: "Submitting...",
                success: "Review submitted!",
                error: extract_message,
              });
            })}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Rating</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    value={star}
                    className="mask mask-star-2 bg-orange-400"
                    {...form.register("rating", { valueAsNumber: true })}
                  />
                ))}
              </div>
            </div>
            <SimpleTextArea
              label="Review"
              placeholder="What did you think about this product?"
              {...form.register("review", { required: "Review is required" })}
            />
            <button className="btn btn-primary btn-block">Submit Review</button>
          </form>
        </FormProvider>
      </Modal>

      <div className="bg-base-100 rounded-sleek border border-base-300 overflow-hidden">
        <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-200/30">
          <div>
            <h2 className="text-xl font-bold">Ratings & Reviews</h2>
            <p className="text-sm opacity-60">Real feedback from customers</p>
          </div>
          {user && (
            <button
              onClick={() => modal.showModal()}
              className="btn btn-primary btn-sm"
            >
              Write Review
            </button>
          )}
        </div>

        <div className="p-4  space-y-4">
          <RatingDistribution id={productId} />
          <div className="space-y-4">
            {reviews.data?.items?.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm flex gap-4 transition-all hover:border-primary/30 ring fade"
              >
                <div className="avatar placeholder h-fit">
                  <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 ring-1 ring-base-300">
                    <span className="text-sm uppercase font-bold">
                      {review.expand?.user_id?.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-bold text-md">
                        {review.expand?.user_id?.fullName || "Anonymous User"}
                      </h3>
                      <div className="rating rating-xs pointer-events-none">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <input
                            key={star}
                            type="radio"
                            className="mask mask-star-2 bg-orange-400"
                            checked={Math.round(review.rating) === star}
                            readOnly
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs opacity-40 font-medium italic">
                      {new Date(review.created).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-base-content/90 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            ))}

            {reviews.data?.items.length === 0 && (
              <div className="text-center py-12 bg-base-200/20 rounded-xl border-2 border-dashed border-base-300">
                <p className="text-base-content/40 font-medium">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const RatingDistribution = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["reviews_count", id],
    queryFn: () =>
      pb
        .collection("review_count")
        .getFirstListItem<ReviewCountResponse>(`product_id = "${id}"`),
    enabled: !!id,
  });

  return (
    <CompLoader query={query}>
      {(data) => {
        const total = data.total_reviews || 0;
        const distribution = [
          { rating: 5, count: data.rating_5 || 0 },
          { rating: 4, count: data.rating_4 || 0 },
          { rating: 3, count: data.rating_3 || 0 },
          { rating: 2, count: data.rating_2 || 0 },
          { rating: 1, count: data.rating_1 || 0 },
        ];

        return (
          <div className="flex flex-col md:flex-row sm:items-center gap-4  py-4">
            <div className="text-center ring p-6 rounded-sleek fade flex-1 md:max-w-3xs">
              <div className="text-5xl font-black text-primary mb-1">
                {Number(data.average_rating || 0).toFixed(1)}
              </div>
              <div className="rating rating-sm pointer-events-none mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    className="mask mask-star-2 bg-orange-400"
                    checked={
                      Math.round(Number(data.average_rating || 0)) === star
                    }
                    readOnly
                  />
                ))}
              </div>
              <div className="text-xs opacity-50 font-bold uppercase tracking-wider">
                {total} Reviews
              </div>
            </div>

            <div className="space-y-2 flex-1 ring p-4 fade rounded-sleek ">
              {distribution.map(({ rating, count }) => {
                const percentage = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <span className="text-xs font-bold w-3">{rating}</span>
                    <progress
                      className="progress progress-primary flex-1 h-2"
                      value={percentage}
                      max="100"
                    ></progress>
                    <span className="text-xs opacity-50 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </CompLoader>
  );
};
