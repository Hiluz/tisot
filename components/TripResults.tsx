"use client";

import { useEffect, useState } from "react";
import type { TripResult, TripFormData, FlightResult, WeeklyFlightSummary } from "@/types";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

const travelerTypeLabels: Record<string, string> = {
  solo: "יחיד",
  couple: "זוג",
  family: "משפחה",
  friends: "חברים",
};

const interestLabels: Record<string, string> = {
  attractions: "אטרקציות",
  nightlife: "חיי לילה",
  food: "אוכל",
  nature: "טבע",
  shopping: "קניות",
  culture: "תרבות",
  beach: "חוף",
  adventure: "הרפתקאות",
};

function formatPrice(n: number): string {
  return `₪${n.toLocaleString("he-IL")}`;
}

const timeIcons: Record<string, string> = {
  morning: "wb_sunny",
  afternoon: "wb_twilight",
  evening: "dark_mode",
};

interface Props {
  tripResult: TripResult;
  formData: TripFormData;
}

export default function TripResults({ tripResult, formData }: Props) {
  const [flights, setFlights] = useState<FlightResult[] | null>(null);
  const [weeklyFlights, setWeeklyFlights] = useState<WeeklyFlightSummary[] | null>(null);
  const [flightsLoading, setFlightsLoading] = useState(true);
  const [flightsEstimate, setFlightsEstimate] = useState(false);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const res = await fetch("/api/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination: formData.destination,
            outboundDate: formData.startDate,
            returnDate: formData.endDate,
            numberOfTravelers: formData.numberOfTravelers,
            flexibleMonth: formData.flexibleDates ? formData.flexibleMonth : undefined,
            days: formData.days,
          }),
        });
        const data = await res.json();
        if (data.isEstimate) setFlightsEstimate(true);
        if (data.type === "flexible") {
          setWeeklyFlights(data.weeks);
        } else {
          setFlights(data.flights);
        }
      } catch {
        // Flight search failed silently
      } finally {
        setFlightsLoading(false);
      }
    }
    fetchFlights();
  }, [formData]);

  const { summary, itinerary, attractions, costBreakdown, tips, foodRecommendations } = tripResult;

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("הקישור הועתק!");
  }

  return (
    <div className="pt-24 max-w-screen-xl mx-auto px-6">
      {/* Hero */}
      <section className="relative h-[400px] rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9f402d] to-[#e2725b]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-8 right-8 text-white text-right">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            מסע ל{tripResult.destination}
          </h2>
          <p className="text-xl opacity-90">{tripResult.days} ימים של הרפתקה</p>
        </div>
        <div className="absolute top-8 left-8 flex gap-2">
          <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/30">
            {tripResult.numberOfTravelers} {travelerTypeLabels[tripResult.travelerType]}
          </span>
          <button
            onClick={handleShare}
            className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm align-middle ml-1">share</span>
            שיתוף
          </button>
        </div>
        <div className="absolute top-8 right-8 flex flex-wrap gap-2">
          {tripResult.interests.map((i) => (
            <span key={i} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20">
              {interestLabels[i]}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Summary */}
          {summary && (
            <section className="bg-white rounded-xl p-6 shadow-sm border border-[#ddc0ba]/20">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-[#9f402d] align-middle ml-2">summarize</span>
                סיכום הטיול
              </h3>
              <p className="text-[#56423e] mb-3">
                {summary.totalAttractions} אטרקציות • {summary.topRestaurants?.length || 0} מסעדות מומלצות
              </p>
              {summary.topHighlights?.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-semibold mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#cb8241]">star</span>
                    חובה לראות
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-[#56423e]">
                    {summary.topHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.costRange && (
                <p className="font-bold text-lg text-[#8d4f11]">
                  טווח עלויות: {formatPrice(summary.costRange.min)} – {formatPrice(summary.costRange.max)}
                </p>
              )}
            </section>
          )}

          {/* Itinerary */}
          {itinerary?.map((day) => (
            <div key={day.dayNumber}>
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="text-[#00677e] text-4xl font-black"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {String(day.dayNumber).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    יום {day.dayNumber}
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { key: "morning", label: "בוקר", text: day.morning, icon: timeIcons.morning, color: "text-yellow-600" },
                  { key: "afternoon", label: "צהריים", text: day.afternoon, icon: timeIcons.afternoon, color: "text-orange-500" },
                  { key: "evening", label: "ערב", text: day.evening, icon: timeIcons.evening, color: "text-blue-400" },
                ].map((slot) => (
                  <div key={slot.key} className="bg-[#f9f2ec] p-6 rounded-xl flex gap-6 items-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className={`material-symbols-outlined ${slot.color}`}>{slot.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#00677e] uppercase tracking-widest">{slot.label}</span>
                      <p className="text-[#56423e] mt-1 leading-relaxed">{slot.text}</p>
                    </div>
                  </div>
                ))}

                {/* Food for this day */}
                {foodRecommendations?.find((f) => f.dayNumber === day.dayNumber) && (() => {
                  const food = foodRecommendations.find((f) => f.dayNumber === day.dayNumber)!;
                  return (
                    <div className="bg-[#f9f2ec] p-6 rounded-xl">
                      <h4 className="text-sm font-bold text-[#8d4f11] mb-3 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">restaurant</span>
                        המלצות אוכל
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white/50 p-3 rounded-lg">
                          <span className="text-xs text-[#56423e] block">ארוחת בוקר</span>
                          <span className="font-bold text-sm">{food.breakfast.name}</span>
                          <span className="text-xs text-[#8d4f11] block">{formatPrice(food.breakfast.price)}</span>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <span className="text-xs text-[#56423e] block">ארוחת צהריים</span>
                          <span className="font-bold text-sm">{food.lunch.name}</span>
                          <span className="text-xs text-[#8d4f11] block">{formatPrice(food.lunch.price)}</span>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <span className="text-xs text-[#56423e] block">ארוחת ערב</span>
                          <span className="font-bold text-sm">{food.dinner.name}</span>
                          <span className="text-xs text-[#8d4f11] block">{formatPrice(food.dinner.price)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Map */}
          {attractions && attractions.length > 0 && attractions.some((a) => a.lat && a.lng) && (
            <div className="bg-[#f3ede7] p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>מפת המסלול</h4>
                <span className="material-symbols-outlined text-[#00677e]">map</span>
              </div>
              <TripMap attractions={attractions} />
            </div>
          )}

          {/* Budget Summary */}
          {costBreakdown && (
            <div className="bg-[#8d4f11]/10 p-6 rounded-xl space-y-4">
              <h4 className="font-bold text-[#8d4f11]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                סיכום תקציב
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <span className="text-xs text-[#56423e] block mb-1">לינה</span>
                  <span className="font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatPrice(costBreakdown.accommodation.central.total)}
                  </span>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <span className="text-xs text-[#56423e] block mb-1">אוכל</span>
                  <span className="font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatPrice(costBreakdown.food.midRange.total)}
                  </span>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <span className="text-xs text-[#56423e] block mb-1">פעילויות</span>
                  <span className="font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatPrice(costBreakdown.activities.total)}
                  </span>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <span className="text-xs text-[#56423e] block mb-1">תחבורה</span>
                  <span className="font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {formatPrice(costBreakdown.transport.total)}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-[#8d4f11]/20 flex justify-between items-center">
                <span className="font-bold">סה&quot;כ מוערך</span>
                <span
                  className="text-2xl font-black text-[#8d4f11]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {formatPrice(costBreakdown.combos.centralMid)}
                </span>
              </div>
            </div>
          )}

          {/* Flights */}
          <div className="bg-white p-6 rounded-xl border border-[#ddc0ba]/20 shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="material-symbols-outlined text-[#00677e]">flight</span>
              טיסות
              {flightsEstimate && (
                <span className="text-xs font-normal text-[#56423e] bg-[#eee7e1] px-2 py-0.5 rounded-full">הערכה</span>
              )}
            </h4>
            {flightsLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-[#9f402d] ml-2">progress_activity</span>
                <span className="text-[#56423e]">מחפשים טיסות...</span>
              </div>
            ) : weeklyFlights ? (
              <div className="space-y-3">
                {weeklyFlights.map((week) => (
                  <div
                    key={week.weekNumber}
                    className={`rounded-xl border p-4 ${
                      week.isCheapest ? "border-green-500 bg-green-50" : "border-[#ddc0ba]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">שבוע {week.weekNumber}</span>
                        {week.isCheapest && (
                          <span className="mr-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            הכי זול!
                          </span>
                        )}
                        <p className="text-xs text-[#56423e]">{week.dateRange}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatPrice(week.avgPricePerPerson)}</p>
                        <p className="text-xs text-[#56423e]">לאדם</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : flights && flights.length > 0 ? (
              <div className="space-y-3">
                {flights.map((f, i) => (
                  <div key={i} className="rounded-xl border border-[#ddc0ba]/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{f.airline}</p>
                        <p className="text-xs text-[#56423e]">
                          {f.stops === 0 ? "ישירה" : `${f.stops} עצירות`}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatPrice(f.pricePerPerson)}</p>
                        <p className="text-xs text-[#56423e]">לאדם</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[#56423e]">לא נמצאו טיסות</p>
            )}
          </div>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="bg-[#f9f2ec] p-6 rounded-xl">
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className="material-symbols-outlined text-[#cb8241]">tips_and_updates</span>
                טיפים חשובים
              </h4>
              <ul className="space-y-2 text-sm text-[#56423e]">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="material-symbols-outlined text-sm text-[#cb8241] mt-0.5 shrink-0">check_circle</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
