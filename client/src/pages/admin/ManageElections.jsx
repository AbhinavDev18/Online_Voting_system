import { useState, useEffect } from 'react'
import api from '../../api/api'
import { toast } from 'react-toastify'

export default function ManageElections({ elections, setElections }) {
  const [form, setForm] = useState({
    electionId: '',
    name: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  })
  const [ele, setEle] = useState([])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const createElection = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/admin/start', form)
      setElections(prev => [...prev, res.data.election])
      setEle(prev => [...prev, res.data.election])
      toast.success('Election created successfully!')
      setForm({ electionId:'', name:'', description:'', startDate:'', startTime:'', endDate:'', endTime:'' })
    } catch (err) {
      toast.error('Failed to create election: ' + (err.response?.data?.message || err.message))
    }
  }

  useEffect(() => {
    const getAllElections = async () => {
      try {
        const res = await api.get('/admin/elections');
        setEle(res.data.elections);
      }
      catch(error) {
        console.log(error);
        toast.error('Failed to fetch elections: ' + (error.response?.data?.message || error.message));
      }
    }
    getAllElections();
  })

  const stopElection = async (id) => {
    try {
      await api.post(`/admin/stop/${id}`)
      setElections(prev => prev.map(e => e.electionId === id ? { ...e, status: 'stopped' } : e))
      toast.success('Election stopped successfully!')
    } catch (err) {
      toast.error('Failed to stop election: ' + (err.response?.data?.message || err.message))
    }
  }

  const releaseResult = async (id) => {
    try {
      const res = await api.post(`/admin/release-result/${id}`)
      toast.success(res.data.message || 'Result released successfully!')
      setElections(prev => prev.map(e => e.electionId === id ? { ...e, resultReleased: true } : e))
    } catch (err) {
      toast.error('Failed to release result: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="space-y-6">
      {/* --- Create Election Form --- */}
      <form
        onSubmit={createElection}
        className="grid md:grid-cols-2 gap-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-colors duration-300"
      >
        {['electionId','name','description','startDate','startTime','endDate','endTime'].map(key => (
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
        <button
          type="submit"
          className="col-span-2 bg-primary text-white py-3 rounded-2xl hover:bg-indigo-600 transition-colors shadow-md"
        >
          Create Election
        </button>
      </form>

      {/* --- Elections List --- */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl p-4 max-h-[500px] overflow-auto transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Elections</h3>
        {ele.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400 py-2 text-center">No elections yet</div>
        )}
        <div className="space-y-3">
          {ele.map(e => (
            <div
              key={e.electionId}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{e.name}</span>
                <span
                  className={`mt-1 sm:mt-0 inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    e.status === 'stopped' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                  }`}
                >
                  {e.phase === 'completed' ? 'completed' : 'active'}
                </span>
                {e.resultReleased && (
                  <span className="ml-2 text-blue-600 text-sm font-semibold">(Result Released)</span>
                )}
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                {e.phase !== 'completed' && (
                  <button
                    onClick={() => stopElection(e.electionId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-2xl hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Stop
                  </button>
                )}
                {e.phase === 'completed' && !e.resultReleased && (
                  <button
                    onClick={() => releaseResult(e.electionId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    Release Result
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
