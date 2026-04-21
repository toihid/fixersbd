import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fixersbd";

const CategorySchema = new mongoose.Schema({
  name: String, nameBn: String, slug: String, icon: String,
  description: String, isActive: { type: Boolean, default: true },
  workerCount: { type: Number, default: 0 },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: String, phone: String, password: String,
  role: String, avatar: String,
  location: { address: String, area: String, city: String, coordinates: { lat: Number, lng: Number } },
  isActive: { type: Boolean, default: true }, isBanned: { type: Boolean, default: false },
  occupation: String, skills: [String], experience: Number, hourlyRate: Number,
  bio: String, availability: String, categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  nidNumber: String, nidPhoto: String,
  verificationLevel: { type: String, default: "none" },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }, totalReviews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 }, featured: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: String, agreedPrice: Number,
  status: { type: String, default: "pending" },
  completedAt: Date,
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  rating: Number, comment: String,
  isVerified: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

// 2 workers per category — 28 workers total
const workersByCategory: Record<string, { name: string; email: string; phone: string; skills: string[]; experience: number; hourlyRate: number; bio: string; area: string; lat: number; lng: number; rating: number; reviews: number; jobs: number; verification: string; verified: boolean; available: string; featured: boolean }[]> = {
  "Electrician": [
    { name: "Rahim Mia", email: "rahim.elec@test.com", phone: "01712345001", skills: ["Wiring", "Fan Repair", "Switch Installation", "Meter Setup"], experience: 8, hourlyRate: 300, bio: "8 years experienced electrician. Expert in house wiring, fan repair, and all electrical work in Dhaka.", area: "Mirpur", lat: 23.8069, lng: 90.3687, rating: 4.5, reviews: 23, jobs: 45, verification: "full", verified: true, available: "available", featured: true },
    { name: "Sohel Ahmed", email: "sohel.elec@test.com", phone: "01712345002", skills: ["Generator Repair", "Solar Panel", "Industrial Wiring"], experience: 12, hourlyRate: 450, bio: "Senior electrician specializing in generator and solar panel installation. Serving Uttara and nearby areas.", area: "Uttara", lat: 23.8759, lng: 90.3795, rating: 4.8, reviews: 41, jobs: 78, verification: "trusted_pro", verified: true, available: "available", featured: true },
  ],
  "Plumber": [
    { name: "Karim Sheikh", email: "karim.plumb@test.com", phone: "01812345001", skills: ["Pipe Fitting", "Leak Repair", "Bathroom Fitting", "Water Heater"], experience: 5, hourlyRate: 250, bio: "Professional plumber serving Dhanmondi and surrounding areas. Quick response guaranteed.", area: "Dhanmondi", lat: 23.7465, lng: 90.3760, rating: 4.2, reviews: 15, jobs: 30, verification: "basic", verified: true, available: "available", featured: false },
    { name: "Babul Hossain", email: "babul.plumb@test.com", phone: "01812345002", skills: ["Sewage Repair", "Tap Installation", "Toilet Repair", "Drain Cleaning"], experience: 10, hourlyRate: 350, bio: "Expert plumber with 10 years experience. Specializing in sewage and drainage systems.", area: "Mohammadpur", lat: 23.7662, lng: 90.3588, rating: 4.6, reviews: 28, jobs: 55, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Carpenter": [
    { name: "Abdul Malek", email: "malek.carp@test.com", phone: "01912345001", skills: ["Furniture Making", "Door Repair", "Cabinet Work", "Wood Polish"], experience: 15, hourlyRate: 400, bio: "Master carpenter with 15 years of furniture making experience. Custom designs available.", area: "Jatrabari", lat: 23.7104, lng: 90.4348, rating: 4.7, reviews: 35, jobs: 62, verification: "trusted_pro", verified: true, available: "available", featured: true },
    { name: "Rafiq Uddin", email: "rafiq.carp@test.com", phone: "01912345002", skills: ["Window Frame", "Shelf Making", "Table Repair", "Bed Frame"], experience: 6, hourlyRate: 280, bio: "Skilled carpenter for all home furniture needs. Affordable rates and quality work.", area: "Banani", lat: 23.7937, lng: 90.4066, rating: 4.1, reviews: 12, jobs: 22, verification: "basic", verified: true, available: "busy", featured: false },
  ],
  "AC Technician": [
    { name: "Jamal Uddin", email: "jamal.ac@test.com", phone: "01612345001", skills: ["AC Repair", "AC Installation", "Gas Refill", "Compressor Fix"], experience: 6, hourlyRate: 400, bio: "AC specialist for all brands — Samsung, Gree, General. Fast service in Gulshan area.", area: "Gulshan", lat: 23.7934, lng: 90.4142, rating: 4.8, reviews: 32, jobs: 60, verification: "trusted_pro", verified: true, available: "available", featured: true },
    { name: "Nasir Hasan", email: "nasir.ac@test.com", phone: "01612345002", skills: ["Refrigerator Repair", "Deep Freezer", "AC Cleaning", "Duct Work"], experience: 4, hourlyRate: 350, bio: "Cooling system expert. AC and refrigerator repair at your doorstep.", area: "Bashundhara", lat: 23.8139, lng: 90.4312, rating: 4.3, reviews: 18, jobs: 35, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Car Mechanic": [
    { name: "Faruk Islam", email: "faruk.car@test.com", phone: "01512345001", skills: ["Engine Repair", "Brake Service", "Oil Change", "AC Repair"], experience: 9, hourlyRate: 500, bio: "Experienced car mechanic. All brands serviced — Toyota, Honda, Nissan. Tejgaon workshop.", area: "Tejgaon", lat: 23.7590, lng: 90.3928, rating: 4.6, reviews: 27, jobs: 50, verification: "full", verified: true, available: "available", featured: false },
    { name: "Milon Das", email: "milon.car@test.com", phone: "01512345002", skills: ["Tire Change", "Battery Service", "Suspension", "Gear Box"], experience: 7, hourlyRate: 450, bio: "Car repair specialist. Home service available for minor repairs. Serving Motijheel area.", area: "Motijheel", lat: 23.7330, lng: 90.4178, rating: 4.4, reviews: 20, jobs: 38, verification: "basic", verified: true, available: "available", featured: false },
  ],
  "Motorcycle Mechanic": [
    { name: "Rubel Khan", email: "rubel.bike@test.com", phone: "01312345001", skills: ["Engine Tuning", "Chain Adjustment", "Kick Start Fix", "Oil Change"], experience: 5, hourlyRate: 200, bio: "Bike mechanic expert. Honda, Yamaha, Bajaj — all brands. Quick roadside service.", area: "Farmgate", lat: 23.7571, lng: 90.3879, rating: 4.3, reviews: 19, jobs: 40, verification: "basic", verified: true, available: "available", featured: false },
    { name: "Sumon Sarker", email: "sumon.bike@test.com", phone: "01312345002", skills: ["Brake Repair", "Carburetor", "Electrical Fix", "Body Work"], experience: 8, hourlyRate: 250, bio: "Senior motorcycle mechanic. Specializing in engine overhaul and electrical systems.", area: "Shyamoli", lat: 23.7741, lng: 90.3654, rating: 4.5, reviews: 25, jobs: 48, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Daily Worker": [
    { name: "Harun Mia", email: "harun.daily@test.com", phone: "01412345001", skills: ["Loading", "Unloading", "House Shifting", "Cleaning"], experience: 3, hourlyRate: 150, bio: "Hardworking daily laborer. Available for house shifting, loading, and general help.", area: "Kamrangirchar", lat: 23.7250, lng: 90.3830, rating: 4.0, reviews: 10, jobs: 25, verification: "basic", verified: true, available: "available", featured: false },
    { name: "Alamgir Kabir", email: "alamgir.daily@test.com", phone: "01412345002", skills: ["Gardening", "Moving Help", "Warehouse Work", "Event Setup"], experience: 5, hourlyRate: 180, bio: "Reliable helper for any daily work. Experienced in event setup and warehouse management.", area: "Keraniganj", lat: 23.6980, lng: 90.3460, rating: 4.2, reviews: 14, jobs: 32, verification: "none", verified: false, available: "available", featured: false },
  ],
  "Cleaner": [
    { name: "Ruma Begum", email: "ruma.clean@test.com", phone: "01712345010", skills: ["House Cleaning", "Office Cleaning", "Deep Clean", "Sanitization"], experience: 4, hourlyRate: 200, bio: "Professional cleaner for homes and offices. Eco-friendly products used. Punctual and thorough.", area: "Lalmatia", lat: 23.7530, lng: 90.3680, rating: 4.4, reviews: 16, jobs: 33, verification: "full", verified: true, available: "available", featured: false },
    { name: "Salma Akter", email: "salma.clean@test.com", phone: "01712345011", skills: ["Kitchen Cleaning", "Bathroom Cleaning", "Carpet Wash", "Window Cleaning"], experience: 6, hourlyRate: 220, bio: "Experienced cleaning professional. Specializing in deep cleaning and post-construction cleanup.", area: "Mirpur DOHS", lat: 23.8340, lng: 90.3670, rating: 4.6, reviews: 22, jobs: 44, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Cook": [
    { name: "Fatema Khatun", email: "fatema.cook@test.com", phone: "01812345010", skills: ["Bengali Cuisine", "Biryani", "Catering", "Party Food"], experience: 10, hourlyRate: 300, bio: "Expert cook specializing in traditional Bengali cuisine and biryani. Available for events and daily cooking.", area: "Old Dhaka", lat: 23.7200, lng: 90.4010, rating: 4.7, reviews: 30, jobs: 55, verification: "trusted_pro", verified: true, available: "available", featured: true },
    { name: "Monira Begum", email: "monira.cook@test.com", phone: "01812345011", skills: ["Chinese Food", "Fast Food", "Desserts", "Meal Prep"], experience: 7, hourlyRate: 280, bio: "Versatile cook — Bengali, Chinese, and continental. Weekly meal prep service available.", area: "Wari", lat: 23.7150, lng: 90.4100, rating: 4.3, reviews: 17, jobs: 30, verification: "basic", verified: true, available: "busy", featured: false },
  ],
  "Babysitter": [
    { name: "Nasima Akter", email: "nasima.baby@test.com", phone: "01912345010", skills: ["Infant Care", "Toddler Care", "Homework Help", "First Aid"], experience: 8, hourlyRate: 250, bio: "Caring and experienced babysitter. First aid trained. Available for full-day and part-time care.", area: "Gulshan", lat: 23.7900, lng: 90.4150, rating: 4.8, reviews: 26, jobs: 48, verification: "trusted_pro", verified: true, available: "available", featured: true },
    { name: "Taslima Begum", email: "taslima.baby@test.com", phone: "01912345011", skills: ["Child Care", "Cooking for Kids", "School Pickup", "Night Care"], experience: 5, hourlyRate: 200, bio: "Reliable babysitter with experience in child care. School pickup and drop-off service included.", area: "Banani", lat: 23.7940, lng: 90.4030, rating: 4.4, reviews: 15, jobs: 28, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Painter": [
    { name: "Shahidul Islam", email: "shahid.paint@test.com", phone: "01612345010", skills: ["Wall Painting", "Whitewash", "Texture Paint", "Waterproofing"], experience: 11, hourlyRate: 350, bio: "Professional painter with 11 years experience. Interior and exterior painting. Free color consultation.", area: "Uttara", lat: 23.8700, lng: 90.3800, rating: 4.5, reviews: 24, jobs: 42, verification: "full", verified: true, available: "available", featured: false },
    { name: "Billal Hossain", email: "billal.paint@test.com", phone: "01612345011", skills: ["Spray Paint", "Wood Polish", "Enamel Paint", "Primer Coat"], experience: 6, hourlyRate: 280, bio: "Affordable painting service. Specializing in apartment painting and wood finishing.", area: "Mohakhali", lat: 23.7780, lng: 90.4050, rating: 4.2, reviews: 13, jobs: 24, verification: "basic", verified: true, available: "available", featured: false },
  ],
  "Mason": [
    { name: "Mokbul Hossain", email: "mokbul.mason@test.com", phone: "01512345010", skills: ["Brick Work", "Plastering", "Tile Setting", "Concrete Work"], experience: 14, hourlyRate: 400, bio: "Master mason with 14 years in construction. Expert in tile work and plastering. Large project experience.", area: "Badda", lat: 23.7800, lng: 90.4260, rating: 4.6, reviews: 29, jobs: 52, verification: "trusted_pro", verified: true, available: "available", featured: false },
    { name: "Aziz Mia", email: "aziz.mason@test.com", phone: "01512345011", skills: ["Foundation Work", "Wall Building", "Renovation", "Waterproofing"], experience: 9, hourlyRate: 350, bio: "Experienced mason for home renovation and new construction. Quality work at fair prices.", area: "Rampura", lat: 23.7650, lng: 90.4230, rating: 4.3, reviews: 18, jobs: 35, verification: "full", verified: true, available: "busy", featured: false },
  ],
  "Delivery Helper": [
    { name: "Ripon Mia", email: "ripon.delivery@test.com", phone: "01312345010", skills: ["Parcel Delivery", "Document Delivery", "Food Delivery", "Same Day"], experience: 3, hourlyRate: 150, bio: "Fast and reliable delivery helper. Bike delivery across Dhaka. Same-day service available.", area: "Mirpur", lat: 23.8100, lng: 90.3700, rating: 4.1, reviews: 11, jobs: 28, verification: "basic", verified: true, available: "available", featured: false },
    { name: "Jewel Ahmed", email: "jewel.delivery@test.com", phone: "01312345011", skills: ["Heavy Parcel", "Furniture Delivery", "Office Shifting", "Pickup Service"], experience: 5, hourlyRate: 200, bio: "Delivery and shifting expert. Van and truck available for large items. Serving all of Dhaka.", area: "Tongi", lat: 23.8780, lng: 90.4010, rating: 4.4, reviews: 19, jobs: 38, verification: "full", verified: true, available: "available", featured: false },
  ],
  "Tube-well Mechanic": [
    { name: "Shafiq Uddin", email: "shafiq.tube@test.com", phone: "01412345010", skills: ["Tube-well Installation", "Pump Repair", "Boring", "Motor Fix"], experience: 12, hourlyRate: 350, bio: "Tube-well specialist with 12 years experience. Installation, repair, and boring services.", area: "Savar", lat: 23.8585, lng: 90.2567, rating: 4.5, reviews: 20, jobs: 40, verification: "full", verified: true, available: "available", featured: false },
    { name: "Hanif Molla", email: "hanif.tube@test.com", phone: "01412345011", skills: ["Submersible Pump", "Water Filter", "Pipeline", "Well Digging"], experience: 8, hourlyRate: 300, bio: "Water system expert. Submersible pump installation and repair. Serving Dhaka outskirts.", area: "Gazipur", lat: 23.9906, lng: 90.4245, rating: 4.3, reviews: 14, jobs: 28, verification: "basic", verified: true, available: "available", featured: false },
  ],
};

// Sample customers
const customers = [
  { name: "Tanvir Rahman", email: "tanvir@test.com", phone: "01711111001" },
  { name: "Nusrat Jahan", email: "nusrat@test.com", phone: "01711111002" },
  { name: "Imran Hossain", email: "imran@test.com", phone: "01711111003" },
  { name: "Ayesha Siddika", email: "ayesha@test.com", phone: "01711111004" },
  { name: "Shakib Al Hasan", email: "shakib@test.com", phone: "01711111005" },
];

const reviewComments = [
  "Very professional and on time. Highly recommended!",
  "Did a great job. Will hire again for sure.",
  "Good work but took a bit longer than expected.",
  "Excellent service! Very skilled and polite.",
  "Fair price and quality work. Satisfied with the result.",
  "Came on time, fixed the issue quickly. Very happy!",
  "Knows the work well. Cleaned up after finishing too.",
  "Decent work. Could improve communication a bit.",
  "Outstanding! Best worker I have hired so far.",
  "Reliable and trustworthy. My go-to person now.",
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
    const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing data");

    const password = await bcrypt.hash("password123", 12);

    // Create admin
    const admin = await User.create({
      name: "Admin", email: "admin@fixersbd.com", phone: "01700000000",
      password, role: "admin", isVerified: true, verificationLevel: "trusted_pro",
      location: { address: "FixersBD HQ", area: "Gulshan", city: "Dhaka", coordinates: { lat: 23.7934, lng: 90.4142 } },
    });
    console.log("Created admin: admin@fixersbd.com / password123");

    // Create customers
    const customerDocs = [];
    for (const c of customers) {
      const doc = await User.create({
        ...c, password, role: "customer",
        location: { address: "Dhaka", area: "Dhanmondi", city: "Dhaka", coordinates: { lat: 23.74 + Math.random() * 0.1, lng: 90.36 + Math.random() * 0.1 } },
      });
      customerDocs.push(doc);
    }
    console.log(`Created ${customerDocs.length} customers`);

    // Create workers per category
    const allCategories = await Category.find({});
    const catMap: Record<string, any> = {};
    for (const cat of allCategories) {
      catMap[cat.name] = cat;
    }

    const workerDocs: any[] = [];
    for (const [catName, workers] of Object.entries(workersByCategory)) {
      const cat = catMap[catName];
      if (!cat) { console.log(`Category not found: ${catName}`); continue; }

      for (const w of workers) {
        const doc = await User.create({
          name: w.name, email: w.email, phone: w.phone, password,
          role: "worker", occupation: catName, skills: w.skills,
          experience: w.experience, hourlyRate: w.hourlyRate, bio: w.bio,
          availability: w.available, categoryId: cat._id,
          location: { address: `${w.area}, Dhaka`, area: w.area, city: "Dhaka", coordinates: { lat: w.lat, lng: w.lng } },
          rating: w.rating, totalReviews: w.reviews, completedJobs: w.jobs,
          verificationLevel: w.verification, isVerified: w.verified, featured: w.featured,
        });
        workerDocs.push(doc);
      }
    }
    console.log(`Created ${workerDocs.length} workers across ${Object.keys(workersByCategory).length} categories`);

    // Create jobs and reviews
    let jobCount = 0;
    let reviewCount = 0;
    for (const worker of workerDocs) {
      // Create 2-4 completed jobs per worker with reviews
      const numJobs = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numJobs; i++) {
        const customer = customerDocs[Math.floor(Math.random() * customerDocs.length)];
        const job = await Job.create({
          customerId: customer._id, workerId: worker._id, categoryId: worker.categoryId,
          description: `${worker.occupation} service needed`,
          agreedPrice: worker.hourlyRate * (1 + Math.floor(Math.random() * 4)),
          status: "completed", completedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        });
        jobCount++;

        // Add review for each completed job
        const rating = Math.max(3, Math.min(5, Math.round(worker.rating + (Math.random() - 0.5))));
        await Review.create({
          customerId: customer._id, workerId: worker._id, jobId: job._id,
          rating, comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        });
        reviewCount++;
      }

      // Create 1 active job per worker
      const activeCustomer = customerDocs[Math.floor(Math.random() * customerDocs.length)];
      const statuses = ["pending", "deal_final", "in_progress"];
      await Job.create({
        customerId: activeCustomer._id, workerId: worker._id, categoryId: worker.categoryId,
        description: `Need ${worker.occupation} service`,
        agreedPrice: worker.hourlyRate * 2,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
      jobCount++;
    }
    console.log(`Created ${jobCount} jobs and ${reviewCount} reviews`);

    // Update category worker counts
    for (const cat of allCategories) {
      const count = await User.countDocuments({ categoryId: cat._id, role: "worker" });
      await Category.findByIdAndUpdate(cat._id, { workerCount: count });
    }
    console.log("Updated category worker counts");

    console.log("\n--- SEED COMPLETE ---");
    console.log(`Admin:     admin@fixersbd.com / password123`);
    console.log(`Customers: tanvir@test.com, nusrat@test.com, etc. / password123`);
    console.log(`Workers:   rahim.elec@test.com, karim.plumb@test.com, etc. / password123`);
    console.log(`Total:     1 admin, ${customerDocs.length} customers, ${workerDocs.length} workers, ${jobCount} jobs, ${reviewCount} reviews`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
