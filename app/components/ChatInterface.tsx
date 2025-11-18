"use client";

import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatBubble } from './ChatBubble';

interface ChatInterfaceProps {
  initialQuery: string;
  onClearChat: () => void;
}

export function ChatInterface({ initialQuery, onClearChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('carMatchConversation');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (initialQuery) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: initialQuery,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages([userMessage]);
      localStorage.setItem('carMatchConversation', JSON.stringify([userMessage]));
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'd be happy to help you find the perfect car! To give you the best recommendations, could you tell me a bit more about:\n\n1. What's your budget?\n2. Where are you located?\n3. What will you mainly use the car for?\n4. Any must-have features?\n\nThis will help me suggest specific models that match your needs.",
          role: 'assistant',
          timestamp: new Date(),
        };
        const newMessages = [userMessage, aiMessage];
        setMessages(newMessages);
        localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
      }, 1000);
    }
  }, [initialQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);
    localStorage.setItem('carMatchConversation', JSON.stringify(updatedMessages));

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently in development mode. The OpenAI integration will be added soon! For now, I can show you that your message was received: \"" + inputValue + "\"",
        role: 'assistant',
        timestamp: new Date(),
      };
      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
      setIsLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    localStorage.removeItem('carMatchConversation');
    setMessages([]);
    onClearChat();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">CarMatch AI</h1>
          <button
            onClick={handleClearChat}
            className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear conversation
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about specific cars, features, or describe your needs..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}