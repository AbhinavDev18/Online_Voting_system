import { useState, useEffect } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ElectionResults() {
  const [completedElections, setCompletedElections] = useState([])
  const [selectedElection, setSelectedElection] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get('/admin/completed-elections')
        setCompletedElections(res.data.elections || [])
      } catch (err) {
        toast.error('Failed to fetch completed elections')
      }
    }
    fetchCompleted()
  }, [])

  const fetchResults = async (electionId) => {
    try {
      setLoadingResults(true)
      const res = await api.get(`/admin/results/${electionId}`)
      setSelectedElection(res.data.election)
      setResults(res.data.results || [])
    } catch (err) {
      toast.error('Failed to fetch results: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoadingResults(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Completed Elections</h3>

      <div className="flex gap-3 flex-wrap">
        {completedElections.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400">No completed elections yet</div>
        )}
        {completedElections.map((e) => (
          <button
            key={e.electionId}
            onClick={() => fetchResults(e.electionId)}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300 ${
              selectedElection?.electionId === e.electionId
                ? 'bg-primary text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-primary hover:text-white'
            }`}
          >
            {e.title}
          </button>
        ))}
      </div>

      {loadingResults && (
        <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading results…</div>
      )}

      {selectedElection && !loadingResults && (
        <div className="space-y-6 mt-4">
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-colors duration-500">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Results for: {selectedElection.name}
            </h3>

            {results.length > 0 && (
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results}>
                    <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#4b5563" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none' }}
                    />
                    <Bar dataKey="voteCount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((r) => (
                  <div
                    key={r.candidateId}
                    className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/60 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
                  >
                    <span className="font-medium">{r.name} ({r.party})</span>
                    <span className="font-semibold">{r.voteCount} votes</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No votes were cast in this election</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
