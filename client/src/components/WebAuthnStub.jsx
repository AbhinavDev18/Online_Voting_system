import { motion } from 'framer-motion'

export default function WebAuthnStub({ onPass }) {
  const start = async () => {
    if (!window.PublicKeyCredential) {
      alert('WebAuthn not supported in this browser')
      return
    }
    try {
      const publicKey = {
        challenge: new Uint8Array([1, 2, 3, 4]),
        rp: { name: 'VotePanel' },
        user: { id: new Uint8Array([1]), name: 'voter', displayName: 'Voter' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }]
      }
      await navigator.credentials.create({ publicKey })
      onPass && onPass({ ok: true })
    } catch (err) {
      console.error(err)
      alert('WebAuthn failed')
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={start}
      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-colors backdrop-blur-sm"
    >
      Use Fingerprint
    </motion.button>
  )
}
