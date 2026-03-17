import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Camera,
  BookOpen,
  Palette,
  Code2,
  Video,
  Music,
  Mic2,
  Cake,
  Sparkles,
  Dumbbell,
  Wrench,
  Car,
  Flower2,
  PawPrint,
  Home as HomeIcon,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const categories = [
    {
      icon: Camera,
      label: "Photography",
      desc: "Professional photographers for any occasion",
    },
    {
      icon: Video,
      label: "Videography",
      desc: "Videographers for events and productions",
    },
    {
      icon: Palette,
      label: "Design",
      desc: "Creative designers for your brand",
    },
    {
      icon: Code2,
      label: "Development",
      desc: "Skilled developers for your projects",
    },
    {
      icon: BookOpen,
      label: "Tutoring",
      desc: "Expert tutors for all subjects and levels",
    },
    {
      icon: Music,
      label: "Music Lessons",
      desc: "Learn instruments and vocals",
    },
    {
      icon: Mic2,
      label: "Events Host",
      desc: "Professional emcees for any event",
    },
    { icon: Cake, label: "Cake Artist", desc: "Custom cakes and pastries" },
    {
      icon: Sparkles,
      label: "Hair & Makeup",
      desc: "Beauty artists for any occasion",
    },
    {
      icon: Dumbbell,
      label: "Fitness Trainer",
      desc: "Personal trainers for your goals",
    },
    { icon: Wrench, label: "Handyman", desc: "Repairs and installations" },
    { icon: Car, label: "Driver", desc: "Professional drivers and chauffeurs" },
    {
      icon: Flower2,
      label: "Florist",
      desc: "Beautiful arrangements for any occasion",
    },
    {
      icon: PawPrint,
      label: "Pet Groomer",
      desc: "Keep your pets clean and happy",
    },
    {
      icon: HomeIcon,
      label: "House Cleaning",
      desc: "Professional home cleaning services",
    },
    {
      icon: Calculator,
      label: "Accounting",
      desc: "Bookkeeping and financial services",
    },
  ];

  const stats = [
    { number: "Secure", label: "GCash & Card Payments" },
    { number: "0%", label: "Hidden Fees" },
    { number: "24/7", label: "Book Anytime" },
    { number: "🇵🇭", label: "Made in Philippines" },
  ];

  const phrases = [
    { text: "Anyone, Anything.", lang: "en" },
    { text: "Kahit Sino, Kahit Ano.", lang: "fil" },
  ];

  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex].text;

    // If pausing, wait then start deleting
    if (isPausing) {
      const pause = setTimeout(() => {
        setIsPausing(false);
        setIsDeleting(true);
      }, 2500);
      return () => clearTimeout(pause);
    }

    // If fully deleted, wait then move to next phrase
    if (isDeleting && displayed.length === 0) {
      const pause = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }, 800);
      return () => clearTimeout(pause);
    }

    const speed = isDeleting ? 40 : 100;

    const timer = setTimeout(() => {
      if (isDeleting) {
        // Delete one character
        setDisplayed(current.slice(0, displayed.length - 1));
      } else {
        // Type one character
        setDisplayed(current.slice(0, displayed.length + 1));
        // If fully typed, start pause
        if (displayed.length + 1 === current.length) {
          setIsPausing(true);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, isPausing, phraseIndex]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <div className="relative px-8 py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://res.cloudinary.com/diqt9metd/video/upload/herofinalbg_wjjnuv.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/75 z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
          <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Built for Filipino Freelancers
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight text-center">
            Book
            <br />
            <span
              className={
                phrases[phraseIndex].lang === "fil"
                  ? "bg-gradient-to-r from-yellow-300 to-blue-400 bg-clip-text text-transparent"
                  : "text-blue-300"
              }
            >
              {displayed}
            </span>
            <span className="animate-pulse text-blue-300">|</span>
            <br />
            <span className="text-blue-300">Almost.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-10 max-w-2xl text-center px-4">
            Find and book trusted local freelancers in minutes. Pay securely via
            GCash or card. No hassle, just results. Pa-sched na!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/freelancers")}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
            >
              Browse Freelancers →
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/30 transition border border-white/30"
            >
              Join as Freelancer
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center" data-aos="fade-up">
              {" "}
              <p className="text-3xl font-bold text-white">{s.number}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div id="categories" className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header + Buttons */}
          <div
            className="flex justify-between items-end mb-8"
            data-aos="fade-up"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Browse by Category
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                Find the right freelancer for your specific needs
              </p>
            </div>
          </div>

          {/* Carousel Wrapper */}
          <div className="relative">
            {/* Left Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-md"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 px-12"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((cat, index) => (
                <div
                  key={cat.label}
                  onClick={() => navigate("/freelancers")}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="flex-shrink-0 w-48 md:w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg cursor-pointer transition group p-5"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition">
                    <cat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {/* Label */}
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition mb-1">
                    {cat.label}
                  </h3>
                  {/* Desc */}
                  <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-md"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Swipe hint on mobile */}
          <p className="text-center text-gray-400 text-xs mt-4 md:hidden">
            ← Swipe to browse more →
          </p>
        </div>
      </div>

      {/* How it works */}
      <div
        id="how-it-works"
        className="bg-gray-100 dark:bg-gray-900 py-24 px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Get started in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse & Choose",
                desc: "Search freelancers by category, read their profiles and check their rates",
              },
              {
                step: "02",
                title: "Book a Slot",
                desc: "Pick your preferred date and time, add notes, and confirm your booking",
              },
              {
                step: "03",
                title: "Pay & Connect",
                desc: "Pay securely via GCash or card, then connect with your freelancer",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                data-aos="fade-up"
                data-aos-delay={index * 150}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
              >
                <p className="text-5xl font-bold text-blue-200 dark:text-white mb-4">
                  {item.step}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="max-w-4xl mx-auto px-8 py-24 text-center"
        data-aos="fade-up"
      >
        {" "}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to get started?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
          Join hundreds of clients and freelancers already on the platform
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition"
        >
          Create Free Account →
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
        <p className="text-gray-400 dark:text-gray-600 text-sm">
          © 2026 Pasched. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Home;
