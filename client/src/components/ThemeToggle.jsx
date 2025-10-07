import useTheme from '../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={theme}
          initial={{ x: theme === 'dark' ? 0 : 24, opacity: 0 }}
          animate={{ x: theme === 'dark' ? 0 : 24, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute w-4 h-4 bg-indigo-600 dark:bg-yellow-400 rounded-full shadow-md"
        />
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
