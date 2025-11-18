interface RequestRecord {
  minuteCount: number;
  hourCount: number;
  minuteWindowStart: number;
  hourWindowStart: number;
}

interface CostTracking {
  dailyCost: number;
  dayStart: number;
}

class RateLimiter {
  private requestRecords: Map<string, RequestRecord> = new Map();
  private costTracking: CostTracking = {
    dailyCost: 0,
    dayStart: Date.now()
  };

  private readonly MINUTE_LIMIT = 5;
  private readonly HOUR_LIMIT = 20;
  private readonly DAILY_COST_LIMIT = 1.0;
  private readonly COST_PER_REQUEST = 0.002; // Approximate cost per GPT-4 request

  constructor() {
    // Clean up old records every 10 minutes
    setInterval(() => this.cleanupOldRecords(), 10 * 60 * 1000);
  }

  checkRateLimit(ip: string): { allowed: boolean; error?: string } {
    const now = Date.now();
    const minuteWindow = 60 * 1000; // 1 minute in milliseconds
    const hourWindow = 60 * 60 * 1000; // 1 hour in milliseconds
    const dayWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check daily cost cap
    if (now - this.costTracking.dayStart > dayWindow) {
      // Reset daily tracking
      this.costTracking = {
        dailyCost: 0,
        dayStart: now
      };
    }

    if (this.costTracking.dailyCost >= this.DAILY_COST_LIMIT) {
      return { 
        allowed: false, 
        error: 'Service temporarily unavailable due to high usage. Please try again tomorrow.' 
      };
    }

    // Get or create request record for this IP
    let record = this.requestRecords.get(ip);
    if (!record) {
      record = {
        minuteCount: 0,
        hourCount: 0,
        minuteWindowStart: now,
        hourWindowStart: now
      };
      this.requestRecords.set(ip, record);
    }

    // Check minute window
    if (now - record.minuteWindowStart > minuteWindow) {
      // Reset minute counter
      record.minuteCount = 0;
      record.minuteWindowStart = now;
    }

    // Check hour window
    if (now - record.hourWindowStart > hourWindow) {
      // Reset hour counter
      record.hourCount = 0;
      record.hourWindowStart = now;
    }

    // Check rate limits
    if (record.minuteCount >= this.MINUTE_LIMIT) {
      const waitTime = Math.ceil((minuteWindow - (now - record.minuteWindowStart)) / 1000);
      return { 
        allowed: false, 
        error: `Too many requests. Please wait ${waitTime} seconds before trying again.` 
      };
    }

    if (record.hourCount >= this.HOUR_LIMIT) {
      const waitMinutes = Math.ceil((hourWindow - (now - record.hourWindowStart)) / 60000);
      return { 
        allowed: false, 
        error: `Hourly limit reached. Please wait ${waitMinutes} minutes before trying again.` 
      };
    }

    // Update counters
    record.minuteCount++;
    record.hourCount++;
    this.costTracking.dailyCost += this.COST_PER_REQUEST;

    return { allowed: true };
  }

  private cleanupOldRecords() {
    const now = Date.now();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours

    this.requestRecords.forEach((record, ip) => {
      if (now - record.hourWindowStart > maxAge) {
        this.requestRecords.delete(ip);
      }
    });
  }

  getRemainingRequests(ip: string): { minute: number; hour: number } {
    const record = this.requestRecords.get(ip);
    if (!record) {
      return { minute: this.MINUTE_LIMIT, hour: this.HOUR_LIMIT };
    }

    const now = Date.now();
    const minuteWindow = 60 * 1000;
    const hourWindow = 60 * 60 * 1000;

    const minuteRemaining = now - record.minuteWindowStart > minuteWindow 
      ? this.MINUTE_LIMIT 
      : this.MINUTE_LIMIT - record.minuteCount;

    const hourRemaining = now - record.hourWindowStart > hourWindow 
      ? this.HOUR_LIMIT 
      : this.HOUR_LIMIT - record.hourCount;

    return {
      minute: Math.max(0, minuteRemaining),
      hour: Math.max(0, hourRemaining)
    };
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

export { rateLimiter };