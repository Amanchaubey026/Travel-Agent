import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TravelForm } from './components/TravelForm';
import { TravelResponse } from './components/TravelResponse';
import { Compass } from 'lucide-react';
import type { TravelPlan, TravelResponse as TravelResponseType } from './types';

// Initialize Google AI
const genAI = new GoogleGenerativeAI('YOUR_API_KEY'); // Replace with your API key

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TravelResponseType | null>(null);

  const generatePrompt = (plan: TravelPlan) => {
    return `Act as an expert travel planner. Create a detailed travel plan for the following trip:

From: ${plan.source}
To: ${plan.destination}
Dates: ${plan.startDate} to ${plan.endDate}
Budget: ${plan.budget}
Number of Travelers: ${plan.travelers}
Interests: ${plan.interests.join(', ')}

Please provide a comprehensive travel plan with the following sections. Use the exact section numbers and titles as shown below:

1. Best Travel Options (flights/trains)
2. Accommodation Suggestions
3. Daily Itinerary
4. Food & Dining Options
5. Local Transportation Tips
6. Estimated Cost Breakdown

For each section, provide detailed information and recommendations. Keep the section numbers and titles exactly as shown above to ensure proper parsing.`;
  };

  const handleSubmit = async (plan: TravelPlan) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = generatePrompt(plan);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Improved parsing logic
      const sectionTitles = [
        'Best Travel Options',
        'Accommodation Suggestions',
        'Daily Itinerary',
        'Food & Dining Options',
        'Local Transportation Tips',
        'Estimated Cost Breakdown'
      ];
      
      // Split by numbered sections and clean up
      const sections = text.split(/\d\.\s+(?=[A-Z])/).filter(Boolean);
      
      // Create response object with proper section mapping
      const parsedResponse: TravelResponseType = {
        travelOptions: sections[0]?.trim() || 'No travel options available',
        accommodation: sections[1]?.trim() || 'No accommodation suggestions available',
        itinerary: sections[2]?.trim() || 'No itinerary available',
        dining: sections[3]?.trim() || 'No dining options available',
        transportation: sections[4]?.trim() || 'No transportation tips available',
        costBreakdown: sections[5]?.trim() || 'No cost breakdown available'
      };
      
      setResponse(parsedResponse);
    } catch (error) {
      console.error('Error generating travel plan:', error);
      alert('Please ensure you have entered a valid API key and try again. If the problem persists, check your input data and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Travel Planner</h1>
          <p className="text-lg text-gray-600">
            Plan your perfect trip with our AI-powered travel assistant
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <TravelForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {response && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Travel Plan</h2>
            <TravelResponse response={response} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;