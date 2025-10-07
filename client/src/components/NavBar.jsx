import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

export default function NavBar() {
  return (
    <nav className="w-full backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-3 flex items-center justify-between">

      {/* Left links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="font-bold text-xl text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          VotePanel
        </Link>
        <Link
          to="/election"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          Elections
        </Link>
        <Link
          to="/admin/login"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          Admin
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  )
}
