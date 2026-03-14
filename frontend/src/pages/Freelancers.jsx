import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Freelancers() {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  const categories = [
    "All",
    "Photography",
    "Tutoring",
    "Design",
    "Development",
  ];

  useEffect(() => {
    fetchFreelancers();
  }, [category]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = category && category !== "All" ? { category } : {};
      const res = await axios.get("http://127.0.0.1:8000/freelancers/", {
        params,
      });
      setFreelancers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (freelancer) => {
    const user = localStorage.getItem("user");
    console.log("user from storage:", user);
    if (!user) {
      navigate("/login");
    } else {
      navigate("/booking", { state: { freelancer } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
        >
          Freelancer Connect
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-indigo-600 font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-indigo-600 py-12 px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Browse Freelancers
        </h2>
        <p className="text-indigo-200">
          Find the perfect freelancer for your needs
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                (cat === "All" && !category) || cat === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Freelancer Cards */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading freelancers...
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No freelancers found</p>
            <p className="text-gray-400 text-sm mt-2">Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Avatar */}
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4">
                  {f.category === "Photography"
                    ? "📸"
                    : f.category === "Tutoring"
                      ? "📚"
                      : f.category === "Design"
                        ? "🎨"
                        : f.category === "Development"
                          ? "💻"
                          : "👤"}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {f.category} Freelancer
                </h3>

                <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full mb-3">
                  {f.category}
                </span>

                {f.bio && (
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {f.bio}
                  </p>
                )}

                {f.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-indigo-600 font-bold">
                    {f.hourly_rate ? `₱${f.hourly_rate}/hr` : "Rate TBD"}
                  </span>
                  <button
                    onClick={() => handleBooking(f)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Freelancers;
