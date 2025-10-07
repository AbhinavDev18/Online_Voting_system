import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './hooks/useAuth'
import NavBar from './components/NavBar'
import useTheme from './hooks/useTheme'

const Landing = lazy(() => import('./pages/Landing'))
const VoterLogin = lazy(() => import('./pages/VoterLogin'))
const VoterOtp = lazy(() => import('./pages/VoterOtp'))
const VoterBiometric = lazy(() => import('./pages/VoterBiometric'))
const VotePage = lazy(() => import('./pages/VotePage'))
const Receipt = lazy(() => import('./pages/Receipt'))
const VoterProfile = lazy(() => import('./pages/VoterProfile'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

export default function App() {
  useTheme()

  const location = useLocation()

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500 font-sans">
        {/* NavBar stays as-is */}
        <NavBar />

        <main className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <Suspense
              fallback={
                <div className="max-w-3xl mx-auto p-8 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md">
                  <div className="animate-pulse text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading…
                  </div>
                </div>
              }
            >
              <Routes location={location} key={location.pathname}>
                {/* Landing */}
                <Route path="/" element={<Landing />} />

                {/* Voter flow */}
                <Route path="/voter/login" element={<VoterLogin />} />
                <Route path="/voter/verify/:voterId" element={<VoterOtp />} />
                <Route path="/voter/biometric" element={<VoterBiometric />} />
                <Route path="/vote" element={<VotePage />} />
                <Route path="/receipt" element={<Receipt />} />
                <Route path="/voter/profile" element={<VoterProfile />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#333', color: '#fff' },
          }}
        />
      </div>
    </AuthProvider>
  )
}
