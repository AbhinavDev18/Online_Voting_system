import { useState } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'

export default function ManageVoters({ voters, setVoters }) {
  const [form, setForm] = useState({
    voterId: '',
    name: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    dateOfBirth: ''
  })

  const today = new Date()
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addVoter = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/admin/voters', form)
      setVoters(prev => [...prev, res.data.voter])
      toast.success('Voter added successfully!')
      setForm({ voterId: '', name: '', email: '', phoneNumber: '', aadharNumber: '', dateOfBirth: '' })
    } catch (err) {
      toast.error('Failed to add voter: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="space-y-6">
      {/* --- Add Voter Form --- */}
      <form
        onSubmit={addVoter}
        className="grid md:grid-cols-2 gap-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-colors duration-300"
      >
        {['voterId', 'name', 'email', 'phoneNumber', 'aadharNumber'].map(key => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            required
            className="p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        ))}

        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          max={minAgeDate}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-all duration-200"
        />

        <button
          type="submit"
          className="col-span-2 bg-primary text-white py-3 rounded-2xl hover:bg-indigo-600 transition-colors shadow-md"
        >
          Add Voter
        </button>
      </form>

      {/* --- Voter List --- */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-4 overflow-auto max-h-[500px] transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Voter List</h3>
        {voters.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400 py-2 text-center">No voters yet</div>
        )}
        <div className="space-y-2">
          {voters.map(v => (
            <div
              key={v.voterId}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-200 hover:bg-gray-100 dark:hover:bg-gray-600/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium text-gray-900 dark:text-gray-100">{v.name}</span>
                <span className="text-gray-500 dark:text-gray-300">{v.voterId}</span>
                <span className="text-gray-500 dark:text-gray-300">{v.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
