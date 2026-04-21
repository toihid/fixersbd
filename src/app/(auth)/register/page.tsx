"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "worker" ? "worker" : "customer";
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole as "customer" | "worker" },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "Registration failed"); return; }
      setUser(result.user);
      toast.success("Account created successfully!");
      router.push(data.role === "worker" ? "/dashboard/worker/profile" : "/dashboard");
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-500 mt-1">Join FixersBD today</p>
        </div>
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {(["customer", "worker"] as const).map((role) => (
            <button key={role} type="button" onClick={() => setValue("role", role)}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                selectedRole === role ? "bg-white dark:bg-gray-700 shadow-sm text-brand-600" : "text-gray-500 hover:text-gray-700")}>
              {role === "customer" ? "I need a worker" : "I am a worker"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Your full name" icon={<User size={16} />} error={errors.name?.message} {...register("name")} />
          <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={16} />} error={errors.email?.message} {...register("email")} />
          <Input label="Phone Number" placeholder="01XXXXXXXXX" icon={<Phone size={16} />} error={errors.phone?.message} {...register("phone")} />
          <div className="relative">
            <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" icon={<Lock size={16} />} error={errors.password?.message} {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-500 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
