async function resizeImage(image) {
  // Simulate image resizing
}

// Correct: The function that calls `resizeImage` is async and awaits its result
async function processImage(image) {
  await resizeImage(image)
  console.log('Image processed')
}

// Produced via common programming aids-4-0125-preview
