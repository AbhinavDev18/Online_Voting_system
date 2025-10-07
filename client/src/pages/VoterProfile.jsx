import { useEffect, useState } from 'react'
import api from '../api/api'

export default function VoterProfile() {
  const [voter, setVoter] = useState(null)

  useEffect(() => {
    api.get('/voter/me')
      .then(r => setVoter(r.data.voter))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 lg:p-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Voter Profile
      </h2>

      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl p-6 sm:p-8 transition-colors duration-500">
        {voter ? (
          <pre className="text-gray-700 dark:text-gray-200 font-mono text-sm sm:text-base overflow-x-auto">
            {JSON.stringify(voter, null, 2)}
          </pre>
        ) : (
          <div className="animate-pulse text-gray-500 dark:text-gray-400 text-center py-8">
            Loading voter data…
          </div>
        )}
      </div>
    </div>
  )
}
