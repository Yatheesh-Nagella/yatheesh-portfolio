import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Yatheesh Nagella | Cloud Solutions Consultant & Software Engineer',
  description: 'Software Engineer & Cloud Solutions Consultant specializing in AWS, Kubernetes, DevOps, and AI applications. Available for consulting.',
  keywords: ['Software Engineer', 'Cloud Consultant', 'AWS', 'DevOps', 'Kubernetes', 'Next.js', 'AI'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CW7Y84LP7M"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CW7Y84LP7M');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}