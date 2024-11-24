const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
