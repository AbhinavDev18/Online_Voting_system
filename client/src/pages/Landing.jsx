import AnimatedPage from '../components/AnimatedPage'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/api.js';

export default function Landing() {
  const { t } = useTranslation()
  const [elections, setElections] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    const getElections = async () => {
      try {
        const res = await api.get('/admin/elections', { withCredentials: true });
        setElections(res.data.elections || []);
        const resResults = {};
        for (const election of res.data.elections) {
          if (election.phase === 'completed' && election.resultReleased) {
            const resultRes = await api.get(`/admin/results/${election.electionId}`, { withCredentials: true });
            resResults[election._id] = resultRes.data.results || [];
          }
        }
        setResults(resResults);
      }
      catch(error) {
        console.error('Error fetching elections:', error);
      }
    }
    getElections();
  })

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <header className="sm:flex-row items-center justify-between mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 animate-fade-in mb-1.5">
            {t('appTitle')}
          </h1>
          <p className="mt-4 sm:mt-0 text-gray-600 dark:text-gray-300 text-lg animate-fade-in delay-200">
            {t('intro')}
          </p>
        </header>

        {/* Main content */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* Welcome card */}
          <div className="rounded-3xl p-8 shadow-2xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md transform hover:scale-105 transition-transform duration-300 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('welcome')}
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('intro')}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/voter/login"
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:bg-primary-dark transition-colors"
              >
                {t('voterLogin')}
              </Link>
              <Link
                to="/admin/login"
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {t('adminLogin')}
              </Link>
            </div>
          </div>

          {/* Features card */}
          <div className="rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-white/60 to-gray-100/40 dark:from-gray-800/60 dark:to-gray-700/40 backdrop-blur-md animate-slide-up delay-150">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('featuresTitle')}
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              <li className="flex items-center gap-2 animate-fade-in delay-200">
                <span className="text-primary font-bold">•</span> {t('feature_secure')}
              </li>
              <li className="flex items-center gap-2 animate-fade-in delay-300">
                <span className="text-primary font-bold">•</span> {t('feature_biometric_demo')}
              </li>
              <li className="flex items-center gap-2 animate-fade-in delay-400">
                <span className="text-primary font-bold">•</span> {t('feature_multilang')}
              </li>
            </ul>
          </div>

          {/* --- NEW: Released Results card (keeps the rest unchanged) --- */}
          <div className="rounded-3xl p-8 shadow-2xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md animate-slide-up delay-200 col-span-1 md:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
              🏁 Released Election Results
            </h3>

            {Object.keys(results).length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No results have been released yet.
              </p>
            ) : (
              <div className="space-y-5">
                {Object.entries(results).map(([electionId, resArray]) => {
                  const election = elections.find(e => e._id === electionId) || {}
                  const title = election.title || election.name || election.electionId || 'Election'
                  return (
                    <div
                      key={electionId}
                      className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                          {title}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {election.phase ? election.phase.charAt(0).toUpperCase() + election.phase.slice(1) : ''}
                        </div>
                      </div>

                      <ul className="space-y-2 mt-2">
                        {resArray.length > 0 ? resArray.map((r) => (
                          <li
                            key={r.candidateId || r.name}
                            className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700"
                          >
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {r.name} {r.party ? `(${r.party})` : ''}
                            </span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {r.voteCount} vote{r.voteCount !== 1 ? 's' : ''}
                            </span>
                          </li>
                        )) : (
                          <li className="text-gray-500 dark:text-gray-400 text-sm">No votes recorded</li>
                        )}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </AnimatedPage>
  )
}
