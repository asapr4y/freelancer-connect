import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  // ─── STATE ────────────────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freelancerForm, setFreelancerForm] = useState({
    category: "",
    bio: "",
    skills: "",
    hourly_rate: "",
    location: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
  });

  // ─── EFFECTS ──────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    fetchBookings(parsedUser);

    if (parsedUser.role === "freelancer") {
      fetchFreelancerProfile(parsedUser);
    }
  }, []);

  const fetchFreelancerProfile = async (parsedUser) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/freelancers/user/${parsedUser.id}`,
      );
      setFreelancerForm({
        category: res.data.category || "",
        bio: res.data.bio || "",
        skills: res.data.skills || "",
        hourly_rate: res.data.hourly_rate || "",
        location: res.data.location || "",
      });
    } catch (err) {
      console.log("No freelancer profile yet");
    }
  };

  // ─── FUNCTIONS ────────────────────────────────────────
  const fetchBookings = async (parsedUser) => {
    try {
      if (parsedUser.role === "client") {
        const res = await axios.get(
          `http://127.0.0.1:8000/bookings/client/${parsedUser.id}`,
        );
        setBookings(res.data);
      } else {
        // First get the freelancer profile using user_id
        const freelancerRes = await axios.get(
          `http://127.0.0.1:8000/freelancers/user/${parsedUser.id}`,
        );
        const freelancerProfile = freelancerRes.data;

        // Then fetch bookings using the freelancer profile id
        const bookingsRes = await axios.get(
          `http://127.0.0.1:8000/bookings/freelancer/${freelancerProfile.id}`,
        );
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Try to update first
      try {
        await axios.put(
          `http://127.0.0.1:8000/freelancers/user/${user.id}`,
          freelancerForm,
        );
      } catch {
        // If no profile exists yet, create one
        await axios.post(
          `http://127.0.0.1:8000/freelancers/?user_id=${user.id}`,
          freelancerForm,
        );
      }
      setProfileSaved(true);
      setEditingProfile(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!user) return null;

  const handlePayment = async (bookingId) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/payments/create-link/${bookingId}`,
      );
      // Open PayMongo checkout in a new tab
      window.open(res.data.checkout_url, "_blank");
    } catch (err) {
      alert(err.response?.data?.detail || "Payment failed");
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/bookings/${bookingId}/status?status=${status}`,
      );
      // Refresh bookings after update
      fetchBookings(user);
      alert(`Booking ${status} successfully!`);
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const getCategoryIcon = (category) => {
  const icons = {
    'Photography': '📸',
    'Videography': '🎬',
    'Design': '🎨',
    'Development': '💻',
    'Tutoring': '📚',
    'Music Lessons': '🎵',
    'Events Host': '🎤',
    'Cake Artist': '🎂',
    'Hair & Makeup': '💇',
    'Fitness Trainer': '🧘',
    'Handyman': '🔧',
    'Driver': '🚗',
    'Florist': '🌸',
    'Pet Groomer': '🐶',
    'House Cleaning': '🧹',
    'Accounting': '📊',
  }
  return icons[category] || '👤'
}

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
        >
          Pasched{" "}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">
            Hi, {user.full_name}! 👋
          </span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Welcome Card */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user.full_name}! 🎉
          </h2>
          <p className="text-indigo-200">
            {user.role === "client"
              ? "Manage your bookings and find freelancers"
              : "Manage your profile and incoming bookings"}
          </p>
          <span className="inline-block mt-3 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {user.role}
          </span>
        </div>

        {/* Tab Navigation — for ALL users */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            📋 Bookings
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            👤 My Profile
          </button>

          {user.role === "freelancer" && (
            <button
              onClick={() => setActiveTab("freelancer")}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === "freelancer"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              🛠 Freelancer Profile
            </button>
          )}
        </div>

        {/* MY PROFILE — for all users */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              My Profile
            </h3>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-3xl">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {user.full_name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {user.email}
                </p>
                <span
                  className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    user.role === "freelancer"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-800 dark:text-white font-medium">
                    {user.full_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                    Email
                  </p>
                  <p className="text-gray-800 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                    Account Type
                  </p>
                  <p className="text-gray-800 dark:text-white font-medium capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Member since */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl px-6 py-4">
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                Member Since
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {new Date().toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* FREELANCER: Profile Form — only shown when tab is active */}
        {user.role === "freelancer" && activeTab === "freelancer" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                🛠 Freelancer Profile
              </h3>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-sm bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
              >
                {editingProfile ? "✕ Cancel" : "✏️ Edit Profile"}
              </button>
            </div>

            {/* Profile View — shown when not editing */}
            {!editingProfile && (
              <div className="space-y-4">
                {profileSaved && (
                  <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
                    ✅ Profile saved successfully!
                  </div>
                )}

                {freelancerForm.category ? (
                  <>
                    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                          Category
                        </p>
                        <p className="text-gray-800 dark:text-white font-medium">
                          <p className="text-gray-800 dark:text-white font-medium">
                            {getCategoryIcon(freelancerForm.category)}{" "}
                            {freelancerForm.category}
                          </p>
                        </p>
                      </div>
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                          Bio
                        </p>
                        <p className="text-gray-800 dark:text-white">
                          {freelancerForm.bio || "No bio yet"}
                        </p>
                      </div>
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {freelancerForm.skills ? (
                            freelancerForm.skills
                              .split(",")
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {skill.trim()}
                                </span>
                              ))
                          ) : (
                            <p className="text-gray-400">No skills listed</p>
                          )}
                        </div>
                      </div>
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                          Hourly Rate
                        </p>
                        <p className="text-gray-800 dark:text-white font-bold text-lg text-blue-600">
                          {freelancerForm.hourly_rate
                            ? `₱${freelancerForm.hourly_rate}/hr`
                            : "Not set"}
                        </p>
                      </div>
                      <div className="px-6 py-4">
                        <p className="text-xs text-gray-400 uppercase font-medium mb-1">
                          Location
                        </p>
                        <p className="text-gray-800 dark:text-white">
                          📍 {freelancerForm.location || "Not set"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-4">👤</p>
                    <p className="text-gray-400 mb-4">No profile set up yet</p>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Set Up Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Edit Form — shown when editing */}
            {editingProfile && (
              <form
                onSubmit={handleProfileSubmit}
                className="flex flex-col gap-4"
              >
                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Category
                  </label>
                  <select
                    value={freelancerForm.category}
                    onChange={(e) =>
                      setFreelancerForm({
                        ...freelancerForm,
                        category: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select a category</option>
                    <option value="Photography">📸 Photography</option>
                    <option value="Videography">🎬 Videography</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Development">💻 Development</option>
                    <option value="Tutoring">📚 Tutoring</option>
                    <option value="Music Lessons">🎵 Music Lessons</option>
                    <option value="Events Host">🎤 Events Host</option>
                    <option value="Cake Artist">🎂 Cake Artist</option>
                    <option value="Hair & Makeup">💇 Hair & Makeup</option>
                    <option value="Fitness Trainer">🧘 Fitness Trainer</option>
                    <option value="Handyman">🔧 Handyman</option>
                    <option value="Driver">🚗 Driver</option>
                    <option value="Florist">🌸 Florist</option>
                    <option value="Pet Groomer">🐶 Pet Groomer</option>
                    <option value="House Cleaning">🧹 House Cleaning</option>
                    <option value="Accounting">📊 Accounting</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell clients about yourself..."
                    value={freelancerForm.bio}
                    onChange={(e) =>
                      setFreelancerForm({
                        ...freelancerForm,
                        bio: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Skills
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Portrait, Wedding, Events"
                    value={freelancerForm.skills}
                    onChange={(e) =>
                      setFreelancerForm({
                        ...freelancerForm,
                        skills: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Hourly Rate (₱)
                    </label>
                    <input
                      type="number"
                      placeholder="500"
                      value={freelancerForm.hourly_rate}
                      onChange={(e) =>
                        setFreelancerForm({
                          ...freelancerForm,
                          hourly_rate: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Quezon City"
                      value={freelancerForm.location}
                      onChange={(e) =>
                        setFreelancerForm({
                          ...freelancerForm,
                          location: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mt-2"
                >
                  Save Profile
                </button>
              </form>
            )}
          </div>
        )}
        {/* Bookings Section */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {user.role === "client" ? "My Bookings" : "Incoming Bookings"}
              </h3>
              {user.role === "client" && (
                <button
                  onClick={() => navigate("/freelancers")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  + New Booking
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-gray-400 text-center py-8">
                Loading bookings...
              </p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-gray-400">No bookings yet</p>
                {user.role === "client" && (
                  <button
                    onClick={() => navigate("/freelancers")}
                    className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Browse Freelancers
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="border border-gray-100 dark:border-gray-800 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          📅 {b.booking_date}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          🕐 {b.start_time} — {b.end_time}
                        </p>
                        {b.notes && (
                          <p className="text-gray-400 text-xs mt-1">
                            📝 {b.notes}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getStatusColor(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* Client: Pay Now button */}
                    {user.role === "client" && b.status === "pending" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
                      >
                        💳 Pay Now
                      </button>
                    )}

                    {/* Freelancer: Accept / Decline buttons */}
                    {user.role === "freelancer" && b.status === "pending" && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleUpdateStatus(b.id, "confirmed")}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, "cancelled")}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    )}

                    {/* Freelancer: Mark as completed */}
                    {user.role === "freelancer" && b.status === "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "completed")}
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                      >
                        🏁 Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
