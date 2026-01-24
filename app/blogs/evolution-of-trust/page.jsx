'use client'

export default function EvolutionOfTrustPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              <span>←</span> Back to Blog
            </a>
            
            <a 
              href="/" 
              className="text-gray-600 hover:text-orange-500 font-semibold transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <article>
          <div className="mb-8">
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4">
              COMING SOON
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              The Evolution of Trust: How a Game Changed My Software Engineering Journey
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm md:text-base">
              <span className="font-medium">By Yatheesh Nagella</span>
              <span>•</span>
              <span>December 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://ncase.me/trust/social/thumbnail.png" 
              alt="Evolution of Trust Game"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-3 text-center italic">
              Screenshot from "The Evolution of Trust" by Nicky Case
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                📝 Article in Progress
              </p>
              <p className="text-gray-700">
                This article is currently being written. Check back in March 2026 for the full story!
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">What to Expect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">In this post, I'll share:</p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>How I discovered "The Evolution of Trust" game</li>
              <li>The profound impact it had on my understanding of systems</li>
              <li>How game theory principles apply to software engineering</li>
              <li>Why trust is fundamental in building scalable systems</li>
              <li>Lessons learned from building distributed systems</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Preview</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              In 2017, I stumbled upon a simple web game called "The Evolution of Trust" 
              by Nicky Case. What started as casual curiosity turned into a pivotal moment 
              in my software engineering journey...
            </p>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-r-lg my-8">
              <p className="text-gray-800 text-lg italic leading-relaxed">
                "Trust is not just a human concept—it's a fundamental principle in 
                system design, distributed computing, and even AI architecture."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Coming Soon</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Subscribe to get notified when this article is published. I'll be diving 
              deep into the technical and philosophical implications of trust in modern 
              software systems.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                Personal Story
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Career
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                Game Theory
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Systems Design
              </span>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              YN
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-1">Yatheesh Nagella</h4>
              <p className="text-gray-600 mb-4">
                Software Engineer & Cloud Solutions Consultant specializing in multi-cloud architecture, DevOps automation, and scalable systems.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://linkedin.com/in/Yatheesh-Nagella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/Yatheesh-Nagella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="mailto:yatheeshnagella17@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Follow */}
        <div className="mt-12 bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 rounded-2xl p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
            Want to Read More?
          </h3>
          <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
            Follow me on LinkedIn or GitHub to get notified when new articles are published.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://linkedin.com/in/Yatheesh-Nagella"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Follow on LinkedIn
            </a>
            <a 
              href="https://github.com/Yatheesh-Nagella"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Follow on GitHub
            </a>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          
          <a
            href="/blogs"
            className="px-8 py-4 bg-white border-2 border-orange-500 text-orange-500 rounded-full font-bold text-center hover:bg-orange-50 transition-all"
          >
            ← Back to All Posts
          </a>
          
          <a
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-center shadow-lg hover:shadow-xl transition-all"
          >
            Return to Home →
          </a>
        </div>
      </div>
    </div>
  );
}