import { pb } from "@/api/apiClient";
import { useUser } from "@/helpers/client";

export function RouteComponent() {
  const { user } = useUser();
  return (
    <div>
      Hello "/auth/logout"!
      {JSON.stringify(user)}
    </div>
  );
}
