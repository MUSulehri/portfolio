import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Mail, Linkedin, ExternalLink, Github, Code, Server, Database, Cloud, Zap } from "lucide-react";

// ImageWithFallback component for handling image loading errors
function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==" alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={() => setDidError(true)} />
  );
}

// Particle animation component for background effect
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];

    const createParticles = () => {
      const width = canvas.width;
      const height = canvas.height;

      particles = [];
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          color: `rgba(10, 132, 255, ${Math.random() * 0.5 + 0.1})`,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(10, 132, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, opacity: 0.7 }}
    />
  );
};

// Animated counter component
const AnimatedCounter = ({ value, label, color, icon }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startValue = 0;
          const duration = 2000; // ms
          const increment = Math.ceil(value / (duration / 16));

          const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= value) {
              clearInterval(timer);
              startValue = value;
            }
            setCount(startValue);
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [value]);

  return (
    <motion.div
      ref={counterRef}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-extrabold" style={{ color }}>
          {count}
          {typeof value === 'number' && value > 0 && <span>+</span>}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
      </div>
      <div className="text-lg font-medium">{label}</div>
    </motion.div>
  );
};

// Glowing badge component
const GlowingBadge = ({ children, color }) => {
  return (
    <div
      className="inline-block px-4 py-1 rounded-full font-medium text-sm mb-6"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        boxShadow: `0 0 20px ${color}30`
      }}
    >
      {children}
    </div>
  );
};

