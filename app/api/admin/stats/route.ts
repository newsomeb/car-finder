import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiterStats } from '@/app/utils/rateLimiter';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get rate limiter stats
    const rateLimiterStats = getRateLimiterStats();
    
    // Get feedback stats
    const feedbackStats = await getFeedbackStats();
    
    // Get share stats
    const shareStats = await getShareStats();
    
    // Compile all stats
    const stats = {
      timestamp: new Date().toISOString(),
      requests: {
        total: rateLimiterStats.totalRequests,
        dailyCost: rateLimiterStats.dailyCost,
        costLimit: rateLimiterStats.costLimit,
        activeIPs: rateLimiterStats.activeIPs,
        ipDetails: rateLimiterStats.ipDetails
      },
      feedback: feedbackStats,
      shares: shareStats,
      system: {
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        environment: process.env.NODE_ENV || 'development'
      }
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

async function getFeedbackStats() {
  try {
    const feedbackPath = path.join(process.cwd(), 'feedback.log');
    const exists = await fs.access(feedbackPath).then(() => true).catch(() => false);
    
    if (!exists) {
      return {
        total: 0,
        helpful: 0,
        notHelpful: 0,
        recent: []
      };
    }
    
    const content = await fs.readFile(feedbackPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const feedbacks = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    const stats = {
      total: feedbacks.length,
      helpful: feedbacks.filter(f => f.feedback === 'helpful').length,
      notHelpful: feedbacks.filter(f => f.feedback === 'not-helpful').length,
      recent: feedbacks.slice(-10).reverse() // Last 10, most recent first
    };
    
    return stats;
  } catch (error) {
    console.error('Error reading feedback stats:', error);
    return {
      total: 0,
      helpful: 0,
      notHelpful: 0,
      recent: []
    };
  }
}

async function getShareStats() {
  try {
    const sharesPath = path.join(process.cwd(), '.shares.json');
    const exists = await fs.access(sharesPath).then(() => true).catch(() => false);
    
    if (!exists) {
      return {
        total: 0,
        recent: []
      };
    }
    
    const content = await fs.readFile(sharesPath, 'utf-8');
    const shares = JSON.parse(content);
    
    const shareArray = Object.entries(shares).map(([id, data]: [string, any]) => ({
      id,
      messageCount: data.messages?.length || 0,
      createdAt: data.createdAt
    }));
    
    // Sort by creation date, most recent first
    shareArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return {
      total: shareArray.length,
      recent: shareArray.slice(0, 10) // Last 10 shares
    };
  } catch (error) {
    console.error('Error reading share stats:', error);
    return {
      total: 0,
      recent: []
    };
  }
}