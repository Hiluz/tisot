export interface TripFormData {
  destination: string;
  budget: number;
  days: number;
  startDate: string;
  endDate: string;
  flexibleDates: boolean;
  flexibleMonth: string;
  numberOfTravelers: number;
  travelerType: "solo" | "couple" | "family" | "friends";
  ageRange: string;
  interests: string[];
}

export interface DayPlan {
  dayNumber: number;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface CostBreakdown {
  accommodation: {
    central: { perNight: number; totalNights: number; rooms: number; total: number };
    budget: { perNight: number; totalNights: number; rooms: number; total: number };
  };
  food: {
    midRange: { perDay: number; total: number };
    luxury: { perDay: number; total: number };
  };
  activities: { perDay: number; total: number };
  transport: { perDay: number; total: number };
  combos: {
    budgetMid: number;
    budgetLuxury: number;
    centralMid: number;
    centralLuxury: number;
  };
  perPerson: {
    budgetMid: number;
    budgetLuxury: number;
    centralMid: number;
    centralLuxury: number;
  };
}

export interface TripSummary {
  totalAttractions: number;
  topHighlights: string[];
  topRestaurants: string[];
  mainActivities: string[];
  costRange: { min: number; max: number };
}

export interface Attraction {
  name: string;
  description: string;
  cost: number;
  timeNeeded: string;
  lat?: number;
  lng?: number;
}

export interface TripResult {
  id?: string;
  destination: string;
  days: number;
  budget: number;
  numberOfTravelers: number;
  travelerType: string;
  interests: string[];
  summary: TripSummary;
  itinerary: DayPlan[];
  attractions: Attraction[];
  costBreakdown: CostBreakdown;
  tips: string[];
  foodRecommendations: {
    dayNumber: number;
    breakfast: { name: string; price: number; tier: string };
    lunch: { name: string; price: number; tier: string };
    dinner: { name: string; price: number; tier: string };
  }[];
}

export interface FlightResult {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  pricePerPerson: number;
  totalPrice: number;
  bookingUrl?: string;
  departure_date?: string;
  return_date?: string;
  isEstimate?: boolean;
}

export interface WeeklyFlightSummary {
  weekNumber: number;
  dateRange: string;
  avgPricePerPerson: number;
  avgTotalPrice: number;
  cheapestOptions: FlightResult[];
  isCheapest: boolean;
}
