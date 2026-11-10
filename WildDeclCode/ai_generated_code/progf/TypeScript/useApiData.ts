// Assisted using common GitHub development utilities

import { useState } from "react";

/**
 * Custom hook for fetching API data.
 * @returns apiData, loading, error, and fetchApiData function.
 * Assisted using common GitHub development utilities
 */
const useApiData = () => {
  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setApiData(data.slice(0, 5));
    } catch (err) {
      setError("Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  return { apiData, loading, error, fetchApiData };
};

export default useApiData;
