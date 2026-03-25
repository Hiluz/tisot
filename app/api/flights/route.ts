import { NextRequest, NextResponse } from "next/server";
import { getIATACode, ORIGIN_AIRPORT } from "@/lib/cities";

interface SerpAPIFlight {
  flights?: {
    airline?: string;
    departure_airport?: { time?: string };
    arrival_airport?: { time?: string };
    total_duration?: number;
  }[];
  price?: number;
  type?: string;
  airline_logo?: string;
  layovers?: { duration?: number }[];
  booking_token?: string;
}

// Estimated round-trip prices from TLV in ILS per person
const ESTIMATED_PRICES: Record<string, { min: number; max: number; airlines: string[] }> = {
  // Europe short-haul
  ATH: { min: 600, max: 1400, airlines: ["Aegean", "El Al", "Wizz Air"] },
  IST: { min: 500, max: 1200, airlines: ["Turkish Airlines", "Pegasus", "El Al"] },
  BCN: { min: 800, max: 2000, airlines: ["Vueling", "El Al", "Ryanair"] },
  FCO: { min: 700, max: 1800, airlines: ["Wizz Air", "El Al", "ITA Airways"] },
  BER: { min: 800, max: 1900, airlines: ["Ryanair", "El Al", "Lufthansa"] },
  PRG: { min: 700, max: 1700, airlines: ["Wizz Air", "El Al", "Ryanair"] },
  VIE: { min: 750, max: 1800, airlines: ["Wizz Air", "Austrian", "El Al"] },
  BUD: { min: 600, max: 1500, airlines: ["Wizz Air", "El Al", "Ryanair"] },
  WAW: { min: 650, max: 1600, airlines: ["Wizz Air", "LOT", "El Al"] },
  // Europe medium-haul
  LHR: { min: 1000, max: 2800, airlines: ["El Al", "British Airways", "Wizz Air"] },
  CDG: { min: 900, max: 2500, airlines: ["El Al", "Air France", "Transavia"] },
  AMS: { min: 900, max: 2400, airlines: ["El Al", "KLM", "Transavia"] },
  MAD: { min: 900, max: 2200, airlines: ["Iberia", "El Al", "Vueling"] },
  LIS: { min: 1000, max: 2500, airlines: ["TAP", "El Al", "Ryanair"] },
  MXP: { min: 700, max: 1800, airlines: ["Wizz Air", "El Al", "Ryanair"] },
  MUC: { min: 800, max: 2000, airlines: ["Lufthansa", "El Al", "Wizz Air"] },
  CPH: { min: 1000, max: 2400, airlines: ["SAS", "El Al", "Ryanair"] },
  DUB: { min: 1100, max: 2600, airlines: ["Ryanair", "El Al", "Aer Lingus"] },
  // Asia
  NRT: { min: 2500, max: 5500, airlines: ["El Al", "Turkish Airlines", "Ethiopian"] },
  BKK: { min: 2000, max: 4500, airlines: ["Thai Airways", "Turkish Airlines", "El Al"] },
  SIN: { min: 2200, max: 5000, airlines: ["Singapore Airlines", "Turkish Airlines", "El Al"] },
  HKG: { min: 2300, max: 5200, airlines: ["Cathay Pacific", "Turkish Airlines", "El Al"] },
  ICN: { min: 2500, max: 5500, airlines: ["Korean Air", "Turkish Airlines", "Ethiopian"] },
  PEK: { min: 2200, max: 5000, airlines: ["Air China", "Turkish Airlines", "Hainan"] },
  // Americas
  JFK: { min: 2000, max: 5000, airlines: ["El Al", "Delta", "United"] },
  LAX: { min: 2500, max: 6000, airlines: ["El Al", "United", "Air Canada"] },
  MIA: { min: 2200, max: 5500, airlines: ["El Al", "Delta", "American"] },
  YYZ: { min: 2200, max: 5000, airlines: ["Air Canada", "El Al", "Turkish Airlines"] },
  CUN: { min: 3000, max: 6500, airlines: ["Aeromexico", "Turkish Airlines", "United"] },
  // Middle East & Africa
  DXB: { min: 800, max: 2000, airlines: ["flydubai", "El Al", "Emirates"] },
  RAK: { min: 1200, max: 2800, airlines: ["Royal Air Maroc", "Ryanair", "El Al"] },
  CAI: { min: 600, max: 1500, airlines: ["Air Cairo", "Nile Air", "El Al"] },
  ETH: { min: 300, max: 800, airlines: ["Israir", "Arkia", "El Al"] },
};

function getEstimatedFlights(
  destCode: string,
  outboundDate: string,
  returnDate: string
) {
  const est = ESTIMATED_PRICES[destCode];
  if (!est) {
    // Generic fallback
    return [
      { airline: "El Al", departureTime: "06:30", arrivalTime: "", stops: 0, pricePerPerson: 1500, departure_date: outboundDate, return_date: returnDate, isEstimate: true },
      { airline: "Turkish Airlines", departureTime: "10:00", arrivalTime: "", stops: 1, pricePerPerson: 1200, departure_date: outboundDate, return_date: returnDate, isEstimate: true },
      { airline: "Wizz Air", departureTime: "22:15", arrivalTime: "", stops: 0, pricePerPerson: 900, departure_date: outboundDate, return_date: returnDate, isEstimate: true },
    ];
  }

  const range = est.max - est.min;
  return est.airlines.map((airline, i) => {
    const factor = i / Math.max(est.airlines.length - 1, 1);
    const price = Math.round(est.min + range * factor * 0.8 + Math.random() * range * 0.2);
    const hours = ["06:30", "10:00", "14:30", "17:00", "22:15"];
    return {
      airline,
      departureTime: hours[i % hours.length],
      arrivalTime: "",
      stops: i === 0 ? 0 : i === 1 ? 0 : 1,
      pricePerPerson: price,
      departure_date: outboundDate,
      return_date: returnDate,
      isEstimate: true,
    };
  });
}

