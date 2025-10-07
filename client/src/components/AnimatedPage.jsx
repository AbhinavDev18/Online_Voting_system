import { motion } from 'framer-motion'

export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, type: 'spring', stiffness: 100 }}
      className={`min-h-screen bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </motion.div>
  )
}
