// src/components/TravelChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { TravelPlan } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TravelChatProps {
  travelPlan: TravelPlan;
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  loading: boolean;
}

export const TravelChat: React.FC<TravelChatProps> = ({
  travelPlan,
  onSendMessage,
  messages,
  loading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Travel Assistant Chat</h3>
        <p className="text-sm text-gray-600">
          Ask questions about your travel plan to {travelPlan.destination}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your travel plan..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};