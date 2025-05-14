"use client";

import { useState, useEffect } from "react";
import UserProfile from "./components/UserProfile";
import ProfileSettingForm from "./components/ProfileSettingForm";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "setting">("profile");

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  const menuItems = [
    { key: "profile", label: "User Profile" },
    { key: "setting", label: "Profile Setting" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">Profile Menu</h1>
        </div>
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 p-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(item.key as any)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-8 bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow">
          {activeTab === "profile" && <UserProfile />}
          {activeTab === "setting" && <ProfileSettingForm />}
        </div>
      </main>
    </div>
  );
}
