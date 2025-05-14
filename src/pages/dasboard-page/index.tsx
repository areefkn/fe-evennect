"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import MyEvent from "./events-page";
import OrganizerTransactions from "./transactions-page";
import AttendeePage from "./attendee-page";
import StatisticPage from "./detil-page";
import StatisticsChart from "./statistics-page";

interface TokenPayload {
  role: string;
  exp: number; // optional, kalau mau check exp
}
export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "event" | "transaction" | "statistics" | "attendee"
  >("dashboard");

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

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      if (decoded.role !== "ORGANIZER") {
        router.push("/");
        return;
      }

      setAuthorized(true);
    } catch (err) {
      router.push("/login");
    }
  }, []);

  if (!authorized) return null;

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "statistics", label: "Statistics" },
    { key: "event", label: "My Event" },
    { key: "transaction", label: "Transaction" },
    { key: "attendee", label: "Attendee" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">Organizer Panel</h1>
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
          {activeTab === "dashboard" && <StatisticPage />}
          {activeTab === "statistics" && <StatisticsChart />}
          {activeTab === "event" && <MyEvent />}
          {activeTab === "transaction" && <OrganizerTransactions />}
          {activeTab === "attendee" && <AttendeePage />}
        </div>
      </main>
    </div>
  );
}
