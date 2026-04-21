"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import {
  Zap,
  Droplets,
  Wrench,
  Wind,
  Car,
  Bike,
  HardHat,
  Sparkles,
  ChefHat,
  Baby,
  Paintbrush,
  Truck,
  Shield,
  Star,
  MapPin,
  CheckCircle,
} from "lucide-react";

const categories = [
  { name: "Electrician", nameBn: "ইলেকট্রিশিয়ান", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { name: "Plumber", nameBn: "প্লাম্বার", icon: Droplets, color: "bg-blue-100 text-blue-600" },
  { name: "Carpenter", nameBn: "কাঠমিস্ত্রি", icon: Wrench, color: "bg-orange-100 text-orange-600" },
  { name: "AC Technician", nameBn: "এসি টেকনিশিয়ান", icon: Wind, color: "bg-cyan-100 text-cyan-600" },
  { name: "Car Mechanic", nameBn: "কার মেকানিক", icon: Car, color: "bg-red-100 text-red-600" },
  { name: "Motorcycle Mechanic", nameBn: "বাইক মেকানিক", icon: Bike, color: "bg-purple-100 text-purple-600" },
  { name: "Daily Worker", nameBn: "দিনমজুর", icon: HardHat, color: "bg-amber-100 text-amber-600" },
  { name: "Cleaner", nameBn: "ক্লিনার", icon: Sparkles, color: "bg-green-100 text-green-600" },
  { name: "Cook", nameBn: "রাঁধুনি", icon: ChefHat, color: "bg-rose-100 text-rose-600" },
  { name: "Babysitter", nameBn: "বেবিসিটার", icon: Baby, color: "bg-pink-100 text-pink-600" },
  { name: "Painter", nameBn: "পেইন্টার", icon: Paintbrush, color: "bg-indigo-100 text-indigo-600" },
  { name: "Delivery Helper", nameBn: "ডেলিভারি হেল্পার", icon: Truck, color: "bg-teal-100 text-teal-600" },
];

const features = [
  {
    icon: Shield,
    title: "Verified Workers",
    description: "Every worker goes through our verification process. NID, phone, and photo verified.",
  },
  {
    icon: MapPin,
    title: "Find Nearby",
    description: "Auto-detect your location and find skilled workers closest to you.",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description: "Real reviews from real customers. Only verified job completions count.",
  },
  {
    icon: CheckCircle,
    title: "Easy Hiring",
    description: "Contact directly, negotiate, finalize deal, and mark complete. Simple.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Find Trusted{" "}
              <span className="text-brand-500">Local Workers</span>
              <br />
              Near You
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Bangladesh&apos;s trusted marketplace for skilled workers.
              Electricians, plumbers, mechanics and more — verified and ready.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar large />
            </div>

            {/* Quick category links */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Electrician", "Plumber", "Mechanic", "Cleaner", "Cook"].map(
                (cat) => (
                  <Link
                    key={cat}
                    href={`/search?category=${cat}`}
                    className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300 hover:text-brand-500 transition-all"
                  >
                    {cat}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Find the right professional for any job
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/search?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all group bg-white dark:bg-gray-800"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <cat.icon size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.nameBn}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Why FixersBD?
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Built for trust, speed, and simplicity
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-brand-500" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-500 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Are you a skilled worker?
          </h2>
          <p className="text-brand-100 mb-6 max-w-lg mx-auto">
            Join FixersBD and get discovered by thousands of customers looking
            for your skills. Get verified and start earning.
          </p>
          <Link
            href="/register?role=worker"
            className="inline-block bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors"
          >
            Join as a Worker
          </Link>
        </div>
      </section>
    </div>
  );
}
