import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { TravelResponse as TravelResponseType } from '../types';

interface TravelResponseProps {
  response: TravelResponseType;
}

export const TravelResponse: React.FC<TravelResponseProps> = ({ response }) => {
  const sections = [
    { title: "Best Travel Options", content: response.travelOptions },
    { title: "Accommodation Suggestions", content: response.accommodation },
    { title: "Daily Itinerary", content: response.itinerary },
    { title: "Food & Dining Options", content: response.dining },
    { title: "Local Transportation Tips", content: response.transportation },
    { title: "Estimated Cost Breakdown", content: response.costBreakdown }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {section.title}
          </h3>
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};