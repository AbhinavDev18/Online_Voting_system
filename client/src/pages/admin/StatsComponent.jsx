import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

export default function StatsComponent({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid md:grid-cols-2 gap-6"
    >
      {/* Stats Card */}
      <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl hover:scale-[1.03] transition-transform duration-300">
        <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">Election Stats</h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <div className="flex justify-between">
            <span>Total Candidates:</span>
            <span className="font-medium">{stats?.totalCandidates || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Voters:</span>
            <span className="font-medium">{stats?.totalVoters || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Votes Cast:</span>
            <span className="font-medium">{stats?.votesCast || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Turnout:</span>
            <span className="font-medium">{stats?.turnoutRate || 0}%</span>
          </div>
        </div>
      </div>

      {/* Turnout Chart Card */}
      <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl hover:scale-[1.03] transition-transform duration-300">
        <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-gray-100">Turnout Trend</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats?.turnoutData || [
                { name: 'A', uv: 12 },
                { name: 'B', uv: 20 },
                { name: 'C', uv: 15 },
              ]}
            >
              <defs>
                <linearGradient id="turnoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="uv" stroke="#6366f1" fillOpacity={1} fill="url(#turnoutGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
