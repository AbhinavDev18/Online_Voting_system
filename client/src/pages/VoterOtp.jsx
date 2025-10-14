import { useState, useRef } from 'react'
import api from '../api/api'
import { useParams, useNavigate } from 'react-router-dom'

export default function VoterOtp() {
  const { voterId } = useParams()
  const nav = useNavigate()
  const otpLength = 6
  const [otp, setOtp] = useState(Array(otpLength).fill(''))
  const inputsRef = useRef([])

  const handleChange = (value, idx) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[idx] = value
      setOtp(newOtp)

      // focus next input
      if (value && idx < otpLength - 1) {
        inputsRef.current[idx + 1].focus()
      }
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus()
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    try {
      await api.post(`/voter/verify-otp/${voterId}`, { otp: otpValue })
      nav('/voter/biometric')
    } catch {
      alert('Invalid OTP')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 lg:p-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Verify OTP
      </h2>
      <form onSubmit={submit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              maxLength={1}
              className="w-12 h-12 text-center text-lg sm:text-xl font-semibold border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-primary transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-3 sm:py-4 rounded-xl bg-primary text-gray-900 dark:text-gray-100 font-semibold shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Verify
        </button>
      </form>
    </div>
  )
}
