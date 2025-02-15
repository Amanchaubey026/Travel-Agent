import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TravelForm } from './components/TravelForm';
import { TravelResponse } from './components/TravelResponse';
import { FloatingChatbot } from './components/FloatingChatbot';
import { Compass } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import type { TravelPlan, TravelResponse as TravelResponseType } from './types';

// Initialize Google AI with environment variable
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [response, setResponse] = useState<TravelResponseType | null>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const generatePrompt = (plan: TravelPlan) => {
    return `Act as an expert travel planner. Create a detailed travel plan for the following trip:

From: ${plan.source}
To: ${plan.destination}
Dates: ${plan.startDate} to ${plan.endDate}
Budget: ${plan.budget}
Number of Travelers: ${plan.travelers}
Interests: ${plan.interests.join(', ')}

Please provide a comprehensive travel plan with the following sections in markdown format. Use the exact section headers as shown below:

# 1. Best Travel Options (flights/trains)
[Your content here]

# 2. Accommodation Suggestions
[Your content here]

# 3. Daily Itinerary
[Your content here]

# 4. Food & Dining Options
[Your content here]

# 5. Local Transportation Tips
[Your content here]

# 6. Estimated Cost Breakdown
[Your content here]

For each section, provide detailed information and recommendations. Include bullet points, emphasis, and other markdown formatting where appropriate.`;
  };

  const parseSections = (markdown: string): TravelResponseType => {
    const sections = markdown.split(/(?=# \d\.)/);
    const sectionMap: { [key: string]: number } = {
      'Best Travel Options': 0,
      'Accommodation Suggestions': 1,
      'Daily Itinerary': 2,
      'Food & Dining Options': 3,
      'Local Transportation Tips': 4,
      'Estimated Cost Breakdown': 5
    };

    const response: TravelResponseType = {
      travelOptions: '',
      accommodation: '',
      itinerary: '',
      dining: '',
      transportation: '',
      costBreakdown: ''
    };

    sections.forEach(section => {
      const titleMatch = section.match(/# \d\. (.*?)(?:\r?\n|$)/);
      if (titleMatch) {
        const title = titleMatch[1].split(' (')[0].trim();
        const content = section.replace(/# \d\. .*?\r?\n/, '').trim();
        
        switch (sectionMap[title]) {
          case 0: response.travelOptions = content; break;
          case 1: response.accommodation = content; break;
          case 2: response.itinerary = content; break;
          case 3: response.dining = content; break;
          case 4: response.transportation = content; break;
          case 5: response.costBreakdown = content; break;
        }
      }
    });

    return response;
  };

  const handleSubmit = async (plan: TravelPlan) => {
    const loadingToast = toast.loading('Generating your travel plan...');
    setLoading(true);
    setTravelPlan(plan);
    
    if (!API_KEY) {
      toast.error('Please set your Google AI API key in the environment variables (VITE_GOOGLE_AI_API_KEY)', {
        duration: 5000
      });
      setLoading(false);
      toast.dismiss(loadingToast);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = generatePrompt(plan);
      const result = await model.generateContent(prompt);
      const apiResponse = await result.response;
      const text = apiResponse.text();
      
      const parsedResponse = parseSections(text);
      setResponse(parsedResponse);
      setMessages([{
        role: 'assistant',
        content: `Hi! I've created a detailed travel plan for your trip to ${plan.destination}. Feel free to ask me any questions about the plan!`
      }]);
      toast.success('Travel plan generated successfully!', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while generating your travel plan. Please try again.',
        {
          duration: 5000
        }
      );
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!travelPlan || !response) return;

    setChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `You are a helpful travel assistant. The user has the following travel plan:

From: ${travelPlan.source}
To: ${travelPlan.destination}
Dates: ${travelPlan.startDate} to ${travelPlan.endDate}

Here are the details of their travel plan:

Best Travel Options:
${response.travelOptions}

Accommodation:
${response.accommodation}

Itinerary:
${response.itinerary}

Dining:
${response.dining}

Transportation:
${response.transportation}

Cost Breakdown:
${response.costBreakdown}

Their question is: ${message}

Please provide a helpful, friendly response based on the above travel plan. Use markdown formatting in your response where appropriate.`;

      const result = await model.generateContent(prompt);
      const aiResponse = await result.response;
      const text = aiResponse.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Compass className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Travel Agent</h1>
          <p className="text-lg text-gray-600">
            Plan your perfect trip with our AI-powered travel assistant
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <TravelForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {response && (
          <>
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Travel Plan</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <TravelResponse response={response} />
              </div>
            </div>
            
            <FloatingChatbot
              travelPlan={travelPlan}
              travelResponse={response}
              onSendMessage={handleChatMessage}
              messages={messages}
              loading={chatLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;