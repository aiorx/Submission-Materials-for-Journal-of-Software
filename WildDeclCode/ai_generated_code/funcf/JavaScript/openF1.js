useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const last20Data = data.slice(-20); // Get the last 20 indexes
      setIntervalData(last20Data);
    } catch (error) {
      console.error("Error fetching live data: ", error);
    }
  };

  fetchData();

  // Crafted with standard coding tools
  //Context prompt is active
  // Prompt: Set the following useEffect to execute every determined interval
  const intervalId = setInterval(fetchData, 15000); // Fetch every 15 seconds

  return () => clearInterval(intervalId);
}, []);