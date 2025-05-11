"use client";

import { useState } from "react";
import MyEvent from "./events-page";
import OrganizerTransactions from "./transactions-page";
import AttendeePage from "./attendee-page";
import StatisticPage from "./detil-page";
import StatisticsChart from "./statistics-page";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "event" | "transaction" | "statistics" | "attendee"
  >("dashboard");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Organizer Menu</h1>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "statistics"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("statistics")}
          >
            Statistics
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "event"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("event")}
          >
            My Event
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "transaction"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("transaction")}
          >
            Transaction
          </button>
          <button
            className={`text-left px-4 py-2 rounded ${
              activeTab === "attendee"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("attendee")}
          >
            Attendee
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">
        {activeTab === "dashboard" && <StatisticPage />}
        {activeTab === "statistics" && <StatisticsChart />}
        {activeTab === "event" && <MyEvent />}
        {activeTab === "transaction" && <OrganizerTransactions />}
        {activeTab === "attendee" && <AttendeePage />}
      </main>
    </div>
  );
}
