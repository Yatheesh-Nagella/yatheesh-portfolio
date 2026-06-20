'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {['Projects', 'Services', 'Blog', 'Contact'].map((item) => (
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
              {['Projects', 'Services', 'Blog', 'Contact'].map((item) => (
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
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl ring-4 ring-white/50"
                >
                  <div className="text-center">
                    <div className="text-white text-3xl font-black tracking-wider">YN</div>
                    <div className="w-8 h-0.5 bg-white/60 mx-auto mt-1"></div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-6 md:mb-8 leading-[1.15] max-w-5xl"
                >
                  Software Engineering Solutions for Financial Services & Enterprise
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed"
                >
                  From custom web applications to cloud infrastructure and AI integration — delivering end-to-end engineering solutions for banking, fintech, and high-growth businesses that demand scale and reliability.
                </motion.p>
              </div>


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

                {/* OneLibro */}
                <motion.a
                  href="https://finance.yatheeshnagella.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group aspect-square bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-green-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-white font-bold text-sm mb-1">OneLibro</div>
                    <div className="text-white/70 text-xs">Finance SaaS</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs">View Platform →</span>
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

                {/* Cloud Solutions */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => scrollToSection('services')}
                  className="group aspect-square bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 backdrop-blur-sm border border-white/60 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="text-4xl mb-2">☁️</div>
                    <div className="text-white font-bold text-sm mb-1">Cloud Solutions</div>
                    <div className="text-white/70 text-xs">AWS Certified</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">AWS</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs">View Services →</span>
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
            {/* Project 1: OneLibro */}
            <motion.div variants={fadeInUp} className="group cursor-pointer">
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">💰</div>
                    <div className="text-white text-2xl font-bold">OneLibro</div>
                  </div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors">
                OneLibro - Personal Finance SaaS Platform
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Comprehensive financial management platform with real-time banking data integration via Plaid API. Features transaction syncing, budget tracking, and automated categorization across 12,000+ financial institutions. Built with React, Node.js, PostgreSQL, and AWS.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ x: 5 }} href="https://finance.yatheeshnagella.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium">
                  Live Demo →
                </motion.a>
                <motion.a whileHover={{ x: 5 }} href="https://yatheesh-nagella.github.io/OneLibro-DOCS/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 font-medium">
                  Documentation →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 2: F1-GPT */}
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
                Production-ready AI chatbot with Hybrid RAG architecture combining real-time F1 data with historical knowledge. Built with Next.js 14, OpenAI GPT-3.5-turbo, and DataStax Astra DB vector database for semantic search across 70+ years of F1 history.
              </p>
              <div className="flex gap-4">
                <motion.a whileHover={{ x: 5 }} href="https://f1-gpt-eta.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium">
                  Live Demo →
                </motion.a>
                <motion.a whileHover={{ x: 5 }} href="https://github.com/Yatheesh-Nagella/f1-gpt" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 font-medium">
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
      <footer className="bg-gray-900 text-white py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-2xl font-black mb-3 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Yatheesh Nagella
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Software Engineer & Cloud Solutions Consultant specializing in scalable cloud architecture and modern web development.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    Projects
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-orange-500 transition-colors">
                    Services
                  </button>
                </li>
                <li>
                  <a href="/blogs" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Yatheesh Nagella. Built with Next.js & Tailwind CSS
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      


    </div>
  );
};

export default Portfolio;