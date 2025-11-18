import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Message } from '@/app/types';

const SYSTEM_PROMPT = `You are a car-buying expert assistant. Your ONLY job is to help people find the perfect car for their needs and budget. Rules: Only discuss cars and car buying. If asked about anything else, politely redirect. Be concise but thorough. Always ask for budget, location, primary use, must-have features if not provided. Give 3-5 specific recommendations with year/model. Include common issues and realistic price ranges. Be honest about trade-offs. Never say "as an AI" - just be a helpful car expert.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: Message[] };

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