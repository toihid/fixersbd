import { Shield, CheckCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";

const levels = [
  { icon: CheckCircle, title: "Basic Verified", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", requirements: ["Phone number verified via OTP", "Profile photo uploaded"] },
  { icon: Shield, title: "Fully Verified", color: "text-brand-500", bg: "bg-brand-100 dark:bg-brand-900/30", requirements: ["Phone verified", "NID (National ID) submitted", "Photo verification completed", "Admin review passed"] },
  { icon: Star, title: "Trusted Pro", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30", requirements: ["Full verification completed", "Minimum 20 completed jobs", "Rating above 4.5", "Admin approval"] },
];

export default function VerificationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Get Verified on FixersBD</h1>
        <p className="text-gray-500 mt-2">Build trust with customers by getting your profile verified</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {levels.map((level) => (
          <Card key={level.title} className="p-6">
            <div className={`w-12 h-12 ${level.bg} rounded-xl flex items-center justify-center mb-4`}>
              <level.icon size={24} className={level.color} />
            </div>
            <h3 className="font-semibold text-lg mb-3">{level.title}</h3>
            <ul className="space-y-2">
              {level.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
