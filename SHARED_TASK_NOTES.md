# CarMatch AI - Iteration Notes

## Current Status
- ✅ Next.js 14 project setup with TypeScript and Tailwind CSS
- ✅ Google-inspired landing page with centered search bar
- ✅ 6 suggested search examples + detailed example
- ✅ Environment variable setup (.env.local.example)
- ✅ Chat interface implementation (transforms from landing page)
- ✅ Chat bubbles with proper styling (user right/blue, AI left/gray)
- ✅ localStorage persistence for conversations
- ✅ "Clear conversation" button functionality
- ✅ Loading state with animated dots
- ✅ OpenAI integration completed with GPT-4
- ✅ API route created at /app/api/chat/route.ts
- ✅ System prompt implemented for car expert behavior
- ✅ Error handling with retry logic (3 attempts)
- ✅ Proper error messages for different scenarios
- ✅ Rate limiting implemented (5 calls/min, 20 calls/hr per IP)
- ✅ Daily cost cap tracking ($1/day limit)
- ✅ Honeypot field for bot protection
- ✅ Blog structure created at /app/blog with layout
- ✅ Blog index page listing all 10 planned articles
- ✅ 7 of 10 SEO articles completed

## Next Steps (Priority Order)

### 1. SEO Content (In Progress - 7 of 10 completed)
- ✅ Created /blog route structure with layout
- ✅ Created blog index page with all 10 articles listed
- ✅ Completed articles:
  - "Best Used SUVs Under $15,000 in 2025"
  - "Mazda CX-5 Years to Avoid (And Which to Buy)" 
  - "How Many Miles is Too Many for a Used Car?"
  - "Should I Buy a Car with 100k Miles?"
  - "Best First Cars for Teenagers Under $10k"
  - "Toyota RAV4 vs Honda CR-V: Which Should You Buy?"
  - "Red Flags When Buying a Used Car (Mechanic's Checklist)"
- ⏳ Remaining 3 articles to write:
  - "Best AWD SUVs for Snow (Under $20k)"
  - "Is the Audi Q5 Reliable? Real Owner Experiences"
  - "How to Negotiate a Used Car Price (Scripts Included)"

### 2. Nice-to-Haves
- Dark mode toggle
- Share conversation link
- 'Was this helpful?' feedback buttons
- Simple admin dashboard for usage stats

## Technical Implementation Details

### OpenAI Integration:
- API route: /app/api/chat/route.ts
- Uses GPT-4 model (gpt-4-1106-preview)
- System prompt enforces car-only discussions
- Max 1000 tokens per response
- Temperature set to 0.7 for balanced responses
- Retry logic: 3 attempts with 1-second delays
- Error handling for rate limits, invalid API key, and general errors

### To Use the App:
1. Copy `.env.local.example` to `.env.local`
2. Add your OpenAI API key to `OPENAI_API_KEY`
3. Run `npm run dev`
4. Visit http://localhost:3000

### File Structure:
```
/app
  /api
    /chat
      - route.ts (OpenAI API integration + rate limiting)
  /blog
    - layout.tsx (blog layout with navigation)
    - page.tsx (blog index listing all articles)
    /best-used-suv-under-15000
      - page.tsx (completed SEO article)
    /mazda-cx5-years-to-avoid
      - page.tsx (completed SEO article)
    /how-many-miles-too-many-used-car
      - page.tsx (completed SEO article)
    /is-100k-miles-bad
      - page.tsx (completed SEO article)
  /components
    - ChatBubble.tsx
    - ChatInterface.tsx (includes honeypot field)
  /utils
    - rateLimiter.ts (IP-based rate limiting)
  - page.tsx (main entry, handles view switching)
  - types.ts (TypeScript interfaces)
```

### Rate Limiting Implementation:
- Created rateLimiter.ts utility with in-memory tracking
- Tracks requests per IP address
- Enforces 5 requests/minute and 20 requests/hour limits
- Daily cost cap of $1 (approx 500 requests at $0.002 per request)
- Honeypot field added to prevent bot submissions
- IP extracted from x-forwarded-for or x-real-ip headers

## Testing Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linting
```

## Notes for Next Developer
- OpenAI integration is complete and working
- API key must be set in .env.local for the chat to work
- Rate limiting is now implemented and active
- ESLint needs to be configured (run `npm run lint` and choose Strict)
- Blog structure is set up with layout and index page
- 4 SEO articles completed, using conversational tone with specific examples
- Articles are 1500-2000 words each with FAQ sections and internal links
- Each article needs its own directory under /app/blog/[slug]/page.tsx
- All articles include CTA to main CarMatch AI tool and related article links
- Consider implementing streaming responses for better UX
- Consider adding Cloudflare Turnstile for additional bot protection
- May want to add conversation length limits (max messages)
- Current token limit is 1000 per response - adjust if needed
- Rate limiter uses in-memory storage - consider Redis for production
- Cost tracking is approximate ($0.002 per request estimated)