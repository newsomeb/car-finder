#!/bin/bash

# CarMatch AI - Automated Setup and Continuous Claude Build
# Run this once before bed, wake up to a working car-finding AI website

set -e

echo "🚗 Setting up CarMatch AI with Continuous Claude..."
echo ""

# Get GitHub username
echo "📝 Getting your GitHub username..."
GH_USER=$(gh api user --jq '.login')
echo "✅ Found: $GH_USER"
echo ""

# Create .gitignore first
echo "📄 Creating .gitignore..."
cat > .gitignore << 'EOF'
# dependencies
node_modules/
.pnp
.pnp.js

# testing
coverage/

# next.js
.next/
out/
build/
dist/

# env files - NEVER COMMIT THESE
.env
.env.local
.env.*.local

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
*~
EOF

# Create README
echo "# CarMatch AI" > README.md
cat >> README.md << 'EOF'

AI-powered car recommendation engine. Just describe what you want, get expert recommendations.

## Features
- Conversational AI car finder
- Natural language input (write as little or as much as you want)
- Real-time recommendations with pros/cons
- SEO-optimized car buying guides
- Bot protection & rate limiting

## Tech Stack
- Next.js 14
- OpenAI GPT-4
- Tailwind CSS
- Vercel deployment

Built autonomously with continuous-claude.
EOF

# Create initial commit
git add .gitignore README.md
git commit -m "Initial commit: CarMatch AI setup"

# Rename branch to main
git branch -M main

# Create PRIVATE GitHub repo
echo "📦 Creating PRIVATE GitHub repository..."
gh repo create car-finder --private --source=. --remote=origin --push || echo "Repo might already exist, continuing..."

# Push to main
git push -u origin main 2>/dev/null || git push origin main

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "🚀 Starting Continuous Claude..."
echo "Building your car-finding AI website in 15 iterations..."
echo "This will take 30-90 minutes. Go to sleep, check in the morning."
echo ""
echo "What's being built:"
echo "  ✓ Landing page with Google-style search"
echo "  ✓ Chat interface with OpenAI integration"
echo "  ✓ Bot protection & rate limiting"
echo "  ✓ 10 SEO articles for organic traffic"
echo "  ✓ Mobile-responsive design"
echo "  ✓ Cost controls (max \$1/day during testing)"
echo ""

# Run continuous-claude with comprehensive instructions
~/.local/bin/continuous-claude \
  --prompt "Build CarMatch AI - an AI-powered car recommendation website. This should be a production-ready Next.js 14 app.

CORE FEATURES TO BUILD:

1. LANDING PAGE (Google-inspired):
   - Clean, centered search bar with placeholder: 'What kind of car are you looking for?'
   - Tagline above: 'Find the perfect car' (large, bold)
   - Subtext: 'Instant AI recommendations tailored to your life.'
   - 6 suggested search examples below search bar:
     * 'Reliable SUV under \$15k'
     * 'Family car with 3rd row seating'
     * 'Best first car for a teenager'
     * 'Fuel-efficient commuter under \$10k'
     * 'Off-road capable truck under \$25k'
     * 'Luxury sedan for highway driving'
   - ONE hilariously detailed example (in smaller text at bottom): 'I'm a 32-year-old software engineer in Seattle. I bike to work but need a car for weekend camping trips in the Cascades (lots of dirt roads). Budget is \$18k max. I'm 6'3\" so I need headroom. I hate sedans. I want something that looks cool but isn't flashy. Good speakers are a must because I listen to podcasts. I had a Honda Civic that was boring as hell. I like the idea of Subarus but everyone in Seattle has one and I don't want to be basic. Also I have a dog (golden retriever) so I need space for him and camping gear. Heated seats would be nice because it's cold here. I don't care about 0-60 times but I do care about reliability because I'm terrible at remembering to do maintenance. What should I get?'
   - Minimal design, white background, clean sans-serif font

2. CHAT INTERFACE:
   - When user types in search bar, page transforms into chat UI
   - Clean chat bubbles (user on right, AI on left)
   - AI should ask clarifying questions if needed (budget, location, use case, must-have features)
   - AI gives 3-5 specific car recommendations with:
     * Year/Make/Model
     * Why it matches their needs
     * Realistic price range
     * Common issues to watch for
     * Links to CarGurus/Autotrader listings
   - User can continue conversing naturally
   - 'Clear conversation' button in top-right
   - Conversation stored in localStorage (persists across refreshes)

