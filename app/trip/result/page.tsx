"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import TripResults from "@/components/TripResults";
import type { TripResult, TripFormData } from "@/types";

export default function TripResultPage() {
  const router = useRouter();
  const [tripResult, setTripResult] = useState<TripResult | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tripResult");
    const storedForm = sessionStorage.getItem("tripFormData");
    if (stored && storedForm) {
      setTripResult(JSON.parse(stored));
      setFormData(JSON.parse(storedForm));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!tripResult || !formData) {
    return (
      <div className="min-h-screen bg-[#fff8f2] text-[#1e1b18]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-32">
          <span className="material-symbols-outlined text-4xl animate-spin text-[#9f402d]">progress_activity</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#1e1b18] pb-24">
      <Navbar />
      <main className="flex-1">
        <TripResults tripResult={tripResult} formData={formData} />
      </main>
      <BottomNav />
    </div>
  );
}
