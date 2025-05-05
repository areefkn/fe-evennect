import { useState } from "react";
import UserProfile from "./components/UserProfile";
import ProfileSettingForm from "./components/ProfileSettingForm";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "setting">("profile");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Profile Menu</h1>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            User Profile
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "setting"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("setting")}
          >
            Profile Setting
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "setting" && <ProfileSettingForm />}
      </main>
    </div>
  );
}
