import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, SendHorizontal, X, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { TravelPlan, TravelResponse } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  travelPlan: TravelPlan | null;
  travelResponse: TravelResponse | null;
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  loading: boolean;
}

const ChatbotButton: React.FC<{ onClick: () => void; hasUnread: boolean }> = ({ 
  onClick, 
  hasUnread 
}) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
  >
    <MessageCircle className="w-6 h-6" />
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
    )}
  </button>
);

export const FloatingChatbot: React.FC<ChatbotProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  travelPlan,
  travelResponse,
  onSendMessage,
  messages,
  loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      setHasUnread(true);
    }
  }, [messages, isOpen]);

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

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  if (!isOpen) {
    return <ChatbotButton onClick={handleOpen} hasUnread={hasUnread} />;
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Travel Assistant</h3>
            <p className="text-sm opacity-90">
              {loading ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!travelResponse ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Generate a travel plan to start chatting
          </div>
        ) : (
          <>
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
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your travel plan..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || !travelResponse}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !travelResponse}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};