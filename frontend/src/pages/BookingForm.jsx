import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const freelancer = location.state?.freelancer;

  const [form, setForm] = useState({
    booking_date: "",
    start_time: "",
    end_time: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/bookings/?client_id=${user.id}`, {
        freelancer_id: freelancer.id,
        booking_date: form.booking_date,
        start_time: form.start_time,
        end_time: form.end_time,
        notes: form.notes,
      });
      alert("Booking confirmed! 🎉");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">No freelancer selected</p>
          <button
            onClick={() => navigate("/freelancers")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Browse Freelancers
          </button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Photography: "📸",
      Videography: "🎬",
      Design: "🎨",
      Development: "💻",
      Tutoring: "📚",
      "Music Lessons": "🎵",
      "Events Host": "🎤",
      "Cake Artist": "🎂",
      "Hair & Makeup": "💇",
      "Fitness Trainer": "🧘",
      Handyman: "🔧",
      Driver: "🚗",
      Florist: "🌸",
      "Pet Groomer": "🐶",
      "House Cleaning": "🧹",
      Accounting: "📊",
    };
    return icons[category] || "👤";
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
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Freelancer Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
            {getCategoryIcon(freelancer.category)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {freelancer.category} Freelancer
            </h3>
            <p className="text-gray-500 text-sm">{freelancer.bio}</p>
            <p className="text-indigo-600 font-bold mt-1">
              {freelancer.hourly_rate
                ? `₱${freelancer.hourly_rate}/hr`
                : "Rate TBD"}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Book this Freelancer
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date
              </label>
              <input
                type="date"
                value={form.booking_date}
                onChange={(e) =>
                  setForm({ ...form, booking_date: e.target.value })
                }
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Start Time
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  End Time
                </label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Notes (optional)
              </label>
              <textarea
                placeholder="Any special requests or details..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Confirming booking..." : "Confirm Booking 🎉"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
