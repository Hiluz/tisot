import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import type { TripFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const data: TripFormData = await req.json();

    const interestsMap: Record<string, string> = {
      attractions: "אטרקציות ואתרים",
      nightlife: "חיי לילה וברים",
      food: "אוכל ומסעדות",
      nature: "טבע וטיולים",
      shopping: "קניות",
      culture: "תרבות ומוזיאונים",
      beach: "חוף וים",
      adventure: "אקסטרים והרפתקאות",
    };

    const travelerTypeMap: Record<string, string> = {
      solo: "מטייל יחיד",
      couple: "זוג",
      family: "משפחה עם ילדים",
      friends: "קבוצת חברים",
    };

    const interestsHebrew = data.interests.map((i) => interestsMap[i] || i).join(", ");
    const travelerTypeHebrew = travelerTypeMap[data.travelerType] || data.travelerType;

    const prompt = `You are a professional travel planner. Create a detailed trip plan for the following request.
IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no extra text.

Destination: ${data.destination}
Budget: ₪${data.budget} ILS
Duration: ${data.days} days
Number of travelers: ${data.numberOfTravelers}
Traveler type: ${travelerTypeHebrew}
Age range: ${data.ageRange}
Interests: ${interestsHebrew}

Generate a JSON response with this EXACT structure:
{
  "summary": {
    "totalAttractions": <number>,
    "topHighlights": ["<highlight1 in Hebrew>", "<highlight2>", "<highlight3>", "<highlight4>", "<highlight5>"],
    "topRestaurants": ["<restaurant1>", "<restaurant2>", "<restaurant3>"],
    "mainActivities": ["<activity1 in Hebrew>", "<activity2>", "<activity3>"],
    "costRange": { "min": <cheapest combo total in ILS>, "max": <most expensive combo total in ILS> }
  },
  "itinerary": [
    {
      "dayNumber": 1,
      "morning": "<morning activity in Hebrew, detailed>",
      "afternoon": "<afternoon activity in Hebrew, detailed>",
      "evening": "<evening activity in Hebrew, detailed>"
    }
  ],
  "attractions": [
    {
      "name": "<name in Hebrew>",
      "description": "<short description in Hebrew>",
      "cost": <entry cost in ILS>,
      "timeNeeded": "<e.g. 2-3 שעות>",
      "lat": <latitude>,
      "lng": <longitude>
    }
  ],
  "costBreakdown": {
    "accommodation": {
      "central": { "perNight": <ILS>, "totalNights": ${data.days}, "rooms": <suggested rooms>, "total": <total ILS> },
      "budget": { "perNight": <ILS>, "totalNights": ${data.days}, "rooms": <suggested rooms>, "total": <total ILS> }
    },
    "food": {
      "midRange": { "perDay": <ILS per day for all ${data.numberOfTravelers} travelers>, "total": <total for all days> },
      "luxury": { "perDay": <ILS per day for all ${data.numberOfTravelers} travelers>, "total": <total for all days> }
    },
    "activities": { "perDay": <ILS per day for all travelers>, "total": <total for all days> },
    "transport": { "perDay": <ILS per day for all travelers>, "total": <total for all days> },
    "combos": {
      "budgetMid": <budget accommodation + mid food + activities + transport total>,
      "budgetLuxury": <budget accommodation + luxury food + activities + transport total>,
      "centralMid": <central accommodation + mid food + activities + transport total>,
      "centralLuxury": <central accommodation + luxury food + activities + transport total>
    },
    "perPerson": {
      "budgetMid": <budgetMid / ${data.numberOfTravelers}>,
      "budgetLuxury": <budgetLuxury / ${data.numberOfTravelers}>,
      "centralMid": <centralMid / ${data.numberOfTravelers}>,
      "centralLuxury": <centralLuxury / ${data.numberOfTravelers}>
    }
  },
  "foodRecommendations": [
    {
      "dayNumber": 1,
      "breakfast": { "name": "<restaurant name in Hebrew>", "price": <ILS>, "tier": "mid-range" },
      "lunch": { "name": "<restaurant name>", "price": <ILS>, "tier": "mid-range" },
      "dinner": { "name": "<restaurant name>", "price": <ILS>, "tier": "luxury" }
    }
  ],
  "tips": ["<tip1 in Hebrew>", "<tip2>", "<tip3>", "<tip4>"]
}

RULES:
- ALL text content must be in Hebrew
- All prices in Israeli Shekels (₪ ILS) with realistic prices for ${data.destination}
- Cost calculations are for ALL ${data.numberOfTravelers} travelers combined, not per person
- Tailor activities to the interests: ${interestsHebrew}
- Tailor recommendations to traveler type: ${travelerTypeHebrew}, age: ${data.ageRange}
- Include lat/lng coordinates for all attractions (must be real coordinates in ${data.destination})
- Generate exactly ${data.days} days of itinerary
- Provide realistic, current prices`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const tripResult = JSON.parse(content);

    // Attach form metadata
    tripResult.destination = data.destination;
    tripResult.days = data.days;
    tripResult.budget = data.budget;
    tripResult.numberOfTravelers = data.numberOfTravelers;
    tripResult.travelerType = data.travelerType;
    tripResult.interests = data.interests;

    return NextResponse.json(tripResult);
  } catch (error) {
    console.error("Trip generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate trip" },
      { status: 500 }
    );
  }
}