3. OPENAI INTEGRATION:
   - Use OpenAI GPT-4 API (do NOT hardcode API key - use environment variable OPENAI_API_KEY)
   - System prompt: 'You are a car-buying expert assistant. Your ONLY job is to help people find the perfect car for their needs and budget. Rules: Only discuss cars and car buying. If asked about anything else, politely redirect. Be concise but thorough. Always ask for budget, location, primary use, must-have features if not provided. Give 3-5 specific recommendations with year/model. Include common issues and realistic price ranges. Be honest about trade-offs. Never say \"as an AI\" - just be a helpful car expert.'
   - Max 4000 tokens per conversation
   - Max 10 messages per session

4. BOT PROTECTION & RATE LIMITING:
   - Implement Cloudflare Turnstile OR simple rate limiting
   - Max 5 API calls per minute per IP
   - Max 20 API calls per hour per IP
   - Honeypot field (hidden input that bots fill but humans don't)
   - Daily cost cap: if OpenAI API spend exceeds \$1/day, show maintenance message
   - Friendly error messages for rate limits

5. SEO CONTENT - Create 10 blog articles (in /blog or /articles):
   Each article should be 1500-2000 words, conversational but authoritative, NOT sound like AI:

   a) 'Best Used SUVs Under \$15,000 in 2025' - target keyword: 'best used suv under 15000'
   b) 'Mazda CX-5 Years to Avoid (And Which to Buy)' - target: 'mazda cx-5 years to avoid'
   c) 'How Many Miles is Too Many for a Used Car?' - target: 'how many miles is too much for used car'
   d) 'Should I Buy a Car with 100k Miles?' - target: 'is 100k miles bad for a used car'
   e) 'Best First Cars for Teenagers Under \$10k' - target: 'best first car for teenager'
   f) 'Toyota RAV4 vs Honda CR-V: Which Should You Buy?' - target: 'rav4 vs crv'
   g) 'Red Flags When Buying a Used Car (Mechanic's Checklist)' - target: 'used car red flags'
   h) 'Best AWD SUVs for Snow (Under \$20k)' - target: 'best awd suv for snow under 20k'
   i) 'Is the Audi Q5 Reliable? Real Owner Experiences' - target: 'is audi q5 reliable'
   j) 'How to Negotiate a Used Car Price (Scripts Included)' - target: 'how to negotiate used car price'

   - Use proper H2/H3 headers
   - Include FAQ sections
   - Internal link between articles
   - Write like a human car enthusiast, not like AI
   - Include specific examples, years, models, prices
   - Be opinionated but fair

6. TECHNICAL REQUIREMENTS:
   - Next.js 14 with App Router
   - Tailwind CSS for styling
   - TypeScript
   - Mobile-responsive (looks great on phone)
   - Fast loading (<2s)
   - Environment variables for API key (create .env.local example file)
   - Deploy-ready for Vercel
   - Proper error handling (API down, rate limit, etc.)
   - Simple analytics (track searches to console or file)

7. SECURITY & BEST PRACTICES:
   - API key NEVER in code or committed to Git
   - .env.local in .gitignore
   - Input sanitization
   - CORS properly configured
   - No console.log in production

8. NICE TO HAVES (if time permits):
   - Dark mode toggle
   - Share conversation link
   - 'Was this helpful?' feedback buttons
   - Simple admin dashboard showing usage stats

IMPORTANT NOTES:
- This is a PRIVATE repo - do not make it public
- Build incrementally - landing page first, then chat, then SEO content
- Test OpenAI integration thoroughly
- Make sure bot protection actually works
- Articles should be genuinely helpful, not SEO spam
- The site should feel trustworthy and professional
- Focus on user experience - fast, clean, helpful

Build this as if you're launching a real startup. Quality over speed." \
  --max-runs 15 \
  --owner "$GH_USER" \
  --repo car-finder \
  --merge-strategy squash

echo ""
echo "🎉 Continuous Claude is running!"
echo ""
echo "📊 Progress:"
echo "  - Check: https://github.com/$GH_USER/car-finder/pulls"
echo "  - Logs: This terminal (leave it open)"
echo ""
echo "💤 Go to sleep. Check back in 6-8 hours."
echo ""
