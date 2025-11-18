import Link from 'next/link'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CarMatch AI
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Find Cars
              </Link>
              <Link href="/blog" className="text-gray-900 font-medium">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 CarMatch AI - Your AI-powered car recommendation expert
          </p>
        </div>
      </footer>
    </div>
  )
}