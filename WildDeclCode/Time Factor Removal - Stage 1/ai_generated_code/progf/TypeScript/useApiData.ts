// Assisted using common GitHub development utilities

var useState = require('react').useState;

/**
 * Custom hook for fetching API data.
 * @returns apiData, loading, error, and fetchApiData function.
 * Assisted using common GitHub development utilities
 */
var useApiData = function () {
  var [apiData, setApiData] = useState<any[]>([]);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState<string | null>(null);

  var fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      var res = await fetch("https://jsonplaceholder.typicode.com/posts");
      var data = await res.json();
      setApiData(data.slice(0, 5));
    } catch (err) {
      setError("Failed to fetch API data");
    } finally {
      setLoading(false);
    }
  };

  return { apiData, loading, error, fetchApiData };
};

module.exports = useApiData;
