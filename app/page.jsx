'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="text-xl font-semibold text-gray-900 hover:text-orange-500 transition-colors">
            Yatheesh
          </button>
          <div className="flex gap-8">
            {['Projects', 'Services', 'About', 'Experience', 'Contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className={`text-gray-600 hover:text-orange-500 transition-colors ${activeSection === item.toLowerCase() ? 'text-orange-500' : ''}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl mb-8"
            >
              👤
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-8 leading-[1.15] max-w-5xl"
            >
              I'm Yatheesh Nagella, a Software Engineer & Cloud Solutions Consultant specializing in building scalable cloud infrastructure and intelligent AI applications.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 max-w-4xl leading-relaxed"
            >
              Leveraging expertise in multi-cloud architecture, DevOps automation, and modern web technologies, I help organizations build resilient systems that drive business value.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-6 mb-14"
          >
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="https://github.com/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors">
              GitHub
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="https://linkedin.com/in/Yatheesh-Nagella" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-500 transition-colors">
              LinkedIn
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} href="mailto:yatheeshnagella17@gmail.com" className="text-gray-600 hover:text-orange-500 transition-colors">
              Email
            </motion.a>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  📱
                </div>
              </motion.div>
            ))}
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
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
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
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
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
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] bg-gradient-to-br from-green-600 to-teal-500 rounded-lg mb-6 overflow-hidden relative hover:shadow-2xl transition-shadow"
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
                { value: '3+', label: 'Years Experience' },
                { value: '3.78', label: 'M.S. Computer Science GPA' },
                { value: 'AWS Certified', label: 'Solutions Architect - Associate' },
                { value: 'Oklahoma City, OK', label: 'Available for Remote Work' }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp} className="border-l-4 border-orange-500 pl-6">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
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
            ].map((job, index) => (
              <motion.div key={index} variants={fadeInUp} className="border-l-2 border-gray-200 pl-8 relative">
                <div className="absolute w-4 h-4 bg-orange-500 rounded-full" style={{left: '-9px', top: 0}}></div>
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
            ))}
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
                { title: 'Cloud & Infrastructure', skills: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform'] },
                { title: 'Programming Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'PHP'] },
                { title: 'Frontend Technologies', skills: ['React', 'Next.js', 'Angular', 'Flutter', 'Tailwind CSS'] },
                { title: 'Backend & APIs', skills: ['Node.js', 'Express.js', 'Spring Boot', 'GraphQL', 'REST'] },
                { title: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Astra DB', 'Vector DBs'] },
                { title: 'DevOps & Tools', skills: ['Jenkins', 'GitHub Actions', 'CI/CD', 'Istio', 'Kafka'] }
              ].map((category, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <h4 className="font-semibold text-gray-900 mb-3">{category.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                      <motion.span whileHover={{ scale: 1.05 }} key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-default">{skill}</motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
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
    </div>
  );
};

export default Portfolio;