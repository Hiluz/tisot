"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MapPin,
  Wallet,
  Users,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { TripFormData } from "@/types";

const INTERESTS = [
  { id: "attractions", label: "אטרקציות ואתרים", emoji: "🏛️" },
  { id: "nightlife", label: "חיי לילה", emoji: "🌃" },
  { id: "food", label: "אוכל ומסעדות", emoji: "🍽️" },
  { id: "nature", label: "טבע וטיולים", emoji: "🌿" },
  { id: "shopping", label: "קניות", emoji: "🛍️" },
  { id: "culture", label: "תרבות ומוזיאונים", emoji: "🎭" },
  { id: "beach", label: "חוף וים", emoji: "🏖️" },
  { id: "adventure", label: "אקסטרים והרפתקאות", emoji: "🧗" },
];

const TRAVELER_TYPES = [
  { value: "solo", label: "יחיד" },
  { value: "couple", label: "זוג" },
  { value: "family", label: "משפחה (עם ילדים)" },
  { value: "friends", label: "חברים" },
];

const AGE_RANGES = [
  { value: "18-25", label: "18-25" },
  { value: "25-35", label: "25-35" },
  { value: "35-50", label: "35-50" },
  { value: "50+", label: "50+" },
  { value: "mixed", label: "גילאים מעורבים" },
];

function getFlexibleMonthOptions(): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("he-IL", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label });
  }
  return options;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

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

  function handleStartDateChange(value: string) {
    setStartDate(value);
    // days stays the same, endDate recalculates automatically
  }

  function handleEndDateChange(value: string) {
    const diff = daysBetween(startDate, value);
    if (diff >= 1 && diff <= 14) {
      setDays(diff);
    }
  }

  function handleDaysChange(value: number | readonly number[]) {
    const v = Array.isArray(value) ? value[0] : value;
    setDays(v);
  }

  function toggleInterest(id: string) {
    setInterests((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) return;
    if (interests.length === 0) return;

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
      // Store in sessionStorage for the results page
      sessionStorage.setItem("tripResult", JSON.stringify(tripResult));
      sessionStorage.setItem("tripFormData", JSON.stringify(formData));
      router.push("/trip/result");
    } catch {
      setLoading(false);
      alert("שגיאה ביצירת הטיול. נסו שוב.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-6 p-4">
      {/* Section 1: Destination & Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            יעד ותקציב
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">לאן טסים?</Label>
            <Input
              id="destination"
              placeholder="למשל: לונדון, טוקיו, ברצלונה..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">תקציב כולל (₪)</Label>
            <div className="relative">
              <Input
                id="budget"
                type="number"
                min={500}
                max={100000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="pe-10"
              />
              <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₪
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Travelers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            מטיילים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="travelers">מספר מטיילים</Label>
            <Input
              id="travelers"
              type="number"
              min={1}
              max={10}
              value={numberOfTravelers}
              onChange={(e) => setNumberOfTravelers(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>סוג טיול</Label>
            <RadioGroup
              value={travelerType}
              onValueChange={(v) => setTravelerType(v as TripFormData["travelerType"])}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {TRAVELER_TYPES.map((t) => (
                <div key={t.value}>
                  <RadioGroupItem
                    value={t.value}
                    id={`type-${t.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`type-${t.value}`}
                    className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-sm font-medium hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    {t.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>טווח גילאים</Label>
            <Select value={ageRange} onValueChange={(v) => v && setAgeRange(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            מה בא לכם לעשות?
          </CardTitle>
          <p className="text-sm text-muted-foreground">בחרו עד 4</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INTERESTS.map((interest) => {
              const checked = interests.includes(interest.id);
              return (
                <div
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                    checked
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-muted-foreground/30"
                  } ${!checked && interests.length >= 4 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Checkbox checked={checked} className="pointer-events-none" />
                  <span className="text-sm">
                    {interest.emoji} {interest.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            תאריכים ומשך
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>מספר ימים: {days}</Label>
            </div>
            <Slider
              value={[days]}
              onValueChange={handleDaysChange}
              min={1}
              max={14}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>יום 1</span>
              <span>14 ימים</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={flexibleDates}
              onCheckedChange={setFlexibleDates}
              id="flexible"
            />
            <Label htmlFor="flexible">תאריכים גמישים</Label>
          </div>

          {flexibleDates ? (
            <div className="space-y-2">
              <Label>בחרו חודש</Label>
              <Select value={flexibleMonth} onValueChange={(v) => v && setFlexibleMonth(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getFlexibleMonthOptions().map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">תאריך התחלה</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">תאריך סיום</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={addDays(startDate, 1)}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg font-bold h-14"
        disabled={loading || !destination.trim() || interests.length === 0}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin me-2" />
            מייצרים את הטיול שלכם...
          </>
        ) : (
          "✈️ תכננו לי טיול"
        )}
      </Button>
    </form>
  );
}
