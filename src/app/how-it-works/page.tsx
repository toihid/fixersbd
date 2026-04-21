"use client";
import { motion } from "framer-motion";
import { Search, UserCheck, Phone, Handshake, Star, CheckCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Search for a Worker", titleBn: "কর্মী খুঁজুন", description: "Type what you need — like 'fan repair' or 'plumber'. Our smart search finds the right category automatically." },
  { icon: UserCheck, title: "Browse Verified Profiles", titleBn: "ভেরিফাইড প্রোফাইল দেখুন", description: "View worker ratings, reviews, skills, and verification badges. Filter by availability, distance, and price." },
  { icon: Phone, title: "Contact the Worker", titleBn: "কর্মীর সাথে যোগাযোগ করুন", description: "Call or WhatsApp the worker directly. Discuss the job details and negotiate the price." },
  { icon: Handshake, title: "Hire & Finalize Deal", titleBn: "ভাড়া করুন ও চুক্তি করুন", description: "Click 'Hire Now' to send a job request. The worker accepts and starts the job." },
  { icon: CheckCircle, title: "Job Completed", titleBn: "কাজ সম্পন্ন", description: "Once the work is done, mark the job as complete from your dashboard." },
  { icon: Star, title: "Leave a Review", titleBn: "রিভিউ দিন", description: "Rate the worker and share your experience. Help others find great workers." },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">How FixersBD Works</h1>
        <p className="text-gray-500 mt-2">Find and hire trusted local workers in 6 simple steps</p>
      </div>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-start gap-5 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
              <step.icon size={24} className="text-brand-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-brand-500">Step {i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.titleBn}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
