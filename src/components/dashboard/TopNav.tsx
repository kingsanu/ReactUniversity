import { useState } from "react";
import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TopNav() {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  console.log("TopNav rendered with translations");

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <nav className="space-x-4 text-gray-600">
        {[
          t("nav.dashboard"),
          t("nav.analytics"),
          t("nav.careerPaths"),
          t("nav.jobs"),
          t("nav.community"),
        ].map((item) => (
          <a
            key={item}
            href="#"
            className={cn("text-sm font-medium hover:text-gray-900")}
          >
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-1 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <FiBell className="text-xl text-gray-600 hover:text-gray-900 cursor-pointer transition" />
        <div className="border-l border-gray-300 h-6 mx-2"></div>
        <FiUser className="text-2xl text-gray-600 hover:text-gray-900 cursor-pointer transition" />
      </div>
    </header>
  );
}
