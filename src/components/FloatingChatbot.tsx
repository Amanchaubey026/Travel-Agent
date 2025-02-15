import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, SendHorizontal, X, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { TravelPlan, TravelResponse } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
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
    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center group"
  >
    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
    )}
  </button>
);

export const FloatingChatbot: React.FC<ChatbotProps> = ({
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
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    <div className="fixed bottom-6 right-6 w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl flex flex-col animate-in slide-in-from-bottom-3 duration-200">
      <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold">Travel Assistant</h3>
            <p className="text-sm opacity-90 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Typing...
                </>
              ) : 'Online'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-blue-700 rounded-full transition-colors duration-200 hover:rotate-90 transform"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[calc(80vh-120px)]">
        {!travelResponse ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
            <Bot className="w-12 h-12 text-gray-400 animate-bounce" />
            <p>Generate a travel plan for {travelPlan?.destination || 'your destination'} to start chatting</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in slide-in-from-${message.role === 'user' ? 'right' : 'left'}-3 duration-200`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } shadow-sm`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-gray-100 rounded-lg p-3 flex gap-1.5">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your travel plan..."
            className="flex-1 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={loading || !travelResponse}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !travelResponse}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};