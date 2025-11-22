// src/components/Navbar.tsx
import React, { Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../state/languageStore";
import { useAuthStore } from "../state/useAuth";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkBase =
    "text-sm font-medium transition border-b-2 border-transparent hover:border-blue-500 pb-1";

  return (
    <nav className="backdrop-blur bg-white/80 border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent"
        >
          CaseFlow
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/cases"
            className={`${navLinkBase} ${
              location.pathname.includes("cases") ? "border-blue-600" : ""
            }`}
          >
            <span className="font-semibold"> {t("navbar.cases")}</span>
          </Link>

          {/* Language Selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded hover:bg-gray-50 transition">
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-28 bg-white shadow-md border rounded-lg py-1">
                <Menu.Item>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      language === "en" ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    English
                  </button>
                </Menu.Item>

                <Menu.Item>
                  <button
                    onClick={() => setLanguage("hi")}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      language === "hi" ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    हिंदी
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-50 transition">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center font-semibold overflow-hidden">
                {user?.email ? (
                  <span className="text-black text-xs truncate whitespace-nowrap">
                    {user.email.split("@")[0]}
                  </span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="w-6 h-6 text-gray-700"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 20c1.5-4 5-6 6.5-6s5 2 6.5 6" />
                  </svg>
                )}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-lg p-1">
                <Menu.Item>
                  <div className="px-3 py-2 text-sm text-gray-600 border-b overflow-hidden whitespace-nowrap truncate">
                    {user?.email}
                  </div>
                </Menu.Item>

                <Menu.Item>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                  >
                    {t("navbar.logout")}
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Mobile Menu */}
        <Menu as="div" className="md:hidden relative">
          <Menu.Button className="p-2 rounded hover:bg-gray-100 transition">
            ☰
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-12 w-44 bg-white shadow-md border rounded-lg p-2 space-y-1">
              <Menu.Item>
                <Link
                  to="/cases"
                  className="block px-3 py-2 rounded hover:bg-gray-100"
                >
                  {t("navbar.cases")}
                </Link>
              </Menu.Item>

              {/* Language Selector Mobile */}
              <Menu.Item>
                <div className="px-2">
                  <label className="text-xs text-gray-600">
                    {t("navbar.language")}
                  </label>
                  <select
                    className="w-full border px-2 py-2 rounded mt-1"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                  </select>
                </div>
              </Menu.Item>

              {/* Logout */}
              <Menu.Item>
                <button
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
                  onClick={handleLogout}
                >
                  {t("navbar.logout")}
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
}
