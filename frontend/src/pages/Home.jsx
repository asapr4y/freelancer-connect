import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Camera, BookOpen, Palette, Code2 } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: Camera,
      label: "Photography",
      desc: "Professional photographers for any occasion",
    },
    {
      icon: BookOpen,
      label: "Tutoring",
      desc: "Expert tutors for all subjects and levels",
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
  ];

  const stats = [
    { number: "500+", label: "Freelancers" },
    { number: "1,200+", label: "Bookings Made" },
    { number: "4.9★", label: "Average Rating" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

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
          <source src="/src/assets/herovid.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/75 z-10"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
          <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🇵🇭 Built for Filipino Freelancers
          </span>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Book Top Freelancers
            <br />
            <span className="text-blue-300">Instantly</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl">
            Connect with photographers, tutors, designers and developers. Book
            in minutes, pay securely, get results.
          </p>
          <div className="flex gap-4">
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
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white">{s.number}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Find the right freelancer for your specific needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.label}
              onClick={() => navigate("/freelancers")}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg cursor-pointer transition group"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition">
                <cat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                {cat.label}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-100 dark:bg-gray-900 py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
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
            ].map((item) => (
              <div
                key={item.step}
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
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
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
          © 2026 FreelancerConnect. Built with love in the Philippines.
        </p>
      </div>
    </div>
  );
}

export default Home;
