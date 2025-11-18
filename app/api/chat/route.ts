import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Message } from '@/app/types';
import { rateLimiter } from '@/app/utils/rateLimiter';

const SYSTEM_PROMPT = `You are a car-buying expert assistant. Your ONLY job is to help people find the perfect car for their needs and budget. Rules: Only discuss cars and car buying. If asked about anything else, politely redirect. Be concise but thorough. Always ask for budget, location, primary use, must-have features if not provided. Give 3-5 specific recommendations with year/model. Include common issues and realistic price ranges. Be honest about trade-offs. Never say "as an AI" - just be a helpful car expert.`;

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Fallback to a default if no IP found
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, honeypot } = body as { messages: Message[]; honeypot?: string };

    // Check honeypot field for bot protection
    if (honeypot) {
      // Bot detected - honeypot field should be empty for real users
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Extract client IP and check rate limit
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openaiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      content: responseContent,
    });

  } catch (error: any) {
    console.error('OpenAI API error:', error);

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}