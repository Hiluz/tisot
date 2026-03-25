"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TripResults from "@/components/TripResults";
import type { TripResult, TripFormData } from "@/types";
import { Loader2 } from "lucide-react";

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
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <TripResults tripResult={tripResult} formData={formData} />
      </main>
    </div>
  );
}
