"use client";
import Link from "next/link";
import { useLangStore } from "@/store/lang-store";

export function Footer() {
  const { t } = useLangStore();

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
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("footer.forCustomers")}</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/search" className="hover:text-brand-500">{t("footer.findWorkers")}</Link></li>
              <li><Link href="/categories" className="hover:text-brand-500">{t("nav.categories")}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-brand-500">{t("footer.howItWorks")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("footer.forWorkers")}</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/register?role=worker" className="hover:text-brand-500">{t("footer.joinAsWorker")}</Link></li>
              <li><Link href="/verification" className="hover:text-brand-500">{t("footer.getVerified")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-brand-500">{t("footer.aboutUs")}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500">{t("footer.contact")}</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-500">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-brand-500">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FixersBD. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
