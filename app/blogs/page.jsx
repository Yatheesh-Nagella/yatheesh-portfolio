'use client'

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 mb-12">
          Thoughts on software engineering, cloud architecture, and life.
        </p>

        {/* Blog Posts List */}
        <div className="space-y-8">
          {/* Coming Soon Post */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                COMING SOON
              </span>
              <span className="text-gray-500 text-sm">March 2025</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              The Evolution of Trust: How a Game Changed My Software Engineering Journey
            </h2>
            <p className="text-gray-600 mb-4">
              The story of how "The Evolution of Trust" by Nicky Case sparked my passion 
              for software engineering and shaped my approach to building systems...
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
                Personal Story
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                Career
              </span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                Game Theory
              </span>
            </div>
          </div>

          {/* Placeholder for more posts */}
          <div className="text-center py-12 text-gray-500">
            <p>More articles coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}