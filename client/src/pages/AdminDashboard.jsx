import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import { toast } from 'react-toastify'
import api from '../api/api'
import { motion, AnimatePresence } from 'framer-motion'

import StatsComponent from './admin/StatsComponent'
import ManageVoters from './admin/ManageVoters'
import ManageCandidates from './admin/ManageCandidates'
import ManageElections from './admin/ManageElections'
import ElectionResults from './admin/ElectionResults'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [voters, setVoters] = useState([])
  const [candidates, setCandidates] = useState([])
  const [elections, setElections] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, votersRes, candidatesRes, electionsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/voters'),
          api.get('/admin/candidates'),
          api.get('/elections').catch(() => ({ data: [] })),
        ])
        setStats(statsRes.data)
        setVoters(votersRes.data.voteres || [])
        setCandidates(candidatesRes.data.candidates || [])
        setElections(electionsRes.data.elections || [])
      } catch (err) {
        toast.error('Failed to fetch admin data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading)
    return (
      <div className="p-12 text-center text-gray-700 dark:text-gray-300 animate-pulse">
        Loading dashboard…
      </div>
    )

  const tabs = [
    { id: 'stats', label: 'Stats' },
    { id: 'voters', label: 'Voters' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'elections', label: 'Elections' },
    { id: 'results', label: 'Results' },
  ]

  return (
    <ProtectedRoute role="super_admin">
      <div className="p-6 sm:p-8 lg:p-12 space-y-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-2xl border border-gray-300 dark:border-gray-600 font-semibold transition-all duration-300 ${
                tab === t.id
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-primary shadow-sm'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 sm:p-8 transition-colors duration-500"
          >
            {tab === 'stats' && <StatsComponent stats={stats} />}
            {tab === 'voters' && <ManageVoters voters={voters} setVoters={setVoters} />}
            {tab === 'candidates' && (
              <ManageCandidates candidates={candidates} setCandidates={setCandidates} />
            )}
            {tab === 'elections' && <ManageElections elections={elections} setElections={setElections} />}
            {tab === 'results' && <ElectionResults elections={elections} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  )
}
