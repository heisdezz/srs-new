import SimpleInput from "@/components/inputs/SimpleInput";
import { useUser } from "@/helpers/client";
import { Link } from "react-router";
import { useForm } from "react-hook-form";

export default function ProfileSettings() {
  const { user } = useUser();
  // const form = useForm({
  //   defaultValues: {
  //     email: user["email"],
  //   },
  // });
  //
  //
  if (!user) {
    return (
      <div className="ring p-4 rounded-sleek fade grid place-items-center">
        <div className="">
          <h2 className="text-xl font-bold text-current/70">
            <Link to="/auth/login">Login To Continue</Link>
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div className="ring  rounded-sleek fade">
      <div className="p-4 fade border-b font-bold text-current/80">
        UserInfo
      </div>
      <div className="p-4 space-y-4">
        <SimpleInput value={user.fullName} label="FullName" />
        <SimpleInput value={user.email} label="Email" />
      </div>
      {/*{JSON.stringify(user, null, 2)}*/}
    </div>
  );
}
