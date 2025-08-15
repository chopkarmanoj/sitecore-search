import { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function OpenAISearch({ dataForAI, searchKeyword, setIsDataReceived }) {
  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchKeyword) return;

    const fetchAbstract = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/openai-api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchKeyword, dataset: dataForAI }),
        });
        const data = await res.json();
        setAbstract(data.abstract);
      } catch (err) {
        console.error(err);
        setAbstract("⚠️ Error fetching summary.");
      }
      setLoading(false);
    };

    fetchAbstract();
  }, [dataForAI, searchKeyword]);

  useEffect(() => {
    if (abstract && !loading) {
      setIsDataReceived(true);
    }
  }, [abstract, loading, setIsDataReceived]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      {/* Glow effect */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="w-6 h-6 text-indigo-500 animate-pulse" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {/* AI-Powered Insights */}
        </h2>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300 animate-pulse">
          <svg
            className="animate-spin h-5 w-5 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span>Sit back and relax… AI is summarizing your search.</span>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {abstract}
        </p>
      )}
    </div>
  );
}
