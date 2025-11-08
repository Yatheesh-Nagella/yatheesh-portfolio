'use client';

export default function KofiButton({ 
  style = 'default', // 'default' | 'minimal' | 'floating'
  message = 'Support my work'
}) {
  if (style === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
        <a
          href="https://ko-fi.com/yatheeshnagella"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#FF5E5B] hover:bg-[#FF4542] text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        >
          <span className="text-xl">☕</span>
          <span className="font-semibold">Support</span>
        </a>
      </div>
    );
  } else if (style === 'minimal') {
    return (
      <a
        href="https://ko-fi.com/yatheeshnagella"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF5E5B] transition-colors"
      >
        <span>☕</span>
        <span className="text-sm underline">{message}</span>
      </a>
    );
  }
  // Default style - prominent button
  return (
    <div className="bg-gradient-to-r from-[#FF5E5B] to-[#FF8E3C] rounded-2xl p-6 text-white text-center">
      <h3 className="text-2xl font-bold mb-2">Enjoyed this tutorial?</h3>
      <p className="mb-4 opacity-90">
        Your support helps me create more free, interactive content!
      </p>
      <a
        href="https://ko-fi.com/yatheeshnagella"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-[#FF5E5B] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
      >
        <span className="text-xl">☕</span>
        <span>Buy Me a Coffee</span>
      </a>
    </div>
  );
}