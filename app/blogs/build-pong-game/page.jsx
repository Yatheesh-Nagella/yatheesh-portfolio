'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { event } from '@/lib/analytics';

// ============================================================================
// ANALYTICS HELPER (Same pattern as Mouse Effects tutorial)
// ============================================================================

const trackTutorialEvent = (action, label, value = 1) => {
    event({
        action,
        category: 'Tutorial',
        label,
        value
    });
};

// ============================================================================
// LIVE PONG GAME COMPONENT (Top of page - fully functional)
// ============================================================================

const LivePongGame = ({ currentStep = 7 }) => {
    // Game state
    const [paddleY, setPaddleY] = useState(200);
    const [ballPos, setBallPos] = useState({ x: 400, y: 250 });
    const [ballVelocity, setBallVelocity] = useState({ x: 4, y: 3 });
    const [score, setScore] = useState({ player: 0, computer: 0 });
    const [computerPaddleY, setComputerPaddleY] = useState(200);
    const [gameStarted, setGameStarted] = useState(false);
    const [particles, setParticles] = useState([]);
    const [isResetting, setIsResetting] = useState(false); // Prevents multiple scoring

    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Game constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 500;
    const PADDLE_WIDTH = 15;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 15;
    const WINNING_SCORE = 5;

    // Helper: Generate random ball velocity for variety
    const getRandomVelocity = () => {
        const baseSpeed = 4;
        // Random angle between -30° and +30° (avoids too vertical)
        const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
        // Random direction (left or right)
        const direction = Math.random() < 0.5 ? 1 : -1;

        return {
            x: Math.cos(angle) * baseSpeed * direction,
            y: Math.sin(angle) * baseSpeed * (Math.random() < 0.5 ? 1 : -1)
        };
    };

    // Step 1: Mouse tracking for paddle (ONLY when game is started!)
    useEffect(() => {
        if (currentStep < 1 || !gameStarted) return;

        const handleMouseMove = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;

            // Keep paddle within bounds
            const newY = Math.max(0, Math.min(mouseY - PADDLE_HEIGHT / 2, CANVAS_HEIGHT - PADDLE_HEIGHT));
            setPaddleY(newY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentStep, gameStarted]);

    // Step 2-7: Game loop - FIXED VERSION
    useEffect(() => {
        if (currentStep < 2 || !gameStarted) return;

        const gameLoop = () => {
            // Step 3: Ball movement with collision detection
            if (currentStep >= 3) {
                setBallPos(prev => {
                    let newX = prev.x + ballVelocity.x;
                    let newY = prev.y + ballVelocity.y;
                    let velocityChanged = false;

                    // Step 4: Ball collision with top/bottom walls
                    if (currentStep >= 4) {
                        // Hit top wall
                        if (newY <= 0) {
                            newY = 0;
                            if (ballVelocity.y < 0) { // Only reverse if moving upward
                                setBallVelocity(v => ({ ...v, y: Math.abs(v.y) }));
                                velocityChanged = true;
                                if (currentStep >= 7) {
                                    createParticles(newX, 0);
                                }
                            }
                        }
                        // Hit bottom wall
                        else if (newY >= CANVAS_HEIGHT - BALL_SIZE) {
                            newY = CANVAS_HEIGHT - BALL_SIZE;
                            if (ballVelocity.y > 0) { // Only reverse if moving downward
                                setBallVelocity(v => ({ ...v, y: -Math.abs(v.y) }));
                                velocityChanged = true;
                                if (currentStep >= 7) {
                                    createParticles(newX, CANVAS_HEIGHT - BALL_SIZE);
                                }
                            }
                        }
                    }

                    // Step 5: Paddle collision
                    if (currentStep >= 5) {
                        // Player paddle collision (left side)
                        if (
                            newX <= PADDLE_WIDTH &&
                            ballVelocity.x < 0 && // Moving left
                            newY + BALL_SIZE >= paddleY &&
                            newY <= paddleY + PADDLE_HEIGHT
                        ) {
                            newX = PADDLE_WIDTH;
                            setBallVelocity(v => ({
                                x: Math.abs(v.x) * 1.05,
                                y: v.y
                            }));
                            velocityChanged = true;
                            if (currentStep >= 7) {
                                createParticles(PADDLE_WIDTH, newY);
                            }
                        }

                        // Computer paddle collision (right side)
                        if (
                            newX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
                            ballVelocity.x > 0 && // Moving right
                            newY + BALL_SIZE >= computerPaddleY &&
                            newY <= computerPaddleY + PADDLE_HEIGHT
                        ) {
                            newX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
                            setBallVelocity(v => ({
                                x: -Math.abs(v.x) * 1.05,
                                y: v.y
                            }));
                            velocityChanged = true;
                            if (currentStep >= 7) {
                                createParticles(CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE, newY);
                            }
                        }
                    }

                    // Step 6: Scoring (ONLY if not currently resetting)
                    if (currentStep >= 6 && !isResetting) {
                        // Ball goes past player paddle (computer scores)
                        if (newX <= -BALL_SIZE) {
                            setScore(s => {
                                const newScore = { ...s, computer: s.computer + 1 };
                                // Check if this score wins the game
                                if (newScore.computer >= WINNING_SCORE) {
                                    setGameStarted(false);
                                    setIsResetting(false); // Clear flag immediately
                                    trackTutorialEvent('game_complete', 'computer_wins');
                                }
                                return newScore;
                            });
                            trackTutorialEvent('game_score', 'computer_scores');
                            setIsResetting(true); // Prevent multiple scores

                            // Reset ball immediately
                            setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
                            setBallVelocity(getRandomVelocity());

                            // Allow scoring again after 500ms (only if game not ended)
                            setTimeout(() => {
                                setIsResetting(false);
                            }, 500);

                            return prev; // Don't update position this frame
                        }

                        // Ball goes past computer paddle (player scores)
                        if (newX >= CANVAS_WIDTH) {
                            setScore(s => {
                                const newScore = { ...s, player: s.player + 1 };
                                // Check if this score wins the game
                                if (newScore.player >= WINNING_SCORE) {
                                    setGameStarted(false);
                                    setIsResetting(false); // Clear flag immediately
                                    trackTutorialEvent('game_complete', 'player_wins');
                                }
                                return newScore;
                            });
                            trackTutorialEvent('game_score', 'player_scores');
                            setIsResetting(true); // Prevent multiple scores

                            // Reset ball immediately
                            setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
                            setBallVelocity(getRandomVelocity());

                            // Allow scoring again after 500ms (only if game not ended)
                            setTimeout(() => {
                                setIsResetting(false);
                            }, 500);

                            return prev; // Don't update position this frame
                        }
                    }

                    return { x: newX, y: newY };
                });
            }

            // Computer AI (simple following)
            if (currentStep >= 2) {
                setComputerPaddleY(prev => {
                    const targetY = ballPos.y - PADDLE_HEIGHT / 2;
                    const speed = 0.08;
                    let newY = prev + (targetY - prev) * speed;
                    newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - PADDLE_HEIGHT));
                    return newY;
                });
            }

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [currentStep, gameStarted, ballPos, ballVelocity, paddleY, computerPaddleY, isResetting]);

    // Step 7: Particle effects
    const createParticles = (x, y) => {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            x,
            y,
            vx: Math.cos((i * Math.PI * 2) / 8) * 3,
            vy: Math.sin((i * Math.PI * 2) / 8) * 3,
            life: 1,
            id: Date.now() + i,
        }));
        setParticles(prev => [...prev, ...newParticles]);
    };

    // Particle animation
    useEffect(() => {
        if (currentStep < 7 || particles.length === 0) return;

        const interval = setInterval(() => {
            setParticles(prev =>
                prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy,
                        life: p.life - 0.05,
                    }))
                    .filter(p => p.life > 0)
            );
        }, 30);

        return () => clearInterval(interval);
    }, [currentStep, particles.length]);

    // Canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, 0);
        ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.setLineDash([]);

        // Step 1: Draw player paddle
        if (currentStep >= 1) {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(0, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
        }

        // Step 2: Draw computer paddle
        if (currentStep >= 2) {
            ctx.fillStyle = '#ff0066';
            ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, computerPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
        }

        // Step 3: Draw ball
        if (currentStep >= 3) {
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(ballPos.x, ballPos.y, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Step 7: Draw particles
        if (currentStep >= 7) {
            particles.forEach(p => {
                ctx.fillStyle = `rgba(255, 204, 0, ${p.life})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw scores
        if (currentStep >= 6) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(score.player, CANVAS_WIDTH / 4, 60);
            ctx.fillText(score.computer, (CANVAS_WIDTH / 4) * 3, 60);
        }

    }, [currentStep, paddleY, computerPaddleY, ballPos, score, particles]);

    // Check for winner
    useEffect(() => {
        if (score.player >= WINNING_SCORE) {
            setGameStarted(false);
            trackTutorialEvent('game_complete', 'player_wins');
        } else if (score.computer >= WINNING_SCORE) {
            setGameStarted(false);
            trackTutorialEvent('game_complete', 'computer_wins');
        }
    }, [score]);

    const resetGame = () => {
        setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
        setBallVelocity(getRandomVelocity());
        setScore({ player: 0, computer: 0 });
        setParticles([]);
        setIsResetting(false); // Reset the flag
        setGameStarted(true);
        trackTutorialEvent('game_action', 'start_game');
    };

    const winner = score.player >= WINNING_SCORE ? 'Player' :
        score.computer >= WINNING_SCORE ? 'Computer' : null;

    return (
        <div className="flex flex-col items-center bg-gray-900 p-8 rounded-xl shadow-2xl">
            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-4 border-green-500 rounded-lg cursor-none max-w-full"
            />

            {/* Game Controls */}
            <div className="mt-5 flex gap-4 items-center flex-wrap justify-center">
                {!gameStarted && !winner && (
                    <button
                        onClick={resetGame}
                        disabled={currentStep < 3}
                        className="px-8 py-4 bg-green-500 text-black rounded-lg text-lg font-bold cursor-pointer shadow-lg hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentStep >= 3 ? '🎮 Start Game' : '⚠️ Complete Steps First'}
                    </button>
                )}

                {winner && (
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold my-3">
                            🏆 {winner} Wins!
                        </h2>
                        <button
                            onClick={resetGame}
                            className="px-8 py-4 bg-yellow-500 text-black rounded-lg text-lg font-bold cursor-pointer mt-3 hover:bg-yellow-400 transition-all"
                        >
                            🔄 Play Again
                        </button>
                    </div>
                )}

                {gameStarted && (
                    <button
                        onClick={() => {
                            setGameStarted(false);
                            trackTutorialEvent('game_action', 'pause_game');
                        }}
                        className="px-8 py-4 bg-pink-600 text-white rounded-lg text-lg font-bold cursor-pointer hover:bg-pink-500 transition-all"
                    >
                        ⏸️ Pause
                    </button>
                )}
            </div>

            {/* Feature Status */}
            <div className="mt-5 p-5 bg-white bg-opacity-10 rounded-lg text-white min-w-[300px] max-w-full">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎮</span>
                    <strong className="text-lg text-black">Active Features:</strong>
                </div>

                {/* Win Condition Display */}
                <div className="mb-4 p-3 bg-yellow-500 bg-opacity-20 rounded-lg border-2 border-yellow-500 text-center">
                    <span className="text-xl font-bold text-yellow-900">🏆 First to 6 Points Wins!</span>
                </div>

                <ul className="space-y-2 list-none">
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 1 ? 'text-grey-400' : 'text-gray-500'}>
                            {currentStep >= 1 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 1 ? 'text-green-400' : 'text-gray-600'}>
                            Player paddle (mouse control)
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 2 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 2 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 2 ? 'text-green-400' : 'text-gray-600'}>
                            Computer paddle (AI)
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 3 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 3 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 3 ? 'text-green-400' : 'text-gray-600'}>
                            Ball movement
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 4 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 4 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 4 ? 'text-green-400' : 'text-gray-600'}>
                            Wall collisions
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 5 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 5 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 5 ? 'text-green-400' : 'text-gray-600'}>
                            Paddle collisions
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 6 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 6 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 6 ? 'text-green-400' : 'text-gray-600'}>
                            Scoring system
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className={currentStep >= 7 ? 'text-green-400' : 'text-gray-500'}>
                            {currentStep >= 7 ? '✅' : '⬜'}
                        </span>
                        <span className={currentStep >= 7 ? 'text-green-400' : 'text-gray-600'}>
                            Particle effects
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

// ============================================================================
// CODE SNIPPET COMPONENT
// ============================================================================

const CodeSnippet = ({ code, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        trackTutorialEvent('code_copy', title);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden mt-5 shadow-lg">
            <div className="bg-gray-800 px-4 py-3 text-white text-sm font-bold flex justify-between items-center">
                <span>{title}</span>
                <button
                    onClick={handleCopy}
                    className={`${copied ? 'bg-green-600' : 'bg-blue-600'
                        } border-none text-white px-3 py-1 rounded cursor-pointer text-xs font-bold hover:opacity-90 transition-all`}
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
            </div>
            <pre className="m-0 p-5 text-gray-300 text-sm leading-relaxed overflow-x-auto font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
};

// ============================================================================
// MAIN PONG TUTORIAL PAGE
// ============================================================================

export default function PongTutorialPage() {
    const [currentStep, setCurrentStep] = useState(7);
    const [isMobile, setIsMobile] = useState(false);

    // Track page view on mount
    useEffect(() => {
        trackTutorialEvent('view', 'pong_tutorial_page');
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
            setIsMobile(
                /iPhone|iPad|iPod|Android/i.test(userAgent) || window.innerWidth < 768
            );
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const steps = [
        { id: 0, title: 'Intro', label: 'Start' },
        { id: 1, title: 'Step 1: Player Paddle', label: 'Paddle' },
        { id: 2, title: 'Step 2: Computer AI', label: 'AI' },
        { id: 3, title: 'Step 3: Ball Movement', label: 'Ball' },
        { id: 4, title: 'Step 4: Wall Collision', label: 'Walls' },
        { id: 5, title: 'Step 5: Paddle Collision', label: 'Collision' },
        { id: 6, title: 'Step 6: Scoring', label: 'Score' },
        { id: 7, title: 'Step 7: Particles', label: 'Effects' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(`step-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            trackTutorialEvent('navigation', `scroll_to_step_${id}`);
        }
    };

    const activateStep = (stepId) => {
        setCurrentStep(stepId);
        scrollToSection(0);
        trackTutorialEvent('activate_step', `step_${stepId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/blogs"
                        className="text-green-500 hover:text-green-400 font-semibold flex items-center gap-2 transition-colors"
                        onClick={() => trackTutorialEvent('navigation', 'back_to_blogs')}
                    >
                        ← Back to Blog
                    </Link>
                    <Link
                        href="/"
                        className="text-green-500 hover:text-green-400 font-semibold transition-colors"
                        onClick={() => trackTutorialEvent('navigation', 'return_home')}
                    >
                        Return Home →
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-black py-16 px-5 text-center">
                <h1 className="text-5xl md:text-6xl font-black mb-5 drop-shadow-lg">
                    🏓 Build Pong in React
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                    Learn game development step-by-step. See the game, understand the code, build it yourself!
                </p>

                {/* Step Navigator */}
                <div className="flex justify-center gap-2 flex-wrap max-w-4xl mx-auto">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => activateStep(step.id)}
                            className={`px-5 py-2 rounded-full border-2 font-bold text-sm transition-all ${currentStep >= step.id
                                ? 'border-black bg-yellow-400 text-black shadow-lg hover:scale-105'
                                : 'border-gray-800 bg-white bg-opacity-20 text-gray-900 hover:bg-opacity-30'
                                }`}
                        >
                            {step.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-5 py-10">

                {/* ==================== LIVE DEMO SECTION ==================== */}
                <section id="step-0" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-3 text-gray-900">🎯 Live Pong Game</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        This is what we'll build! Control the left paddle with your mouse and try to beat the computer.
                        Click the step buttons above to see each feature being added!
                    </p>

                    {isMobile ? (
                        <div className="mb-8">
                            <div className="rounded-2xl bg-yellow-100 border-4 border-yellow-400 p-8 text-center shadow-xl max-w-xl mx-auto">
                                <div className="text-3xl mb-2 text-yellow-500">📱 Mobile Device Detected</div>
                                <div className="text-xl font-semibold mb-4 text-yellow-900">This Pong game requires mouse control and works best on desktop/laptop.</div>
                                <div className="text-lg mb-3 text-yellow-800">👇 You can still:</div>
                                <ul className="mb-4 text-gray-800 text-left max-w-sm mx-auto">
                                    <li>• Read the full tutorial below</li>
                                    <li>• Copy all code snippets</li>
                                    <li>• Learn game development concepts</li>
                                </ul>
                                <div className="font-semibold text-emerald-700 text-base mt-2">💻 Visit on desktop to play!</div>
                            </div>
                        </div>
                    ) : (
                        <LivePongGame currentStep={currentStep} />
                    )}

                    <div className="mt-8 p-5 bg-blue-50 rounded-lg border-2 border-blue-500">
                        <strong className="text-lg text-gray-900">📚 What You'll Learn:</strong>
                        <ul className="mt-3 pl-5 space-y-1 text-gray-900">
                            <li>Game loop with requestAnimationFrame</li>
                            <li>Collision detection algorithms</li>
                            <li>AI opponent using lerp</li>
                            <li>Canvas API for rendering</li>
                            <li>Particle systems</li>
                        </ul>
                    </div>
                </section>

                {/* ==================== STEP 1: PLAYER PADDLE ==================== */}
                <section id="step-1" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 1
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">🎮 Player Paddle Control</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>Let's Start Simple:</strong> Create a paddle that follows your mouse!
                            This uses the same mouse tracking we learned before. The paddle will only respond
                            to your mouse after you click "Start Game".
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 The Concept</h3>
                        <p>
                            We track the mouse Y position and set the paddle's vertical position to follow it.
                            The paddle stays within the canvas boundaries so it can't go off-screen. The tracking
                            is only active during gameplay to keep things clean.
                        </p>

                        <CodeSnippet
                            title="Step 1: Mouse-Controlled Paddle"
                            code={`import { useState, useEffect, useRef } from 'react';

function PongGame() {
  const [paddleY, setPaddleY] = useState(200);
  const canvasRef = useRef(null);
  
  const CANVAS_HEIGHT = 500;
  const PADDLE_HEIGHT = 100;

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      
      // Keep paddle within canvas bounds
      const newY = Math.max(
        0,  // Don't go above top
        Math.min(
          mouseY - PADDLE_HEIGHT / 2,  // Center on mouse
          CANVAS_HEIGHT - PADDLE_HEIGHT  // Don't go below bottom
        )
      );
      
      setPaddleY(newY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Drawing code (we'll add this next)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 500);
    
    // Draw paddle
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(0, paddleY, 15, 100);
  }, [paddleY]);

  return <canvas ref={canvasRef} width={800} height={500} />;
}`}
                        />

                        <button
                            onClick={() => activateStep(1)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 1 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 2: COMPUTER AI ==================== */}
                <section id="step-2" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 2
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">🤖 Computer AI Opponent</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>Adding Challenge:</strong> The computer paddle needs to move automatically!
                            We'll use lerp (linear interpolation) to make it smoothly follow the ball.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 The Concept</h3>
                        <p>
                            The AI tries to center its paddle on the ball's Y position. Instead of instant movement,
                            it moves a percentage of the distance each frame - this makes it beatable!
                        </p>

                        <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-5 my-5">
                            <strong className="text-gray-900">💡 AI Difficulty:</strong><br />
                            <span className="text-gray-900">Speed = 0.08 → Easy (slow reaction)</span><br />
                            <span className="text-gray-900">Speed = 0.15 → Medium (balanced)</span><br />
                            <span className="text-gray-900">Speed = 0.5 → Hard (fast reaction)</span>
                        </div>

                        <CodeSnippet
                            title="Step 2: Computer AI with Lerp"
                            code={`function ComputerAI() {
  const [computerPaddleY, setComputerPaddleY] = useState(200);
  const [ballPos, setBallPos] = useState({ x: 400, y: 250 });

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      // Computer AI: Follow the ball
      setComputerPaddleY(prev => {
        const targetY = ballPos.y - PADDLE_HEIGHT / 2;
        const speed = 0.08;  // Adjust for difficulty
        
        // Lerp formula: move 8% closer each frame
        return prev + (targetY - prev) * speed;
      });

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [ballPos]);

  return (
    // Canvas rendering...
    <canvas />
  );
}`}
                        />

                        <button
                            onClick={() => activateStep(2)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 2 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 3: BALL MOVEMENT ==================== */}
                <section id="step-3" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 3
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">⚽ Ball Movement</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>The Core Mechanic:</strong> A ball that moves with velocity!
                            Velocity means the ball has both speed and direction.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 The Physics</h3>
                        <p>
                            The ball has velocity in X and Y directions. Each frame, we add the velocity
                            to the position. Positive X = right, negative X = left. Same for Y (up/down).
                        </p>

                        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-5 my-5">
                            <strong className="text-gray-900">🎯 Velocity Explained:</strong><br />
                            <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">velocity = {`{ x: 4, y: 3 }`}</code>
                            <ul className="mt-3 pl-5 space-y-1 text-gray-900">
                                <li>x: 4 means move 4 pixels right per frame</li>
                                <li>y: 3 means move 3 pixels down per frame</li>
                                <li>At 60fps, ball moves 240px/sec right, 180px/sec down</li>
                            </ul>
                        </div>

                        <CodeSnippet
                            title="Step 3: Ball Physics"
                            code={`function BallMovement() {
  const [ballPos, setBallPos] = useState({ x: 400, y: 250 });
  const [ballVelocity, setBallVelocity] = useState({ x: 4, y: 3 });

  useEffect(() => {
    const gameLoop = () => {
      // Update ball position based on velocity
      setBallPos(prev => ({
        x: prev.x + ballVelocity.x,  // Add X velocity
        y: prev.y + ballVelocity.y,  // Add Y velocity
      }));

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [ballVelocity]);

  // Draw ball on canvas
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, 7.5, 0, Math.PI * 2);
    ctx.fill();
  }, [ballPos]);

  return <canvas />;
}`}
                        />

                        <button
                            onClick={() => activateStep(3)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 3 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 4: WALL COLLISION ==================== */}
                <section id="step-4" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 4
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">🧱 Wall Collision Detection</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>Bounce Back:</strong> When the ball hits the top or bottom wall,
                            it should bounce! We do this by reversing the Y velocity.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 Collision Logic</h3>
                        <p>
                            Check if ball's Y position is less than 0 (hit top) or greater than canvas height (hit bottom).
                            When collision detected: multiply Y velocity by -1 to reverse direction!
                        </p>

                        <CodeSnippet
                            title="Step 4: Wall Bounce"
                            code={`function WallCollision() {
  const CANVAS_HEIGHT = 500;
  const BALL_SIZE = 15;

  useEffect(() => {
    const gameLoop = () => {
      // Move ball
      setBallPos(prev => {
        let newY = prev.y + ballVelocity.y;

        // Hit top wall?
        if (newY <= 0) {
          setBallVelocity(v => ({ ...v, y: Math.abs(v.y) }));
          newY = 0;
        }

        // Hit bottom wall?
        if (newY >= CANVAS_HEIGHT - BALL_SIZE) {
          setBallVelocity(v => ({ ...v, y: -Math.abs(v.y) }));
          newY = CANVAS_HEIGHT - BALL_SIZE;
        }

        return { ...prev, y: newY };
      });

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [ballVelocity]);
}`}
                        />

                        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-5 my-5">
                            <strong className="text-gray-900">⚡ Why Math.abs()?</strong><br />
                            <span className="text-gray-900">If velocity.y = 3 (moving down) and we hit bottom wall:</span><br />
                            <span className="text-gray-900">→ New velocity.y = -Math.abs(3) = -3 (now moving up!)</span><br />
                            <span className="text-gray-900">This ensures the ball always bounces in the correct direction!</span>
                        </div>

                        <button
                            onClick={() => activateStep(4)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 4 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 5: PADDLE COLLISION ==================== */}
                <section id="step-5" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 5
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">🏓 Paddle Collision Detection</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>The Trickiest Part:</strong> Detecting when the ball hits a paddle!
                            We need to check if the ball overlaps with the paddle rectangle.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 Rectangle Collision</h3>
                        <p>
                            For collision to happen, the ball must be:<br />
                            1) Horizontally aligned with paddle (X check)<br />
                            2) Vertically overlapping with paddle (Y check)<br />
                            3) Moving TOWARDS the paddle (prevents double-bounce)
                        </p>

                        <CodeSnippet
                            title="Step 5: Paddle Collision"
                            code={`function PaddleCollision() {
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 15;

  useEffect(() => {
    const gameLoop = () => {
      // Check player paddle collision (left side)
      setBallPos(prev => {
        let newX = prev.x + ballVelocity.x;
        
        if (
          newX <= PADDLE_WIDTH &&
          ballVelocity.x < 0 &&  // Moving LEFT toward paddle
          prev.y + BALL_SIZE >= paddleY &&
          prev.y <= paddleY + PADDLE_HEIGHT
        ) {
          // Collision detected!
          setBallVelocity(v => ({
            x: Math.abs(v.x) * 1.05,  // Bounce right (+ speed up 5%)
            y: v.y
          }));
          
          newX = PADDLE_WIDTH;  // Push ball away
        }

        // Check computer paddle (right side)
        if (
          newX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          ballVelocity.x > 0 &&  // Moving RIGHT toward paddle
          prev.y + BALL_SIZE >= computerPaddleY &&
          prev.y <= computerPaddleY + PADDLE_HEIGHT
        ) {
          setBallVelocity(v => ({
            x: -Math.abs(v.x) * 1.05,  // Bounce left (+ speed up)
            y: v.y
          }));
          
          newX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
        }

        return { ...prev, x: newX };
      });

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [paddleY, computerPaddleY, ballVelocity]);
}`}
                        />

                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-5 my-5">
                            <strong className="text-gray-900">🎮 Pro Tip:</strong>{' '}
                            <span className="text-gray-900">The velocity direction check (ballVelocity.x &lt; 0 or &gt; 0)
                                prevents the ball from getting "stuck" inside the paddle. It only bounces when approaching!</span>
                        </div>

                        <button
                            onClick={() => activateStep(5)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 5 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 6: SCORING ==================== */}
                <section id="step-6" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 6
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">🎯 Scoring System</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>Keep Track of Points:</strong> When the ball goes past a paddle,
                            the opponent scores! Then reset the ball to center.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 Scoring Logic</h3>
                        <p>
                            If ball X position goes past left edge (X ≤ 0), computer scores.
                            If ball goes past right edge (X ≥ canvas width), player scores.
                        </p>

                        <CodeSnippet
                            title="Step 6: Score Tracking"
                            code={`function ScoringSystem() {
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const CANVAS_WIDTH = 800;

  useEffect(() => {
    const gameLoop = () => {
      // Move ball...

      // Check for scoring
      setBallPos(prev => {
        // Ball went past player paddle (left edge)
        if (prev.x <= 0) {
          setScore(s => ({ ...s, computer: s.computer + 1 }));
          // Reset ball to center
          setTimeout(() => {
            setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
            setBallVelocity(getRandomVelocity());
          }, 100);
          return prev;
        }

        // Ball went past computer paddle (right edge)
        if (prev.x >= CANVAS_WIDTH) {
          setScore(s => ({ ...s, player: s.player + 1 }));
          // Reset ball to center
          setTimeout(() => {
            setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
            setBallVelocity(getRandomVelocity());
          }, 100);
          return prev;
        }

        return prev;
      });

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Draw scores on canvas
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score.player, CANVAS_WIDTH / 4, 60);
    ctx.fillText(score.computer, (CANVAS_WIDTH / 4) * 3, 60);
  }, [score]);
}`}
                        />

                        <button
                            onClick={() => activateStep(6)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 6 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== STEP 7: PARTICLES ==================== */}
                <section id="step-7" className="bg-white rounded-2xl p-10 mb-10 shadow-2xl">
                    <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                        STEP 7
                    </div>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900">✨ Particle Effects</h2>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-5">
                        <p>
                            <strong>Visual Polish:</strong> Add explosion particles when the ball hits something!
                            This makes the game feel more dynamic and satisfying.
                        </p>

                        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900">🧠 Particle System</h3>
                        <p>
                            When collision happens, spawn 8 particles in a circle pattern. Each particle
                            moves outward and fades away over time.
                        </p>

                        <CodeSnippet
                            title="Step 7: Particle Explosions"
                            code={`function ParticleSystem() {
  const [particles, setParticles] = useState([]);

  // Create particles on collision
  const createParticles = (x, y) => {
    const newParticles = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 8;  // Spread in circle
      
      return {
        x,
        y,
        vx: Math.cos(angle) * 3,  // X velocity
        vy: Math.sin(angle) * 3,  // Y velocity
        life: 1,  // Full opacity
        id: Date.now() + i,
      };
    });
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,      // Move
            y: p.y + p.vy,
            life: p.life - 0.05, // Fade out
          }))
          .filter(p => p.life > 0)  // Remove dead particles
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Draw particles
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    
    particles.forEach(p => {
      ctx.fillStyle = \`rgba(255, 204, 0, \${p.life})\`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [particles]);

  // Call createParticles() on collisions
  // Example: createParticles(ballPos.x, ballPos.y);
}`}
                        />

                        <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-5 my-5">
                            <strong className="text-gray-900">🎨 Math Behind Circular Spread:</strong><br />
                            <span className="text-gray-900">
                                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">angle = (i × 2π) / 8</code> creates 8 evenly spaced directions<br />
                                <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">vx = cos(angle) × speed</code> and <code className="bg-gray-800 text-green-400 px-2 py-1 rounded">vy = sin(angle) × speed</code><br />
                                This creates the "explosion" effect!
                            </span>
                        </div>

                        <button
                            onClick={() => activateStep(7)}
                            className="mt-8 px-8 py-4 bg-green-600 text-white rounded-lg text-base font-bold cursor-pointer hover:bg-green-500 transition-all"
                        >
                            ▶️ Activate Step 7 in Game Above
                        </button>
                    </div>
                </section>

                {/* ==================== FINAL SECTION ==================== */}
                <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-2xl p-16 text-center shadow-2xl">
                    <h2 className="text-5xl font-black mb-5">🏆 You Built Pong!</h2>
                    <p className="text-2xl mb-10">
                        From mouse tracking to particle systems - you mastered game development basics!
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
                        {[
                            { emoji: '🎮', title: 'Game Loop', desc: 'requestAnimationFrame' },
                            { emoji: '⚡', title: 'Physics', desc: 'Velocity & Collision' },
                            { emoji: '🤖', title: 'AI', desc: 'Lerp-based Opponent' },
                            { emoji: '✨', title: 'Polish', desc: 'Particles & Effects' },
                        ].map((item, i) => (
                            <div key={i} className="bg-emerald-600 bg-opacity-5 p-10 rounded-2xl text-center hover:bg-opacity-10 transition-all">
                                <div className="text-6xl mb-4">{item.emoji}</div>
                                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                                <p className="text-base opacity-90">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => {
                                setCurrentStep(0);
                                scrollToSection(0);
                                trackTutorialEvent('action', 'restart_tutorial');
                            }}
                            className="px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-bold cursor-pointer hover:bg-gray-800 transition-all"
                        >
                            🔄 Start Over
                        </button>
                        <button
                            onClick={() => {
                                setCurrentStep(7);
                                trackTutorialEvent('action', 'play_full_game');
                            }}
                            className="px-8 py-4 bg-yellow-400 text-black rounded-lg text-lg font-bold cursor-pointer hover:bg-yellow-300 transition-all"
                        >
                            🎮 Play Full Game
                        </button>
                    </div>

                    {/* Author Section */}
                    <div className="mt-12 pt-8 border-t-2 border-black border-opacity-20">
                        <p className="text-lg mb-4">
                            Built by{' '}
                            <a
                                href="https://linkedin.com/in/Yatheesh-Nagella"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline hover:text-gray-900 transition-colors"
                                onClick={() => trackTutorialEvent('social_share', 'author_linkedin')}
                            >
                                Yatheesh Nagella
                            </a>
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="https://twitter.com/intent/tweet?text=I%20just%20learned%20game%20development%20by%20building%20Pong%20in%20React!%20🏓%20Check%20out%20this%20interactive%20tutorial%20%E2%86%92%20https://yatheeshnagella/blogs/build-pong-game"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                                onClick={() => trackTutorialEvent('social_share', 'twitter')}
                            >
                                🐦 Share on Twitter
                            </a>
                            <a
                                href="https://www.linkedin.com/sharing/share-offsite/?url=https://yatheeshnagella/blogs/build-pong-game"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                                onClick={() => trackTutorialEvent('social_share', 'linkedin')}
                            >
                                💼 Share on LinkedIn
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}