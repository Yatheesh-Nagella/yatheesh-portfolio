'use client'

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header - Reduced top padding */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-6xl mx-auto">
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mb-6 transition-colors"
          >
            <span>←</span> Back to Home
          </a>
          
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-3">
            Blog
          </h1>
          <p className="text-lg text-gray-600">
            Thoughts on software engineering, cloud architecture, and life.
          </p>
        </div>
      </header>

      {/* Blog Posts - Reduced top margin */}
      <main className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {/* Blog Post Card */}
            <article className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                  COMING SOON
                </span>
                <span className="text-gray-500">March 2025</span>
              </div>

              <a 
                href="/blogs/evolution-of-trust"
                className="block group"
              >
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                  The Evolution of Trust: How a Game Changed My Software Engineering Journey
                </h2>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  The story of how "The Evolution of Trust" by Nicky Case sparked my passion for software engineering and shaped my approach to building systems...
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                    Personal Story
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    Career
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Game Theory
                  </span>
                </div>
              </a>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}