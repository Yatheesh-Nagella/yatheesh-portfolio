# 🚀 Yatheesh Nagella - Portfolio

A modern, responsive portfolio website showcasing my work as a Software Engineer and Cloud Solutions Consultant.

[![Live Demo](https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge)](https://your-domain.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 📸 Preview


> **Live Site:** [yatheeshnagella.com](https://yatheeshnagella.com)

---

## ✨ Features

### 🎨 **Modern Design**
- **Animated gradient backgrounds** with floating orbs
- **Glassmorphism effects** with backdrop blur
- **Smooth animations** powered by Framer Motion
- **Mobile-first responsive** design

### 📝 **Blog System**
- Blog index page with post listings
- Individual blog post pages with full content
- Tag-based categorization
- Coming soon posts with preview content
- Reading time estimates

### 🎯 **Interactive Elements**
- **Sticky navigation** with smooth scrolling
- **Project showcase cards** with hover effects
- **Social media integration** (GitHub, LinkedIn, Email)
- **Mobile-friendly menu** with smooth transitions

### 📊 **Sections**
- **Hero** - Introduction with profile and quick links
- **Projects** - Featured work with live demos
- **Services** - What I offer (Cloud, DevOps, Full-Stack)
- **Blog** - Technical articles and insights
- **About** - Background and education
- **Experience** - Work history and achievements
- **Skills** - Technical competencies
- **Contact** - Call-to-action

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI library with hooks |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **JavaScript** | Primary language |
| **Vercel** | Hosting and deployment |
| **Google Analytics** | Visitor tracking |

---

## 📁 Project Structure

```
yatheesh-portfolio/
├── app/                      # Next.js App Router
│   ├── layout.jsx           # Root layout with analytics
│   ├── page.jsx             # Homepage (main portfolio)
│   ├── globals.css          # Global styles + Tailwind
│   ├── favicon.ico          # Site favicon
│   └── blogs/               # Blog section
│       ├── page.jsx         # Blog index
│       └── evolution-of-trust/
│           └── page.jsx     # Individual blog post
│
├── lib/                     # Utilities and helpers
│   └── analytics.jsx        # Google Analytics wrapper
│
├── public/                  # Static assets
│   ├── profile.png          # Profile photo
│   ├── marathon.png         # Marathon achievement
│   └── *.svg                # Icon files
│
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD workflows (optional)
│
├── package.json             # Dependencies and scripts
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.mjs       # PostCSS config
├── tsconfig.json            # TypeScript config
├── DEPLOY.md                # Deployment checklist
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yatheesh-Nagella/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 🎨 Customization Guide

### **1. Update Personal Information**

**File:** `app/page.jsx`

```javascript
// Line ~265 - Update your name
<h1>I'm Yatheesh Nagella, a Software Engineer...</h1>

// Line ~120 - Update social links
<a href="https://github.com/YOUR_USERNAME">GitHub</a>
<a href="https://linkedin.com/in/YOUR_PROFILE">LinkedIn</a>
<a href="mailto:YOUR_EMAIL">Email</a>
```

### **2. Add/Edit Projects**

**File:** `app/page.jsx` - Around line 420

```javascript
// Add a new project card
<motion.div variants={fadeInUp} className="group cursor-pointer">
  <motion.div className="aspect-[4/3] bg-gradient-to-br from-YOUR-COLOR...">
    <div className="text-8xl mb-4">YOUR_EMOJI</div>
    <div className="text-white text-2xl font-bold">Project Name</div>
  </motion.div>
  <h3>Your Project Title</h3>
  <p>Your project description...</p>
</motion.div>
```

### **3. Update Experience**

**File:** `app/page.jsx` - Around line 650

```javascript
{
  title: 'Your Job Title',
  company: 'Company Name',
  period: 'Start - End',
  achievements: [
    'Achievement 1',
    'Achievement 2',
    'Achievement 3'
  ]
}
```

### **4. Add Blog Posts**

Create new folder: `app/blogs/your-post-slug/page.jsx`

```javascript
'use client'

export default function YourPostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Your blog post content */}
    </div>
  );
}
```

Update blog index: `app/blogs/page.jsx`

```javascript
<article className="bg-white rounded-3xl p-6 lg:p-8...">
  <a href="/blogs/your-post-slug">
    <h2>Your Blog Post Title</h2>
    <p>Your blog post excerpt...</p>
  </a>
