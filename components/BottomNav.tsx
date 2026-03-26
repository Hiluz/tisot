"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "בית", icon: "home" },
  { href: "/my-trips", label: "הטיולים שלי", icon: "travel_explore" },
  { href: "/new-trip", label: "הוסף טיול", icon: "add_circle" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-3xl bg-[#fff8f2]/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(30,27,24,0.04)]">
      <div className="flex justify-around items-center px-4 pb-6 pt-3 w-full flex-row-reverse">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-transform active:scale-90 duration-150 ${
                isActive
                  ? "text-[#00677e] font-bold scale-110"
                  : "text-[#56423e] opacity-70 hover:opacity-100"
              }`}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] uppercase tracking-wider mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
