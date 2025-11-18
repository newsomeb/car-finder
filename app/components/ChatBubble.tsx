import { useState } from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'helpful' | 'not-helpful') => void;
}

export function ChatBubble({ message, onFeedback }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(message.feedback || null);
  
  const handleFeedback = (value: 'helpful' | 'not-helpful') => {
    if (feedback === value) {
      setFeedback(null);
      onFeedback?.(message.id, value);
    } else {
      setFeedback(value);
      onFeedback?.(message.id, value);
    }
  };
  
  return (
    <div className="mb-4">
      <div
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[70%] px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 dark:bg-blue-600 text-white ml-auto'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      
      {!isUser && (
        <div className="flex justify-start mt-2 ml-2 space-x-2">
          <button
            onClick={() => handleFeedback('helpful')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              feedback === 'helpful'
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="This was helpful"
          >
            👍 Helpful
          </button>
          <button
            onClick={() => handleFeedback('not-helpful')}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              feedback === 'not-helpful'
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="This was not helpful"
          >
            👎 Not helpful
          </button>
        </div>
      )}
    </div>
  );
}