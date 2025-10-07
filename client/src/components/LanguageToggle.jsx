import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()

  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
      className="p-2 pl-3 pr-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors hover:bg-white/90 dark:hover:bg-gray-800/90 cursor-pointer"
    >
      <option value="en">English</option>
      <option value="ta">தமிழ்</option>
    </select>
  )
}
