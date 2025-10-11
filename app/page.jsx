'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showResumeModal) {
        setShowResumeModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showResumeModal]);

  useEffect(() => {
    if (showResumeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showResumeModal]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Gradient Wave Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white" />

        {/* Animated gradient waves */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 87, 34, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 87, 34, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(255, 87, 34, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 87, 34, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        />

        {/* Secondary wave layer */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute inset-0"
        />

        {/* Floating gradient orbs for depth */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.4, 0.3],
            x: [0, -80, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-20 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/15 via-teal-400/15 to-transparent rounded-full blur-3xl"
        />

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="text-xl font-semibold text-gray-900 hover:text-orange-500 transition-colors">
            Yatheesh Nagella
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {['Projects', 'Services', 'Blog', 'About', 'Experience', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Blog') {
                    window.location.href = '/blogs';
                  } else {
                    scrollToSection(item.toLowerCase());
                  }
                }}
                className={`text-gray-600 hover:text-orange-500 transition-colors`}
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => setShowResumeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900 p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-6 py-4 space-y-4">
              {['Projects', 'Services', 'About', 'Blog', 'Experience', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Blog') {
                      window.location.href = '/blogs';
                    } else {
                      scrollToSection(item.toLowerCase());
                    }
                    setIsMobileMenuOpen(false); // Close menu after click
                  }}
                  className={`block w-full text-left py-2 text-gray-600 hover:text-orange-500 transition-colors ${activeSection === item.toLowerCase() ? 'text-orange-500 font-semibold' : ''
                    }`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowResumeModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 md:pt-32 pb-12 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Glassmorphism Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-6 md:p-12 shadow-2xl"
          >
            {/* Gradient overlay on card */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-500/20 backdrop-blur-sm border-2 border-white/50 overflow-hidden mb-8 shadow-lg"
                >
                  <img
                    src="/profile.png"
                    alt="Yatheesh Nagella"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-6 md:mb-8 leading-[1.15] max-w-5xl"
                >
                  I'm Yatheesh Nagella, a Software Engineer & Cloud Solutions Consultant.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed"
                >
                  Leveraging expertise in multi-cloud architecture, DevOps automation, and modern web technologies, I help organizations build resilient systems that drive business value.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex gap-6 mb-16"
              >
                <motion.a whileHover={{ scale: 1.1, color: '#06B6D4' }} whileTap={{ scale: 0.95 }} href="https://github.com/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-500 transition-colors font-medium">
                  GitHub
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, color: '#6366F1' }} whileTap={{ scale: 0.95 }} href="https://linkedin.com/in/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-500 transition-colors font-medium">
                  LinkedIn
                </motion.a>
                <motion.a whileHover={{ scale: 1.1, color: '#FF5722' }} whileTap={{ scale: 0.95 }} href="mailto:yatheeshnagella17@gmail.com" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">
                  Email
                </motion.a>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {/* F1-GPT Project */}
                <motion.a
                  href="https://f1-gpt-eta.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group aspect-square bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-red-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-4xl mb-2">🏎️</div>
                    <div className="text-white font-bold text-sm mb-1">F1-GPT</div>
                    <div className="text-white/70 text-xs">AI Chatbot</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs">View Live Demo →</span>
                  </div>
                </motion.a>

                {/* Jump MD Editor */}
                <motion.a
                  href="https://jump-md-editor-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group aspect-square bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-4xl mb-2">📝</div>
                    <div className="text-white font-bold text-sm mb-1">Jump MD</div>
                    <div className="text-white/70 text-xs">Markdown Editor</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs">Try the Editor →</span>
                  </div>
                </motion.a>

                {/* Evolution of Trust - Blog Coming Soon */}
                <motion.a
                  href="/blogs/evolution-of-trust"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group aspect-square bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-gray-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-4xl mb-2">🎮</div>
                    <div className="text-gray-900 font-bold text-sm mb-1">Evolution of Trust</div>
                    <div className="text-gray-600 text-xs">Blog Coming Soon</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">SOON</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs">Read the Story →</span>
                  </div>
                </motion.a>

                {/* Marathon - Health & Wellness */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group aspect-square bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-orange-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0">
                    <img
                      src="/marathon.png"
                      alt="Marathon Achievement"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end p-4 text-center">
                    <div className="text-white font-bold text-sm mb-1">Health & Fitness</div>
                    <div className="text-white/70 text-xs">Marathon Runner</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">🏃</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Selected projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-16 max-w-3xl"
          >
            Explore my selected projects, showcasing my expertise in cloud architecture, full-stack development, and AI integration.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Project 1: F1-GPT */}
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-700 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🏎️</div>
                    <div className="text-white text-2xl font-bold">F1-GPT</div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                F1-GPT - AI-Powered Formula 1 Chatbot
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Building a production-ready AI chatbot with Next.js 14, TypeScript, and OpenAI GPT-3.5-turbo with real-time streaming responses and semantic search capabilities using DataStax Astra DB vector database.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ x: 5 }} href="https://f1-gpt-eta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium">
                  Live Demo →
                </motion.a>
                <motion.a whileHover={{ x: 5 }} href="https://github.com/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 font-medium">
                  View Code →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 2: Jump Markdown Editor */}
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">📝</div>
                    <div className="text-white text-2xl font-bold">Jump MD Editor</div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                Jump Markdown Editor
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                A 2-pane real-time Markdown editor with live preview, PDF export functionality, and clipboard integration. Built with React and Vite featuring markdown parsing and HTML-to-PDF conversion.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ x: 5 }} href="https://jump-md-editor-one.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium">
                  Live Demo →
                </motion.a>
                <motion.a whileHover={{ x: 5 }} href="https://github.com/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 font-medium">
                  View Code →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 3: Kubernetes Infrastructure */}
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">☸️</div>
                    <div className="text-white text-2xl font-bold">K8s Infrastructure</div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                Multi-Cloud Kubernetes Infrastructure
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Leading enterprise DevOps infrastructure with GKE cluster deployment, Istio service mesh integration for secure microservices communication, and multi-cloud resilience across distributed systems.
              </p>
              <div className="text-gray-500 font-medium">Enterprise Project - Swish.ai</div>
            </motion.div>

            {/* Project 4: AWS Automation */}
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">☁️</div>
                    <div className="text-white text-2xl font-bold">AWS Automation</div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                AWS Infrastructure Automation
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Automating cloud infrastructure with Terraform, Docker containerization with ECS, and CI/CD pipelines using Jenkins and GitHub Actions for improved deployment efficiency and system reliability.
              </p>
              <div className="text-gray-500 font-medium">Enterprise Project - Truist</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-gray-900 mb-16"
          >
            What I offer
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: '☁️', title: 'Cloud Architecture & Migration', desc: 'AWS/GCP/Azure infrastructure design, cost optimization, migration strategy, and Infrastructure as Code implementation.' },
              { icon: '⚙️', title: 'DevOps & CI/CD', desc: 'Kubernetes cluster management, CI/CD pipeline automation, containerization strategy, and monitoring setup.' },
              { icon: '💻', title: 'Full-Stack Development', desc: 'Modern web applications with React/Next.js, RESTful and GraphQL APIs, database optimization, and authentication.' },
              { icon: '🤖', title: 'AI/ML Integration', desc: 'AI chatbot development, vector database implementation, OpenAI API integration, and semantic search solutions.' },
              { icon: '🔍', title: 'Technical Consulting', desc: 'Architecture review, code quality audits, performance optimization, and security best practices implementation.' },
              { icon: '📊', title: 'Data Engineering', desc: 'Real-time data pipelines with Apache Kafka and Flink, workflow orchestration with Airflow, and database management.' }
            ].map((service, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }} className="border border-gray-200 rounded-lg p-8 transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-gray-900 mb-16"
          >
            About me
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 space-y-6 text-gray-700 leading-relaxed text-lg"
            >
              <p>
                I'm a Software Engineer and Cloud Solutions Consultant with a Master's in Computer Science from the University of Central Oklahoma (GPA 3.78). With over 3 years of experience across DevOps, cloud infrastructure, and full-stack development, I specialize in building scalable, secure systems that drive business value.
              </p>
              <p>
                My expertise spans multi-cloud environments (AWS, GCP, Azure), Kubernetes orchestration, CI/CD automation, and modern web technologies. I've worked with companies like Truist and Swish.ai, where I designed cloud infrastructure, implemented DevOps best practices, and integrated AI-powered solutions.
              </p>
              <p>
                Currently, I'm leveraging my technical skills at UCO's LX Studio while exploring consulting opportunities to help organizations optimize their cloud architecture, automate workflows, and build resilient systems.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                { value: '3+', label: 'Years Experience', color: 'orange' },
                { value: '3.78', label: 'M.S. Computer Science GPA', color: 'cyan' },
                { value: 'AWS Certified', label: 'Solutions Architect - Associate', color: 'indigo' },
                { value: 'Oklahoma City, OK', label: 'Available for Remote Work', color: 'emerald' }
              ].map((stat, index) => {
                const colorClasses = {
                  orange: 'border-orange-500',
                  cyan: 'border-cyan-500',
                  indigo: 'border-indigo-500',
                  emerald: 'border-emerald-500'
                };

                return (
                  <motion.div key={index} variants={fadeInUp} className={`border-l-4 ${colorClasses[stat.color]} pl-6`}>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-gray-900 mb-16"
          >
            Experience
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {[
              {
                title: 'Techceptionist',
                company: 'LX Studio',
                period: 'June 2024 - Present',
                achievements: [
                  'Implemented Microsoft 365 applications to enhance collaboration and team productivity',
                  'Developed Power Automate workflows reducing IT support response time',
                  'Designed Power BI dashboards providing insights into equipment usage and efficiency metrics'
                ]
              },
              {
                title: 'DevOps Engineer',
                company: 'Swish.ai',
                period: 'Nov 2022 - Jun 2023',
                achievements: [
                  'Led deployment and lifecycle management of GKE clusters across multi-cloud environments',
                  'Integrated Istio service mesh for secure microservices communication and observability',
                  'Configured IAM roles and enforced least privilege access policies for compliance'
                ]
              },
              {
                title: 'Associate Software Engineer',
                company: 'Truist',
                period: 'Aug 2021 - Sep 2022',
                achievements: [
                  'Designed and deployed AWS infrastructure using Terraform for scalability and cost optimization',
                  'Optimized real-time data pipelines using Apache Kafka and Flink for event-driven architecture',
                  'Implemented CI/CD pipelines using Jenkins and GitHub Actions for automated deployment'
                ]
              }
            ].map((job, index) => {
              const colors = ['orange', 'cyan', 'indigo'];
              const colorClasses = {
                orange: 'bg-orange-500',
                cyan: 'bg-cyan-500',
                indigo: 'bg-indigo-500'
              };

              return (
                <motion.div key={index} variants={fadeInUp} className="border-l-2 border-gray-200 pl-8 relative">
                  <div className={`absolute w-4 h-4 ${colorClasses[colors[index]]} rounded-full`} style={{ left: '-9px', top: 0 }}></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
                      <div className="text-orange-500 font-medium">{job.company}</div>
                    </div>
                    <div className="text-gray-500">{job.period}</div>
                  </div>
                  <ul className="mt-4 space-y-2 text-gray-600">
                    {job.achievements.map((achievement, i) => (
                      <li key={i}>• {achievement}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Technical Skills</h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { title: 'Cloud & Infrastructure', skills: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform'], color: 'cyan' },
                { title: 'Programming Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'PHP'], color: 'purple' },
                { title: 'Frontend Technologies', skills: ['React', 'Next.js', 'Angular', 'Flutter', 'Tailwind CSS'], color: 'indigo' },
                { title: 'Backend & APIs', skills: ['Node.js', 'Express.js', 'Spring Boot', 'GraphQL', 'REST'], color: 'orange' },
                { title: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Astra DB', 'Vector DBs'], color: 'emerald' },
                { title: 'DevOps & Tools', skills: ['Jenkins', 'GitHub Actions', 'CI/CD', 'Istio', 'Kafka'], color: 'blue' }
              ].map((category, index) => {
                const colorClasses = {
                  cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
                  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
                  indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
                  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
                  emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                };

                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map(skill => (
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          key={skill}
                          className={`px-3 py-1 ${colorClasses[category.color]} rounded-full text-sm cursor-default transition-colors`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        id="contact"
        className="py-20 px-6 bg-gray-800 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold mb-6"
          >
            Interested in working together?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-12"
          >
            Let's discuss cloud architecture, DevOps consulting, or full-stack development projects.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:yatheeshnagella17@gmail.com"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Get in Touch
          </motion.a>

        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-semibold mb-2">Yatheesh Nagella</div>
              <div className="flex gap-6 text-sm text-gray-400">
                <button onClick={() => scrollToSection('projects')} className="hover:text-orange-500 transition-colors">Projects</button>
                <button onClick={() => scrollToSection('services')} className="hover:text-orange-500 transition-colors">Services</button>
                <button onClick={() => scrollToSection('about')} className="hover:text-orange-500 transition-colors">About</button>
                <button onClick={() => scrollToSection('contact')} className="hover:text-orange-500 transition-colors">Contact</button>
              </div>
            </div>
            <div className="flex gap-6">
              <motion.a whileHover={{ y: -3 }} href="https://github.com/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                GitHub
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="https://linkedin.com/in/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                LinkedIn
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="mailto:yatheeshnagella17@gmail.com" className="text-gray-400 hover:text-orange-500 transition-colors">
                Email
              </motion.a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            Copyright 2025 by Yatheesh Nagella
          </div>
        </div>
      </footer>
      {showResumeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          onClick={(e) => {
            // Close when clicking outside the modal
            if (e.target === e.currentTarget) {
              setShowResumeModal(false);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-orange-500 to-pink-500 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 id="resume-modal-title" className="text-lg sm:text-xl font-black text-white">
                Yatheesh Nagella - Resume
              </h3>
              <div className="flex gap-3 w-full sm:w-auto">
                <a
                  href="/YN_Resume.pdf"
                  download
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-full font-bold hover:bg-gray-100 transition-all text-sm sm:text-base"
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'download', {
                        event_category: 'Resume',
                        event_label: 'PDF Download',
                      });
                    }
                  }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </a>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="h-full pt-16 sm:pt-20">
              <iframe
                src="/YN_Resume.pdf"
                className="w-full h-full border-0"
                title="Resume PDF"
              />
            </div>

            {/* Mobile fallback */}
            <div className="absolute bottom-4 left-4 right-4 sm:hidden">
              <a
                href="/YN_Resume.pdf"
                download
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold shadow-lg"
              >
                Can't see the PDF? Download it here
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;