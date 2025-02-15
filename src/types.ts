export interface TravelPlan {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string[];
}

export interface TravelResponse {
  travelOptions: string;
  accommodation: string;
  itinerary: string;
  dining: string;
  transportation: string;
  costBreakdown: string;
}