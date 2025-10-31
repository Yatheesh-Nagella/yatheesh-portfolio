'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  trackTutorialView, 
  trackCodeCopy, 
  trackTutorialAction, 
  trackTutorialNavigation,
  trackTutorialShare 
} from '@/lib/analytics';

// ============================================================================
// LIVE DEMO COMPONENT
// ============================================================================

const LiveDemo = ({ currentStep = 0 }) => {
  const [mousePos, setMousePos] = useState({ x: 300, y: 300 });
  const [hoveredBrick, setHoveredBrick] = useState(null);
  const [butterflyPos, setButterflyPos] = useState({ x: 300, y: 300 });
  const [trail, setTrail] = useState([]);
  const [theme, setTheme] = useState('minecraft');
  const animationFrameRef = useRef(null);

  // Track when step changes
  useEffect(() => {
    trackTutorialView('interactive_mouse_effects', currentStep);
  }, [currentStep]);

  // Mouse tracking (Step 1)
  useEffect(() => {
    if (currentStep < 1) return;
    const handleMouseMove = (e) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    return () => {};
  }, [currentStep]);

  // Butterfly following with lerp (Step 3)
  useEffect(() => {
    if (currentStep < 3) return;
    const animate = () => {
      setButterflyPos((prev) => {
        const speed = 0.12;
        return {
          x: prev.x + (mousePos.x - prev.x) * speed,
          y: prev.y + (mousePos.y - prev.y) * speed,
        };
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos, currentStep]);

  // Trail effect (Step 5)
  useEffect(() => {
    if (currentStep < 5) return;
    const interval = setInterval(() => {
      setTrail((prev) => [
        ...prev.slice(-8),
        { x: butterflyPos.x, y: butterflyPos.y, id: Date.now() },
      ]);
    }, 60);
    return () => clearInterval(interval);
  }, [butterflyPos, currentStep]);

  const bricks = Array.from({ length: 24 }, (_, i) => i);

  const themes = {
    minecraft: {
      colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
      emoji: '🦋',
      bg: '#87CEEB',
      name: 'Minecraft',
    },
    roblox: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
      emoji: '🚀',
      bg: '#A8DADC',
      name: 'Roblox',
    },
  };

  const current = themes[theme];

  const getBrickStyle = (index) => {
    const isHovered = hoveredBrick === index && currentStep >= 2;
    const color = current.colors[index % current.colors.length];

    return {
      width: isHovered ? '70px' : '60px',
      height: isHovered ? '70px' : '60px',
      backgroundColor: isHovered ? '#FFD700' : color,
      transform: `scale(${isHovered ? 1.15 : 1}) rotate(${isHovered ? 5 : 0}deg)`,
      transition: currentStep >= 2 ? 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      borderRadius: theme === 'minecraft' ? '2px' : '8px',
      border: theme === 'minecraft' ? '2px solid #654321' : '2px solid rgba(255,255,255,0.5)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      fontSize: '14px',
    };
  };

  return (
    <div
      onMouseMove={(e) => {
        if (currentStep >= 1) {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        backgroundColor: current.bg,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}
    >
      {/* Theme Switcher (Step 4) */}
      {currentStep >= 4 && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={() => {
              setTheme('minecraft');
              trackTutorialAction('theme_change', 'minecraft');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: theme === 'minecraft' ? '#FFD700' : '#555',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            ⛏️ Minecraft
          </button>
          <button
            onClick={() => {
              setTheme('roblox');
              trackTutorialAction('theme_change', 'roblox');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: theme === 'roblox' ? '#FFD700' : '#555',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
          >
            🎮 Roblox
          </button>
        </div>
      )}

      {/* Coordinates Display (Step 1) */}
      {currentStep >= 1 && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 10,
        }}>
          <div>🖱️ ({Math.round(mousePos.x)}, {Math.round(mousePos.y)})</div>
          {currentStep >= 3 && (
            <div>🦋 ({Math.round(butterflyPos.x)}, {Math.round(butterflyPos.y)})</div>
          )}
        </div>
      )}

      {/* Brick Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        padding: '80px 40px 40px 40px',
        maxWidth: '500px',
        margin: '0 auto',
      }}>
        {bricks.map((brick) => (
          <div
            key={brick}
            style={getBrickStyle(brick)}
            onMouseEnter={() => currentStep >= 2 && setHoveredBrick(brick)}
            onMouseLeave={() => setHoveredBrick(null)}
          >
            {brick + 1}
          </div>
        ))}
      </div>

      {/* Butterfly Follower (Step 3) */}
      {currentStep >= 3 && (
        <div style={{
          position: 'absolute',
          left: butterflyPos.x,
          top: butterflyPos.y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          fontSize: '32px',
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
        }}>
          {current.emoji}
        </div>
      )}

      {/* Trail (Step 5) */}
      {currentStep >= 5 && trail.map((point, i) => (
        <div
          key={point.id}
          style={{
            position: 'absolute',
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            fontSize: '14px',
            opacity: (i / trail.length) * 0.4,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// CODE SNIPPET COMPONENT
// ============================================================================

const CodeSnippet = ({ code, language = 'javascript', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    trackCodeCopy(title || 'unknown_snippet');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden my-6 shadow-lg">
      {title && (
        <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
          <span className="text-white text-sm font-semibold">{title}</span>
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              copied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}
      <pre className="p-5 overflow-x-auto">
        <code className="text-gray-300 text-sm font-mono leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
};

// ============================================================================
// MAIN TUTORIAL COMPONENT
// ============================================================================

export default function InteractiveMouseEffectsTutorial() {
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 to show nothing initially

  const steps = [
    { id: 0, title: 'Start', label: 'Intro' },
    { id: 1, title: 'Step 1: Mouse Tracking', label: 'Mouse' },
    { id: 2, title: 'Step 2: Hover Effects', label: 'Hover' },
    { id: 3, title: 'Step 3: Butterfly Follower', label: 'Follower' },
    { id: 4, title: 'Step 4: Theme Switching', label: 'Themes' },
    { id: 5, title: 'Step 5: Trail Effect', label: 'Trail' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(`step-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track initial page view
  useEffect(() => {
    trackTutorialView('interactive_mouse_effects', 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/blogs"
            className="text-white hover:text-orange-500 transition-colors flex items-center gap-2"
            onClick={() => trackTutorialNavigation('back_to_blog')}
          >
            ← Back to Blog
          </Link>
          <Link 
            href="/"
            className="text-white hover:text-orange-500 transition-colors"
            onClick={() => trackTutorialNavigation('return_home')}
          >
            Return Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-black/30 text-white py-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 ">
          🎮 Build Interactive Mouse Effects
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Learn by building! See the demo, understand the theory, copy the code.
        </p>

        {/* Mobile Warning */}
        <div className="md:hidden mb-6 bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-200">
            📱 <strong>Mobile Tip:</strong> This tutorial works best on desktop for full interactive experience!
          </p>
        </div>

        {/* Step Navigator */}
        <div className="flex justify-center gap-2 flex-wrap max-w-3xl mx-auto">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStep(step.id);
                scrollToSection(step.id);
                trackTutorialAction('step_navigation', step.label);
              }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                currentStep >= step.id
                  ? 'bg-yellow-400 text-black border-2 border-yellow-500'
                  : 'bg-white/10 text-white border-2 border-white/30'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Live Demo Section */}
        <section id="step-0" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 ">🎯 Live Demo</h2>
          <p className="text-lg text-gray-700 mb-4">
            This is what we'll build! Move your mouse and watch the magic happen.
          </p>
          
          {/* UPDATED INSTRUCTIONS - More prominent */}
          <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-pink-100 border-3 border-orange-400 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-3xl">👉</span>
              <div>
                <p className="text-lg font-bold text-orange-900 mb-2">
                  ⚡ How to Use This Demo:
                </p>
                <p className="text-gray-800 leading-relaxed">
                  Click the <strong className="text-orange-600">step buttons above</strong> (Mouse, Hover, Follower, Themes, Trail) 
                  to progressively activate each feature. Then scroll down to read the explanation and code for that step!
                </p>
                <p className="text-sm text-gray-600 mt-2 italic">
                  💡 Start with "Mouse" to see the first feature, then move through each step to build up the full effect.
                </p>
              </div>
            </div>
          </div>

          <LiveDemo currentStep={currentStep} />

          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-400 rounded-lg">
            <strong className="text-blue-900">🎮 Currently Active Features:</strong>
            <ul className="mt-3 space-y-2 text-blue-800">
              {currentStep === 0 && (
                <li className="text-gray-500">
                  👆 Click a step button above to start activating features!
                </li>
              )}
              {currentStep >= 1 && <li>✅ Mouse position tracking</li>}
              {currentStep >= 2 && <li>✅ Brick hover effects</li>}
              {currentStep >= 3 && <li>✅ Smooth butterfly follower</li>}
              {currentStep >= 4 && <li>✅ Theme switching</li>}
              {currentStep >= 5 && <li>✅ Sparkle trail effect</li>}
            </ul>
          </div>
        </section>

        {/* Step 1: Mouse Tracking */}
        <section id="step-1" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            STEP 1
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">🖱️ Mouse Tracking</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>The Foundation:</strong> Everything starts with knowing where the user's mouse is!
              We need to track the cursor position so our elements can react to it.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">🧠 The Concept</h3>
            <p className="text-gray-700">
              Browsers fire a <code className="bg-gray-100 px-2 py-1 rounded">mousemove</code> event
              every time the mouse moves. We listen to this event and save the X and Y coordinates.
            </p>

            <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6 my-6">
              <strong className="text-orange-900">💡 Think of it like this:</strong><br/>
              <p className="text-orange-800 mt-2">
                Imagine the screen is a giant graph paper. When you move your mouse:
              </p>
              <ul className="mt-3 space-y-2 text-orange-800">
                <li><strong>X coordinate</strong>: How far right from the left edge (0 = left, higher = right)</li>
                <li><strong>Y coordinate</strong>: How far down from the top (0 = top, higher = bottom)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">📝 The Code</h3>

            <CodeSnippet
              title="Step 1: Mouse Tracking Setup"
              code={`import { useState, useEffect } from 'react';

function MouseTracker() {
  // Create a state to store mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // This function runs every time the mouse moves
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,  // Horizontal position
        y: e.clientY   // Vertical position
      });
    };

    // Tell the browser to listen for mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup: Remove listener when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty array means "run once on mount"

  return (
    <div>
      <p>Mouse position: ({mousePos.x}, {mousePos.y})</p>
    </div>
  );
}`}
            />

            <button
              onClick={() => {
                setCurrentStep(1);
                scrollToSection(0);
                trackTutorialAction('activate_step', 'step_1');
              }}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg transition-colors"
            >
              ▶️ Activate Step 1 in Demo Above
            </button>
          </div>
        </section>

        {/* Step 2: Hover Effects */}
        <section id="step-2" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            STEP 2
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">✨ Hover Effects</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>Making It Interactive:</strong> Now let's make the bricks react when you hover over them!
              They should grow bigger, change color, and rotate slightly.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">🧠 The Concept</h3>
            <p className="text-gray-700">
              We track which brick is being hovered and apply special styles to it. CSS handles the smooth animation
              automatically using <code className="bg-gray-100 px-2 py-1 rounded">transition</code>.
            </p>

            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 my-6">
              <strong className="text-yellow-900">💡 The Magic Formula:</strong><br/>
              <code className="bg-gray-800 text-white px-2 py-1 rounded mt-2 inline-block">
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)
              </code>
              <ul className="mt-3 space-y-2 text-yellow-800">
                <li><strong>all</strong>: Animate all properties that change</li>
                <li><strong>0.3s</strong>: Take 300 milliseconds (smooth but quick)</li>
                <li><strong>cubic-bezier(...)</strong>: Creates a "bouncy" effect</li>
              </ul>
            </div>

            <CodeSnippet
              title="Step 2: Adding Hover Effects"
              code={`function InteractiveBricks() {
  const [hoveredBrick, setHoveredBrick] = useState(null);
  
  // Create array of bricks [0, 1, 2, 3, ..., 23]
  const bricks = Array.from({ length: 24 }, (_, i) => i);

  const getBrickStyle = (index) => {
    const isHovered = hoveredBrick === index;
    
    return {
      width: isHovered ? '70px' : '60px',      // Grow when hovered
      height: isHovered ? '70px' : '60px',
      backgroundColor: isHovered ? '#FFD700' : '#8B4513',  // Gold vs Brown
      transform: isHovered 
        ? 'scale(1.15) rotate(5deg)'           // Bigger + slight rotation
        : 'scale(1) rotate(0deg)',             // Normal state
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy!
      cursor: 'pointer',
    };
  };

  return (
    <div>
      {bricks.map((brick) => (
        <div
          key={brick}
          style={getBrickStyle(brick)}
          onMouseEnter={() => setHoveredBrick(brick)}    // Track entry
          onMouseLeave={() => setHoveredBrick(null)}      // Track exit
        >
          {brick + 1}
        </div>
      ))}
    </div>
  );
}`}
            />

            <button
              onClick={() => {
                setCurrentStep(2);
                scrollToSection(0);
                trackTutorialAction('activate_step', 'step_2');
              }}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg transition-colors"
            >
              ▶️ Activate Step 2 in Demo Above
            </button>
          </div>
        </section>

        {/* Step 3: Butterfly Follower */}
        <section id="step-3" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            STEP 3
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">🦋 Smooth Butterfly Follower</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>The Star of the Show:</strong> Let's add a butterfly that smoothly follows your cursor!
              Instead of jumping instantly, it gracefully glides to catch up.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">🧠 The Concept: Linear Interpolation (Lerp)</h3>
            <p className="text-gray-700">
              <strong>Lerp</strong> is a technique that smoothly transitions from one value to another.
              Instead of teleporting to the target, we move a percentage of the distance each frame.
            </p>

            <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 my-6">
              <strong className="text-blue-900">💡 The Math (Don't Worry, It's Simple!):</strong><br/>
              <pre className="bg-gray-900 text-gray-200 p-4 rounded-lg mt-3 overflow-x-auto text-sm">
{`newPosition = currentPosition + (targetPosition - currentPosition) × speed

Example with speed = 0.1 (10% per frame):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frame 0:  Position = 0,    Target = 100
Frame 1:  Position = 0 + (100-0) × 0.1 = 10
Frame 2:  Position = 10 + (100-10) × 0.1 = 19
Frame 3:  Position = 19 + (100-19) × 0.1 = 27.1
...keeps getting closer!`}
              </pre>
            </div>

            <CodeSnippet
              title="Step 3: Butterfly Follower with Lerp"
              code={`function ButterflyFollower() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [butterflyPos, setButterflyPos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Track mouse (from Step 1)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth following animation
  useEffect(() => {
    const animate = () => {
      setButterflyPos((prev) => {
        const speed = 0.1;  // Move 10% of the distance per frame
        
        return {
          // Lerp formula for X coordinate
          x: prev.x + (mousePos.x - prev.x) * speed,
          // Lerp formula for Y coordinate
          y: prev.y + (mousePos.y - prev.y) * speed,
        };
      });

      // Request next frame (60 times per second)
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup: Stop animation when component unmounts
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]); // Re-run when mouse position changes

  return (
    <div
      style={{
        position: 'fixed',
        left: butterflyPos.x,
        top: butterflyPos.y,
        transform: 'translate(-50%, -50%)',  // Center on position
        pointerEvents: 'none',  // Don't block mouse clicks
        fontSize: '40px',
      }}
    >
      🦋
    </div>
  );
}`}
            />

            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 my-6">
              <strong className="text-yellow-900">🎯 Why requestAnimationFrame?</strong>
              <ul className="mt-3 space-y-2 text-yellow-800">
                <li>✅ Syncs with your monitor's refresh rate (usually 60fps)</li>
                <li>✅ Automatically pauses when tab is hidden (saves battery!)</li>
                <li>✅ Much smoother than setInterval or setTimeout</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentStep(3);
                scrollToSection(0);
                trackTutorialAction('activate_step', 'step_3');
              }}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg transition-colors"
            >
              ▶️ Activate Step 3 in Demo Above
            </button>
          </div>
        </section>

        {/* Step 4: Theme Switching */}
        <section id="step-4" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            STEP 4
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">🎨 Theme Switching</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>Multiple Personalities:</strong> Let's add the ability to switch between gaming themes!
              Minecraft style (blocky, brown) or Roblox style (smooth, colorful).
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">🧠 The Concept</h3>
            <p className="text-gray-700">
              We create a theme object that stores all the visual properties, then swap between them.
              This keeps our code organized and makes adding new themes super easy!
            </p>

            <CodeSnippet
              title="Step 4: Theme System"
              code={`function ThemedDemo() {
  const [theme, setTheme] = useState('minecraft');

  // Theme configuration object
  const themes = {
    minecraft: {
      name: 'Minecraft',
      brickColors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
      butterflyEmoji: '🦋',
      backgroundColor: '#87CEEB',  // Sky blue
      borderRadius: '2px',          // Sharp edges
      borderStyle: '2px solid #654321',
    },
    roblox: {
      name: 'Roblox',
      brickColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
      butterflyEmoji: '🚀',
      backgroundColor: '#A8DADC',  // Soft blue
      borderRadius: '8px',          // Rounded edges
      borderStyle: '2px solid rgba(255,255,255,0.5)',
    },
  };

  // Get current theme
  const currentTheme = themes[theme];

  return (
    <div style={{ backgroundColor: currentTheme.backgroundColor }}>
      {/* Theme Switcher Buttons */}
      <button onClick={() => setTheme('minecraft')}>
        ⛏️ Minecraft
      </button>
      <button onClick={() => setTheme('roblox')}>
        🎮 Roblox
      </button>

      {/* Bricks using current theme */}
      <div style={{
        backgroundColor: currentTheme.brickColors[0],
        borderRadius: currentTheme.borderRadius,
        border: currentTheme.borderStyle,
      }}>
        Brick
      </div>

      {/* Follower using current theme emoji */}
      <div>{currentTheme.butterflyEmoji}</div>
    </div>
  );
}`}
            />

            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 my-6">
              <strong className="text-green-900">✨ Easy to Extend!</strong><br/>
              <p className="text-green-800 mt-2">Want to add a Super Mario theme? Just add to the themes object:</p>
              <pre className="bg-gray-900 text-gray-200 p-3 rounded-lg mt-3 text-sm">
{`mario: {
  name: 'Super Mario',
  brickColors: ['#C84C09', '#FCE76D'],
  butterflyEmoji: '🍄',
  backgroundColor: '#5C94FC',
}`}
              </pre>
            </div>

            <button
              onClick={() => {
                setCurrentStep(4);
                scrollToSection(0);
                trackTutorialAction('activate_step', 'step_4');
              }}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg transition-colors"
            >
              ▶️ Activate Step 4 in Demo Above
            </button>
          </div>
        </section>

        {/* Step 5: Trail Effect */}
        <section id="step-5" className="bg-white rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            STEP 5
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">✨ Sparkle Trail Effect</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong>The Finishing Touch:</strong> Let's add a magical sparkle trail behind the butterfly!
              It will leave a fading trail of ✨ as it moves.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">🧠 The Concept</h3>
            <p className="text-gray-700">
              We store an array of recent positions and render sparkles at each position.
              Older sparkles fade out by reducing their opacity based on their age.
            </p>

            <CodeSnippet
              title="Step 5: Trail Effect"
              code={`function TrailEffect() {
  const [butterflyPos, setButterflyPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  // Add to trail every 60 milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => {
        // Keep only last 8 positions (prevent memory issues)
        const newTrail = [...prev.slice(-8)];
        
        // Add current position with unique ID
        newTrail.push({
          x: butterflyPos.x,
          y: butterflyPos.y,
          id: Date.now(),  // Unique identifier
        });
        
        return newTrail;
      });
    }, 60); // 60ms = ~16 times per second

    return () => clearInterval(interval);
  }, [butterflyPos]);

  return (
    <div>
      {/* Butterfly */}
      <div
        style={{
          position: 'fixed',
          left: butterflyPos.x,
          top: butterflyPos.y,
        }}
      >
        🦋
      </div>

      {/* Trail sparkles */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            fontSize: '14px',
            // Fade based on position in array
            // Newer sparkles (higher index) = more visible
            opacity: (index / trail.length) * 0.5,
            pointerEvents: 'none',  // Don't block clicks
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}`}
            />

            <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-6 my-6">
              <strong className="text-purple-900">🎨 Opacity Trick Explained:</strong><br/>
              <code className="bg-gray-800 text-white px-2 py-1 rounded mt-2 inline-block">
                (index / trail.length) × 0.5
              </code>
              <ul className="mt-3 space-y-2 text-purple-800">
                <li>If trail has 8 sparkles, indexes are 0-7</li>
                <li>Sparkle 0: (0 / 8) × 0.5 = 0 (invisible)</li>
                <li>Sparkle 4: (4 / 8) × 0.5 = 0.25 (faint)</li>
                <li>Sparkle 7: (7 / 8) × 0.5 = 0.44 (more visible)</li>
              </ul>
              <p className="text-purple-800 mt-2">This creates a natural fade-out effect!</p>
            </div>

            <button
              onClick={() => {
                setCurrentStep(5);
                scrollToSection(0);
                trackTutorialAction('activate_step', 'step_5');
              }}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-bold shadow-lg transition-colors"
            >
              ▶️ Activate Step 5 in Demo Above
            </button>
          </div>
        </section>

        {/* Final Section */}
        <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">🎉 You Did It!</h2>
          <p className="text-xl mb-10">
            You've learned how to build interactive mouse effects from scratch!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-3">🖱️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Mouse Tracking</h3>
              <p className="text-sm text-gray-200">Foundation of all interactions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Smooth Animations</h3>
              <p className="text-sm text-gray-200">Lerp & requestAnimationFrame</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Dynamic Theming</h3>
              <p className="text-sm text-gray-200">Easy to customize & extend</p>
            </div>
          </div>

          <CodeSnippet
            title="Complete Code - Ready to Copy!"
            code={`// Save as: components/InteractiveMouseEffects.jsx
import { useState, useEffect, useRef } from 'react';

export default function InteractiveMouseEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredBrick, setHoveredBrick] = useState(null);
  const [butterflyPos, setButterflyPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [theme, setTheme] = useState('minecraft');
  const animationFrameRef = useRef(null);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Butterfly following
  useEffect(() => {
    const animate = () => {
      setButterflyPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.1,
        y: prev.y + (mousePos.y - prev.y) * 0.1,
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [mousePos]);

  // Trail effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => [
        ...prev.slice(-8),
        { x: butterflyPos.x, y: butterflyPos.y, id: Date.now() },
      ]);
    }, 60);
    return () => clearInterval(interval);
  }, [butterflyPos]);

  const themes = {
    minecraft: {
      colors: ['#8B4513', '#A0522D', '#CD853F'],
      emoji: '🦋',
      bg: '#87CEEB',
    },
    roblox: {
      colors: ['#FF0000', '#00FF00', '#0000FF'],
      emoji: '🚀',
      bg: '#A8DADC',
    },
  };

  const current = themes[theme];

  return (
    <div style={{ background: current.bg, minHeight: '100vh' }}>
      {/* Your awesome interactive component! */}
    </div>
  );
}`}
          />

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={() => {
                setCurrentStep(0);
                scrollToSection(0);
                trackTutorialAction('tutorial_restart', 'reset_demo');
              }}
              className="px-8 py-4 bg-white text-purple-700 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              🔄 Start Over
            </button>
            <button
              onClick={() => {
                setCurrentStep(5);
                trackTutorialAction('show_all_features', 'complete_demo');
              }}
              className="px-8 py-4 bg-yellow-400 text-black rounded-lg text-lg font-bold hover:bg-yellow-300 transition-colors shadow-lg"
            >
              ✨ Show All Features
            </button>
          </div>

          {/* Social Share */}
          <div className="mt-12 pt-10 border-t border-white/20">
            <p className="text-lg mb-4 font-semibold">💬 Share this tutorial:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  trackTutorialShare('twitter');
                  const text = encodeURIComponent('I just learned interactive mouse effects in React! 🎮✨');
                  const url = encodeURIComponent(window.location.href);
                  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
                }}
                className="px-6 py-3 bg-blue-400 hover:bg-blue-500 rounded-lg font-bold transition-colors shadow-lg"
              >
                🐦 Share on Twitter
              </button>
              <button
                onClick={() => {
                  trackTutorialShare('linkedin');
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors shadow-lg"
              >
                💼 Share on LinkedIn
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Author Bio */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src="/profile.png" 
              alt="Yatheesh Nagella"
              className="w-24 h-24 rounded-full shadow-md"
            />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Written by Yatheesh Nagella</h3>
              <p className="text-gray-600 mb-3">
                Software Engineer & Cloud Solutions Consultant specializing in React, Next.js, and interactive web experiences.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a 
                  href="https://linkedin.com/in/Yatheesh-Nagella" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                  onClick={() => trackTutorialNavigation('author_linkedin')}
                >
                  🔗 LinkedIn
                </a>
                <a 
                  href="https://github.com/Yatheesh-Nagella" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-900 font-semibold"
                  onClick={() => trackTutorialNavigation('author_github')}
                >
                  💻 GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}