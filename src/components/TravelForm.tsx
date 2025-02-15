import React, { useState } from 'react';
import { Calendar, Users, Plane, MapPin, Wallet, Heart } from 'lucide-react';
import type { TravelPlan } from '../types';

interface TravelFormProps {
  onSubmit: (plan: TravelPlan) => void;
  loading: boolean;
}

export function TravelForm({ onSubmit, loading }: TravelFormProps) {
  const [plan, setPlan] = useState<TravelPlan>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: [],
  });

  const interests = [
    'Adventure',
    'Nature',
    'Food',
    'History',
    'Relaxation',
    'Nightlife',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(plan);
  };

  const handleInterestToggle = (interest: string) => {
    setPlan(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Plane className="w-4 h-4" />
            Source Location
          </label>
          <input
            type="text"
            required
            value={plan.source}
            onChange={e => setPlan(prev => ({ ...prev, source: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4" />
            Destination
          </label>
          <input
            type="text"
            required
            value={plan.destination}
            onChange={e => setPlan(prev => ({ ...prev, destination: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            required
            value={plan.startDate}
            onChange={e => setPlan(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            required
            value={plan.endDate}
            onChange={e => setPlan(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Wallet className="w-4 h-4" />
            Budget Range
          </label>
          <input
            type="text"
            required
            value={plan.budget}
            onChange={e => setPlan(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000-2000"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4" />
            Number of Travelers
          </label>
          <input
            type="number"
            required
            min="1"
            value={plan.travelers}
            onChange={e => setPlan(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Heart className="w-4 h-4" />
          Interests & Preferences
        </label>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  plan.interests.includes(interest)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 
          disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Generating Plan...' : 'Plan My Trip'}
      </button>
    </form>
  );
}