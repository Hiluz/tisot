"use client";

import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const SAMPLE_TRIPS = [
  {
    id: 1,
    title: "חופשה רומנטית בוונציה",
    dates: "12-18 באוקטובר",
    travelers: 2,
    status: "בקרוב",
    statusColor: "#9f402d",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0_R03hNVNDheLLH0eHBikP-LHvN18r_aeMCfqWZiyIgDXMgYkcanGkO30_Wc_1ffhkzwhef3cWsRqYmXXqxnmjdeper12BtbAeGzypETcL6X4YvNi4EPQhDOMEHiJEzWHwEBZtBaeGcT49s8p7Waq3IaQA5bq9iEbNp5mqD26g6BczZ3CNWvDNFwrOJu_SUMhHBEDI4h_W4PINmhx2rJO4d-LuLB-MgCyB6XTBtshIeFMs3Hac45BY_2C_70pUw8vl5xsN2TeFZRz",
  },
  {
    id: 2,
    title: "מסע קולינרי בהודו",
    dates: "05-20 בדצמבר",
    travelers: 4,
    status: "בתכנון",
    statusColor: "#00677e",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvkqa5d3294pZmXl2Pd8F6MELRmVrAMkJEDbr473taaj5E1ilq6CYblgfdhsUwr2-rq21LCZEorO9-zsyvTHUDKkJCNrrPz-4PbETvnqapjy4xqEdxjtf3J_Ej0psw1eRT4GLruQQchhCn9-IAfBkq31TszEuuD11JucHE75mPHphinzK4gGpHFZc8nLBlwfY_wl6SZ5Y-caiEJO6hixzns71O8CpGsxv4j7MkxC11YUh70rHxh9of7peak1dD5qV8op6l_0vU1sXl",
  },
];

export default function MyTripsPage() {
  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#1e1b18] pb-24">
      <Navbar />
      <main className="pt-24 px-6 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            הטיולים שלי
          </h1>
          <Link
            href="/new-trip"
            className="bg-gradient-to-r from-[#9f402d] to-[#e2725b] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#9f402d]/20 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            טיול חדש
          </Link>
        </div>

        {SAMPLE_TRIPS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SAMPLE_TRIPS.map((trip) => (
              <div key={trip.id} className="relative flex flex-col group cursor-pointer">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg shadow-stone-200/50">
                  <img
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={trip.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{ color: trip.statusColor }}
                  >
                    {trip.status}
                  </div>
                </div>
                <div className="mt-[-40px] relative z-10 bg-white mx-6 p-6 rounded-xl shadow-xl shadow-stone-200/20">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#56423e]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {trip.dates}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">group</span>
                      {trip.travelers} נוסעים
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new trip card */}
            <Link
              href="/new-trip"
              className="flex flex-col items-center justify-center h-80 rounded-xl border-2 border-dashed border-[#9f402d]/30 bg-[#9f402d]/5 hover:bg-[#9f402d]/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-5xl text-[#9f402d] mb-4">add_circle</span>
              <span className="text-lg font-bold text-[#9f402d]">תכננו טיול חדש</span>
              <span className="text-sm text-[#56423e] mt-1">הגדירו יעד, תאריכים ותקציב</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#56423e]/40 mb-4">flight</span>
            <p className="text-[#56423e] mb-6 text-lg">עדיין אין טיולים שמורים. תכננו טיול חדש!</p>
            <Link
              href="/new-trip"
              className="bg-gradient-to-r from-[#9f402d] to-[#e2725b] text-white px-8 py-3 rounded-full font-bold shadow-lg"
            >
              תכננו טיול
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
