import { Link, useNavigate } from "react-router";
import { useForm, FormProvider } from "react-hook-form";
import { AtSign, Lock, User } from "lucide-react"; // Assuming these icons are used
import { toast } from "sonner";
import { pb } from "@/api/apiClient";
import { extract_message } from "@/helpers/api";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "@/components/inputs/SimpleInput";

interface SignupFormInputs {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  emailVisibility: boolean;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const methods = useForm<SignupFormInputs>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      emailVisibility: true,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setError,
  } = methods;

  const password = watch("password");

  const mut = useMutation({
    mutationFn: (fn: any) => fn(),
    onSuccess: () => {
      navigate("/auth/login");
    },
  });
  const onSubmit = (data: SignupFormInputs) => {
    // Manual validation for password match
    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log(data);
    toast.promise(
      mut.mutateAsync(() => pb.collection("users").create(data)),
      {
        loading: "Creating account...",
        success: "Account created successfully!",
        error: extract_message,
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 space-y-6 ring fade mx-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-sm text-gray-500">
            Welcome! Please enter your details.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <SimpleInput
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User size={16} />}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
            <SimpleInput
              label="Email"
              type="email"
              placeholder="Enter your email address"
              icon={<AtSign size={16} />}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimpleInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "A minimum of 8 characters",
                  },
                })}
              />
              <SimpleInput
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                {...register("passwordConfirm", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>

            <button
              disabled={mut.isPending}
              type="submit"
              className="btn btn-primary w-full"
            >
              Signup
            </button>
          </form>
        </FormProvider>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="link link-hover text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
