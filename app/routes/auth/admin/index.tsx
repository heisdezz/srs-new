import { pb } from "@/api/apiClient";
import SimpleInput from "@/components/inputs/SimpleInput";
import { extract_message } from "@/helpers/api";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

// Route migrated to react-router (file-based routes): default export below

export default function AdminLogin() {
  const form = useForm<{ email: string; password: string }>();
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen grid place-items-center px-4 bg-linear-60 from-primary/20 to-secondary/20">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              toast.promise(
                pb
                  .collection("admins")
                  .authWithPassword(data.email, data.password),
                {
                  loading: "Logging in...",
                  success: () => {
                    navigate("/admin");
                    return `welcome`;
                  },
                  error: extract_message,
                },
              );
              return;
            })}
            className="p-6 ring bg-base-100/80 backdrop-blur-md fade rounded-lg shadow w-full max-w-md space-y-4"
          >
            <div className="h-18 grid place-items-center">
              <div className="h-full aspect-square  rounded-sleek ring fade bg-primary/10   grid place-items-center font-lobster-two text-3xl font-bold">
                SRU
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-bold text-2xl">Sign In To Admin</h2>
              <div className=" text-current/80 text-sm">
                Enter your credentials to access your account
              </div>{" "}
            </div>
            <section className="space-y-2">
              <SimpleInput
                label="Email"
                placeholder="Email"
                {...form.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <SimpleInput
                label="Password"
                placeholder="Password"
                type="password"
                {...form.register("password", {
                  required: "Password is required",
                })}
              />
            </section>
            <section className="space-y-4">
              <button className="btn btn-primary btn-block">Login </button>
            </section>
            <section className="ring fade rounded-sleek shadow mt-4">
              <h2 className="border-b fade p-2 font-bold text-current/80">
                Credientials
              </h2>
              <div className="p-2 text-sm">
                <p className="">
                  Email: <span className="font-bold">adminsrs@gmail.com</span>
                </p>
                <p>
                  Password: <span className="font-bold">admin1234</span>
                </p>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