</article>
```

### **5. Change Colors**

**File:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF5722',  // Change to your brand color
        secondary: '#06B6D4',
      }
    }
  }
}
```

### **6. Add Google Analytics**

**File:** `app/layout.jsx`

```javascript
// Replace with your Measurement ID
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

---

## 🚢 Deployment

### **Deploy to Vercel (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Configure Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records

### **Deploy to Netlify**

1. **Build command:** `npm run build`
2. **Publish directory:** `out` or `.next`
3. **Node version:** 18

### **Deploy to Other Platforms**

Build the project:
```bash
npm run build
```

The output will be in `.next` folder. Upload to any static hosting service.

---

## 📈 Performance

### **Lighthouse Scores** (Target)

- 🟢 **Performance:** 90+
- 🟢 **Accessibility:** 90+
- 🟢 **Best Practices:** 90+
- 🟢 **SEO:** 90+

### **Optimization Tips**

1. **Images:** Use WebP format and next/image
2. **Fonts:** Load fonts locally or use next/font
3. **Code Splitting:** Lazy load components
4. **Caching:** Leverage Vercel's Edge Network

---

## 🧪 Testing

### **Manual Testing Checklist**

Before deployment, verify:

- [ ] All links work (internal and external)
- [ ] Images load correctly
- [ ] Mobile menu opens/closes
- [ ] Blog posts are accessible
- [ ] Forms submit (if applicable)
- [ ] No console errors
- [ ] Responsive on mobile, tablet, desktop

### **Cross-Browser Testing**

Test in:
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)

---

## 🐛 Troubleshooting

### **Build Fails**

```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

### **404 on Routes**

Check that:
- Files are in correct `app/` folders
- Folder names match URL slugs
- No typos in `href` links

### **Styles Not Updating**

```bash
# Clear Tailwind cache
rm -rf .next
npm run dev
```

### **Images Not Loading**

- Ensure images are in `public/` folder
- Use correct paths: `/image.png` not `./image.png`
- Check file names are exact (case-sensitive)

---

## 🤝 Contributing

This is a personal portfolio, but if you find bugs or have suggestions:

1. Open an issue
2. Submit a pull request
3. Email me: yatheeshnagella17@gmail.com

---

## 📝 License

This project is **open source** and available under the [MIT License](LICENSE).

Feel free to use this code for your own portfolio! Just remember to:
- Update the content with your information
- Remove my personal details
- Give credit if you use significant portions

---

## 📬 Contact

**Yatheesh Nagella**

- 🌐 **Website:** [yatheeshnagella.com](https://your-domain.com)
- 💼 **LinkedIn:** [linkedin.com/in/Yatheesh-Nagella](https://linkedin.com/in/Yatheesh-Nagella)
- 🐙 **GitHub:** [github.com/Yatheesh-Nagella](https://github.com/Yatheesh-Nagella)
- 📧 **Email:** yatheeshnagella17@gmail.com

---

## 🎯 Roadmap

### **Completed ✅**
- [x] Responsive portfolio design
- [x] Blog system with routing
- [x] Project showcase
- [x] Mobile navigation
- [x] Framer Motion animations
- [x] Google Analytics integration

### **In Progress 🚧**
- [ ] Blog post: "Evolution of Trust"
- [ ] Dark mode toggle
- [ ] Blog search functionality
- [ ] Contact form with email backend

### **Future 🔮**
- [ ] CMS integration (Sanity/Contentful)
- [ ] Newsletter subscription
- [ ] Comment system for blog
- [ ] Performance monitoring
- [ ] A/B testing

---

## 🙏 Acknowledgments

- **Design Inspiration:** [Brittany Chiang](https://brittanychiang.com/), [Lee Robinson](https://leerob.io/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Hosting:** [Vercel](https://vercel.com/)
- **Font:** System fonts for performance

---

## 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/Yatheesh-Nagella/portfolio)
![GitHub issues](https://img.shields.io/github/issues/Yatheesh-Nagella/portfolio)
![GitHub stars](https://img.shields.io/github/stars/Yatheesh-Nagella/portfolio?style=social)

---

**Built with ❤️ by Yatheesh Nagella**

*Last Updated: October 2025*

---

## 🔗 Quick Links

- [Live Demo](https://your-domain.vercel.app)
- [Deployment Checklist](./DEPLOY.md)
- [Issues](https://github.com/Yatheesh-Nagella/portfolio/issues)

---

> 💡 **Tip:** Star this repo if you found it helpful! It helps others discover it too.