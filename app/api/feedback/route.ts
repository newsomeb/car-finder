import { NextResponse } from 'next/server';
import { appendFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { messageId, feedback, content } = await request.json();
    
    if (!messageId || !feedback || !['helpful', 'not-helpful'].includes(feedback)) {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }
    
    const feedbackData = {
      messageId,
      feedback,
      content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    };
    
    // In production, you would store this in a database
    // For now, we'll append to a log file
    const logPath = join(process.cwd(), 'feedback.log');
    await appendFile(
      logPath,
      JSON.stringify(feedbackData) + '\n'
    ).catch(() => {
      // If file write fails, just log to console
      console.log('Feedback received:', feedbackData);
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}