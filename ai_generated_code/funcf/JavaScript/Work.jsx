// OpenAI GPT-3.5 (2023). Standard coding segments Snippet to return books to their original position when not on work page anymore. (Accessed: January 4, 2024).
// Effect for logging new positions when 'active' changes
useEffect(() => {
  const newPositions = projectBookRef.current.map((book, index) => {
    if (book) {
      const { x, y, z } = book.position;
      console.log(`Project Book ${index + 1}:`, x, y, z);
      return { x, y, z, width: book.width, height: book.height };
    }
  });
}, [projectBookRef, active]);