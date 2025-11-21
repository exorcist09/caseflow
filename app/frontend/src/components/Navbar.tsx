import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import i18n from "../i18n";
import {Globe} from "lucide-react";
import { useAuthStore } from "../state/useAuth";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold text-blue-400 hover:text-black">
          CaseFlow
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/cases" className="hover:text-blue-600">
            {t("navbar.cases")}
          </Link>

          {/* Language Selector */}
          <select
            className="border rounded px-2 py-1"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <Globe size={16} />
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
              {user?.email ?? "Account"}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-36 bg-white border shadow-md rounded p-1">
                <Menu.Item>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    {t("navbar.logout")}
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        {/* Mobile Hamburger */}
        <Menu as="div" className="md:hidden relative">
          <Menu.Button className="p-2 rounded hover:bg-gray-100">
            ☰
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-10 w-40 bg-white border shadow-md rounded p-2">
              <Menu.Item>
                <Link to="/cases" className="block px-3 py-2 hover:bg-gray-100 rounded">
                  {t("navbar.cases")}
                </Link>
              </Menu.Item>

              <Menu.Item>
                <select
                  className="w-full border rounded px-2 py-2 my-1"
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </Menu.Item>

              <Menu.Item>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
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
