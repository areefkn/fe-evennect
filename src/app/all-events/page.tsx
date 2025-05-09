"use client";
import CardEvents from "@/components/CardEvents";
import HomeMain from "@/pages/home-page";
import React from "react";

export default function EventsPage() {
  return (
    <>
      {/* TEST DUMMY */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <HomeMain/>
        </div>
      </div>
    </>
  );
}

{/* <CardEvents
  title="Festival Kain Tradisional"
  date="10 Agustus 2025"
  price={25000}
  imageUrl="https://assets.loket.com/neo/production/images/banner/IiSCk_1746179336727780.png"
  organizerName="Baraya Tailor"
  organizerLogo="/images/logo-baraya.png"
  href="/event/festival-kain"
/> */}