import React from 'react';
import { Plane, Hotel, Calendar, Utensils, Bus, Wallet } from 'lucide-react';
import type { TravelResponse } from '../types';

interface TravelResponseProps {
  response: TravelResponse;
}

export function TravelResponse({ response }: TravelResponseProps) {
  const sections = [
    { icon: Plane, title: 'Travel Options', content: response.travelOptions },
    { icon: Hotel, title: 'Accommodation', content: response.accommodation },
    { icon: Calendar, title: 'Daily Itinerary', content: response.itinerary },
    { icon: Utensils, title: 'Food & Dining', content: response.dining },
    { icon: Bus, title: 'Local Transportation', content: response.transportation },
    { icon: Wallet, title: 'Cost Breakdown', content: response.costBreakdown },
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ icon: Icon, title, content }) => (
        <div key={title} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Icon className="w-5 h-5 text-blue-500" />
            {title}
          </h3>
          <div className="prose prose-blue max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i} className="text-gray-700">
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}