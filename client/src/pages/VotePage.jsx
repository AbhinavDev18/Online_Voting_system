import { useEffect, useState } from 'react'
import Card from '../components/Card'
import api from '../api/api'

export default function VotePage() {
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState(null)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    async function load() {
      const res = await api.get('/election')
      setElection(res.data.election)
      const cand = await api.get('/admin/candidates')
      setCandidates(cand.data.candidates || [])
    }
    load()
  }, [])

  const cast = async () => {
    if (!selected) return alert('Please select a candidate')
    try {
      const res = await api.post(`/voter/cast-vote/${election.electionId}`, { candidateId: selected })
      console.log(res.data);
      setReceipt(res.data.receiptId)
    } catch (err) {
      console.log(err);
      window.location.href = '/';
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {election?.title || 'Election'}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {candidates.map((c) => {
          const isSelected = selected === c.candidateId
          return (
            <div
              key={c.candidateId}
              className={`bg-white dark:bg-gray-800/80 rounded-2xl shadow-md p-4 flex flex-col items-center transition-all duration-300 cursor-pointer hover:shadow-xl ${
                isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
            >
              <img
                src={c.photoUrl || ''}
                alt={c.name}
                className="h-36 w-full object-cover rounded-xl mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{c.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{c.party}</p>
              <button
                onClick={() => setSelected(c.candidateId)}
                className={`px-4 py-2 rounded-xl w-full font-semibold border transition-colors ${
                  isSelected
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-primary hover:bg-primary-dark'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={cast}
          className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cast Vote
        </button>
      </div>

      {receipt && <div className="mt-6"><Card receipt={receipt} /></div>}
    </div>
  )
}
