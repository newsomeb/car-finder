"use client";

import { useState, useEffect } from "react";
import { ChatInterface } from "./components/ChatInterface";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");

  const suggestedSearches = [
    "Reliable SUV under $15k",
    "Family car with 3rd row seating",
    "Best first car for a teenager",
    "Fuel-efficient commuter under $10k",
    "Off-road capable truck under $25k",
    "Luxury sedan for highway driving",
  ];

  const detailedExample = "I'm a 32-year-old software engineer in Seattle. I bike to work but need a car for weekend camping trips in the Cascades (lots of dirt roads). Budget is $18k max. I'm 6'3\" so I need headroom. I hate sedans. I want something that looks cool but isn't flashy. Good speakers are a must because I listen to podcasts. I had a Honda Civic that was boring as hell. I like the idea of Subarus but everyone in Seattle has one and I don't want to be basic. Also I have a dog (golden retriever) so I need space for him and camping gear. Heated seats would be nice because it's cold here. I don't care about 0-60 times but I do care about reliability because I'm terrible at remembering to do maintenance. What should I get?";

  useEffect(() => {
    const savedConversation = localStorage.getItem('carMatchConversation');
    if (savedConversation) {
      setShowChat(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery);
      setShowChat(true);
    }
  };

  const handleSuggestedSearch = (suggestion: string) => {
    setActiveQuery(suggestion);
    setShowChat(true);
  };

  const handleClearChat = () => {
    setShowChat(false);
    setSearchQuery("");
    setActiveQuery("");
  };

  if (showChat) {
    return <ChatInterface initialQuery={activeQuery} onClearChat={handleClearChat} />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 text-center">
            Find the perfect car
          </h1>
          
          <p className="text-lg text-gray-600 text-center">
            Instant AI recommendations tailored to your life.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-2xl mt-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What kind of car are you looking for?"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md transition-shadow"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="mt-8 w-full max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedSearches.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedSearch(suggestion)}
                  className="text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors text-center"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16 w-full max-w-2xl px-4">
            <p className="text-xs text-gray-500 text-center mb-3">
              Or try this detailed example:
            </p>
            <button
              onClick={() => handleSuggestedSearch(detailedExample)}
              className="text-xs text-gray-500 hover:text-gray-700 text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors w-full"
            >
              {detailedExample}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}