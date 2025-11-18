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
- ✅ All 10 SEO articles completed
- ✅ Dark mode toggle implemented with system preference detection
- ✅ 'Was this helpful?' feedback buttons implemented
- ✅ Share conversation link functionality implemented

## Next Steps (Priority Order)

### Nice-to-Haves
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

### Dark Mode Implementation:
- Created ThemeProvider.tsx using React Context for state management
- Theme preference persists in localStorage
- Automatically detects system preference on first visit
- Toggle button fixed in top-right corner with sun/moon icons
- Smooth transitions between light and dark modes
- All components updated with dark mode Tailwind classes

### Feedback Feature Implementation:
- Added feedback property to Message type (helpful/not-helpful/null)
- ChatBubble now displays thumbs up/down buttons for AI responses
- Feedback persists in localStorage with conversation
- Created /app/api/feedback/route.ts endpoint to log feedback
- Feedback data includes messageId, feedback type, content snippet, timestamp, and IP
- Feedback.log added to .gitignore
- Toggle functionality: clicking same button removes feedback

### Share Conversation Implementation:
- Added share button to ChatInterface header (appears when messages exist)
- Created API routes for saving and retrieving shared conversations
- POST /api/share/save - saves conversation and returns unique ID
- GET /api/share/[id] - retrieves shared conversation by ID
- Share data stored in .shares.json file (added to .gitignore)
- Share IDs are 8-character random strings
- Created /app/share/[id]/page.tsx for viewing shared conversations
- Read-only view with clear messaging about starting own conversation
- Share URL automatically copied to clipboard when share button clicked
- Includes dark mode support and theme toggle on share pages

### File Structure:
```
/app
  /api
    /chat
      - route.ts (OpenAI API integration + rate limiting)
    /feedback
      - route.ts (Feedback logging API)
    /share
      /save
        - route.ts (Save shared conversations)
      /[id]
        - route.ts (Retrieve shared conversations)
  /blog
    - layout.tsx (blog layout with navigation + dark mode)
    - page.tsx (blog index listing all articles)
    /best-awd-suv-snow-under-20k
      - page.tsx (completed SEO article)
    /best-first-car-teenager
      - page.tsx (completed SEO article)
    /best-used-suv-under-15000
      - page.tsx (completed SEO article)
    /how-many-miles-too-many-used-car
      - page.tsx (completed SEO article)
    /how-to-negotiate-used-car-price
      - page.tsx (completed SEO article)
    /is-100k-miles-bad
      - page.tsx (completed SEO article)
    /is-audi-q5-reliable
      - page.tsx (completed SEO article)
    /mazda-cx5-years-to-avoid
      - page.tsx (completed SEO article)
    /rav4-vs-crv
      - page.tsx (completed SEO article)
    /used-car-red-flags
      - page.tsx (completed SEO article)
  /components
    - ChatBubble.tsx (dark mode + feedback buttons)
    - ChatInterface.tsx (includes honeypot field + dark mode + feedback handler + share button)
    - ThemeProvider.tsx (dark mode context)
    - ThemeToggle.tsx (toggle button component)
  /share
    /[id]
      - page.tsx (View shared conversations)
  /utils
    - rateLimiter.ts (IP-based rate limiting)
  - page.tsx (main entry, handles view switching + dark mode)
  - layout.tsx (root layout with ThemeProvider)
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
- All 10 SEO articles completed, using conversational tone with specific examples
- Articles are 1500-2000 words each with FAQ sections and internal links
- Each article has its own directory under /app/blog/[slug]/page.tsx
- All articles include CTA to main CarMatch AI tool and related article links
- Dark mode is fully implemented with toggle button and localStorage persistence
- Dark mode automatically detects system preference on first visit
- All blog articles still need dark mode classes added (only index/layout updated)
- Consider implementing streaming responses for better UX
- Consider adding Cloudflare Turnstile for additional bot protection
- May want to add conversation length limits (max messages)
- Current token limit is 1000 per response - adjust if needed
- Rate limiter uses in-memory storage - consider Redis for production
- Cost tracking is approximate ($0.002 per request estimated)
- Feedback is currently logged to feedback.log file - consider database for production
- Feedback buttons appear below every AI response and persist state
- Share functionality uses JSON file storage (.shares.json) - consider database for production
- Share IDs are simple 8-char strings - consider using nanoid or UUID for better uniqueness
- Shared conversations are read-only with prompts to start new conversations
- Share button appears in chat header when messages exist
- Share URLs are automatically copied to clipboard when share button is clicked