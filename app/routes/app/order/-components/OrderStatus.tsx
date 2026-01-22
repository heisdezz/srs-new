import { pb } from "@/api/apiClient";
import { toast } from "sonner";
import type { OrdersResponse } from "pocketbase-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const status_list = ["pending", "processing", "in transit", "delivered"];

export default function OrderStatus({
  status,
  id,
  deliveryCode,
}: {
  status: string;
  id: string;
  deliveryCode?: string;
}) {
  const queryClient = useQueryClient();
  const currentStatusIndex = status_list.indexOf(status.toLowerCase());
  const isNotInTransit = status.toLowerCase() !== "in transit";

  const mutation = useMutation({
    mutationFn: async () => {
      return await pb.collection("orders").update<OrdersResponse>(id, {
        status: "delivered",
      });
    },
    onSuccess: () => {
      toast.success("Order marked as delivered");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: () => {
      toast.error("Failed to mark order as delivered");
    },
  });

  const handleMarkAsDelivered = () => {
    mutation.mutate();
  };

  return (
    <div className="w-full py-8 px-4 bg-base-200/50 rounded-2xl border border-base-300 flex flex-col gap-6">
      <ul className="steps steps-vertical md:steps-horizontal w-full gap-y-4">
        {status_list.map((stat, index) => {
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <li
              key={stat}
              data-content={isCompleted ? "✓" : isCurrent ? "●" : index + 1}
              className={`step transition-all duration-700 ease-in-out ${
                isCompleted || isCurrent
                  ? "step-primary"
                  : "before:bg-base-300!"
              } ${isCurrent ? "font-bold" : ""}`}
            >
              <div className="flex flex-col items-center md:items-start ml-2 md:ml-0">
                <span
                  className={`text-sm tracking-wide capitalize transition-colors duration-300 ${
                    isCurrent
                      ? "text-primary scale-110 origin-left"
                      : isCompleted
                        ? "text-base-content/80"
                        : "text-base-content/40"
                  }`}
                >
                  {stat}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mt-1 animate-pulse hidden md:block">
                    In Progress
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] font-medium uppercase tracking-tighter text-success opacity-70 hidden md:block">
                    Completed
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {status.toLowerCase() !== "delivered" && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          {deliveryCode && (
            <div className="text-sm">
              <span className="opacity-50 mr-2">Delivery Code:</span>
              <span className="font-mono font-bold bg-base-300 px-2 py-1 rounded">
                {deliveryCode}
              </span>
            </div>
          )}
          <button
            onClick={handleMarkAsDelivered}
            disabled={mutation.isPending || isNotInTransit}
            className="btn btn-primary btn-sm md:btn-md ml-auto"
          >
            {mutation.isPending && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            Mark as Delivered
          </button>
        </div>
      )}
    </div>
  );
}
