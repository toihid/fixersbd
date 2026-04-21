"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { workerProfileSchema, type WorkerProfileInput } from "@/lib/validations";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function WorkerProfilePage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<WorkerProfileInput>({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: { skills: [], availability: "available" },
  });

  const skills = watch("skills");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "worker")) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  function addSkill() {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue("skills", [...skills, skillInput.trim()]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setValue("skills", skills.filter((s) => s !== skill));
  }

  async function onSubmit(data: WorkerProfileInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        toast.success("Profile updated!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update profile");
      }
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  }

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Occupation" placeholder="e.g. Electrician" error={errors.occupation?.message} {...register("occupation")} />

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select {...register("categoryId")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm">
              <option value="">Select category</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name} ({c.nameBn})</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Skills</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm"
              />
              <Button type="button" variant="secondary" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-lg text-sm flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-brand-400 hover:text-brand-600">&times;</button>
                </span>
              ))}
            </div>
            {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Experience (years)" type="number" error={errors.experience?.message} {...register("experience", { valueAsNumber: true })} />
            <Input label="Hourly Rate (৳)" type="number" error={errors.hourlyRate?.message} {...register("hourlyRate", { valueAsNumber: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea {...register("bio")} placeholder="Tell customers about yourself..." rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Availability</label>
            <select {...register("availability")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm">
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <fieldset className="border-t pt-4 mt-4">
            <legend className="text-sm font-medium px-2">Location</legend>
            <div className="space-y-3 mt-2">
              <Input label="Address" placeholder="Your address" error={errors.location?.address?.message} {...register("location.address")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Area" placeholder="Area/Thana" {...register("location.area")} />
                <Input label="City" placeholder="City" error={errors.location?.city?.message} {...register("location.city")} />
              </div>
            </div>
          </fieldset>

          <Button type="submit" loading={loading} className="w-full" size="lg">Save Profile</Button>
        </form>
      </Card>
    </div>
  );
}
