'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Global Variables for Firebase/API (Mandatory Check) ---
// IMPORTANT: For client-side React code, an API key should generally be
// handled securely via a serverless function or a secure build-time environment.
// For this single-file example, it is placed here but should be noted as insecure practice.
const GEMINI_API_KEY = "AIzaSyDjCoKZdmErVtSLZ3fso87gxI9LSJ__TFw"; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

// --- Mock Data ---
const services = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V5H6.5A2.5 2.5 0 0 0 4 7.5v12z"/><path d="M12 12H16"/></svg>
    ),
    title: "School Management Systems",
    description: "Automate administrative tasks, enhance parent-teacher communication, and provide a seamless digital learning environment.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21a8 8 0 0 1 11.873-7.825 8 8 0 0 1 8.127 7.825"/><path d="M12 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><path d="m19 16-2 3-2-3"/><path d="m5 16 2 3 2-3"/></svg>
    ),
    title: "Hotel Management Websites",
    description: "Boost direct bookings with high-speed websites featuring integrated PMS, channel managers, and secure payment gateways.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
    ),
    title: "High-Performance E-commerce",
    description: "Engineer custom, scalable online stores (B2B/B2C) designed for high conversion rates and maximum product visibility.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2 .9-2 2v1h22v-1c0-1.1-.9-2-2-2h-3"/><path d="M19 18V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
    ),
    title: "Shipping Logistics Websites",
    description: "Provide clients with real-time tracking, automated quotes, and seamless dashboard management for all their shipping needs.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "SEO-First Design",
    description: "Every project is architected from the ground up to achieve high organic search rankings and sustainable traffic growth.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Bespoke Software Solutions",
    description: "Develop custom applications that automate unique business processes, eliminate bottlenecks, and maximize operational efficiency.",
  },
];

// --- AnimatedSection with Intersection Observer API ---
interface AnimatedSectionProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
}
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0, className = '' }) => {
  const [inView, setInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setInView(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

// --- SEO Content Idea Generator Component (UPDATED) ---
const SeoIdeaGenerator = () => {
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UPDATED: Function to call the live Gemini API
  const callGeminiApi = async (userQuery: string): Promise<string> => {
    // The prompt is engineered to produce the desired structured markdown output
    const prompt = `You are a world-class SEO strategist. Based on the user's topic, generate a professional, comprehensive, and search-engine-optimized content outline. The output MUST be in markdown format following this structure:
# **H1:** [Title of the Article/Guide]

**Meta Description:** [A concise, compelling description for search engine results]

---

### **H2 Sections:**

1.  **[Main Section Idea 1]**
2.  **[Main Section Idea 2]**
3.  **[Main Section Idea 3]**
4.  **[Main Section Idea 4]**
5.  **[Main Section Idea 5]**

---

### **Keyword Variations:**

* [Long-tail keyword 1]
* [Long-tail keyword 2]
* [Long-tail keyword 3]

The user's topic is: "${userQuery}"`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            // Lower temperature for more focused, structured output
            temperature: 0.4,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the text from the response structure
      const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!resultText) {
         throw new Error("Received an empty or malformed response from the AI.");
      }

      return resultText;

    } catch (err: any) {
      console.error('Gemini API Error:', err);
      // Fallback to a structured error message
      return `# **Error Generating Outline**
**Meta Description:** We apologize for the technical issue. The live API call failed.

---

### **H2 Sections:**

1.  **Error Details:** The API call could not be completed.
2.  **Check:** Please verify the API key and network connection.
3.  **Topic Attempted:** ${userQuery}
`;
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please provide a topic idea to get started.');
      return;
    }
    setLoading(true);
    setOutline('');
    setError('');
    
    // Pass the raw topic to the API function
    const result = await callGeminiApi(topic); 
    
    // The result from the API will be the structured markdown
    setOutline(result);
    setLoading(false);
    
    // Scroll to the generated content
    setTimeout(() => {
        const generatedDiv = document.getElementById('generated-outline-container');
        generatedDiv?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
      <h3 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
        ✨ Instant SEO Content Strategist
      </h3>
      <p className="text-gray-600 text-center mb-8">
        Enter a topic and our AI will generate a professional, SEO-optimized content outline, demonstrating the data-driven strategies we provide.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setError(''); }}
          placeholder="e.g., The Future of E-commerce SEO"
          className="flex-grow p-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          className={`px-8 py-4 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Outline'}
        </button>
      </div>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {outline && (
        <div 
            id="generated-outline-container"
            className="mt-8 p-6 bg-slate-50 rounded-lg border border-blue-200 max-h-[28rem] overflow-y-auto prose prose-blue max-w-none"
        >
           <div
             dangerouslySetInnerHTML={{
               // Use 'marked' for markdown to HTML conversion if available globally (as per the script tag)
               __html: typeof window !== 'undefined' && (window as any).marked
                 ? (window as any).marked.parse(outline)
                 : outline
             }}
           />
        </div>
      )}
    </div>
  );
};

// --- CUSTOMIZATION: Navbar updated to "rhyme" with the new background ---
interface NavbarProps {
  sections: { id: string; name: string }[];
}
const Navbar: React.FC<NavbarProps> = ({ sections }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // When scrolled, the navbar becomes a dark, blurred panel, matching the tech theme.
  const navClass = scrolled
    ? 'bg-gray-900/70 backdrop-blur-lg shadow-lg border-b border-blue-500/20'
    : 'bg-transparent';
    
  // Link color is always white for consistency against the hero image and the dark scrolled navbar.
  const linkColor = 'text-white';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out ${navClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#" className={`text-2xl font-extrabold transition-colors duration-300 z-50 ${linkColor}`}>
            Ulisha<span className="text-blue-500">Tech</span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`text-sm font-medium tracking-wide pb-1 border-b-2 border-transparent transition-all duration-300 ${linkColor} hover:border-blue-500 hover:text-blue-300`}
              >
                {section.name}
              </a>
            ))}
          </div>
          <div className="flex items-center">
              <a
              href="#contact"
              className="hidden md:block px-5 py-2 text-sm font-semibold rounded-md shadow-md transition-all duration-300 transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700"
            >
              Get a Quote
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 z-50 ${linkColor}`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
                <div className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-2.5' : '-translate-y-1'}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isOpen ? '-translate-y-2.5 -rotate-90' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-0 left-0 w-full bg-gray-900 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0 shadow-lg' : '-translate-y-full'
        }`}
      >
        <div className="px-2 pt-20 pb-5 space-y-2 sm:px-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-blue-900/50 hover:text-white"
            >
              {section.name}
            </a>
          ))}
            <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center mt-4 px-3 py-3 rounded-md text-base font-semibold transition-colors duration-300 bg-blue-600 text-white hover:bg-blue-700"
           >
            Get a Quote
          </a>
        </div>
      </div>
    </nav>
  );
};

