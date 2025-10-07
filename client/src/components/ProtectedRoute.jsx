import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children, role = 'admin' }) {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700 dark:text-gray-200">Checking authentication...</p>
        </motion.div>
      </div>
    )

  if (!user || user.role !== role)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Unauthorized Access
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You will be redirected to {role === 'admin' ? 'Admin Login' : 'Home'}.
          </p>
          <Navigate to={role === 'admin' ? '/admin/login' : '/'} replace />
        </motion.div>
      </div>
    )

  return children
}
