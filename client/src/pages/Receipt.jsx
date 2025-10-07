export default function Receipt({ receipt }) {
  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 lg:p-12">
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 transition-colors duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Vote Receipt
        </h2>

        <div className="bg-gray-50 dark:bg-gray-900/70 p-4 sm:p-6 rounded-xl shadow-inner transition-colors duration-500">
          {receipt ? (
            <pre className="font-mono text-sm sm:text-base text-gray-800 dark:text-gray-200 overflow-x-auto">
              {JSON.stringify(receipt, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8 animate-pulse">
              Receipt details will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
