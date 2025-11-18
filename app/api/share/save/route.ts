import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Message } from '@/app/types';

interface SaveShareRequest {
  messages: Message[];
}

interface SharedConversation {
  id: string;
  messages: Message[];
  createdAt: string;
}

const SHARES_FILE = path.join(process.cwd(), '.shares.json');

// Generate a simple ID (in production, use nanoid or uuid)
function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

async function getShares(): Promise<Record<string, SharedConversation>> {
  try {
    const data = await fs.readFile(SHARES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveShares(shares: Record<string, SharedConversation>): Promise<void> {
  await fs.writeFile(SHARES_FILE, JSON.stringify(shares, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveShareRequest = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages to share' },
        { status: 400 }
      );
    }

    // Generate unique ID
    let shareId = generateShareId();
    const shares = await getShares();

    // Ensure ID is unique
    while (shares[shareId]) {
      shareId = generateShareId();
    }

    // Save conversation
    const sharedConversation: SharedConversation = {
      id: shareId,
      messages,
      createdAt: new Date().toISOString()
    };

    shares[shareId] = sharedConversation;
    await saveShares(shares);

    // Return the share ID and URL
    const shareUrl = `/share/${shareId}`;

    return NextResponse.json({
      shareId,
      shareUrl
    });

  } catch (error) {
    console.error('Error saving shared conversation:', error);
    return NextResponse.json(
      { error: 'Failed to save shared conversation' },
      { status: 500 }
    );
  }
}