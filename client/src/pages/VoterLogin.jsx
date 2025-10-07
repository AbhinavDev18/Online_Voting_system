import { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function VoterLogin() {
  const { t } = useTranslation()
  const [voterId, setVoterId] = useState('')
  const [msg, setMsg] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/voter/login', { voterId })
      setMsg(res.data.message)
      nav(`/voter/verify/${voterId}`)
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 lg:p-12">
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 transition-colors duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('voterLogin')}
        </h2>

        <form onSubmit={submit} className="space-y-6">
          <input
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            placeholder={t('voterId')}
            className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-colors shadow-sm"
          />

          <button
            type="submit"
            className="w-full py-3 sm:py-4 rounded-xl bg-primary text-white font-semibold text-lg shadow hover:bg-primary-dark transition-colors"
          >
            {t('sendOtp')}
          </button>
        </form>

        {msg && (
          <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
            {msg}
          </p>
        )}
      </div>
    </div>
  )
}
