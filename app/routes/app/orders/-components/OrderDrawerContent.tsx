import { useNavigate, useSearchParams } from "react-router";

const statuses = [
  "pending",
  "processing",
  "in transit",
  "delivered",
  // "cancelled",
];

export default function OrderDrawerContent() {
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "all";
  const navigate = useNavigate();

  return (
    <div className=" space-y-4">
      <h2 className="h-20 border-b flex items-center fade font-bold text-xl ">
        Order Status
      </h2>
      {/*{search["status"]}*/}
      <div className="p-4 fade shadow rounded-sleek ring">
        <ul className="menu p-0 size-full space-y-2">
          <li>
            <a
              className={`${currentStatus === "all" ? "menu-active" : ""}`}
              onClick={() => navigate("/app/orders")}
            >
              All
            </a>
          </li>
          {statuses.map((status) => (
            <li key={status} className="menu-item capitalize">
              <a
                className={`${status === currentStatus ? "menu-active" : ""}`}
                onClick={() => {
                  navigate(`/app/orders?status=${encodeURIComponent(status)}`);
                }}
              >
                {" "}
                {status}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
