type status =
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "cancelled";

export const render_status = (status: status) => {
  switch (status) {
    case "pending":
      return (
        <span className="badge badge-info badge-sm badge-soft ring ">
          Pending
        </span>
      );
    case "processing":
      return (
        <span className="badge badge-secondary badge-sm badge-soft ring ">
          Processing
        </span>
      );
    case "in_transit":
      return (
        <span className="badge badge-info badge-sm badge-soft ring ">
          In Transit
        </span>
      );
    case "delivered":
      return (
        <span className="badge badge-success badge-sm badge-soft ring ">
          Delivered
        </span>
      );
    case "cancelled":
      return (
        <span className="badge badge-error badge-sm badge-soft ring ">
          Cancelled
        </span>
      );
  }
};
