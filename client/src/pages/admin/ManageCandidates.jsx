import { useState } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'

export default function ManageCandidates({ candidates, setCandidates }) {
  const [form, setForm] = useState({
    candidateId: '',
    name: '',
    party: '',
    file: null,
    partySymbol: '',
    position: '',
    constituency: '',
  })
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleChange = (e) => {
    if (e.target.name === 'file') setForm({ ...form, file: e.target.files[0] })
    else setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addCandidate = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.keys(form).forEach((key) => {
        if (form[key]) fd.append(key, form[key])
      })
      const res = await api.post('/admin/candidates', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCandidates((prev) => [...prev, res.data.candidate])
      toast.success('Candidate added successfully!')
      setForm({ candidateId: '', name: '', party: '', file: null, partySymbol: '', position: '', constituency: '' })
    } catch (err) {
      toast.error('Failed to add candidate: ' + (err.response?.data?.message || err.message))
    }
  }

  const selectCandidate = (candidateId) => {
    setSelectedCandidate(selectedCandidate === candidateId ? null : candidateId)
  }

  return (
    <div className="space-y-6">
      {/* Add Candidate Form */}
      <form
        onSubmit={addCandidate}
        className="grid md:grid-cols-2 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-colors duration-300"
      >
        {['candidateId', 'name', 'party', 'partySymbol', 'position', 'constituency'].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-200 placeholder-gray-400 placeholder:italic placeholder:text-sm"
          />
        ))}
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="col-span-2 border border-black rounded-lg"
        />
        <button
          type="submit"
          className="col-span-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-indigo py-3 rounded-2xl transition-colors shadow-md"
        >
          Add Candidate
        </button>
      </form>

      {/* Candidates List */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-4 max-h-[500px] overflow-auto transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Candidates List</h3>
        {candidates.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400">No candidates yet</div>
        )}
        <div className="space-y-2">
          {candidates.map((c) => (
            <div
              key={c.candidateId}
              onClick={() => selectCandidate(c.candidateId)}
              className="p-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                {c.photoUrl && (
                  <img
                    src={c.photoUrl}
                    alt={c.name}
                    className="w-16 h-16 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{c.party}</p>
                </div>
              </div>

              {/* Expanded details */}
              {selectedCandidate === c.candidateId && (
                <div className="mt-3 md:mt-0 text-sm text-gray-700 dark:text-gray-200 space-y-1">
                  <p><span className="font-semibold">ID:</span> {c.candidateId}</p>
                  <p><span className="font-semibold">Position:</span> {c.position || 'N/A'}</p>
                  <p><span className="font-semibold">Constituency:</span> {c.constituency || 'N/A'}</p>
                  <p><span className="font-semibold">Party Symbol:</span> {c.partySymbol || 'N/A'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
