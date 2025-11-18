import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'best-used-suv-under-15000',
    title: 'Best Used SUVs Under $15,000 in 2025',
    description: 'Looking for a reliable SUV that won\'t break the bank? We\'ve tested dozens of options and found the absolute best used SUVs you can buy for under $15k right now.',
    date: '2025-01-15',
    readTime: '8 min read'
  },
  {
    slug: 'mazda-cx5-years-to-avoid',
    title: 'Mazda CX-5 Years to Avoid (And Which to Buy)',
    description: 'Not all CX-5s are created equal. Learn which model years have the most problems and which ones offer the best reliability and value.',
    date: '2025-01-14',
    readTime: '7 min read'
  },
  {
    slug: 'how-many-miles-too-many-used-car',
    title: 'How Many Miles is Too Many for a Used Car?',
    description: 'The truth about high-mileage cars might surprise you. Here\'s what mechanics really think about buying cars with 100k+ miles.',
    date: '2025-01-13',
    readTime: '6 min read'
  },
  {
    slug: 'should-i-buy-car-100k-miles',
    title: 'Should I Buy a Car with 100k Miles?',
    description: 'Is 100,000 miles the death sentence everyone claims? We break down the real risks and rewards of high-mileage car buying.',
    date: '2025-01-12',
    readTime: '7 min read'
  },
  {
    slug: 'best-first-car-teenager',
    title: 'Best First Cars for Teenagers Under $10k',
    description: 'Safety meets affordability in our expert picks for teen drivers. These reliable rides won\'t drain your wallet or keep you up at night.',
    date: '2025-01-11',
    readTime: '9 min read'
  },
  {
    slug: 'rav4-vs-crv',
    title: 'Toyota RAV4 vs Honda CR-V: Which Should You Buy?',
    description: 'Two legendary compact SUVs go head-to-head. We compare reliability, features, and real ownership costs to crown a winner.',
    date: '2025-01-10',
    readTime: '10 min read'
  },
  {
    slug: 'used-car-red-flags',
    title: 'Red Flags When Buying a Used Car (Mechanic\'s Checklist)',
    description: 'Don\'t get burned on your next used car purchase. Our mechanic reveals the warning signs that should send you running.',
    date: '2025-01-09',
    readTime: '8 min read'
  },
  {
    slug: 'best-awd-suv-snow-under-20k',
    title: 'Best AWD SUVs for Snow (Under $20k)',
    description: 'Winter is coming, but your budget isn\'t huge. Here are the most capable snow-crushing SUVs that won\'t leave you broke.',
    date: '2025-01-08',
    readTime: '7 min read'
  },
  {
    slug: 'is-audi-q5-reliable',
    title: 'Is the Audi Q5 Reliable? Real Owner Experiences',
    description: 'We surveyed 150+ Audi Q5 owners to get the unfiltered truth about reliability, maintenance costs, and common problems.',
    date: '2025-01-07',
    readTime: '9 min read'
  },
  {
    slug: 'how-to-negotiate-used-car-price',
    title: 'How to Negotiate a Used Car Price (Scripts Included)',
    description: 'Stop overpaying for used cars. Our word-for-word scripts and proven tactics will save you thousands on your next purchase.',
    date: '2025-01-06',
    readTime: '11 min read'
  }
]

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Car Buying Guides & Reviews
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        Expert advice to help you find the perfect car for your needs and budget
      </p>
      
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 pb-8">
            <Link 
              href={`/blog/${post.slug}`}
              className="group block hover:no-underline"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-3">
                {post.description}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="mx-2">·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}