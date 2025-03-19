"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/lib/api/hooks/auth";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { useUsers } from "@/lib/api/hooks/user";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const mutation = useLogin();
  const router = useRouter();
  const { refetch } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const credentials = {
      email: data.email,
      password: data.password,
    };
    mutation.mutate(
      { credentials },
      {
        onError: (error) => {
          setLoading(false);
          if (error instanceof FirebaseError) {
            if (error.code === "auth/invalid-credential") {
              toast.error("Invalid Credentials");
            }
          }
        },
        onSuccess: async () => {
          const { data: adminUser } = await refetch();

          if (Array.isArray(adminUser)) {
            const user = adminUser.find((user) => user.email === data.email);

            if (user.usertype === "admin" || user.usertype === "fleetadmin") {
              localStorage.setItem("authenticated", JSON.stringify(true));
              localStorage.setItem("userInfo", JSON.stringify(user));
              setLoading(false);

              toast.success("Logged In successfully");
              router.push("/dashboard");
            } else {
              toast.error("Invalid Credentials");
              setLoading(false);
            }
          }
        },
      },
    );
  };

  useEffect(() => {
    const userAuthenticated = localStorage.getItem("authenticated");

    if (userAuthenticated === "true") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="login-background bg-[url('../assets/svgs/Group 871.svg')] flex h-screen w-full items-center justify-center bg-cover bg-center p-4 font-[Poppins]">
        <div className="flex min-h-screen items-center justify-center bg-opacity-80">
          <div className="w-[720px] rounded-[20px] border-[3px] border-[#F4F4F499] bg-[#F4F4F466] px-8 py-12 shadow-lg backdrop-blur-[30px]">
            <h2 className="text-center text-[36px] font-bold text-white">
              Log In
            </h2>
            <p className="mt-2 text-center text-base font-medium text-white">
              Don’t have an account yet?{" "}
              <span className="cursor-pointer text-[#FFAFF0]">Sign Up</span>
            </p>

            <div className="mt-6 font-[Roboto]">
              <label className="text-base font-semibold text-white">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="false"
                placeholder="example@gmail.com"
                className="mt-1 w-full border-b-[3px] border-b-[#FAFAFA] bg-transparent p-3 text-base text-white outline-none"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="text-base font-semibold text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="*******"
                  autoComplete="new-password"
                  autoCorrect="off"
                  spellCheck="false"
                  className="mt-1 w-full border-b-[3px] border-b-[#FAFAFA] bg-transparent p-3 text-base text-white outline-none"
                />

                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="text-[#FAFAFA]" />
                  ) : (
                    <Eye className="text-[#FAFAFA]" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-gray-300">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 accent-[#913B81]" />
                <span className="text-sm font-bold text-white">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-bold text-white hover:text-[#913B81]"
              >
                Forgot Password?
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Button
                disabled={!isValid || loading}
                type="submit"
                className="w-[287px] py-[10px] text-center disabled:opacity-70"
                size={"default"}
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