async function searchFlights(
  origin: string,
  destination: string,
  outboundDate: string,
  returnDate: string,
  currency: string = "ILS"
) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return { flights: [], isEstimate: true, estimatedFlights: getEstimatedFlights(destination, outboundDate, returnDate) };

  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    outbound_date: outboundDate,
    return_date: returnDate,
    currency,
    hl: "he",
    api_key: apiKey,
    type: "1", // round trip
  });

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`);
    if (!res.ok) return { flights: [], isEstimate: true, estimatedFlights: getEstimatedFlights(destination, outboundDate, returnDate) };
    const data = await res.json();

    const results: SerpAPIFlight[] = [
      ...(data.best_flights || []),
      ...(data.other_flights || []),
    ];

    if (results.length === 0) {
      return { flights: [], isEstimate: true, estimatedFlights: getEstimatedFlights(destination, outboundDate, returnDate) };
    }

    const flights = results.slice(0, 5).map((f) => ({
      airline: f.flights?.[0]?.airline || "Unknown",
      departureTime: f.flights?.[0]?.departure_airport?.time || "",
      arrivalTime: f.flights?.[0]?.arrival_airport?.time || "",
      stops: (f.layovers?.length || 0),
      pricePerPerson: f.price || 0,
      departure_date: outboundDate,
      return_date: returnDate,
      isEstimate: false,
    }));

    return { flights, isEstimate: false, estimatedFlights: [] };
  } catch {
    return { flights: [], isEstimate: true, estimatedFlights: getEstimatedFlights(destination, outboundDate, returnDate) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      destination,
      outboundDate,
      returnDate,
      numberOfTravelers = 1,
      flexibleMonth,
      days = 7,
    } = body;

    const destCode = getIATACode(destination);
    if (!destCode) {
      return NextResponse.json(
        { error: "Could not find airport code for destination" },
        { status: 400 }
      );
    }

    const origin = ORIGIN_AIRPORT;

    if (flexibleMonth) {
      // Flexible dates: search by weeks within the month
      const [year, month] = flexibleMonth.split("-").map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);

      const weeks = [];
      let weekStart = new Date(firstDay);
      let weekNum = 1;
      let anyEstimate = false;

      while (weekStart <= lastDay) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

        const depDate = weekStart.toISOString().split("T")[0];
        const retDate = new Date(weekStart);
        retDate.setDate(retDate.getDate() + days);
        const retDateStr = retDate.toISOString().split("T")[0];

        const result = await searchFlights(origin, destCode, depDate, retDateStr);
        const flightsList = result.isEstimate ? result.estimatedFlights : result.flights;
        if (result.isEstimate) anyEstimate = true;

        weeks.push({
          weekNumber: weekNum,
          dateRange: `${weekStart.getDate()}-${weekEnd.getDate()} ${firstDay.toLocaleDateString("he-IL", { month: "long" })}`,
          flights: flightsList,
          depDate,
          retDateStr,
        });

        weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() + 1);
        weekNum++;
      }

      const weeklySummaries = weeks.map((w) => {
        const prices = w.flights.filter((f) => f.pricePerPerson > 0).map((f) => f.pricePerPerson);
        const avg = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
        return {
          weekNumber: w.weekNumber,
          dateRange: w.dateRange,
          avgPricePerPerson: avg,
          avgTotalPrice: avg * numberOfTravelers,
          cheapestOptions: w.flights
            .filter((f) => f.pricePerPerson > 0)
            .sort((a, b) => a.pricePerPerson - b.pricePerPerson)
            .slice(0, 3)
            .map((f) => ({ ...f, totalPrice: f.pricePerPerson * numberOfTravelers })),
          isCheapest: false,
        };
      });

      const cheapestAvg = Math.min(
        ...weeklySummaries.filter((w) => w.avgPricePerPerson > 0).map((w) => w.avgPricePerPerson)
      );
      weeklySummaries.forEach((w) => {
        if (w.avgPricePerPerson === cheapestAvg && cheapestAvg > 0) {
          w.isCheapest = true;
        }
      });

      return NextResponse.json({ type: "flexible", weeks: weeklySummaries, isEstimate: anyEstimate });
    } else {
      // Exact dates mode
      const result = await searchFlights(origin, destCode, outboundDate, returnDate);
      const flightsList = result.isEstimate ? result.estimatedFlights : result.flights;
      const results = flightsList.map((f) => ({
        ...f,
        totalPrice: f.pricePerPerson * numberOfTravelers,
      }));

      return NextResponse.json({
        type: "exact",
        flights: results.sort((a, b) => a.pricePerPerson - b.pricePerPerson),
        isEstimate: result.isEstimate,
      });
    }
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 });
  }
}
