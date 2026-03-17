import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Menu, X } from "lucide-react";
import logofinally from '../assets/logofinally.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Browse", path: null, id: "categories" },
    { label: "How it Works", path: null, id: "how-it-works" },
    { label: "Categories", path: null, id: "categories" },
  ];

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path);
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logofinally}
            alt="Pasched Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            Pasched
          </span>
        </div>

        {/* Nav Links — desktop only */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-1 mx-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === link.path
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {" "}
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          {/* Desktop auth buttons */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm"
              >
                Dashboard
              </button>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </button>
            </div>
          )}
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 text-center"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
