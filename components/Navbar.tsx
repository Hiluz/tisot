"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fff8f2]/80 backdrop-blur-xl shadow-sm shadow-stone-200/50">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-xl mx-auto flex-row-reverse">
        {/* Notifications */}
        <button className="text-[#9f402d] hover:bg-[#f3ede7] transition-colors p-2 rounded-full active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-[#9f402d] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          The Wandering Editorial
        </Link>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e8e1dc] ring-2 ring-[#9f402d]/10">
          <div className="w-full h-full bg-gradient-to-br from-[#e2725b] to-[#9f402d] flex items-center justify-center text-white text-sm font-bold">
            H
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex justify-center gap-8 items-center font-bold pb-2 max-w-screen-xl mx-auto">
        <Link
          href="/"
          className={`px-3 py-1 rounded-lg transition-colors ${
            pathname === "/" ? "text-[#00677e]" : "text-[#56423e] hover:bg-[#f3ede7]"
          }`}
        >
          בית
        </Link>
        <Link
          href="/my-trips"
          className={`px-3 py-1 rounded-lg transition-colors ${
            pathname === "/my-trips" ? "text-[#00677e]" : "text-[#56423e] hover:bg-[#f3ede7]"
          }`}
        >
          הטיולים שלי
        </Link>
        <Link
          href="/new-trip"
          className={`px-3 py-1 rounded-lg transition-colors ${
            pathname === "/new-trip" ? "text-[#00677e]" : "text-[#56423e] hover:bg-[#f3ede7]"
          }`}
        >
          הוסף טיול
        </Link>
      </div>
    </header>
  );
}
