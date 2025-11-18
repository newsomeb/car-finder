import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SHARES_FILE = path.join(process.cwd(), '.shares.json');

async function getShares(): Promise<Record<string, any>> {
  try {
    const data = await fs.readFile(SHARES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    const shares = await getShares();
    const sharedConversation = shares[id];

    if (!sharedConversation) {
      return NextResponse.json(
        { error: 'Shared conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      conversation: sharedConversation
    });

  } catch (error) {
    console.error('Error retrieving shared conversation:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared conversation' },
      { status: 500 }
    );
  }
}