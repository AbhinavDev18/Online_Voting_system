import { useState } from 'react'
import api from '../api/api'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/admin/login', { username, password })
      console.log(res);
      toast.success('Login successful')
      alert('Login successfully')
      setUser(res.data.user)
      nav('/admin')
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 lg:p-12">
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 transition-colors duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={submit} className="space-y-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
          />

          <button
            type="submit"
            className="w-full py-3 sm:py-4 rounded-xl bg-primary text-white font-semibold shadow-lg hover:bg-primary-dark transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
