'use client'

export default function EvolutionOfTrustPost() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <a href="/blogs" className="text-orange-500 hover:text-orange-600 mb-8 inline-block">
          ← Back to Blog
        </a>

        {/* Article Header */}
        <article>
          <div className="mb-8">
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              COMING SOON
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              The Evolution of Trust: How a Game Changed My Software Engineering Journey
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>By Yatheesh Nagella</span>
              <span>•</span>
              <span>March 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-lg overflow-hidden">
            <img 
              src="https://ncase.me/trust/social/thumbnail.png" 
              alt="Evolution of Trust Game"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Screenshot from "The Evolution of Trust" by Nicky Case
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6 font-medium">
              This article is currently being written. Check back soon!
            </p>

            <h2>What to Expect</h2>
            <p>In this post, I'll share:</p>
            <ul>
              <li>How I discovered "The Evolution of Trust" game</li>
              <li>The profound impact it had on my understanding of systems</li>
              <li>How game theory principles apply to software engineering</li>
              <li>Why trust is fundamental in building scalable systems</li>
              <li>Lessons learned from building distributed systems</li>
            </ul>

            <h2>Preview</h2>
            <p>
              In 2017, I stumbled upon a simple web game called "The Evolution of Trust" 
              by Nicky Case. What started as casual curiosity turned into a pivotal moment 
              in my software engineering journey...
            </p>

            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 my-8">
              <p className="text-gray-700 italic">
                "Trust is not just a human concept—it's a fundamental principle in 
                system design, distributed computing, and even AI architecture."
              </p>
            </div>

            <h2>Coming Soon</h2>
            <p>
              Subscribe to get notified when this article is published. I'll be diving 
              deep into the technical and philosophical implications of trust in modern 
              software systems.
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-12 pt-8 border-t border-gray-200">
            <span className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
              Personal Story
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Career
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              Game Theory
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              Systems Design
            </span>
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 to-cyan-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in reading more?
          </h3>
          <p className="text-gray-600 mb-6">
            Follow me on LinkedIn or GitHub to get notified when new articles are published.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="https://linkedin.com/in/Yatheesh-Nagella"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Follow on LinkedIn
            </a>
            <a 
              href="https://github.com/Yatheesh-Nagella"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Follow on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}