'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Message } from '@/app/types';
import { ChatBubble } from '@/app/components/ChatBubble';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export default function SharePage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.id as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedConversation = async () => {
      try {
        const response = await fetch(`/api/share/${shareId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('This shared conversation was not found.');
          } else {
            setError('Failed to load the shared conversation.');
          }
          return;
        }

        const data = await response.json();
        setMessages(data.conversation.messages);
      } catch (err) {
        setError('An error occurred while loading the conversation.');
        console.error('Error loading shared conversation:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      loadSharedConversation();
    }
  }, [shareId]);

  const handleStartNewChat = () => {
    router.push('/');
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'not-helpful') => {
    // For shared conversations, we won't persist feedback
    // but we'll still send it to the API
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId,
        feedback,
        content: messages.find(m => m.id === messageId)?.content || '',
        isSharedConversation: true
      }),
    }).catch(error => {
      console.error('Failed to send feedback:', error);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-800 dark:text-gray-200 mb-4">{error}</p>
          <button
            onClick={handleStartNewChat}
            className="px-6 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Start a new chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <ThemeToggle />
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">CarMatch AI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Shared conversation</p>
          </div>
          <button
            onClick={handleStartNewChat}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Start your own chat
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            This is a read-only view of a shared conversation.
          </p>
          <button
            onClick={handleStartNewChat}
            className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Start your own conversation
          </button>
        </div>
      </div>
    </div>
  );
}