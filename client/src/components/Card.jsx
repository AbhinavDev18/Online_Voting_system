import { motion } from 'framer-motion'

export default function Card({ receipt }) {
  const onOk = () => {
    window.location.href = '/'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl max-w-sm w-full mx-4 p-8 relative"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
          Vote Submitted!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          Your vote has been recorded successfully.
        </p>

        {/* Receipt */}
        <div className="bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 mb-6 break-words">
          <span className="font-medium text-gray-800 dark:text-gray-100">Receipt ID:</span>
          <div className="mt-1 text-indigo-600 dark:text-indigo-400">{receipt}</div>
        </div>

        {/* Button */}
        <button
          onClick={onOk}
          className="w-full py-3 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Return Home
        </button>
      </motion.div>
    </motion.div>
  )
}
