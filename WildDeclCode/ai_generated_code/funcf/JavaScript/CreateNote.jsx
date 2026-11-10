const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!title || !content) {
    setError("Title and content are required.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5042/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || "Failed to create note.");
      return;
    }

    const newNote = await response.json();
    console.log("Note created:", newNote);
    navigate("/");
  } catch (err) {
    setError("An error occurred while creating the note.");
  }
};