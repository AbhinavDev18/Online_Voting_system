import { useState } from 'react'
import CameraCheck from '../components/CameraCheck'
import WebAuthnStub from '../components/WebAuthnStub'
import { useNavigate } from 'react-router-dom'

export default function VoterBiometric() {
  const [passedCamera, setPassedCamera] = useState(false)
  const [passedAuthn, setPassedAuthn] = useState(false)
  const nav = useNavigate()

  const done = () => {
    if (passedCamera || passedAuthn) nav('/vote')
    else alert('Please complete both checks (demo)')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 lg:p-12">
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 transition-colors duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Biometric Checks (Demo)
        </h2>

        <div className="space-y-4">
          <CameraCheck onPass={() => setPassedCamera(true)} />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <WebAuthnStub onPass={() => setPassedAuthn(true)} />
            <button
              onClick={done}
              className="w-full py-3 sm:py-4 rounded-xl bg-primary text-gray-900 dark:text-gray-100 font-semibold shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Proceed to Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
