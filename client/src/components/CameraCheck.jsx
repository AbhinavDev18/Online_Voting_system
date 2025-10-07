import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CameraCheck({ onPass }) {
  const videoRef = useRef()
  const [err, setErr] = useState(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    let stream
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setRunning(true)
      } catch (e) {
        setErr(e.message)
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  const fakeDetect = () => {
    if (videoRef.current && !videoRef.current.paused) {
      onPass && onPass({ ok: true })
      setErr(null)
    } else {
      setErr('Face not detected')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl"
    >
      <video
        ref={videoRef}
        className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
        playsInline
        muted
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={fakeDetect}
          className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow"
        >
          Run Face Check
        </button>
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.pause()
            setRunning(false)
          }}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Stop
        </button>
      </div>
      {err && <p className="mt-2 text-sm text-rose-500">{err}</p>}
      {running && !err && <p className="mt-2 text-sm text-green-600">Camera running</p>}
    </motion.div>
  )
}
