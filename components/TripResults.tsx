"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Utensils,
  Wallet,
  Sun,
  Sunset,
  Moon,
  Lightbulb,
  Plane,
  Loader2,
  Share2,
} from "lucide-react";
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
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-20">
      {/* Summary Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">
              🌍 טיול ל{tripResult.destination} — {tripResult.days} ימים
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 me-1" />
              שיתוף
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {tripResult.numberOfTravelers} מטיילים
            </Badge>
            <Badge variant="secondary">
              {travelerTypeLabels[tripResult.travelerType]}
            </Badge>
            {tripResult.interests.map((i) => (
              <Badge key={i} variant="outline">
                {interestLabels[i]}
              </Badge>
            ))}
          </div>

          {summary && (
            <>
              <p className="text-sm text-muted-foreground">
                {summary.totalAttractions} אטרקציות • {summary.topRestaurants?.length || 0} מסעדות מומלצות
              </p>

              {summary.topHighlights?.length > 0 && (
                <div>
                  <h4 className="mb-1 font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4" /> חובה לראות
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {summary.topHighlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.costRange && (
                <p className="font-semibold text-lg">
                  💰 טווח עלויות: {formatPrice(summary.costRange.min)} – {formatPrice(summary.costRange.max)} ל-{tripResult.numberOfTravelers} מטיילים
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Itinerary */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">📅 מסלול יומי</h2>
        {itinerary?.map((day) => (
          <Card key={day.dayNumber}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">יום {day.dayNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Sun className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <span className="font-medium">בוקר: </span>
                  <span className="text-sm">{day.morning}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Sunset className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <span className="font-medium">צהריים: </span>
                  <span className="text-sm">{day.afternoon}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Moon className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                <div>
                  <span className="font-medium">ערב: </span>
                  <span className="text-sm">{day.evening}</span>
                </div>
              </div>

              {/* Food for this day */}
              {foodRecommendations?.find((f) => f.dayNumber === day.dayNumber) && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold flex items-center gap-1">
                      <Utensils className="h-4 w-4" /> המלצות אוכל
                    </h4>
                    {(() => {
                      const food = foodRecommendations.find((f) => f.dayNumber === day.dayNumber)!;
                      return (
                        <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-3">
                          <span>🌅 {food.breakfast.name} — {formatPrice(food.breakfast.price)}</span>
                          <span>☀️ {food.lunch.name} — {formatPrice(food.lunch.price)}</span>
                          <span>🌙 {food.dinner.name} — {formatPrice(food.dinner.price)}</span>
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Breakdown */}
      {costBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              פירוט עלויות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Accommodation */}
            <div>
              <h4 className="font-semibold mb-2">🏨 לינה ({costBreakdown.accommodation.central.totalNights} לילות)</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">מרכזי / תיירותי</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(costBreakdown.accommodation.central.perNight)} ללילה × {costBreakdown.accommodation.central.rooms} חדרים
                  </p>
                  <p className="font-bold mt-1">{formatPrice(costBreakdown.accommodation.central.total)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">שכונתי / חסכוני</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(costBreakdown.accommodation.budget.perNight)} ללילה × {costBreakdown.accommodation.budget.rooms} חדרים
                  </p>
                  <p className="font-bold mt-1">{formatPrice(costBreakdown.accommodation.budget.total)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Food */}
            <div>
              <h4 className="font-semibold mb-2">🍽️ אוכל ({tripResult.days} ימים × {tripResult.numberOfTravelers} מטיילים)</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="font-medium">רמה בינונית</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(costBreakdown.food.midRange.perDay)} ליום</p>
                  <p className="font-bold mt-1">{formatPrice(costBreakdown.food.midRange.total)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium">רמה גבוהה</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(costBreakdown.food.luxury.perDay)} ליום</p>
                  <p className="font-bold mt-1">{formatPrice(costBreakdown.food.luxury.total)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Activities & Transport */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="font-medium">🎯 פעילויות</p>
                <p className="text-sm text-muted-foreground">{formatPrice(costBreakdown.activities.perDay)} ליום</p>
                <p className="font-bold mt-1">{formatPrice(costBreakdown.activities.total)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium">🚌 תחבורה</p>
                <p className="text-sm text-muted-foreground">{formatPrice(costBreakdown.transport.perDay)} ליום</p>
                <p className="font-bold mt-1">{formatPrice(costBreakdown.transport.total)}</p>
              </div>
            </div>

            <Separator />

            {/* Combo Totals */}
            <div>
              <h4 className="font-semibold mb-2">📊 סה&quot;כ לפי שילוב (ללא טיסות)</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-green-500/10 border-green-500/30 border p-3">
                  <p className="text-sm">חסכוני + אוכל בינוני</p>
                  <p className="font-bold text-green-400">{formatPrice(costBreakdown.combos.budgetMid)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(costBreakdown.perPerson.budgetMid)} לאדם</p>
                </div>
                <div className="rounded-lg bg-muted/50 border p-3">
                  <p className="text-sm">חסכוני + אוכל יוקרתי</p>
                  <p className="font-bold">{formatPrice(costBreakdown.combos.budgetLuxury)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(costBreakdown.perPerson.budgetLuxury)} לאדם</p>
                </div>
                <div className="rounded-lg bg-muted/50 border p-3">
                  <p className="text-sm">מרכזי + אוכל בינוני</p>
                  <p className="font-bold">{formatPrice(costBreakdown.combos.centralMid)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(costBreakdown.perPerson.centralMid)} לאדם</p>
                </div>
                <div className="rounded-lg bg-orange-500/10 border-orange-500/30 border p-3">
                  <p className="text-sm">מרכזי + אוכל יוקרתי</p>
                  <p className="font-bold text-orange-400">{formatPrice(costBreakdown.combos.centralLuxury)}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(costBreakdown.perPerson.centralLuxury)} לאדם</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            טיסות
            {flightsEstimate && (
              <Badge variant="outline" className="text-xs font-normal">הערכת מחיר</Badge>
            )}
          </CardTitle>
          {flightsEstimate && (
            <p className="text-xs text-muted-foreground">
              המחירים הם הערכה בלבד — מומלץ לבדוק בגוגל טיסות לפני ההזמנה
            </p>
          )}
        </CardHeader>
        <CardContent>
          {flightsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin me-2" />
              <span>מחפשים טיסות...</span>
            </div>
          ) : weeklyFlights ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">תוצאות לפי שבוע בחודש הנבחר</p>
              {weeklyFlights.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`rounded-lg border p-4 ${week.isCheapest ? "border-green-500 bg-green-500/10" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      שבוע {week.weekNumber} ({week.dateRange})
                      {week.isCheapest && (
                        <Badge className="ms-2 bg-green-600">הכי זול!</Badge>
                      )}
                    </h4>
                    <div className="text-start">
                      <p className="font-bold">{formatPrice(week.avgPricePerPerson)} לאדם</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(week.avgTotalPrice)} ל-{tripResult.numberOfTravelers} מטיילים
                      </p>
                    </div>
                  </div>
                  {week.cheapestOptions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {week.cheapestOptions.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{f.airline} • {f.stops === 0 ? "ישיר" : `${f.stops} עצירות`}</span>
                          <span>{formatPrice(f.pricePerPerson)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : flights && flights.length > 0 ? (
            <div className="space-y-3">
              {flights.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{f.airline}</p>
                    <p className="text-sm text-muted-foreground">
                      {f.departureTime} → {f.arrivalTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {f.stops === 0 ? "טיסה ישירה" : `${f.stops} עצירות`}
                    </p>
                  </div>
                  <div className="text-start">
                    <p className="font-bold">{formatPrice(f.pricePerPerson)} לאדם</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(f.totalPrice)} ל-{tripResult.numberOfTravelers} מטיילים
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              לא נמצאו טיסות. נסו תאריכים אחרים או בדקו את מפתח ה-API.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      {attractions && attractions.length > 0 && attractions.some((a) => a.lat && a.lng) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              מפת אטרקציות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TripMap attractions={attractions} />
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              טיפים חשובים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
