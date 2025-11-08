'use client'

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 'interactive-mouse-effects',
      title: 'Build Interactive Mouse Effects in React',
      description: 'Learn by building! Create smooth mouse-following animations, hover effects, and particle systems with this step-by-step interactive tutorial. Features Minecraft and Roblox themes!',
      date: 'October 30, 2025',
      readTime: '15 min read',
      tags: ['React', 'Tutorial', 'Animation', 'Beginner-Friendly'],
      path: '/blogs/interactive-mouse-effects',
      featured: true,
      badge: 'NEW',
      badgeColor: 'bg-green-500',
      emoji: '🎮'
    },
    {
      id: 'build-pong-game',
      title: 'Build Pong Game in React',
      description: 'Take your skills to the next level! Learn game loops, collision detection, AI programming, and canvas rendering by building the classic Pong game from scratch.',
      date: 'November 2, 2025',
      readTime: '25 min read, play it now!',
      tags: ['React', 'Game Dev', 'Canvas API', 'Advanced'],
      path: '/blogs/build-pong-game',
      featured: true,
      badge: 'NEW',
      badgeColor: 'bg-purple-500',
      emoji: '🏓',
      comingSoon: false
    },
    {
      id: 'evolution-of-trust',
      title: 'The Evolution of Trust: How a Game Changed My Software Engineering Journey',
      description: 'The story of how "The Evolution of Trust" by Nicky Case sparked my passion for software engineering and shaped my approach to building systems...',
      date: 'January 2026',
      readTime: '8 min read',
      tags: ['Personal Story', 'Career', 'Game Theory'],
      path: '/blogs/evolution-of-trust',
      badge: 'COMING SOON',
      badgeColor: 'bg-orange-500',
      comingSoon: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
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
            Interactive tutorials, thoughts on software engineering, cloud architecture, and life.
          </p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <article 
                key={post.id}
                className={`bg-white rounded-3xl p-6 lg:p-8 shadow-xl transition-all ${
                  post.comingSoon 
                    ? 'opacity-90 hover:opacity-100' 
                    : 'hover:shadow-2xl hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {/* Badge */}
                  <span className={`px-4 py-1 ${post.badgeColor} text-white rounded-full text-sm font-bold`}>
                    {post.badge}
                  </span>
                  
                  {/* Date & Read Time */}
                  <span className="text-gray-500 text-sm">
                    {post.date} · {post.readTime}
                  </span>
                  
                  {/* Emoji */}
                  {post.emoji && (
                    <span className="text-2xl">{post.emoji}</span>
                  )}
                  
                  {/* Featured Star */}
                  {post.featured && !post.comingSoon && (
                    <span className="text-yellow-500 text-xl" title="Featured Tutorial">⭐</span>
                  )}
                </div>

                <a 
                  href={post.comingSoon ? '#' : post.path}
                  className={`block group ${post.comingSoon ? 'cursor-not-allowed' : ''}`}
                  onClick={(e) => post.comingSoon && e.preventDefault()}
                >
                  <h2 className={`text-2xl lg:text-3xl font-black text-gray-900 mb-3 transition-colors ${
                    !post.comingSoon && 'group-hover:text-orange-500'
                  }`}>
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => {
                      // Color mapping for tags
                      const tagColors = {
                        'React': 'bg-blue-100 text-blue-700',
                        'Tutorial': 'bg-green-100 text-green-700',
                        'Animation': 'bg-purple-100 text-purple-700',
                        'Beginner-Friendly': 'bg-cyan-100 text-cyan-700',
                        'Game Dev': 'bg-pink-100 text-pink-700',
                        'Canvas API': 'bg-indigo-100 text-indigo-700',
                        'Advanced': 'bg-red-100 text-red-700',
                        'Personal Story': 'bg-cyan-100 text-cyan-700',
                        'Career': 'bg-purple-100 text-purple-700',
                        'Game Theory': 'bg-blue-100 text-blue-700'
                      };
                      
                      return (
                        <span 
                          key={tag}
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tagColors[tag] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Call to Action */}
                  {!post.comingSoon && (
                    <div className="mt-4 inline-flex items-center gap-2 text-orange-500 font-bold group-hover:gap-3 transition-all">
                      <span>Start Learning</span>
                      <span>→</span>
                    </div>
                  )}
                </a>
              </article>
            ))}
          </div>

          {/* Newsletter + Ko-fi CTA */}
          <div className="mt-12 space-y-6">
            {/* Newsletter */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 lg:p-12 text-white text-center">
              <h3 className="text-3xl lg:text-4xl font-black mb-4">
                Want More Tutorials? 📚
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get notified when I publish new interactive tutorials and coding guides!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-3 rounded-full bg-white text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/50 placeholder:text-gray-400"
                />
                <button className="px-8 py-3 bg-white text-orange-500 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-sm opacity-75">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
            {/* Ko-fi */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ☕ Enjoy the Tutorials?
              </h3>
              <p className="text-gray-600 mb-6">
                Support my work and help me create more free, interactive content!
              </p>
              <a
                href="https://ko-fi.com/yatheeshnagella"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF5E5B] hover:bg-[#FF4542] text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
              >
                <span className="text-xl">☕</span>
                <span>Buy Me a Coffee on Ko-fi</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}