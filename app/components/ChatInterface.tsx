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
  const [honeypot, setHoneypot] = useState('');
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
      setIsLoading(true);
      
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [userMessage], honeypot: '' }),
      })
        .then(response => response.json())
        .then(data => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.content || "I'd be happy to help you find the perfect car! To give you the best recommendations, could you tell me a bit more about:\n\n1. What's your budget?\n2. Where are you located?\n3. What will you mainly use the car for?\n4. Any must-have features?\n\nThis will help me suggest specific models that match your needs.",
            role: 'assistant',
            timestamp: new Date(),
          };
          const newMessages = [userMessage, aiMessage];
          setMessages(newMessages);
          localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
        })
        .catch(error => {
          console.error('Error:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "It looks like the OpenAI API key isn't configured yet. Please add your OPENAI_API_KEY to the .env.local file.",
            role: 'assistant',
            timestamp: new Date(),
          };
          const newMessages = [userMessage, errorMessage];
          setMessages(newMessages);
          localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
        })
        .finally(() => {
          setIsLoading(false);
        });
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

    let retries = 3;
    while (retries > 0) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: updatedMessages, honeypot }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to get response');
        }

        const data = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.content,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        const newMessages = [...updatedMessages, aiMessage];
        setMessages(newMessages);
        localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
        break;
      } catch (error: any) {
        retries--;
        
        if (retries === 0) {
          console.error('Error:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: error.message === 'Invalid API key configuration.' 
              ? "It looks like the OpenAI API key isn't configured yet. Please add your OPENAI_API_KEY to the .env.local file."
              : error.message === 'Too many requests. Please try again later.'
              ? "You're making requests too quickly. Please wait a moment and try again."
              : `Sorry, I encountered an error: ${error.message}. Please try again.`,
            role: 'assistant',
            timestamp: new Date(),
          };
          const newMessages = [...updatedMessages, errorMessage];
          setMessages(newMessages);
          localStorage.setItem('carMatchConversation', JSON.stringify(newMessages));
        } else if (error.message !== 'Invalid API key configuration.') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          break;
        }
      }
    }
    
    setIsLoading(false);
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
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
              aria-hidden="true"
            />
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