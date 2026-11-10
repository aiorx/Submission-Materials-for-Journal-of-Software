const downloadResponseBlob = data => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'checklists.pdf') // Specify the file name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // Clean up the DOM
}