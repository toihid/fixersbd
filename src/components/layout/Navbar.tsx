"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useLangStore } from "@/store/lang-store";
import { useTheme } from "next-themes";
import { LangToggle } from "@/components/ui/LangToggle";
import {
  Menu, X, Sun, Moon, User, LogOut, Heart, Bell, Briefcase, Shield,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { t } = useLangStore();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Fixers<span className="text-brand-500">BD</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors text-sm font-medium">
              {t("nav.findWorkers")}
            </Link>
            <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors text-sm font-medium">
              {t("nav.categories")}
            </Link>
            {user?.role === "worker" && (
              <Link href="/dashboard/worker" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors text-sm font-medium">
                {t("nav.myDashboard")}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle />
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link href="/favorites" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:block" aria-label="Favorites">
                  <Heart size={18} />
                </Link>
                <Link href="/notifications" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:block" aria-label="Notifications">
                  <Bell size={18} />
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
                      <User size={16} className="text-brand-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.name?.split(" ")[0]}
                    </span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                        <Briefcase size={16} /> {t("nav.dashboard")}
                      </Link>
                      <Link href="/favorites" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 sm:hidden" onClick={() => setProfileOpen(false)}>
                        <Heart size={16} /> {t("nav.favorites")}
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                          <Shield size={16} /> {t("nav.adminPanel")}
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 w-full">
                        <LogOut size={16} /> {t("nav.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-500 transition-colors">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="text-sm font-medium bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                  {t("nav.signup")}
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-slide-up">
            <div className="flex flex-col gap-2">
              <Link href="/search" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
                {t("nav.findWorkers")}
              </Link>
              <Link href="/categories" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
                {t("nav.categories")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