export default function Portfolio({
  primaryColor = "#0F1B2D",
  accentColor = "#0A84FF",
  name = "Muhammad Usman Sulehri",
  primaryHeadline = "Senior Software Consultant",
  secondaryHeadline = "Helping Teams Build Scalable Systems",
  subheadline = "4+ years of experience in fullstack development, cloud architecture, and technical consulting."
}) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const testimonialRef = useRef(null);

  const services = [
    {
      id: 1,
      title: "Backend Engineering & API Development",
      description: "Building robust, scalable APIs and backend systems that power modern applications.",
      icon: <Code size={28} />,
      color: "#0A84FF"
    },
    {
      id: 2,
      title: "Cloud Architecture & DevOps Support",
      description: "Designing and implementing cloud infrastructure that scales with your business needs.",
      icon: <Cloud size={28} />,
      color: "#30D158"
    },
    {
      id: 3,
      title: "System Design & Technical Consulting",
      description: "Providing expert guidance on architecture decisions and system design challenges.",
      icon: <Server size={28} />,
      color: "#FF9F0A"
    },
    {
      id: 4,
      title: "Troubleshooting & Performance Optimization",
      description: "Identifying and resolving performance bottlenecks to ensure optimal system operation.",
      icon: <Zap size={28} />,
      color: "#FF375F"
    },
  ];

  const techStack = {
    languages: ["Java", "Spring Boot", "Python", "Node.js", "React", "TypeScript", "Next.js"],
    cloud: ["AWS (ECS, EC2, Lambda, S3)", "Docker", "GitHub Actions"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    messaging: ["Apache Kafka", "AWS SQS"]
  };

  const projects = [
    {
      id: 1,
      name: "Data-as-a-Service Platform",
      subtitle: "API Integration Layer",
      problem: "Client needed a unified data access layer across multiple disparate systems.",
      solution: "Designed a scalable API gateway with caching and rate limiting capabilities.",
      outcome: "Reduced data access time by 60% and enabled new product features.",
      tech: ["Java", "Spring Boot", "Redis", "AWS API Gateway"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#0A84FF"
    },
    {
      id: 2,
      name: "Resumable File Upload System",
      subtitle: "Cloud Storage Solution",
      problem: "Large file uploads were failing in unstable network environments.",
      solution: "Implemented chunked upload system with client-side retry logic.",
      outcome: "99.8% upload success rate even in challenging network conditions.",
      tech: ["Node.js", "AWS S3", "React", "MongoDB"],
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#30D158"
    },
    {
      id: 3,
      name: "Microservices Migration",
      subtitle: "Scaling for Traffic Growth",
      problem: "Monolithic application couldn't handle growing user base.",
      solution: "Designed and implemented phased migration to microservices architecture.",
      outcome: "System now handles 10x the traffic with improved stability.",
      tech: ["Java", "Spring Cloud", "Docker", "Kubernetes"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#FF9F0A"
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "Usman has been excellent to work with over the past few months and has delivered lots of additions (both major and minor) to our SaaS app. His communication is excellent and provides good solutions from minimal briefs. I would not hesitate to continue working with Usman for our future.",
      name: "Bruce Buxton",
      position: "Co-Founder | motionhub.ai",
      image: "/recommendation3.jpeg",
    },
    {
      id: 2,
      text: "I enjoyed working with Usman at Flywheel and can confidently say he is an outstanding software engineer. Usman consistently demonstrated a remarkable ability to deliver high-quality work on time, every time. His commitment to exceeding expectations was evident in every project he tackled. Usman is incredibly responsible and takes his commitments seriously. He approaches every task with a sense of ownership and dedication that is truly commendable. His technical skills are top-notch, and he has an exceptional ability to translate complex requirements into seamless solutions making him an invaluable member of our team.",
      name: "Anastasia Vernidub",
      position: "Product Manager | B2B SaaS & B2C E-commerce | Healthcare-Tech, AI | 0→1 Product Development | ex‑Accenture",
      image: "/recommendation.jpeg",
    },
    {
      id: 3,
      text: "Usman is one of those rare, faultless colleagues. There is no task too hard, no challenge that can't be approached, nor conversation that can't be had. To achieve, he puts in 101% effort into every area. I couldn't ask for a more reliable colleague!",
      name: "Peter Joseph",
      position: "Engineering Manager | Data Analyst | Flywheel",
      image: "/recommendation2.jpeg",
    }
  ];

  const workProcess = [
    {
      id: 1,
      title: "Discovery",
      description: "Understanding your needs, challenges, and goals through in-depth consultation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4M12 8h.01"></path>
        </svg>
      ),
      color: "#0A84FF"
    },
    {
      id: 2,
      title: "Proposal & Planning",
      description: "Creating a detailed roadmap with clear deliverables, timelines, and milestones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path>
        </svg>
      ),
      color: "#30D158"
    },
    {
      id: 3,
      title: "Development",
      description: "Executing the plan with regular updates and transparent communication.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      ),
      color: "#FF9F0A"
    },
    {
      id: 4,
      title: "Delivery & Support",
      description: "Ensuring smooth implementation and providing ongoing support as needed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="M22 4L12 14.01l-3-3"></path>
        </svg>
      ),
      color: "#FF375F"
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.a
              href="#"
              className="text-xl font-bold relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ color: primaryColor }}
            >
              {name}
              <motion.span
                className="absolute -bottom-1 left-0 h-1 rounded-full"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <motion.button
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-gray-900 py-2 relative"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                About
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-gray-300 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('services')}
                className="text-gray-600 hover:text-gray-900 py-2 relative"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Services
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-gray-300 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('projects')}
                className="text-gray-600 hover:text-gray-900 py-2 relative"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Projects
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 rounded-full bg-gray-300 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2 rounded-lg font-medium transition-all overflow-hidden relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                style={{ backgroundColor: accentColor, color: 'white' }}
              >
                <span className="relative z-10">Contact</span>
                <motion.span
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.button>
            </div>

            {/* Mobile Navigation Toggle */}
            <motion.button
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 space-y-4 bg-white rounded-lg shadow-xl p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">About</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Services</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left py-2 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Projects</button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 px-4 rounded-lg text-white font-medium"
                style={{ backgroundColor: accentColor }}
              >
                Contact
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-0" />
        <ParticleBackground />

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <GlowingBadge color={accentColor}>Senior Developer</GlowingBadge>

              <motion.h1
                className="text-5xl md:text-6xl font-extrabold leading-tight mb-3 tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                {primaryHeadline}
              </motion.h1>

              <motion.h2
                className="text-3xl md:text-4xl font-semibold leading-snug mb-6 text-gray-800"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {secondaryHeadline}
              </motion.h2>

              <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {subheadline}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
              >
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 rounded-lg font-medium transition-all relative group overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(10, 132, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: accentColor, color: 'white' }}
                >
                  <span className="relative z-10">Hire Me</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-full bg-white"
                    initial={{ height: "0%" }}
                    whileHover={{ height: "100%" }}
                    transition={{ duration: 0.3 }}
                    style={{ opacity: 0.15, zIndex: 0 }}
                  />
                </motion.button>

                <motion.button
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-4 rounded-lg font-medium border-2 transition-all relative group overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(15, 27, 45, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <span className="relative z-10">View Projects</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 group-hover:h-full"
                    style={{ backgroundColor: `${primaryColor}10`, zIndex: 0 }}
                  />
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              className="md:w-1/2 mt-16 md:mt-0"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 100 }}
            >
              <div className="relative mx-auto max-w-md">
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 blur-xl opacity-70" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-100 to-green-100 blur-xl opacity-70" />

                {/* Profile image with gradient border */}
                <div className="relative z-10 rounded-2xl p-1 bg-gradient-to-tr from-blue-400 to-purple-500 shadow-2xl">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src="/profile_picture_glasses.jpg"
                      alt="Professional portrait"
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>

                {/* Code block decoration */}
                <motion.div
                  className="absolute -right-10 -bottom-10 p-4 rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20 hidden md:block"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <pre className="text-xs text-gray-700 dark:text-gray-300">
                    <code>{`function optimize(system) {
  return system.scale(10x);
}`}</code>
                  </pre>
                </motion.div>

                {/* Experience badge */}
                <motion.div
                  className="absolute -left-5 -top-5 py-2 px-4 rounded-lg shadow-xl bg-white border border-gray-200 z-20 hidden md:flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold">Available for work</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll down indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: [0, 10, 0],
              transition: {
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 0.5, delay: 2 }
              }
            }}
          >
            <span className="text-sm text-gray-500 mb-2">Scroll down</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-24 relative">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gray-100 to-white"></div>

        <div className="container mx-auto px-6 relative">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                About Me
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-16">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                I'm a <span className="font-semibold" style={{ color: primaryColor }}>Senior Software Consultant</span> specializing in backend engineering and cloud architecture. With over 4 years of experience working with both startups and enterprise clients, I help teams build scalable, maintainable systems that solve real business problems.
              </p>

              <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                My approach combines technical expertise with a deep understanding of business needs. I believe in building solutions that not only work well today but can adapt and scale as your business grows.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you need help with system design, performance optimization, or implementing new features, I bring a pragmatic, results-oriented mindset to every project.
              </p>

              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-gray-300 transition-colors">Problem Solver</span>
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-gray-300 transition-colors">Technical Expert</span>
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-gray-300 transition-colors">Cloud Specialist</span>
                <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-gray-300 transition-colors">Strategic Thinker</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedCounter value={4} label="Years Experience" color={accentColor} icon={<Code size={24} style={{ color: accentColor }} />} />
                <AnimatedCounter value={10} label="Projects Completed" color="#FF9F0A" icon={<Server size={24} style={{ color: "#FF9F0A" }} />} />
                <AnimatedCounter value={7} label="Happy Clients" color="#30D158" icon={<Zap size={24} style={{ color: "#30D158" }} />} />
                <AnimatedCounter value={10} label="Tech Stacks" color="#FF375F" icon={<Database size={24} style={{ color: "#FF375F" }} />} />
                <div className="md:col-span-2 flex justify-center">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl shadow-md border-2 border-yellow-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-extrabold text-yellow-600">🏆</div>
                      <div className="p-3 rounded-lg bg-yellow-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mt-4">1x Employee of the Month</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Services
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Specialized expertise to help your team build better software systems
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
              >
                <div
                  className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center"
                  style={{
                    backgroundColor: `${service.color}10`,
                    color: service.color,
                    transition: "all 0.3s ease"
                  }}
                >
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-semibold mb-4 group-hover:translate-x-1 transition-transform duration-300"
                  style={{ color: primaryColor }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 p-10 rounded-2xl shadow-xl text-white text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Ready to transform your technical challenges into solutions?</h3>
            <p className="mb-6 text-gray-300">Let's discuss how I can help your team build better systems.</p>
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              style={{ backgroundColor: accentColor }}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Tech Stack
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Technologies I work with to build robust, scalable solutions
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-8xl mx-auto [&>*:last-child:nth-child(3n+1)]:col-start-2">
            <motion.div
              className="bg-white p-10 rounded-xl shadow-xl border-t-4 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: "#0A84FF" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3
                className="text-xl font-semibold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <Code size={24} className="mr-3" style={{ color: "#0A84FF" }} />
                Languages & Frameworks
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.languages.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-10 rounded-xl shadow-xl border-t-4 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: "#30D158" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3
                className="text-xl font-semibold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <Cloud size={24} className="mr-3" style={{ color: "#30D158" }} />
                Cloud & DevOps
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.cloud.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-10 rounded-xl shadow-xl border-t-4 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: "#FF9F0A" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3
                className="text-xl font-semibold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <Database size={24} className="mr-3" style={{ color: "#FF9F0A" }} />
                Databases
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.databases.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-10 rounded-xl shadow-xl border-t-4 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: "#FF9F0A" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3
                className="text-xl font-semibold mb-6 flex items-center"
                style={{ color: primaryColor }}
              >
                <Database size={24} className="mr-3" style={{ color: "#FF9F0A" }} />
                Messaging & Caching
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.messaging.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Featured Projects
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Recent work that demonstrates my approach and expertise
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 * index }}
                whileHover={{ y: -15 }}
              >
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium text-sm">View Project Details</p>
                  </div>
                  <div
                    className="absolute top-4 right-4 p-2 rounded-full z-20"
                    style={{ backgroundColor: project.color, opacity: 0.9 }}
                  >
                    {project.id === 1 ? (
                      <Code size={20} color="white" />
                    ) : project.id === 2 ? (
                      <Cloud size={20} color="white" />
                    ) : (
                      <Server size={20} color="white" />
                    )}
                  </div>
                </div>

                <div className="p-8 border-t border-gray-100">
                  <h3
                    className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors duration-300"
                    style={{ color: primaryColor }}
                  >
                    {project.name}
                  </h3>
                  <p className="text-gray-500 mb-5">{project.subtitle}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div
                        className="font-medium text-sm uppercase tracking-wider mb-1"
                        style={{ color: project.color }}
                      >
                        Problem
                      </div>
                      <p className="text-gray-700">{project.problem}</p>
                    </div>

                    <div>
                      <div
                        className="font-medium text-sm uppercase tracking-wider mb-1"
                        style={{ color: project.color }}
                      >
                        Solution
                      </div>
                      <p className="text-gray-700">{project.solution}</p>
                    </div>

                    <div>
                      <div
                        className="font-medium text-sm uppercase tracking-wider mb-1"
                        style={{ color: project.color }}
                      >
                        Outcome
                      </div>
                      <p className="text-gray-700">{project.outcome}</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100">
                    <div
                      className="font-medium text-sm uppercase tracking-wider mb-3 text-gray-500"
                    >
                      Technologies Used
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: `${project.color}15`,
                            color: project.color
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-green-100 to-blue-100 blur-3xl opacity-70"></div>

        <div className="container mx-auto px-6 relative">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Client Testimonials
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            What clients say about working with me
          </motion.p>

          <div className="relative max-w-4xl mx-auto" ref={testimonialRef}>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <motion.div
                      className="bg-white p-10 rounded-xl shadow-xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 ring-4 ring-blue-50 flex-shrink-0">
                          <ImageWithFallback
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center sm:text-left">
                          <h4
                            className="font-semibold text-lg"
                            style={{ color: primaryColor }}
                          >
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600">{testimonial.position}</p>
                          <div className="flex items-center justify-center sm:justify-start mt-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -top-6 -left-4 text-gray-300 text-6xl opacity-30">"</div>
                        <p className="text-gray-700 leading-relaxed text-lg relative z-10">
                          {testimonial.text}
                        </p>
                        <div className="absolute -bottom-8 -right-4 text-gray-300 text-6xl opacity-30">"</div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows & Dots */}
            <div className="mt-12 flex items-center justify-center gap-4">
              {/* Left Arrow */}
              <motion.button
                onClick={prevTestimonial}
                className="p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </motion.button>

              {/* Dots */}
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'scale-100' : 'scale-75'
                      }`}
                    whileHover={{ scale: 1.2 }}
                    style={{
                      backgroundColor: activeTestimonial === index ? accentColor : '#CBD5E1',
                      boxShadow: activeTestimonial === index ? `0 0 10px ${accentColor}70` : 'none'
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  ></motion.button>
                ))}
              </div>

              {/* Right Arrow */}
              <motion.button
                onClick={nextTestimonial}
                className="p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="relative">
              <motion.h2
                className="text-4xl font-bold text-center"
                style={{ color: primaryColor }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                How I Work
              </motion.h2>
              <motion.div
                className="h-1 w-20 rounded-full mt-4 mx-auto"
                style={{ backgroundColor: accentColor }}
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>

          <motion.p
            className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A structured approach to ensure project success
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workProcess.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * index }}
              >
                <div className="bg-white p-8 rounded-xl shadow-lg h-full relative z-10 border-b-4" style={{ borderColor: step.color }}>
                  <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: step.color }}>
                    {step.id}
                  </div>
                  <div className="flex justify-center mb-6">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${step.color}20`, color: step.color }}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-4 text-center"
                    style={{ color: primaryColor }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>

                {index < workProcess.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 items-center">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-green-100 to-blue-100 blur-3xl opacity-70"></div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto bg-white p-12 rounded-2xl shadow-2xl">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlowingBadge color={accentColor}>Get in Touch</GlowingBadge>
              <h2
                className="text-4xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Let's Work Together
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Available for consulting, freelance, and long-term engagements
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.a
                href="mailto:msulehrissi@gmail.com"
                className="flex items-center gap-3 px-10 py-4 rounded-lg text-white font-medium transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: accentColor }}
              >
                <Mail size={20} />
                <span className="text-lg">msulehrissi@gmail.com</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.a>

              <div className="flex gap-5">
                <motion.a
                  href="https://www.linkedin.com/in/muhammad-usman-sulehri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full border-2 border-gray-300 hover:border-blue-400 transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={24} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
                  <motion.div
                    className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity z-[-1]"
                  />
                </motion.a>
                {/* <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full border-2 border-gray-300 hover:border-gray-700 transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub Profile"
                >
                  <Github size={24} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
                  <motion.div
                    className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-[-1]"
                  />
                </motion.a> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-600 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-6">
            <motion.div
              className="h-0.5 w-24 rounded-full"
              style={{ backgroundColor: `${primaryColor}30` }}
            />
          </div>
          <p className="mb-6">© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-gray-800">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-800">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-800">Cookies Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
