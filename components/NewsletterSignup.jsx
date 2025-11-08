'use client';

import { useState } from 'react';
import { event } from '@/lib/analytics';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Track subscription attempt
    event({
      action: 'newsletter_signup_attempt',
      category: 'Newsletter',
      label: email
    });

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('🎉 Thanks! Check your email to confirm.');
        setEmail('');
        
        // Track successful subscription
        event({
          action: 'newsletter_signup_success',
          category: 'Newsletter',
          label: email,
          value: 1
        });
      } else {
        setStatus('error');
        setMessage(data.error || 'Oops! Something went wrong.');
        
        // Track error
        event({
          action: 'newsletter_signup_error',
          category: 'Newsletter',
          label: data.error || 'unknown_error'
        });
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      
      event({
        action: 'newsletter_signup_error',
        category: 'Newsletter',
        label: 'network_error'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 lg:p-12 text-white text-center">
      <h3 className="text-3xl lg:text-4xl font-black mb-4">
        Want More Tutorials? 📚
      </h3>
      <p className="text-lg mb-6 opacity-90">
        Get notified when I publish new interactive tutorials and coding guides!
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-6 py-3 rounded-full bg-white text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/50 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-8 py-3 bg-white text-orange-500 rounded-full font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Subscribing...</span>
              </>
            ) : status === 'success' ? (
              '✅ Subscribed!'
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
        
        {message && (
          <p className={`mt-4 text-sm font-medium ${
            status === 'success' ? 'text-white' : 'text-yellow-200'
          }`}>
            {message}
          </p>
        )}
      </form>
      
      {status !== 'success' && (
        <p className="mt-4 text-sm opacity-75">
          No spam, ever. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}