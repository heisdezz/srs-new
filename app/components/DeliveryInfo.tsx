import { pb } from "@/api/apiClient";
import { useUser } from "@/helpers/client";
import { validate_addr } from "@/store/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { MapPin, AlertCircle, Edit2 } from "lucide-react";
import CompLoader from "./layouts/ComponentLoader";

export function DeliveryInfo() {
  const { user } = useUser();
  const defaultDeliverySettings = {
    // user: user.id,
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
            pb.collection("deliverySettings").create({
              id: user.id,
              user_id: user.id,
              street: "",
              city: "",
              state: "",
              country: "",
              zip: "",
            });
            return defaultDeliverySettings;
          }
          throw stat;
        }),
    enabled: !!user,
    placeholderData: defaultDeliverySettings,
    initialData: defaultDeliverySettings,
  });

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 rounded-2xl ring fade overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-5  border-b fade  bg-base-100/50">
        <h2 className="text-xl font-bold tracking-tight text-base-content">
          Delivery Information
        </h2>
      </div>
      <CompLoader query={query}>
        {(data) => {
          const addr = validate_addr(data);
          if (!user) {
            return (
              <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                <p className="text-base-content/60 font-medium italic">
                  Please log in to see delivery details
                </p>
                <Link
                  className="btn btn-info btn-md rounded-full px-10 shadow-lg shadow-info/20"
                  to="/auth/login"
                >
                  Login
                </Link>
              </div>
            );
          }
          return (
            <div className="p-4">
              {!addr.isValid && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 text-error">
                      <AlertCircle className="size-5" />
                      <span className="text-sm font-bold uppercase tracking-widest">
                        Action Required
                      </span>
                    </div>
                    <Link
                      to="/app/profile"
                      className="btn btn-sm btn-soft btn-error rounded-full px-6"
                    >
                      Set Address
                    </Link>
                  </div>
                  <div className="bg-error/10 text-error text-sm rounded-2xl p-5 border border-error/5 leading-relaxed">
                    We don't have a valid delivery address on file for you.
                    Please update your profile to continue.
                  </div>
                </div>
              )}

              {addr.isValid && (
                <div className="flex items-start gap-5  p-6 rounded-[1.75rem] ">
                  <div className="bg-primary p-3.5 rounded-2xl shadow-lg shadow-primary/20">
                    <MapPin className="size-6 text-primary-content" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
                        Current Destination
                      </p>
                      <Link
                        to="/app/profile"
                        className="btn btn-ghost btn-xs btn-circle -mt-2 -mr-2"
                      >
                        <Edit2 className="size-4 opacity-50 hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                    <p className="text-lg font-bold leading-tight text-base-content break-words">
                      {addr.full_address}
                    </p>
                    <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-base-content/5">
                      <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
                      <span className="text-sm font-medium text-base-content/60 italic">
                        Estimated delivery: 30-45 minutes
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </CompLoader>
    </div>
  );
}
