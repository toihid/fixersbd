import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fixersbd";

const categories = [
  { name: "Electrician", nameBn: "ইলেকট্রিশিয়ান", slug: "electrician", icon: "⚡", description: "Electrical repairs and installations" },
  { name: "Plumber", nameBn: "প্লাম্বার", slug: "plumber", icon: "🔧", description: "Plumbing repairs and installations" },
  { name: "Carpenter", nameBn: "কাঠমিস্ত্রি", slug: "carpenter", icon: "🪚", description: "Woodwork and furniture" },
  { name: "AC Technician", nameBn: "এসি টেকনিশিয়ান", slug: "ac-technician", icon: "❄️", description: "AC repair and servicing" },
  { name: "Car Mechanic", nameBn: "কার মেকানিক", slug: "car-mechanic", icon: "🚗", description: "Car repair and maintenance" },
  { name: "Motorcycle Mechanic", nameBn: "বাইক মেকানিক", slug: "motorcycle-mechanic", icon: "🏍️", description: "Motorcycle repair" },
  { name: "Daily Worker", nameBn: "দিনমজুর", slug: "daily-worker", icon: "👷", description: "General labor and helper" },
  { name: "Cleaner", nameBn: "ক্লিনার", slug: "cleaner", icon: "✨", description: "Cleaning services" },
  { name: "Cook", nameBn: "রাঁধুনি", slug: "cook", icon: "👨‍🍳", description: "Cooking and catering" },
  { name: "Babysitter", nameBn: "বেবিসিটার", slug: "babysitter", icon: "👶", description: "Childcare services" },
  { name: "Painter", nameBn: "পেইন্টার", slug: "painter", icon: "🎨", description: "Painting services" },
  { name: "Mason", nameBn: "রাজমিস্ত্রি", slug: "mason", icon: "🧱", description: "Masonry and construction" },
  { name: "Delivery Helper", nameBn: "ডেলিভারি হেল্পার", slug: "delivery-helper", icon: "🚚", description: "Delivery and courier" },
  { name: "Tube-well Mechanic", nameBn: "টিউবওয়েল মেকানিক", slug: "tubewell-mechanic", icon: "💧", description: "Tube-well installation and repair" },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Seed categories
    const CategoryModel = mongoose.model("Category", new mongoose.Schema({
      name: String, nameBn: String, slug: String, icon: String,
      description: String, isActive: { type: Boolean, default: true },
      workerCount: { type: Number, default: 0 },
    }, { timestamps: true }));

    await CategoryModel.deleteMany({});
    const cats = await CategoryModel.insertMany(categories);
    console.log(`Seeded ${cats.length} categories`);

    // Seed admin user
    const UserModel = mongoose.model("User", new mongoose.Schema({
      name: String, email: String, phone: String, password: String,
      role: String, isActive: { type: Boolean, default: true },
      isBanned: { type: Boolean, default: false },
      verificationLevel: { type: String, default: "none" },
      isVerified: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      completedJobs: { type: Number, default: 0 },
      featured: { type: Boolean, default: false },
    }, { timestamps: true }));

    await UserModel.deleteMany({});
    const adminPassword = await bcrypt.hash("admin123", 12);
    await UserModel.create({
      name: "Admin",
      email: "admin@fixersbd.com",
      phone: "01700000000",
      password: adminPassword,
      role: "admin",
      isVerified: true,
      verificationLevel: "trusted_pro",
    });
    console.log("Seeded admin user (admin@fixersbd.com / admin123)");

    // Seed sample workers
    const workerPassword = await bcrypt.hash("worker123", 12);
    const sampleWorkers = [
      { name: "Rahim Mia", email: "rahim@test.com", phone: "01712345678", occupation: "Electrician", skills: ["Wiring", "Fan Repair", "Switch Installation"], experience: 8, hourlyRate: 300, bio: "Experienced electrician with 8 years of work.", categoryId: cats[0]._id, location: { address: "Mirpur 10", area: "Mirpur", city: "Dhaka", coordinates: { lat: 23.8069, lng: 90.3687 } }, availability: "available", rating: 4.5, totalReviews: 23, completedJobs: 45, isVerified: true, verificationLevel: "full" },
      { name: "Karim Sheikh", email: "karim@test.com", phone: "01812345678", occupation: "Plumber", skills: ["Pipe Fitting", "Leak Repair", "Bathroom"], experience: 5, hourlyRate: 250, bio: "Professional plumber serving Dhaka.", categoryId: cats[1]._id, location: { address: "Dhanmondi 27", area: "Dhanmondi", city: "Dhaka", coordinates: { lat: 23.7465, lng: 90.3760 } }, availability: "available", rating: 4.2, totalReviews: 15, completedJobs: 30, isVerified: true, verificationLevel: "basic" },
      { name: "Jamal Uddin", email: "jamal@test.com", phone: "01912345678", occupation: "AC Technician", skills: ["AC Repair", "AC Installation", "Gas Refill"], experience: 6, hourlyRate: 400, bio: "AC specialist for all brands.", categoryId: cats[3]._id, location: { address: "Gulshan 2", area: "Gulshan", city: "Dhaka", coordinates: { lat: 23.7934, lng: 90.4142 } }, availability: "available", rating: 4.8, totalReviews: 32, completedJobs: 60, isVerified: true, verificationLevel: "trusted_pro" },
    ];

    for (const w of sampleWorkers) {
      await UserModel.create({ ...w, password: workerPassword, role: "worker" });
    }
    console.log("Seeded sample workers");

    // Update category worker counts
    for (const cat of cats) {
      const count = await UserModel.countDocuments({ categoryId: cat._id, role: "worker" });
      await CategoryModel.findByIdAndUpdate(cat._id, { workerCount: count });
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
