import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const navigate = useNavigate()
  const { darkMode, setDarkMode } = useTheme()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">FC</span>
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Freelancer<span className="text-blue-600">Connect</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          {darkMode ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm">
              Dashboard
            </button>
            <button
              onClick={() => navigate('/freelancers')}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm">
              Browse
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-medium">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/freelancers')}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">
              Browse
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm">
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar