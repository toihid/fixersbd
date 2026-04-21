import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-lg font-bold">
                Fixers<span className="text-brand-500">BD</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your trusted local worker marketplace in Bangladesh. Find verified
              skilled workers near you.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/search" className="hover:text-brand-500">Find Workers</Link></li>
              <li><Link href="/categories" className="hover:text-brand-500">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-500">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">For Workers</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/register?role=worker" className="hover:text-brand-500">Join as Worker</Link></li>
              <li><Link href="/verification" className="hover:text-brand-500">Get Verified</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-brand-500">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FixersBD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
