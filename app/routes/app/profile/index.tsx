import { useUser } from "@/helpers/client";
import DeliverySettings from "./-components/DeliverySettings";
import ProfileSettings from "./-components/ProfileSettings";

export default function ProfilePage() {
  const { user } = useUser();
  return (
    <div className="pb-12">
      <div className="h-32 bg-primary/50"></div>
      <section className="px-4 container mx-auto -mt-12">
        <div className="">
          <div className="size-32 shadow-xl bg-accent rounded-full fade ring"></div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">{user?.fullName}</h2>
            <h2 className="text text-current/80">{user?.email}</h2>
          </div>
        </div>
      </section>
      <section className="px-4 container mx-auto mt-4 grid md:grid-cols-2 gap-4">
        <DeliverySettings />
        <ProfileSettings />
      </section>
    </div>
  );
}