// --- Main App Component ---
const App = () => {
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'services', name: 'Solutions' },
    { id: 'features', name: 'Why Us' },
    { id: 'seo-tool', name: 'AI Strategist' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <div className="min-h-screen font-sans bg-white text-gray-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

      <Navbar sections={sections} />

      {/* --- CUSTOMIZATION: Hero section with a background image --- */}
      <section 
        id="hero" 
        className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80)` }}
      >
        {/* Adds a dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              From Vision to Victory:
              <span className="block text-blue-300 mt-2">Your Digital Growth Engine.</span>
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Ulisha Technologies builds high-performance software and SEO-driven websites that don't just compete—they dominate. Let's build your competitive edge.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="#contact" className="px-8 py-3 bg-white text-blue-600 font-bold text-lg rounded-md shadow-2xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300">
                Start Your Project
              </a>
              <a href="#seo-tool" className="px-8 py-3 border-2 border-blue-300 text-white font-bold text-lg rounded-md shadow-xl hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
                Try Our AI Tool
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={100} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Our Core Software & Website Specializations
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We engineer secure, scalable, and search-optimized solutions designed for high-impact sectors and rapid growth.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={index}
                delay={200 + index * 100}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-blue-500"
              >
                <div className="mb-5 p-3 bg-blue-100 rounded-full inline-block">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <AnimatedSection delay={200} className="mb-12 lg:mb-0">
                    <div className="bg-blue-600 p-8 rounded-3xl shadow-2xl relative">
                        <div className="relative text-center p-6 bg-blue-700/80 rounded-2xl">
                            <p className="text-6xl font-extrabold text-white">99%</p>
                            <p className="text-blue-100 mt-2 text-lg">Client Satisfaction Score</p>
                            <div className="mt-6 border-t border-blue-500 pt-4">
                                <p className="text-xl text-white font-semibold">Focused on Data-Driven Growth</p>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                <div>
                  <AnimatedSection delay={300}>
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        The Ulisha Technologies Difference
                    </h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        We don't just build websites; we engineer digital assets. Our approach fuses cutting-edge software development with aggressive, ethical SEO practices.
                    </p>
                  </AnimatedSection>
                  <div className="mt-10 space-y-6">
                    {[
                      { title: "Code Excellence", desc: "Clean, modern, and documented code ensuring long-term maintainability and peak performance.", icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
                      { title: "Scalability First Mindset", desc: "Solutions designed from day one to handle massive traffic and data loads as your business grows.", icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
                      { title: "Pixel-Perfect Responsiveness", desc: "A flawless user experience on any device, boosting engagement and conversions everywhere.", icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                    ].map((feature, index) => (
                      <AnimatedSection key={index} delay={400 + index * 100}>
                          <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
                                  {feature.icon}
                              </div>
                              <div>
                                  <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                                  <p className="text-gray-600">{feature.desc}</p>
                              </div>
                          </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
            </div>
        </div>
      </section>

      <section id="seo-tool" className="py-24 bg-gray-50">
        <AnimatedSection>
          <SeoIdeaGenerator />
        </AnimatedSection>
      </section>

      <section id="contact" className="py-24 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-5xl font-extrabold text-white">
              Ready to Scale Faster?
            </h2>
            <p className="mt-4 text-xl text-blue-200 max-w-3xl mx-auto">
              Stop waiting for growth. Let's design a digital solution that positions your business for immediate and long-term success.
            </p>
            <a
              href="https://calendly.com/paulelite606/meeting"
              className="mt-10 inline-block px-10 py-4 bg-white text-blue-700 font-bold text-lg rounded-md shadow-2xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
            >
              Book Your Free Consultation
            </a>
          </AnimatedSection>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div>
                    <h4 className="text-lg font-bold text-blue-400 mb-4">UlishaTech</h4>
                    <p className="text-sm text-gray-400">
                        Engineering growth through high-performance software and superior SEO-ready websites.
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Solutions</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#services" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                        <li><a href="#services" className="hover:text-blue-400 transition-colors">Custom Software</a></li>
                        <li><a href="#features" className="hover:text-blue-400 transition-colors">SEO & Strategy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#hero" className="hover:text-blue-400 transition-colors">About Us (Mock)</a></li>
                        <li><a href="#features" className="hover:text-blue-400 transition-colors">Careers (Mock)</a></li>
                        <li><a href="#contact" className="hover:text-blue-400 transition-colors">Get In Touch</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Connect</h4>
                    <p className="text-sm text-gray-400">contact@ulishatech.com</p>
                </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Ulisha Technologies. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;