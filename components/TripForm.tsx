"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TripFormData } from "@/types";

const INTERESTS = [
  { id: "attractions", label: "אטרקציות ואתרים" },
  { id: "nightlife", label: "חיי לילה" },
  { id: "food", label: "אוכל ומסעדות" },
  { id: "nature", label: "טבע וטיולים" },
  { id: "shopping", label: "קניות" },
  { id: "culture", label: "תרבות ומוזיאונים" },
  { id: "beach", label: "חוף וים" },
  { id: "adventure", label: "אקסטרים והרפתקאות" },
];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function getFlexibleMonthOptions(): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
    options.push({ value, label });
  }
  return options;
}

const inputClass =
  "w-full bg-[#eee7e1] border-none rounded-xl py-4 pr-12 pl-4 text-[#1e1b18] focus:ring-2 focus:ring-[#9f402d]/20 focus:bg-white transition-all placeholder:text-[#89726d]/60";

const selectClass =
  "w-full bg-[#eee7e1] border-none rounded-xl py-4 pr-12 pl-4 text-[#1e1b18] focus:ring-2 focus:ring-[#9f402d]/20 focus:bg-white transition-all appearance-none";

export default function TripForm() {
  const router = useRouter();
  const today = formatDate(new Date());
  const defaultStart = addDays(today, 14);

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(5000);
  const [numberOfTravelers, setNumberOfTravelers] = useState(2);
  const [travelerType, setTravelerType] = useState<TripFormData["travelerType"]>("couple");
  const [ageRange, setAgeRange] = useState("25-35");
  const [interests, setInterests] = useState<string[]>([]);
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState(defaultStart);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [flexibleMonth, setFlexibleMonth] = useState(getFlexibleMonthOptions()[0].value);
  const [loading, setLoading] = useState(false);

  const endDate = addDays(startDate, days);

  function toggleInterest(id: string) {
    setInterests((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim() || interests.length === 0) return;

    setLoading(true);

    const formData: TripFormData = {
      destination,
      budget,
      days,
      startDate,
      endDate,
      flexibleDates,
      flexibleMonth,
      numberOfTravelers,
      travelerType,
      ageRange,
      interests,
    };

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to generate trip");

      const tripResult = await res.json();
      sessionStorage.setItem("tripResult", JSON.stringify(tripResult));
      sessionStorage.setItem("tripFormData", JSON.stringify(formData));
      router.push("/trip/result");
    } catch {
      setLoading(false);
      alert("שגיאה ביצירת הטיול. נסו שוב.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Destination */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#56423e] mr-1">לאן נוסעים?</label>
        <div className="relative">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">location_on</span>
          <input
            className={inputClass}
            placeholder="למשל: פירנצה, איטליה"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={flexibleDates}
            onChange={(e) => setFlexibleDates(e.target.checked)}
            className="rounded text-[#9f402d] focus:ring-[#9f402d]"
          />
          <label className="text-sm font-semibold text-[#56423e]">תאריכים גמישים</label>
        </div>

        {flexibleDates ? (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#56423e] mr-1">חודש מועדף</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">calendar_month</span>
              <select
                className={selectClass}
                value={flexibleMonth}
                onChange={(e) => setFlexibleMonth(e.target.value)}
              >
                {getFlexibleMonthOptions().map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#56423e] mr-1">תאריך יציאה</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">calendar_month</span>
                <input
                  className={inputClass}
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#56423e] mr-1">תאריך חזרה</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">event</span>
                <input
                  className={inputClass}
                  type="date"
                  value={endDate}
                  min={addDays(startDate, 1)}
                  onChange={(e) => {
                    const diff = Math.round(
                      (new Date(e.target.value).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (diff >= 1 && diff <= 14) setDays(diff);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#56423e] mr-1">מספר ימים: {days}</label>
          <input
            type="range"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-[#9f402d]"
          />
          <div className="flex justify-between text-xs text-[#56423e]">
            <span>יום 1</span>
            <span>14 ימים</span>
          </div>
        </div>
      </div>

      {/* Travelers & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#56423e] mr-1">מספר מטיילים</label>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">group</span>
            <select
              className={selectClass}
              value={numberOfTravelers}
              onChange={(e) => setNumberOfTravelers(Number(e.target.value))}
            >
              <option value={1}>1 מטייל/ת</option>
              <option value={2}>2 מטיילים</option>
              <option value={3}>3 מטיילים</option>
              <option value={4}>4 מטיילים</option>
              <option value={5}>5+ מטיילים</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#56423e] mr-1">תקציב משוער (₪{budget.toLocaleString()})</label>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#89726d]">payments</span>
            <select
              className={selectClass}
              value={
                budget <= 3000 ? "budget" : budget <= 10000 ? "standard" : budget <= 30000 ? "luxury" : "unlimited"
              }
              onChange={(e) => {
                const map: Record<string, number> = { budget: 3000, standard: 8000, luxury: 20000, unlimited: 50000 };
                setBudget(map[e.target.value]);
              }}
            >
              <option value="budget">חסכוני (₪3,000)</option>
              <option value="standard">סטנדרטי (₪8,000)</option>
              <option value="luxury">יוקרתי (₪20,000)</option>
              <option value="unlimited">ללא הגבלה (₪50,000)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Traveler Type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#56423e] mr-1">סוג טיול</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: "solo", label: "יחיד", icon: "person" },
            { value: "couple", label: "זוג", icon: "favorite" },
            { value: "family", label: "משפחה", icon: "family_restroom" },
            { value: "friends", label: "חברים", icon: "group" },
          ].map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setTravelerType(t.value as TripFormData["travelerType"])}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                travelerType === t.value
                  ? "border-[#9f402d] bg-[#9f402d]/10 text-[#9f402d]"
                  : "border-[#ddc0ba]/40 hover:border-[#89726d] text-[#56423e]"
              }`}
            >
              <span className="material-symbols-outlined text-2xl block mb-1">{t.icon}</span>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#56423e] mr-1">מה בא לכם לעשות? (עד 4)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INTERESTS.map((interest) => {
            const checked = interests.includes(interest.id);
            return (
              <button
                type="button"
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-3 rounded-xl border-2 text-sm font-medium text-right transition-all ${
                  checked
                    ? "border-[#9f402d] bg-[#9f402d]/10 text-[#9f402d]"
                    : "border-[#ddc0ba]/40 hover:border-[#89726d] text-[#56423e]"
                } ${!checked && interests.length >= 4 ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={!checked && interests.length >= 4}
              >
                {interest.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#56423e] mr-1">הערות ובקשות מיוחדות</label>
        <textarea
          className="w-full bg-[#eee7e1] border-none rounded-xl py-4 px-4 text-[#1e1b18] focus:ring-2 focus:ring-[#9f402d]/20 focus:bg-white transition-all placeholder:text-[#89726d]/60"
          placeholder="ספרו לנו על העדפות מיוחדות, אלרגיות או אתרים שאסור לפספס..."
          rows={3}
        />
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !destination.trim() || interests.length === 0}
          className="w-full py-4 bg-gradient-to-r from-[#9f402d] to-[#e2725b] text-white font-bold rounded-xl shadow-lg shadow-[#9f402d]/20 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              מייצרים את הטיול שלכם...
            </>
          ) : (
            <>
              <span>צור את הטיול שלי</span>
              <span className="material-symbols-outlined">arrow_back</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
