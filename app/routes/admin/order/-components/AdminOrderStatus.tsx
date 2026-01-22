import { pb } from "@/api/apiClient";
import { extract_message } from "@/helpers/api";
import type { OrdersResponse, ShippingInfoResponse } from "pocketbase-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  CheckCircle2,
  ChevronRight,
  Package,
  Truck,
  Hash,
  Phone,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/helpers/modals";
import Modal from "@/components/modals/DialogModal";
import { useForm } from "react-hook-form";
import SimpleInput from "@/components/inputs/SimpleInput";

const status_list = ["pending", "processing", "in transit", "delivered"];

const status_icons: Record<string, any> = {
  pending: Package,
  processing: CheckCircle2,
  "in transit": Truck,
  delivered: CheckCircle2,
};

export default function OrderStatus({
  status,
  refetch,
}: {
  status: string;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();
  const { orderId } = useParams();

  const { ref, showModal, closeModal } = useModal();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      orderId: orderId,
      ShippingProvider: "",
      trackingNumber: "",
      Name: "",
      Phone: "",
    },
  });

  const return_next_status = (currentStatus: string) => {
    const index = status_list.indexOf(currentStatus);
    if (index === -1 || index === status_list.length - 1) return null;
    return status_list[index + 1];
  };

  const nextStatus = return_next_status(status);

  const mutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return pb
        .collection("orders")
        .update<OrdersResponse>(orderId!, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      refetch();
    },
  });

  const shippingMutation = useMutation({
    mutationFn: (data: any) =>
      pb
        .collection("shippingInfo")
        .create<ShippingInfoResponse>({ id: orderId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      closeModal();
      reset();
      mutation.mutate("in transit");
    },
  });

  const handleStatusTransition = (next: string) => {
    if (next === "in transit") {
      showModal();
    } else {
      toast.promise(mutation.mutateAsync(next), {
        loading: "Updating status...",
        success: `Order moved to ${next}`,
        error: extract_message,
      });
    }
  };

  const onShippingSubmit = (data: any) => {
    toast.promise(shippingMutation.mutateAsync(data), {
      loading: "Saving shipping info...",
      success: "Shipping info saved and order updated",
      error: extract_message,
    });
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-md overflow-hidden">
      <Modal
        ref={ref}
        title="Shipping Information"
        actions={
          <button
            onClick={handleSubmit(onShippingSubmit)}
            className="btn btn-primary"
            disabled={shippingMutation.isPending}
          >
            Save & Ship
          </button>
        }
      >
        <form className="space-y-4">
          <SimpleInput
            label="Order ID"
            icon={<Hash size={16} />}
            {...register("orderId")}
            readOnly
          />
          <SimpleInput
            label="Shipping Provider"
            icon={<Building2 size={16} />}
            placeholder="e.g. FedEx, DHL"
            {...register("ShippingProvider", { required: true })}
          />
          <SimpleInput
            label="Tracking Number"
            icon={<Truck size={16} />}
            placeholder="Tracking Number"
            {...register("trackingNumber", { required: true })}
          />
          <SimpleInput
            label="Phone Number"
            type="number"
            icon={<Phone size={16} />}
            placeholder="Phone Number"
            {...register("Phone", { required: true })}
          />
        </form>
      </Modal>

      <div className="card-body p-0">
        <div className="p-5 bg-base-200/30 border-b border-base-300 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight opacity-50">
                Order Status
              </h3>
              <div className="badge badge-primary badge-md capitalize font-bold gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-content opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-content"></span>
                </span>
                {status}
              </div>
            </div>
          </div>

          {nextStatus && (
            <button
              onClick={() => handleStatusTransition(nextStatus)}
              disabled={mutation.isPending || shippingMutation.isPending}
              className="btn btn-primary btn-sm md:btn-md shadow-sm hover:shadow-md transition-all"
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  Mark as {nextStatus}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          )}
        </div>

        <div className="p-8 bg-linear-to-b from-transparent to-base-200/20">
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            {status_list.map((stat, index) => {
              const currentStatusIndex = status_list.indexOf(status);
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const Icon = status_icons[stat] || Package;

              return (
                <li
                  key={stat}
                  className={`step transition-all duration-500 ${
                    isCompleted || isCurrent ? "step-primary" : ""
                  }`}
                  data-content={isCompleted ? "✓" : index + 1}
                >
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-content shadow-lg scale-110"
                          : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-base-300 text-base-content/30"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        isCurrent ? "text-primary" : "opacity-50"
                      }`}
                    >
                      {stat}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
