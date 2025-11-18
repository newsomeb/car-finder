export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  feedback?: 'helpful' | 'not-helpful' | null;
}

export interface Conversation {
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}